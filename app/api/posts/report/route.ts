import { prisma } from "@/lib/prisma";
import { getIdentity } from "@/lib/getIdentity";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const identity = await getIdentity();

  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId, reason } = await req.json();

  if (!postId || !reason) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // 1️⃣ Create report
  await prisma.postFlag.create({
    data: {
      postId,
      identityId: identity.id,
      reason,
    },
  });

  // 2️⃣ Count reports
  const flagCount = await prisma.postFlag.count({
    where: { postId },
  });

  // 3️⃣ If too many reports → hide post
  if (flagCount >= 5) {
    await prisma.post.update({
      where: { id: postId },
      data: { state: "FADING" },
    });
  }

  return NextResponse.json({ success: true });
}
