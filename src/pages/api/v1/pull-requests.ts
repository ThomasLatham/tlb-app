import type { NextApiRequest, NextApiResponse } from "next";
import type { PullRequestEvent } from "@octokit/webhooks-types";
import { Octokit } from "@octokit/rest";
import * as crypto from "crypto";
import matter from "gray-matter";
import * as fs from "fs";
import readingTime from "reading-time";
import { Client, LibraryResponse, Segmentation } from "node-mailjet";

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
        await sendNewPostNotificationEmails(newPostId);
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

const sendNewPostNotificationEmails = async (newPostId: string) => {
  const frontmatter = getFrontmatterFromPostId(newPostId);
  const mailjet = new Client({
    apiKey: process.env.MAILJET_API_KEY,
    apiSecret: process.env.MAILJET_SECRET_KEY,
  });
};

/**
 * This function retrieves the ID of a Mailjet contact filter that `OR`s together the given post
 * tags. In the case that such a filter already exists in the account for which the `mailjet` client
 * is authenticated, then this function just retrieves that filter's ID. Otherwise, the function
 * creates a new filter with the given tags `OR`ed together.
 *
 * @param postTags An array of post tags for which to retrieve a contact filter.
 * @param mailjet The Mailjet client.
 * @returns The ID of a Mailjet contact filter `OR`ing together the given post tags.
 */
const getContactFilterIdFromPostTags = async (
  postTags: string[],
  mailjet: Client
): Promise<number> => {
  const desiredFilterExpression = getFilterExpressionFromPostTags(postTags);

  const getFiltersRequest: Promise<LibraryResponse<Segmentation.GetContactFilterResponse>> = mailjet
    .get("contactfilter", { version: "v3" })
    .request();

  return getFiltersRequest
    .then((result) => {
      const preExistingFilters = result.body.Data.filter((contactFilter) => {
        return contactFilter.Expression === desiredFilterExpression;
      });

      if (preExistingFilters.length) {
        return preExistingFilters[0].ID;
      }

      const createFilterRequest: Promise<LibraryResponse<Segmentation.PostContactFilterResponse>> =
        mailjet.post("contactfilter", { version: "v3" }).request({
          Description:
            "Will send only to contacts subscribed to at least one of the following tags: " +
            postTags.join(", "),
          Expression: desiredFilterExpression,
          Name: "Contact Subscribed to One or More of The Following Tags: " + postTags.join(", "),
        });

      return createFilterRequest
        .then((result) => {
          return result.body.Data[0].ID;
        })
        .catch((err) => {
          console.log(err.statusCode);
          return 0;
        });
    })
    .catch((err) => {
      console.log(err.statusCode);
      return 0;
    });
};

/**
 * @param postTags The array of post tags used to create the Mailjet contact-filter expression.
 * @returns A filter expression for Mailjet contact segmentation, using Mailjet syntax.
 */
const getFilterExpressionFromPostTags = (postTags: string[]) => {
  return postTags.reduce((prev, cur, curIdx, arr) => {
    return (
      prev +
      " OR " +
      `Contains(tags_subscribed_to,"${cur}")` +
      (curIdx === arr.length - 1 ? ")" : "")
    );
    // eslint-disable-next-line quotes
  }, '(Contains(tags_subscribed_to, "all")' + (postTags.length ? "" : ")"));
};

/**
 * Update the New-Post-Notification Campaign's:
 * - subject
 * - content
 * - segmentation
 *
 * @param frontmatter
 * @param contactFilterId
 * @param mailjet
 */
const updateNewPostNotificationCampaign = async (
  frontmatter: PostFrontmatter,
  contactFilterId: number,
  mailjet: Client
) => {
  // TODO: implement function
};

const getNewPostNotificationEmailContent = (frontmatter: PostFrontmatter) => {
  // TODO: implement function
};

const sendNewPostNotificationCampaign = async (campaignId: number, mailjet: Client) => {
  // TODO: implement function
};

export default handlePullRequest;
