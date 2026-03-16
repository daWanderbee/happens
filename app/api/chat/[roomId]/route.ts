import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getIdentity } from "@/lib/getIdentity";

export async function GET(
  req: Request,
  context: { params: Promise<{ roomId: string }> },
) {
  try {
    const { roomId } = await context.params;
    const identity = await getIdentity();

    if (!identity) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        post: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
        participants: {
          include: {
            identity: true,
          },
        },
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!room) {
      return NextResponse.json(
        { error: "Chat room not found" },
        { status: 404 },
      );
    }

    // 🔹 Ensure user joins the chat
    const alreadyJoined = room.participants.some(
      (p) => p.identityId === identity.id,
    );

    if (!alreadyJoined) {
      await prisma.chatParticipant.create({
        data: {
          roomId,
          identityId: identity.id,
        },
      });

      // reload participants
      room.participants.push({
        id: "",
        roomId,
        identityId: identity.id,
        identity,
      } as any);
    }

    // 🔹 find the other participant
    const other = room.participants.find((p) => p.identityId !== identity.id);

    return NextResponse.json({
      post: room.post,
      messages: room.messages,
      participantName: other?.identity?.username || "Anonymous",
      expiresAt: room.expiresAt ?? null,
      myIdentityId: identity.id, // ✅ add this — already available in this route
    });
  } catch (error) {
    console.error("Chat fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch chat" },
      { status: 500 },
    );
  }
}
