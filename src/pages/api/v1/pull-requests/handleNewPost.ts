  console.log("in getNewPostId()");
    newPostId = getNewPostIdFromDiff(await (await fetch(payload.pull_request.diff_url)).text());
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
