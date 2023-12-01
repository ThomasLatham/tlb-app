import type { NextApiRequest, NextApiResponse } from "next";
import type { PullRequestEvent } from "@octokit/webhooks-types";
import { Octokit } from "@octokit/rest";
import * as crypto from "crypto";
import matter from "gray-matter";
import * as fs from "fs";
import readingTime from "reading-time";
import { Client, ContactProperties, LibraryResponse } from "node-mailjet";

import { POSTS_PATH } from "@/constants";
import { PostFrontmatter } from "@/interfaces";

type ResponseData = {
  message: string;
};

/* ** REQUEST HANDLING ** */

const handlePullRequest = async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (validateGitHubWebhook(req, res, process.env.GITHUB_WEBHOOK_PULL_REQUESTS!)) {
    if (req.method === "POST") {
      const newPostId = await getNewPostId(req.body as PullRequestEvent);
      if (newPostId.length) {
        await executeNewPostNotificationFlow(newPostId);
      }
      res.status(202).send({ message: "Accepted" });
    } else {
      res.status(400).end("No new posts found");
    }
  } else {
    res.status(401).end("Unauthorized");
  }
};

const validateGitHubWebhook = (req: NextApiRequest, res: NextApiResponse, secret: string) => {
  const signature = req.headers["x-hub-signature-256"] as string;
  const payload = JSON.stringify(req.body);

  if (!signature) {
    res.status(400).end("No X-Hub-Signature-256 found in the headers");
    return false;
  }

  const expectedSignature = `sha256=${crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex")}`;

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    // Valid signature
    return true;
  } else {
    // Invalid signature
    res.status(401).end("Invalid X-Hub-Signature-256");
    return false;
  }
};

/* ** GET-POST-ID FLOW ** */

/**
 * If, in the PR detailed by the given `PullRequestEvent` (`payload`):
 *   - a new directory was created in the `src/content/posts` directory *and*
 *   - the PR was closed and merged to either the `main` or `test` branches,
 *
 * this function returns a `Promise` of the name of that directory. Otherwise, returns a `Promise`
 * of the empty string.
 *
 * To give some important context about the application, the name of a post's directory is also the
 * name of the post's MDX file and the ID in the post's URL.
 *
 * @param payload The `PullRequestEvent` for the PR in which we want to check for a new post.
 * @returns A `Promise` of either the name of a new post's directory (if a new post was sent to
 * production via the PR), or the empty string otherwise.
 */
const getNewPostId = async (payload: PullRequestEvent): Promise<string> => {
  let newPostId = "";

  if (
    payload.action === "closed" &&
    payload.pull_request.merged === true &&
    (payload.pull_request.base.ref === "main" || payload.pull_request.base.ref === "test")
  ) {
    newPostId = getNewPostIdFromDiff(await fetchDiffFromGitHub(payload.pull_request.diff_url));
  }

  return newPostId;
};

const fetchDiffFromGitHub = async (url: string): Promise<string> => {
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    });
    const response = await octokit.request("GET " + url);

    if (response.status < 300) {
      return response.data;
    } else {
      throw new Error(`Failed to fetch diff content from GitHub. Status: ${response.status}`);
    }
  } catch (error) {
    return "";
  }
};

const getNewPostIdFromDiff = (diff: string): string => {
  const lines = diff.split("\n");
  let newPostId = "";
  const postIdPattern =
    /^diff --git a\/src\/content\/posts\/([a-zA-Z0-9_-]+)\/\1\.mdx b\/src\/content\/posts\/\1\/\1\.mdx$/;
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];
    const previousLine = lines[i - 1];

    if (currentLine.includes("new file mode 100644")) {
      const postIdMatch = postIdPattern.exec(previousLine);
      if (postIdMatch) {
        newPostId = postIdMatch[1];
        break;
      }
    }
  }

  return newPostId;
};

const getFrontmatterFromPostId = (postId: string): PostFrontmatter => {
  const sourceText = fs.readFileSync(`${POSTS_PATH}/${postId}/${postId}.mdx`, "utf8");
  return {
    ...matter(sourceText).data,
    wordCount: sourceText.split(/\s+/gu).length,
    readingTime: readingTime(sourceText).minutes,
  } as PostFrontmatter;
};

/* ** SEND-EMAILS FLOW ** */

const executeNewPostNotificationFlow = async (newPostId: string) => {
  const frontmatter = getFrontmatterFromPostId(newPostId);
  const mailjet = new Client({
    apiKey: process.env.MAILJET_API_KEY,
    apiSecret: process.env.MAILJET_SECRET_KEY,
  });
  // new flow now that we can't use segmentation:
  // - going to use the Send API (v3) rather than campaigns
  // - get all the subscribers, then filter here (NextJS) for those subscribed to
};

const getSubscribersFromPostTags = async (
  tagsFromPost: string[],
  mailjet: Client
): Promise<ContactProperties.ContactData[]> => {
  const queryData: ContactProperties.GetContactDataQueryParams = {
    ContactsList: 10354543,
  };

  const result: LibraryResponse<ContactProperties.GetContactDataResponse> = await mailjet
    .get("contactdata", { version: "v3" })
    .request({}, queryData);

  return result.body.Data.filter((contact: ContactProperties.ContactData) => {
    const contactSubscribedTags = contact.Data.filter(
      (contactProperty: ContactProperties.ContactProperty) =>
        contactProperty.Name === "tags_subscribed_to"
    )[0].Value.split(", ");

    return (
      contactSubscribedTags.includes("all") || hasCommonElement(tagsFromPost, contactSubscribedTags)
    );
  });
};

/**
 * Check if there is any common element between two arrays of strings.
 *
 * @param {string[]} array1 - The first array of strings.
 * @param {string[]} array2 - The second array of strings.
 * @returns {boolean} Returns true if there is any common element, false otherwise.
 */
const hasCommonElement = (array1: string[], array2: string[]): boolean => {
  // Use the Set data structure for efficient membership testing
  const set1 = new Set(array1);

  // Check if any element in array2 is in set1
  for (const element of array2) {
    if (set1.has(element)) {
      return true; // Found a common element
    }
  }

  // No common element found
  return false;
};

const sendNewPostNotificationEmails = async (
  subscribers: ContactProperties.ContactData[],
  newPostFrontmatter: PostFrontmatter,
  newPostId: string,
  mailjet: Client
) => {
  const request = mailjet.post("send").request({
    Messages: subscribers.map((subscriber) => {
      return {
        FromEmail: "contact@tomlatham.blog",
        FromName: "Tom Latham",
        Recipients: [
          {
            Email: getContactPropertyValue(subscriber, "email_address"),
            Name: getContactPropertyValue(subscriber, "first_name"),
          },
        ],
        Subject: "There's a new post on the Tom Latham Blog!",
        TemplateID: 5346495,
        "Mj-TemplateLanguage": true,
        Vars: {
          newPostFrontmatter: {
            ...newPostFrontmatter,
          },
          newPostId: newPostId,
        },
      };
    }),
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((error) => {
      console.log(error.statusCode);
    });
};

const getContactPropertyValue = (
  contactData: ContactProperties.ContactData,
  propertyName: string
) => {
  return contactData.Data.filter((contactProperty) => contactProperty.Name === propertyName)[0]
    .Value;
};

export default handlePullRequest;
