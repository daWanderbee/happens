import { prisma } from "@/lib/prisma";

export async function GET() {
  await prisma.chatRoom.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  return new Response("cleanup done");
}
