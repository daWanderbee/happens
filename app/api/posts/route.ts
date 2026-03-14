import { prisma } from "@/lib/prisma";
import { getIdentity } from "@/lib/getIdentity";

export async function POST(req: Request) {
  const body = await req.json();

  const identity = await getIdentity();

  if (!identity) {
    return Response.json({ error: "Login required" }, { status: 401 });
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 20);

  const post = await prisma.post.create({
    data: {
      identityId: identity.id,
      content: body.content,
      expiresAt,
      emotionTag: body.emotionTag ?? null,
    },
  });

  return Response.json(post);
}
