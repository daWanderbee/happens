import { prisma } from "@/lib/prisma";
import { getIdentity } from "@/lib/getIdentity";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const identity = await getIdentity();

  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await req.json();

  // get the post author
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  const room = await prisma.chatRoom.create({
    data: {
      postId,
      expiresAt: expires,
      participants: {
        create: [
          { identityId: identity.id }, // user starting chat
          { identityId: post.identityId }, // post author
        ],
      },
    },
  });

  return NextResponse.json(room);
}
