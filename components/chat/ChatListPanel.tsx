"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function ChatListPanel() {
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/chat/list")
      .then((res) => res.json())
      .then(setRooms)
      .catch(() => {});
  }, []);

  return (
    <div className="bg-card my-4 border rounded-2xl p-4 shadow-sm flex flex-col h-[50vh]">
      {/* ── Header — matches NotificationsPanel exactly ── */}
      <h2 className="font-semibold mb-4 text-lg shrink-0">Private Chats</h2>

      <div className="overflow-y-auto flex-1 space-y-3 pr-1">
        {/* Empty state */}
        {rooms.length === 0 && (
          <p className="text-sm text-muted-foreground text-center mt-8">
            No chats yet.
          </p>
        )}

        {/* Chat list */}
        {rooms.map((room) => (
          <Link
            key={room.id}
            href={`/chat/${room.id}`}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors",
              "bg-primary/10 border border-primary/20 hover:bg-primary/15",
            )}
          >
            {/* Icon bubble */}
            <div className="shrink-0 h-10 w-10 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
              <FontAwesomeIcon
                icon={faCommentDots}
                className="h-4 w-4 text-sky-400"
              />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <p className="text-sm font-medium leading-snug truncate">
                {room.name}
              </p>
              <span className="text-xs text-muted-foreground truncate">
                {room.lastMessage || "No messages yet"}
              </span>
            </div>

            <FontAwesomeIcon
              icon={faChevronRight}
              className="h-2.5 w-2.5 text-muted-foreground/40 shrink-0"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
