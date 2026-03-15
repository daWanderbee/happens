import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
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
