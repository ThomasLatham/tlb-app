/* eslint-disable quotes */
import type { NextApiRequest, NextApiResponse } from "next";

import getNewPostNotificationHtml from "@/content/emailTemplates/newPostNotification/newPostNotification";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(400).json({ message: "Improper request method." });
    return;
  }

  const { html, errors } = getNewPostNotificationHtml(
    "abc123",
    "Finn Mertins",
    {
      author: "Doc Oc",
      title: "Test Post Title",
      datePublished: "2025-03-30",
      description:
        "Learn how to shmow the zow with a whole host of wickedy rickedy pow pow mcdowzow. If it's in stock, we've got it. And if it's not in stock, we've still got it.",
      tags: ["math"],
      readingTime: 10,
      wordCount: 200,
    },
    "estimating-pi-rng"
  );

  if (errors?.length) {
    res.status(500).send(`
    <html>
      <body>
        <p>Something went wrong. Errors:</p>
        ${errors.map((mjmlError) => {
          return (
            '<p> - "' +
            mjmlError.message +
            '." Caused by element &lt;' +
            mjmlError.tagName +
            "&gt;.</p>"
          );
        })}
      </body>
    </html>
    `);
    return;
  }
  res.status(200).send(html);
};

export default handler;
