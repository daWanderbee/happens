import { prisma } from "@/lib/prisma";
import { getIdentity } from "@/lib/getIdentity";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const identity = await getIdentity();

    if (!identity) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId } = await req.json();

    if (!roomId) {
      return NextResponse.json({ error: "Missing roomId" }, { status: 400 });
    }

    // Check user is part of chat
    const participant = await prisma.chatParticipant.findFirst({
      where: {
        roomId,
        identityId: identity.id,
      },
    });

    if (!participant) {
      return NextResponse.json({ error: "Not part of chat" }, { status: 403 });
    }

    // Remove user from chat
    await prisma.chatParticipant.delete({
      where: {
        id: participant.id,
      },
    });

    

    // Optional: system message
    await prisma.chatMessage.create({
      data: {
        roomId,
        identityId: identity.id,
        content: "User left the chat",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Leave chat error:", error);

    return NextResponse.json(
      { error: "Failed to leave chat" },
      { status: 500 },
    );
  }
}
