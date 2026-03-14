import { getIdentity } from "@/lib/getIdentity";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const identity = await getIdentity();
  if (!identity) return NextResponse.json([], { status: 401 });

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  const notifications = await prisma.notification.findMany({
    where: {
      userId: identity.userId,
      createdAt: { gte: cutoff },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(notifications);
}
