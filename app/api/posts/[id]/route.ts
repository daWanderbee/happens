import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: postId } = await params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        reactions: true,
        responses: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: post.id,
      content: post.content,
      emotionTag: post.emotionTag,
      createdAt: post.createdAt,
      reactions: post.reactions.length,
      responses: post.responses.length,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
