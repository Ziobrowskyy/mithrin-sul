import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();
  const posts = prisma.post.findMany({
    include: {
      files: true,
    }
  });
  res.status(200).json(posts);
}
