import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
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

    return NextResponse.json({
      id: post.id,
      content: post.content,
      emotionTag: post.emotionTag,
      createdAt: post.createdAt,
      reactions: post.reactions.length,
      responses: post.responses.length,
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
