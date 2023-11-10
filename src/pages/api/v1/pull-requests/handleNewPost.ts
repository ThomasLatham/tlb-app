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
  console.log("in getNewPostId()");
  let newPostId = "";

  if (
    payload.action === "closed" &&
    payload.pull_request.merged === true &&
    (payload.pull_request.base.ref === "main" || payload.pull_request.base.ref === "test")
  ) {
    console.log("in getNewPostId()'s if-block");
    newPostId = getNewPostIdFromDiff(await fetchDiffFromGitHub(payload.pull_request.diff_url));
  }

  return new Promise(() => newPostId);
};

const fetchDiffFromGitHub = async (url: string): Promise<string> => {
  console.log("in fetchDiffFromGitHub()");
  const response = await fetch(url);
  if (response.ok) {
    console.log("in fetchDiffFromGitHub()'s if-block");
    return await response.text();
  } else {
    console.log("in fetchDiffFromGitHub()'s else-block: " + response.status);
    throw new Error(`Failed to fetch diff content from GitHub. Status: ${response.status}`);
  }
};

const getNewPostIdFromDiff = (diff: string): string => {
  console.log("in getNewPostIdFromDiff()");
  console.log(diff);
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

export { getNewPostId };
