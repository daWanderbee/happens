import { getIdentity } from "@/lib/getIdentity";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json([], { status: 400 });
  }

  const comments = await prisma.supportResponse.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: {
      identity: {
        select: {
          username: true,
        },
      },
    },
  });

  return NextResponse.json(
    comments.map((c) => ({
      id: c.id,
      content: c.content,
      author: c.identity?.username ?? "Anonymous",
      createdAt: c.createdAt,
    })),
  );
}

export async function POST(req: Request) {
  const { postId, content } = await req.json();

  if (!postId || !content) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const identity = await getIdentity();

  if (!identity) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const comment = await prisma.supportResponse.create({
    data: {
      postId,
      content,
      identityId: identity.id,
    },
  });

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      identity: {
        select: { userId: true },
      },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (post.identity.userId !== identity.userId) {
    await prisma.notification.create({
      data: {
        userId: post.identity.userId,
        type: "COMMENT",
        postId,
        commentId: comment.id,
        actorLabel: "Someone",
      },
    });
  }

  return NextResponse.json(comment);
}
