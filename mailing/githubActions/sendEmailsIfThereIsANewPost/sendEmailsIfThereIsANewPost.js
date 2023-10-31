/* eslint-disable @typescript-eslint/no-var-requires */
const Mailjet = require("node-mailjet");
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const owner = "ThomasLatham";
const repo = "tlb-app";

const sendEmailsIfThereIsANewPost = async (github, context, core) => {
  try {
    // Use GitHub's API to get the latest commit in the main branch
    const latestCommit = context.sha;

    // 1.) Find the previous commit that is not part of the latest PR
    const previousCommit = await getLatestCommitNotInPr(
      github,
      latestCommit
    ); /* fetch previous commit details */

    // 2.) Get the name of the created directory in `src/content/posts`
    const newPostName = findCreatedDirectoryBetweenCommits(
      latestCommit,
      previousCommit,
      github
    ); /* calculate changes between commits */

    // 3.) Extract the new post's details
    const newPostFrontmatter =
      extractFrontmatterFromMDX(newPostName); /* extract frontmatter from new post MDX file */

    // Extract the tags from the new post
    const tags = newPostFrontmatter.tags || [];

    // Fetch subscribers for the tags
    const subscribers = 1; /* fetch subscribers based on tags */

    // Send emails to subscribers
    for (const subscriber of subscribers) {
      // Create and send emails using Mailjet API
      const emailData = 1; /* create email content based on frontmatter */
      /* Send the email using Mailjet */
    }
  } catch (error) {
    core.setFailed(error.message);
  }
};

/**
 * Gets the SHA of the most recent commit which is not in the PR of the `referenceCommit`.
 *
 * @param {*} github A pre-authenticated `octokit/rest.js` client.
 * @param {*} referenceCommit A commit in the PR for which we are trying to find the most recent
 * previous commit.
 * @returns the SHA of the most recent commit which is not in the PR of the `referenceCommit`.
 */
const getLatestCommitNotInPr = async (github, referenceCommit) => {
  // Use GitHub's API to fetch the commit details
  // Get the list of commits on the branch
  const commits = await github.rest.repos.listCommits({
    owner,
    repo,
    sha: referenceCommit,
  });

  // Find the most recent commit SHA that is not part of the PR
  for (const commit of commits.data) {
    if (commit.sha !== referenceCommit) {
      return commit.sha;
    }
  }
};

/**
 * Compare two commits in a GitHub repository and search for the creation of a directory
 * in the 'src/content/posts' path between those commits.
 *
 * @param {string} baseCommitSHA - The SHA of the base commit for comparison.
 * @param {string} headCommitSHA - The SHA of the head commit for comparison.
 * @param {string} github - A pre-authenticated `octokit/rest.js` client.
 *
 * @returns {Promise<string|null>} A Promise that resolves with the name of the created
 * directory in 'src/content/posts' if found, or null if no directory creation is found.
 * @throws {Error} If there is an issue with the GitHub API request.
 *
 * @example
 * const baseCommitSHA = "BASE_COMMIT_SHA";
 * const headCommitSHA = "HEAD_COMMIT_SHA";
 *
 * findCreatedDirectoryBetweenCommits(baseCommitSHA, headCommitSHA)
 *   .then((directoryName) => {
 *     if (directoryName) {
 *       console.log("Created directory in 'src/content/posts':", directoryName);
 *     } else {
 *       console.log("No directory creation found between the commits.");
 *     }
 *   });
 */
const findCreatedDirectoryBetweenCommits = async (baseCommitSHA, headCommitSHA, github) => {
  try {
    // Compare the two commits
    const comparison = await github.rest.repos.compareCommits({
      owner,
      repo,
      base: baseCommitSHA,
      head: headCommitSHA,
    });

    // Iterate through the files in the comparison
    for (const file of comparison.data.files) {
      if (file.filename.startsWith("src/content/posts/") && file.status === "added") {
        // Extract the directory name from the file path
        const directoryPath = file.filename.replace("src/content/posts/", "");
        const directoryName = directoryPath.split("/")[0];
        return directoryName;
      }
    }

    // If no directory creation is found
    return null;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

/**
 * Extract frontmatter from an MDX file within a specified directory.
 *
 * @param {string} directoryName - The name of the directory to search for the MDX file.
 * @returns {Object|null} The frontmatter extracted from the MDX file as a JavaScript object, or null if not found or an error occurred.
 */
const extractFrontmatterFromMDX = (directoryName) => {
  const directoryPath = path.join("src/content/posts/", directoryName);
  const mdxFileName = `${directoryName}.mdx`;

  const mdxFilePath = path.join(directoryPath, mdxFileName);

  try {
    // Check if the MDX file exists in the directory
    if (fs.existsSync(mdxFilePath)) {
      // Read the MDX file
      const mdxFileContent = fs.readFileSync(mdxFilePath, "utf8");

      // Parse the MDX content to extract frontmatter
      const { data: frontmatter, content } = matter(mdxFileContent);

      return frontmatter;
    } else {
      console.log(`MDX file "${mdxFileName}" not found in directory "${directoryName}".`);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

// TODO: remove this call -- just for testing

module.exports = sendEmailsIfThereIsANewPost;
