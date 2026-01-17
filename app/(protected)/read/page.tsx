import { prisma } from "@/lib/prisma";

export default async function ReadPage() {
  const posts = await prisma.post.findMany({
    where: {
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>Read</h1>

      {posts.map((post) => (
        <div key={post.id} style={{ marginBottom: 12 }}>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
