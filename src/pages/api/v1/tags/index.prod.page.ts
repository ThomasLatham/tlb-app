import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import prisma from "@/utils/database";

import { authOptions } from "../../auth/[...nextauth].prod.page";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (req.method !== "GET") {
    res.status(400).json({ message: "Improper request method." });
  }

  const tags = await prisma.tag.findMany();

  if (!tags.length) {
    res.status(404).json({ message: "No tags found." });
  }
  res.status(200).send({ tags: tags });
};

export default handler;
