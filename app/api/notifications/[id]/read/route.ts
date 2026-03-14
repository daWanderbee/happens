import { getIdentity } from "@/lib/getIdentity";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const identity = await getIdentity();
  if (!identity)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.notification.updateMany({
    where: {
      id: params.id,
      userId: identity.userId,
    },
    data: { isRead: true },
  });

  return NextResponse.json({ ok: true });
}
