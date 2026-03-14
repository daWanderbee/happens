import { prisma } from "@/lib/prisma";
import SwipeNavigator from "@/components/navigation/SwipeNavigator";
import HomeFeed from "@/components/read/HomeFeed";
import SharePage from "@/components/share/SharePage";

export default async function ReadPage() {
  const posts = await prisma.post.findMany({
    where: { expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      identity: {
        select: { username: true, userId: true },
      },
    },
  });

  return (
    <main className="bg-primary">
      <section
        className="
          w-full
          px-4 pt-4
          bg-primary-foreground dark:bg-background
          rounded-t-[20px]
          shadow-md
          h-[100vh]
        "
      >
        {/* ✅ Centered content column — full on mobile, capped on desktop */}
        <div className="mx-auto w-full max-w-2xl">
          <HomeFeed posts={posts} />
        </div>
      </section>
    </main>
  );
}