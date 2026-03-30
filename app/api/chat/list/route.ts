import { prisma } from "@/lib/prisma";
import { getIdentity } from "@/lib/getIdentity";
import { NextResponse } from "next/server";

export async function GET() {
  const identity = await getIdentity();

  if (!identity) {
    return NextResponse.json([], { status: 401 });
  }

  const rooms = await prisma.chatParticipant.findMany({
    where: {
      identityId: identity.id,
    },
    include: {
      room: {
        include: {
          participants: {
            include: {
              identity: true,
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  const result = rooms.map((r) => {
    const other = r.room.participants.find((p) => p.identityId !== identity.id);
    return {
      id: r.room.id,
      name: other?.identity?.username || "Anonymous",
      lastMessage: r.room.messages[0]?.content || null,
    };
  });

  return NextResponse.json(result);
}
