import { prisma } from "./prisma";

const words = ["Quiet", "Soft", "Still", "Echo"];

function generateUsername(): string {
  const a = words[Math.floor(Math.random() * words.length)];
  const b = words[Math.floor(Math.random() * words.length)];
  const n = Math.floor(Math.random() * 100);
  return `${a}${b}_${n}`;
}

export async function createIdentity(userId: string) {
  return prisma.anonymousIdentity.create({
    data: {
      userId,
      username: generateUsername(),
      avatarKey: "stone-01",
    },
  });
}
