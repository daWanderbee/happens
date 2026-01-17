import { prisma } from "@/lib/prisma";
import { createIdentity } from "@/lib/identity";

export async function GET() {
  const user = await prisma.user.create({
    data: {
      provider:"test",
      providerId:"test-id"
    },
  });

  const identity = await createIdentity(user.id);

  return Response.json(identity);
}
