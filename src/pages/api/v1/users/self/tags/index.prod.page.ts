import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import jwt from "jsonwebtoken";

import prisma from "@/utils/database";
import { getBasePath } from "@/utils/general";

import { authOptions } from "../../../../auth/[...nextauth].prod.page";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // endpoint for unsubscribing from emails
  // GET request because just a link in an email
  if (req.method === "GET") {
    if (!req.query.token || req.query.token instanceof Array) {
      res.status(400).json({ message: "Request must include JWT." });
      return;
    }

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: "Sorry, something went wrong on our end." });
      return;
    }

    let decoded: string | jwt.JwtPayload;

    try {
      decoded = jwt.verify(req.query.token, process.env.JWT_SECRET);
    } catch (err: any) {
      res.status(401).json({ message: "Invalid token: " + err.message });
      return;
    }

    if (typeof decoded === "string" || !decoded.userId) {
      res.status(400).json({ message: "Invalid token." });
      return;
    }

    try {
      // const user = await prisma.user.update({
      //   where: { id: decoded.userId },
      //   data: {
      //     tags: {
      //       set: [],
      //     },
      //   },
      //   include: {
      //     tags: true,
      //   },
      // });
      // if (!user) {
      //   res.status(404).json({ message: "Failed to update tag subscription for user." });
      //   return;
      // }
    } catch (err) {
      res.status(500).json({ message: "Something went wrong." });
      return;
    }

    res.writeHead(307, {
      location: getBasePath() + "/unsubscribe-confirmation/" + req.query.token,
    });
    res.end();
    return;
  }

  // otherwise it's an update endpoint
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
      return;
    }

    res.status(200).send({ user: user });
  }
};

export default handler;
