import PostCard from "@/components/post/PostCard";
import { Post, AnonymousIdentity } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type PostWithIdentity = Post & {
  identity: Pick<AnonymousIdentity, "userId" | "username">;
};

export default async function HomeFeed({
  posts,
}: {
  posts: PostWithIdentity[];
}) {
  const session = await getServerSession(authOptions);
  const myUserId = session?.user?.id;

  return (
    <div className="space-y-4 w-full">
      {posts.length === 0 && (
        <p className="text-foreground/70 dark:text-muted-foreground text-sm">
          Nothing here right now. Come back later.
        </p>
      )}

      {posts.map((post) => (
        <PostCard
          key={post.id}
          postId={post.id}
          content={post.content}
          emotion={post.emotionTag ?? undefined}
          author={
            myUserId && post.identity.userId === myUserId
              ? "Me"
              : post.identity.username
          }
          createdAt={post.createdAt}
        />
      ))}
    </div>
  );
}
