import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const identity = await prisma.anonymousIdentity.findFirst();

  if (!identity) {
    return Response.json({ error: "No identity found" }, { status: 400 });
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 20);

  const post = await prisma.post.create({
    data: {
      identityId: identity.id,
      content: body.content,
      expiresAt,
    },
  });

  return Response.json(post);
}
