import type { NextApiRequest, NextApiResponse } from "next";
import type { PullRequestEvent } from "@octokit/webhooks-types";

import { getNewPostId } from "./handleNewPost";

type ResponseData = {
  message: string;
};

const handlePullRequest = async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  console.log("in handlePullRequest()");
  if (req.headers["X-Hub-Signature-256"] === process.env.GITHUB_WEBHOOK_PULL_REQUESTS) {
    console.log("in handlePullRequest()");
    if (req.method === "POST") {
      const newPostId = await getNewPostId(req.body as PullRequestEvent);
      if (newPostId.length) {
        console.log(newPostId);
      }

      res.status(202).send({ message: "Accepted" });
    } else {
      res.status(400);
    }
  } else {
    res.status(401);
  }
};

export default handlePullRequest;
