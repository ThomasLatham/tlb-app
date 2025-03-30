import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import prisma from "@/utils/database";

import { authOptions } from "../../../auth/[...nextauth].prod.page";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (req.method !== "GET") {
    res.status(400).json({ message: "Improper request method." });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    include: {
      tags: true,
    },
  });

  if (!user) {
    res.status(404).json({ message: "No users found with that email." });
  }
  res.status(200).send({ user: user });
};

export default handler;
