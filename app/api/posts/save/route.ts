import { prisma } from "@/lib/prisma";
import { getIdentity } from "@/lib/getIdentity";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const identity = await getIdentity();

  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await req.json();

  const existing = await prisma.savedPost.findUnique({
    where: {
      identityId_postId: {
        identityId: identity.id,
        postId,
      },
    },
  });

  // toggle save
  if (existing) {
    await prisma.savedPost.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ saved: false });
  }

  await prisma.savedPost.create({
    data: {
      identityId: identity.id,
      postId,
    },
  });

  return NextResponse.json({ saved: true });
}
