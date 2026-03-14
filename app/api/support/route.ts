import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const post = await prisma.post.findFirst({
    where: {
      state: "ACTIVE",
    },
    include: {
      reactions: true,
      responses: true,
    },
    orderBy: [
      {
        reactions: {
          _count: "asc",
        },
      },
      {
        responses: {
          _count: "asc",
        },
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return NextResponse.json(post);
}
