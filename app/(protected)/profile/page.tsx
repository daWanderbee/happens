import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faHeart,
  faScroll,
} from "@fortawesome/free-solid-svg-icons";
import { ProfilePostCard } from "@/components/profile/ProfilePostCard";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <div>Not authorized</div>;
  }

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const identity = await prisma.anonymousIdentity.findFirst({
    where: { user: { email: session.user.email } },
    include: {
      posts: {
        where: { createdAt: { gte: oneMonthAgo } },
        include: {
          reactions: true,
          responses: {
            select: { id: true, content: true, createdAt: true },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!identity) return <div>No identity found</div>;

  const totalReactions = identity.posts.reduce(
    (sum, p) => sum + p.reactions.length,
    0,
  );
  const totalResponses = identity.posts.reduce(
    (sum, p) => sum + p.responses.length,
    0,
  );

  const stats = [
    {
      icon: faScroll,
      label: "Posts",
      value: identity.posts.length,
      color: "text-violet-400",
      bg: "bg-violet-400/10 border-violet-400/20",
    },
    {
      icon: faHeart,
      label: "Reactions",
      value: totalReactions,
      color: "text-rose-400",
      bg: "bg-rose-400/10 border-rose-400/20",
    },
    {
      icon: faCommentDots,
      label: "Replies",
      value: totalResponses,
      color: "text-sky-400",
      bg: "bg-sky-400/10 border-sky-400/20",
    },
  ];

  return (
    <main className="bg-primary">
      <section className="w-full px-4 pt-4 bg-primary-foreground dark:bg-background rounded-t-[20px] shadow-md min-h-[100vh]">
        <div className="mx-auto w-full max-w-2xl pb-24">
          {/* Header */}
          <div className="flex items-center gap-4 py-6">
            <Image
              src={`/avatars/${identity.avatarKey}.png`}
              width={72}
              height={72}
              className="rounded-2xl ring-2 ring-primary/20 shadow-md"
              alt="avatar"
            />
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                {identity.username}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Anonymous · last 30 days
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {stats.map(({ icon, label, value, color, bg }) => (
              <div
                key={label}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border ${bg}`}
              >
                <FontAwesomeIcon icon={icon} className={`h-4 w-4 ${color}`} />
                <span className="text-lg font-bold leading-none">{value}</span>
                <span className="text-[11px] text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Posts */}
          <div className="space-y-3">
            {identity.posts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-12">
                No posts this month yet.
              </p>
            )}
            {identity.posts.map((post) => (
              <ProfilePostCard
                key={post.id}
                post={{
                  ...post,
                  responses: post.responses.map((r) => ({
                    ...r,
                    createdAt: r.createdAt.toISOString(),
                  })),
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
