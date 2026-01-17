import { prisma } from "@/lib/prisma";

export async function GET() {
  const now = new Date();

  const posts = await prisma.post.findMany({
    where: {
      expiresAt: {
        gt: now,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return Response.json(posts);
}
