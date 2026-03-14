import { prisma } from "@/lib/prisma";

const RECENT_MS = 10_000;
const MAX_ACTIONS = 10;

export async function rateLimitIdentity(identityId: string) {
  const recent = await prisma.reaction.count({
    where: {
      identityId,
      createdAt: {
        gt: new Date(Date.now() - RECENT_MS),
      },
    },
  });

  if (recent >= MAX_ACTIONS) {
    throw new Error("RATE_LIMIT");
  }
}
