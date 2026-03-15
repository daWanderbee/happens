import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params; // ✅ FIX

    const body = await req.json();
    const { content } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing post id" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        content,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
