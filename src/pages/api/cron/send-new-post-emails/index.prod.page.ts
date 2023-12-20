import type { NextApiRequest, NextApiResponse } from "next";
import Mailjet from "node-mailjet";
import _ from "lodash";

import prisma from "@/utils/database";
import { getAllTags, getFrontmatterByPostId } from "@/contentRetrieval/posts";
import { PostFrontmatter } from "@/interfaces";
import getNewPostNotificationHtml from "@/content/emailTemplates/newPostNotification/newPostNotification";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers["authorization"];
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ success: false });
  }

  const mailjet = new Mailjet({
    apiKey: process.env.MAILJET_API_KEY,
    apiSecret: process.env.MAILJET_SECRET_KEY,
  });

  // get top 200 from queue (mailjet free limit)
  const top200FromQueue = await prisma.queuedPostNotification.findMany({ take: 200 });

  // retrieve and cache all the unique frontmatters for those queued items
  const uniqueFrontmatters: { postId: string; frontmatter: PostFrontmatter }[] = [];

  for (const queueItem of top200FromQueue) {
    if (
      !uniqueFrontmatters
        .map((uniqueFrontmatter) => uniqueFrontmatter.postId)
        .includes(queueItem.postId)
    ) {
      uniqueFrontmatters.push({
        postId: queueItem.postId,
        frontmatter: getFrontmatterByPostId(queueItem.postId),
      });
    }
  }

  // grab user details
  const userDetails = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    where: {
      OR: top200FromQueue.map((queueItem) => {
        return { id: queueItem.userId };
      }),
    },
  });

  // send out the 200 emails with mailjet send api and using the generated html
  // - need to grab user details first
  // - also need to create a text version of the email
  // - need to delete records from DB after sending email
  for (const chunkOf100Items of _.chunk(top200FromQueue, 100)) {
    const request = mailjet.post("send").request({
      Messages: chunkOf100Items.map((queueItem) => {
        const userDetail = userDetails
          .filter((userDetail) => userDetail.id === queueItem.userId)
          .map((userDetail) => {
            return {
              Email: userDetail.email,
              Name: userDetail.name ?? userDetail.email?.split("@")[0] ?? "Subscriber",
            };
          });

        return {
          FromEmail: "contact@tomlatham.blog",
          FromName: "Tom Latham",
          Recipients: userDetail,
          Subject: "There's a new post on my blog!",
          "Text-part": "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
          "Html-part": getNewPostNotificationHtml(
            queueItem.userId,
            userDetail[0].Name,
            uniqueFrontmatters.filter((fm) => fm.postId === queueItem.postId)[0].frontmatter,
            queueItem.postId
          ),
        };
      }),
    });

    request
      .then((result) => {
        console.log(result.body);
      })
      .catch((error) => {
        console.log(error.statusCode);
      });
  }

  res.status(200).json({ success: true });
};

export default handler;
