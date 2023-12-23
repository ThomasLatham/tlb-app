import type { NextApiRequest, NextApiResponse } from "next";
import type { PullRequestEvent } from "@octokit/webhooks-types";
import { Octokit } from "@octokit/rest";
import * as crypto from "crypto";

import prisma from "@/utils/database";
import { getFrontmatterByPostId } from "@/contentRetrieval/posts";

type ResponseData = {
  message: string;
};

/* ** REQUEST HANDLING ** */

const handlePullRequest = async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (validateGitHubWebhook(req, res, process.env.GITHUB_WEBHOOK_PULL_REQUESTS!)) {
    if (req.method === "POST") {
      try {
        const newPostId = await getNewPostId(req.body as PullRequestEvent);
        if (newPostId.length) {
          await queuePostNotifications(newPostId);
        }
        res.status(202).send({ message: "Accepted" });
        return;
      } catch (error) {
        res.status(500).end("Something went wrong. Error: " + error);
        return;
      }
    } else {
      res.status(400).end("No new posts found");
      return;
    }
  } else {
    res.status(401).end("Unauthorized");
    return;
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
    payload.pull_request.base.ref === "main"
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

/* ** QUEUE-EMAILS FLOW ** */

const queuePostNotifications = async (newPostId: string) => {
  const postTags = getFrontmatterByPostId(newPostId).tags;
  const idsOfUsersSubscribedToPostTags = await prisma.user.findMany({
    select: { id: true },
    where: {
      OR: postTags.map((postTag) => {
        return { tags: { some: { tagName: postTag } } };
      }),
    },
  });

  await prisma.queuedPostNotification.createMany({
    data: idsOfUsersSubscribedToPostTags.map((userIdObj) => {
      return {
        userId: userIdObj.id,
        postId: newPostId,
      };
    }),
  });
};

export default handlePullRequest;
