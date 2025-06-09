import { postsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/database";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "POST":
      {
        try {
          const session = await auth.api.getSession({
            headers: req.headers as unknown as Headers,
          });

          if (!session) {
            res.status(401).json({ error: "Unauthorized" });
            return;
          }

          await db.insert(postsTable).values({
            title: req.body.title,
            content: req.body.content,
            authorId: session.user.id,
          });

          res.status(200).json({ message: "Post created correctly" });
        } catch (error) {
          console.error("Error in post handler:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
