import { getIdentity } from "@/lib/getIdentity";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  const identity = await getIdentity();
  if (!identity) return NextResponse.json({ count: 0 });

  const count = await prisma.notification.count({
    where: {
      userId: identity.userId,
      isRead: false,
    },
  });

  return NextResponse.json({ count });
}
