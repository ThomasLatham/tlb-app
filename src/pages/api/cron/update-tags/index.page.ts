import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/utils/database";
import { getAllTags } from "@/contentRetrieval/posts";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers["authorization"];
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ success: false });
  }

  const tagsFromPosts = getAllTags();
  const tagsFromDatabase = (await prisma.tag.findMany()).map((tag) => tag.tagName);

  // add all the new tags to the database
  for (const tagFromPost of tagsFromPosts) {
    if (!tagsFromDatabase.includes(tagFromPost)) {
      await prisma.tag.create({ data: { tagName: tagFromPost } });
    }
  }

  // remove any tags that are no longer present
  for (const tagFromDatabase of tagsFromDatabase) {
    if (!tagsFromPosts.includes(tagFromDatabase)) {
      await prisma.tag.delete({ where: { tagName: tagFromDatabase } });
    }
  }

  res.status(200).json({ success: true });
};

export default handler;
