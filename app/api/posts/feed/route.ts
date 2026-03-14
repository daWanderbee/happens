import { prisma } from "@/lib/prisma";
import { getIdentity } from "@/lib/getIdentity";

export async function GET() {
  const identity = await getIdentity();

  const posts = await prisma.post.findMany({
    include: {
      identity: {
        select: {
          username: true,
          avatarKey: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json(
    posts.map((p) => ({
      id: p.id,
      content: p.content,
      emotion: p.emotionTag,
      createdAt: p.createdAt,
      author: p.identity.username,
      avatarKey: p.identity.avatarKey,
      isMine: identity ? p.identityId === identity.id : false,
    })),
  );
}
