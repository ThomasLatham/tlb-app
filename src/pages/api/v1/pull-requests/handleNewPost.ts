import { PullRequestEvent } from "@octokit/webhooks-types";

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
    console.log(await fetch(payload.pull_request.diff_url));
    newPostId = "shmowzow";
  }

  return new Promise(() => newPostId);
};

export { getNewPostId };
