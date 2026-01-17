import { prisma } from "@/lib/prisma";

export async function GET() {
  // TEMP: get first identity (will replace after auth)
  const identity = await prisma.anonymousIdentity.findFirst();

  if (!identity) {
    return Response.json({ error: "No identity found" }, { status: 400 });
  }

  const posts = await prisma.post.findMany({
    where: {
      identityId: identity.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json({
    username: identity.username,
    avatarKey: identity.avatarKey,
    posts,
  });
}
