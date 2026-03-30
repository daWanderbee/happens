import { prisma } from "@/lib/prisma";
import { getIdentity } from "@/lib/getIdentity";
import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { moderateText } from "@/lib/moderate";

export async function POST(req: Request) {
  const body = await req.json();

  const identity = await getIdentity();

  if (!identity) {
    return Response.json({ error: "Login required" }, { status: 401 });
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 20);

  // 🔥 MODERATION CHECK
  const moderation = moderateText(body.content);

  if (moderation.status === "blocked") {
    return NextResponse.json(
      {
        error: "Your post contains hate speech",
        moderation,
      },
      { status: 400 },
    );
  }

  // OPTIONAL: allow but flag warnings
  const isFlagged = moderation.status === "warning";

  const post = await prisma.post.create({
    data: {
      identityId: identity.id,
      content: body.content,
      expiresAt,
      emotionTag: body.emotionTag ?? null,
      isFlagged,
    },
  });

  return Response.json(post);
}
