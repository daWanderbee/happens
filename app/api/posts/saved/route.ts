import { prisma } from "@/lib/prisma";
import { getIdentity } from "@/lib/getIdentity";
import { NextResponse } from "next/server";

export async function GET() {
  const identity = await getIdentity();

  if (!identity) {
    return NextResponse.json([], { status: 401 });
  }

  const saved = await prisma.savedPost.findMany({
    where: {
      identityId: identity.id,
    },
    include: {
      post: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(saved.map((s) => s.post));
}
