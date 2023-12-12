import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import prisma from "@/utils/database";

import { authOptions } from "../../../../auth/[...nextauth].prod.page";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (req.method === "PUT") {
    if (!req.body?.tags) {
      // eslint-disable-next-line quotes
      res.status(400).json({ message: 'Request body must include "tags".' });
      return;
    }

    const user = await prisma.user.update({
      where: { email: session.user?.email as string },
      data: {
        tags: {
          set: req.body.tags.length
            ? req.body.tags.map((tag: string) => {
                return { tagName: tag };
              })
            : [],
        },
      },
      include: {
        tags: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "Failed to update tag subscription for user." });
    }

    res.status(200).send({ user: user });
  }
};

export default handler;
