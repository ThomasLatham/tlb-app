import type { NextApiRequest, NextApiResponse } from "next";
import Mailjet from "node-mailjet";
import _ from "lodash";

import prisma from "@/utils/database";
import { getFrontmatterByPostId } from "@/contentRetrieval/posts";
import { PostFrontmatter } from "@/interfaces";
import getNewPostNotificationHtml from "@/content/emailTemplates/newPostNotification/newPostNotification";
import { getBasePath, getToken } from "@/utils/general";

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

  // send 100 emails at a time
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

        const frontmatter = uniqueFrontmatters.filter((fm) => fm.postId === queueItem.postId)[0]
          .frontmatter;

        return {
          FromEmail: "contact@tomlatham.blog",
          FromName: "Tom Latham",
          Recipients: userDetail,
          Subject: "There's a new post on my blog!",
          "Text-part": `
            Hi ${userDetail[0].Name},

            There's a new post on my blog that you might be interested in! The post is titled
            ${frontmatter.title}, and here's it's description:
            ${frontmatter.description}
            To check it out, visit ${getBasePath() + "/posts/" + queueItem.postId}.

            Sincerely,

            Tom Latham

            If you'd like to opt out of these emails, copy/paste this URL into your browser: ${
              getBasePath() + "/api/v1/users/self/tags?token=" + getToken(queueItem.userId)
            }
          `,
          "Html-part": getNewPostNotificationHtml(
            queueItem.userId,
            userDetail[0].Name,
            frontmatter,
            queueItem.postId
          ).html,
        };
      }),
    });

    await request
      .then(async (result) => {
        const addressesOfSuccessfulNotifications: string[] = (result.body as any).Sent.map(
          (responseItem: any) => responseItem.Email
        );

        const idsOfUsersWhoReceivedEmails = await prisma.user.findMany({
          select: { id: true },
          where: {
            OR: addressesOfSuccessfulNotifications.map((emailAddress: string) => {
              return { email: emailAddress };
            }),
          },
        });

        await prisma.queuedPostNotification.deleteMany({
          where: {
            OR: idsOfUsersWhoReceivedEmails.map((idObj) => {
              return { userId: idObj.id };
            }),
          },
        });
      })
      .catch((error) => {
        console.log(error.statusCode);
        return res.status(500).json({ success: false });
      });
  }

  res.status(200).json({ success: true });
};

export default handler;
