import Mailjet from "node-mailjet";

const sendEmailsIfThereIsANewPost = async (github, context) => {
  // check if there is a new post:
  //  - so, the `github` object is the Github REST API's JavaScript client (pre-authenticated!)
  //  - whatever you can do with the REST API, you can do with `github`
  //  - so what we want to do is grab the diff of the latest push, then see if a new directory got
  //    created in `src/content/posts`, then grab the mdx file of the same name

  // if so, grab its frontmatter

  // then, use the frontmatter and the new post HTML to craft an email

  // then use mailjet to send the emails

  const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC || "your-api-key",
    apiSecret: process.env.MJ_APIKEY_PRIVATE || "your-api-secret",
  });
};

export default sendEmailsIfThereIsANewPost;
