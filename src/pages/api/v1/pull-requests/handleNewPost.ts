  console.log(payload);
  console.log(await (await fetch(payload.pull_request.diff_url)).text());
    console.log("in getNewPostId()'s if-block");