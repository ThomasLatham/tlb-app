import type { NextApiRequest, NextApiResponse } from "next";
import type { PullRequestEvent } from "@octokit/webhooks-types";

type ResponseData = {
  message: string;
};

const handlePullRequest = async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  if (req.headers["X-Hub-Signature-256"] === process.env.GITHUB_WEBHOOK_PUSH_EVENTS) {
    if (req.method === "POST") {
      res.status(202).send({ message: "Accepted" });
      if (await getNewPostId(req.body as PullRequestEvent)) {
        console.log("placeholder");
      }
    } else {
      res.status(400);
    }
  } else {
    res.status(401);
  }
};

const getNewPostId = async (payload: PullRequestEvent): Promise<string> => {
  if (
    payload.action === "closed" &&
    payload.pull_request.merged === true &&
    (payload.pull_request.base.ref === "main" || payload.pull_request.base.ref === "test")
  ) {
    console.log(await fetch(payload.pull_request.diff_url));
  }

  return "hi";
};

export default handlePullRequest;
