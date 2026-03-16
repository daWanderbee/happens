import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getIdentity } from "@/lib/getIdentity";

export async function POST(req: Request) {
  try {
    const identity = await getIdentity();

    if (!identity) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId, content } = await req.json();

    if (!roomId || !content) {
      return NextResponse.json(
        { error: "Missing roomId or content" },
        { status: 400 },
      );
    }

    const message = await prisma.chatMessage.create({
      data: {
        roomId,
        content,
        identityId: identity.id, // ✅ sender
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Send message error:", error);

    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
