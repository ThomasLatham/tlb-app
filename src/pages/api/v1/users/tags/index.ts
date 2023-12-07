import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import prisma from "@/utils/database";

import { authOptions } from "../../../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (req.method === "PUT") {
    if (!(req.body?.email && req.body?.tags)) {
      // eslint-disable-next-line quotes
      res.status(400).json({ message: 'Request body must include "email" and "tags".' });
      return;
    }

    if (session.user?.email !== req.body.email) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }

    const user = prisma.user.update({
      where: { email: req.query.email as string },
      data: { tags: req.body.tags },
      include: {
        tags: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "No users found with that email." });
    }

    res.status(200).send({ user: user });
  }
};

export default handler;
