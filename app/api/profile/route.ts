import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Find anonymous identity
  const identity = await prisma.anonymousIdentity.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!identity) {
    return NextResponse.json({ error: "Identity not found" }, { status: 404 });
  }

  // Fetch posts
  const posts = await prisma.post.findMany({
    where: {
      identityId: identity.id,
      createdAt: {
        gte: oneMonthAgo,
      },
    },
    include: {
      reactions: true,
      responses: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({
    username: identity.username,
    image: identity.avatarKey,
    identityId: identity.id,
    posts,
  });
}
