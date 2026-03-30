import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimitIdentity } from "@/lib/antiSpam";
import { getIdentity } from "@/lib/getIdentity";

export async function POST(req: Request) {
  try {
    const { postId, type } = await req.json();

    const identity = await getIdentity();

    if (!identity || !identity.id) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }


    console.log("Creating reaction for identity:", identity.id);

    await rateLimitIdentity(identity.id);

    const reaction = await prisma.reaction.upsert({
      where: {
        postId_identityId: {
          postId,
          identityId: identity.id, // This is now the AnonymousIdentity.id
        },
      },
      update: { type },
      create: {
        postId,
        identityId: identity.id,
        type,
      },
    });

    globalThis.reactionStream?.enqueue(
      `data: ${JSON.stringify({ postId })}\n\n`,
    );

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        identity: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (post?.identity?.userId !== identity.userId) {
      await prisma.notification.create({
        data: {
          userId: post.identity.userId,
          type: "REACTION",
          postId,
          actorLabel: "Someone",
          meta: { reactionType: type },
        },
      });
    }

    return NextResponse.json(reaction);
  } catch (e: any) {
    if (e.message === "RATE_LIMIT") {
      return NextResponse.json({ error: "Slow down" }, { status: 429 });
    }

    console.error("POST /api/reactions failed", e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const isStream = searchParams.get("stream") === "true";

    if (isStream) {
      const stream = new ReadableStream({
        start(controller) {
          globalThis.reactionStream = controller;
        },
        cancel() {
          globalThis.reactionStream = undefined;
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    if (!postId) {
      return NextResponse.json({ reactions: {}, active: null });
    }

    let identity = null;
    try {
      identity = await getIdentity();
    } catch {
      identity = null;
    }

    const grouped = await prisma.reaction.groupBy({
      by: ["type"],
      where: { postId },
      _count: true,
    });

    const reactions: Record<string, number> = {};
    for (const g of grouped) {
      reactions[g.type] = g._count;
    }

    let active = null;
    if (identity && identity.id) {
      const r = await prisma.reaction.findFirst({
        where: {
          postId,
          identityId: identity.id,
        },
        select: { type: true },
      });
      active = r?.type ?? null;
    }

    return NextResponse.json({ reactions, active });
  } catch (err) {
    console.error("GET /api/reactions failed", err);
    return NextResponse.json({ reactions: {}, active: null }, { status: 500 });
  }
}
