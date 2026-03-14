import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import SupportDeck from "./SupportDeck";

async function getSupportPosts() {
  return prisma.post.findMany({
    where: { state: "ACTIVE" },
    include: {
      responses: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: [
      { reactions: { _count: "asc" } },
      { responses: { _count: "asc" } },
      { createdAt: "desc" },
    ],
    take: 5,
  });
}

export default async function SupportPage() {
  const posts = await getSupportPosts();

  return (
    <div className="w-full">
      <section
        className={cn(
          "mx-auto w-full max-w-3xl min-h-screen rounded-t-3xl px-6 pt-10 pb-6 shadow-sm transition-colors",
          "bg-neutral-50 border border-black/5",
          "dark:bg-background dark:border-[hsl(193_31%_20%)]",
        )}
      >
       

        {/* DECK */}
        <div className="flex justify-center">
          <SupportDeck posts={posts} />
        </div>
      </section>
    </div>
  );
}
