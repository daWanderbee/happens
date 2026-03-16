import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      reactions: true,
      responses: true,
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Don't return identityId for anonymity
  return NextResponse.json({
    id: post.id,
    content: post.content,
    emotionTag: post.emotionTag,
    createdAt: post.createdAt,
    reactions: post.reactions.length,
    responses: post.responses.length,
  });
}
