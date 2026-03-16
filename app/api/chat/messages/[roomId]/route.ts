import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ roomId: string }> },
) {
  const { roomId } = await context.params;

  const messages = await prisma.chatMessage.findMany({
    where: { roomId },
    orderBy: { createdAt: "asc" },
  });

  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
    include: {
      post: true,
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
  return NextResponse.json(messages);
}
