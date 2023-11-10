import { Octokit } from "@octokit/rest";
    newPostId = getNewPostIdFromDiff(await fetchDiffFromGitHub(payload.pull_request.diff_url));
const fetchDiffFromGitHub = async (url: string): Promise<string> => {
  console.log("in fetchDiffFromGitHub()");
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    });
    const response = await octokit.request("GET " + url);
    if (response.status < 300) {
      console.log("in fetchDiffFromGitHub()'s if-block");
      return await response.data;
    } else {
      console.log("in fetchDiffFromGitHub()'s else-block: " + response.status);
      throw new Error(`Failed to fetch diff content from GitHub. Status: ${response.status}`);
    }
  } catch (error) {
    console.log("Error in fetching from diff url: " + error);
    return "";
  }
};
