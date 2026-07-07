import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";
import { validateNoticePayload } from "@/lib/validation/notice";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;

  if (typeof id !== "string" || !id.trim()) {
    return res.status(400).json({ error: "Invalid notice id." });
  }

  if (req.method === "GET") {
    try {
      const notice = await prisma.notice.findUnique({ where: { id } });
      if (!notice) {
        return res.status(404).json({ error: "Notice not found." });
      }

      return res.status(200).json({ notice });
    } catch {
      return res.status(500).json({ error: "Failed to load notice." });
    }
  }

  if (req.method === "PUT") {
    const validation = validateNoticePayload(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.errors });
    }

    try {
      const notice = await prisma.notice.update({
        where: { id },
        data: validation.data,
      });

      return res.status(200).json({ notice });
    } catch {
      return res.status(404).json({ error: "Notice not found." });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.notice.delete({ where: { id } });
      return res.status(200).json({ message: "Notice deleted." });
    } catch {
      return res.status(404).json({ error: "Notice not found." });
    }
  }

  res.setHeader("Allow", "GET, PUT, DELETE");
  return res.status(405).json({ error: "Method not allowed." });
}
