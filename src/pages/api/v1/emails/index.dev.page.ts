import type { NextApiRequest, NextApiResponse } from "next";

import getNewPostNotificationHtml from "@/content/emailTemplates/newPostNotification/newPostNotification";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(400).json({ message: "Improper request method." });
  }

  const { html, errors } = getNewPostNotificationHtml("Finn Mertins", {
    author: "Doc Oc",
    title: "Test Post Title",
    datePublished: "2023-11-11",
    description: "Learn how to shmow the zow",
    tags: ["math"],
    readingTime: 10,
    wordCount: 200,
  });

  if (errors?.length) {
    res.status(500).json({ message: "Something went wrong." });
  }
  res.status(200).send(html);
};

export default handler;
