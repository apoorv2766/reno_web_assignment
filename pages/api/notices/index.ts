import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";
import { validateNoticePayload } from "@/lib/validation/notice";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: "asc" },
          { publishDate: "desc" },
          { createdAt: "desc" },
        ],
      });

      return res.status(200).json({ notices });
    } catch {
      return res.status(500).json({ error: "Failed to load notices." });
    }
  }

  if (req.method === "POST") {
    const validation = validateNoticePayload(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.errors });
    }

    try {
      const notice = await prisma.notice.create({
        data: validation.data,
      });

      return res.status(201).json({ notice });
    } catch {
      return res.status(500).json({ error: "Failed to create notice." });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed." });
}
