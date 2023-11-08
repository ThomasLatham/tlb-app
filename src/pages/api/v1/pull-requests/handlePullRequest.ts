import type { NextApiRequest, NextApiResponse } from "next";
import type { PullRequestEvent } from "@octokit/webhooks-types";

import { getNewPostId } from "./handleNewPost";

type ResponseData = {
  message: string;
};

const handlePullRequest = async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  if (req.headers["X-Hub-Signature-256"] === process.env.GITHUB_WEBHOOK_PUSH_EVENTS) {
    if (req.method === "POST") {
      res.status(202).send({ message: "Accepted" });

      const newPostId = await getNewPostId(req.body as PullRequestEvent);
      if (newPostId.length) {
        console.log(newPostId);
      }
    } else {
      res.status(400);
    }
  } else {
    res.status(401);
  }
};

export default handlePullRequest;
