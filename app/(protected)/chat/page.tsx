// ChatsPage.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function ChatsPage() {
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/chat/list")
      .then((res) => res.json())
      .then(setRooms)
      .catch(() => {});
  }, []);

  return (
    <main className="bg-primary">
      <section className="w-full px-4 pt-4 bg-primary-foreground dark:bg-background rounded-t-[20px] shadow-md min-h-[100vh]">
        <div className="mx-auto w-full max-w-2xl pb-24">
          {/* ── Header ── */}
          <div className="flex items-center gap-3 py-6">
            <div className="h-9 w-9 rounded-xl bg-[#5D51DA]/10 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faCommentDots}
                className="h-4 w-4 text-[#5D51DA]"
              />
            </div>
            <h1 className="text-lg font-bold tracking-tight">Private Chats</h1>
          </div>

          {/* ── Empty state ── */}
          {rooms.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="h-12 w-12 rounded-2xl bg-[#5D51DA]/10 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faCommentDots}
                  className="h-5 w-5 text-[#5D51DA]/50"
                />
              </div>
              <p className="text-sm text-muted-foreground">No chats yet.</p>
            </div>
          )}

          {/* ── Room list ── */}
          <div className="space-y-3">
            {rooms.map((room: any) => (
              <Link
                key={room.id}
                href={`/chat/${room.id}`}
                className={cn(
                  "flex items-center gap-4 rounded-3xl border shadow-sm px-4 py-4 transition-all",
                  "bg-neutral-50 border-black/5 hover:bg-white",
                  "dark:bg-background dark:border-[hsl(193_31%_20%)] dark:hover:bg-[hsl(193_31%_15%)]",
                )}
              >
                {/* Icon bubble */}
                <div className="h-10 w-10 rounded-xl bg-[#5D51DA]/10 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faCommentDots}
                    className="h-4 w-4 text-[#5D51DA]"
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-foreground truncate">
                    {room.name}
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-foreground/40 mt-0.5 truncate">
                    {room.lastMessage || "No messages yet"}
                  </p>
                </div>

                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="h-3 w-3 text-neutral-300 dark:text-foreground/20 flex-shrink-0"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
