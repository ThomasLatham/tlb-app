import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/utils/database";
import { getAllTags } from "@/contentRetrieval/posts";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers["authorization"];
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ success: false });
  }

  res.status(200).json({ success: true });
};

export default handler;
