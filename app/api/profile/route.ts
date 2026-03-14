import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      identity: true,
    },
  });

  if (!user?.identity) {
    return Response.json({ error: "Identity not found" }, { status: 404 });
  }

  const posts = await prisma.post.findMany({
    where: {
      identityId: user.identity.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json({
    username: user.identity.username,
    avatarKey: user.identity.avatarKey,
    posts,
  });
}
