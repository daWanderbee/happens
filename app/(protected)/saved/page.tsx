"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faHeart,
  faCommentDots,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

export default function SavedPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/posts/saved")
      .then((res) => res.json())
      .then(setPosts)
      .catch(() => {});
  }, []);

  return (
    <main className="bg-primary">
      <section
        className="
          w-full px-4 pt-4
          bg-primary-foreground dark:bg-background
          rounded-t-[20px] shadow-md min-h-[100vh]
        "
      >
        <div className="mx-auto w-full max-w-2xl pb-24">
          {/* ── Header ── */}
          <div className="flex items-center gap-3 py-6">
            <div className="h-9 w-9 rounded-xl bg-[#5D51DA]/10 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faBookmark}
                className="h-4 w-4 text-[#5D51DA]"
              />
            </div>
            <h1 className="text-lg font-bold tracking-tight">Saved Posts</h1>
          </div>

          {/* ── Empty state ── */}
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="h-12 w-12 rounded-2xl bg-[#5D51DA]/10 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faBookmark}
                  className="h-5 w-5 text-[#5D51DA]/50"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                No saved posts yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post: any) => (
                <div
                  key={post.id}
                  className={cn(
                    "w-full rounded-3xl border shadow-sm flex flex-col",
                    "bg-neutral-50 border-black/5",
                    "dark:bg-background dark:border-[hsl(193_31%_20%)]",
                  )}
                >
                  {/* Inner card */}
                  <div
                    className={cn(
                      "mx-4 mt-4 rounded-2xl border",
                      "bg-white border-black/5",
                      "dark:bg-[hsl(193_31%_15%)] dark:border-[hsl(193_31%_25%)]",
                    )}
                  >
                    <div className="px-5 py-5">
                      {post.emotionTag && (
                        <span className="inline-block mb-3 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#5D51DA]/10 text-[#5D51DA] dark:bg-[#5D51DA]/20 dark:text-[#8B82E8]">
                          {post.emotionTag}
                        </span>
                      )}
                      <p className="text-[15.5px] leading-relaxed text-neutral-900 dark:text-foreground">
                        {post.content}
                      </p>
                    </div>

                    {/* Footer */}
                    <div
                      className={cn(
                        "px-5 py-3 border-t flex items-center justify-between",
                        "border-black/5 dark:border-[hsl(193_31%_25%)]",
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-xs text-rose-400">
                          <FontAwesomeIcon icon={faHeart} className="h-3 w-3" />
                          {post.reactions?.length ?? 0}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-sky-400">
                          <FontAwesomeIcon
                            icon={faCommentDots}
                            className="h-3 w-3"
                          />
                          {post.responses?.length ?? 0}
                        </span>
                      </div>

                      <span className="flex items-center gap-1 text-[11px] text-neutral-400 dark:text-foreground/40">
                        <FontAwesomeIcon
                          icon={faCalendarDays}
                          className="h-3 w-3"
                        />
                        {new Date(post.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="h-4" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
