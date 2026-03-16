"use client";

import { use, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faCommentDots,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

export default function ChatPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const [post, setPost] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [myIdentityId, setMyIdentityId] = useState<string | null>(null);
  const [participantName, setParticipantName] = useState<string>("Anonymous");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ✅ fetch current user's identityId from profile
  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        console.log("profile data:", data); // debug
        setMyIdentityId(data?.identityId ?? null);
      })
      .catch(() => {});
  }, []);

  // ✅ fetch room data
  useEffect(() => {
    fetch(`/api/chat/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("room data:", data); // debug
        console.log("first message:", data?.messages?.[0]); // debug — shows field names
        setPost(data?.post || null);
        setMessages(data?.messages || []);
        setParticipantName(data?.participantName || "Anonymous");
        setExpiresAt(data?.expiresAt || null);
      });
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ realtime
  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ChatMessage",
          filter: `roomId=eq.${roomId}`,
        },
        (payload) => {
          console.log("realtime message:", payload.new); // debug
          setMessages((prev) => [...prev, payload.new]);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  async function sendMessage() {
    if (!text.trim()) return;
    await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, content: text }),
    });
    setText("");
  }

  const daysLeft = expiresAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        ),
      )
    : 7;

  const expiryColor =
    daysLeft <= 1
      ? "text-red-400 border-red-400/20 bg-red-400/5"
      : daysLeft <= 3
        ? "text-amber-400 border-amber-400/20 bg-amber-400/5"
        : "text-emerald-400 border-emerald-400/20 bg-emerald-400/5";

  return (
    <main className="bg-primary">
      <section className="w-full bg-primary-foreground dark:bg-background rounded-t-[20px] shadow-md h-[100vh] flex flex-col">
        <div className="mx-auto w-full max-w-2xl flex flex-col flex-1 min-h-0 px-4 pt-4">
          {/* ── Header ── */}
          <div className="flex items-center justify-between py-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#5D51DA]/10 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faCommentDots}
                  className="h-4 w-4 text-[#5D51DA]"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  Private Chat
                </h1>
                <p className="text-xs text-muted-foreground">
                  with {participantName}
                </p>
              </div>
            </div>

            {/* Expiry badge */}
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium",
                expiryColor,
              )}
            >
              <FontAwesomeIcon icon={faClock} className="h-3 w-3" />
              {daysLeft === 0 ? "Expires today" : `${daysLeft}d left`}
            </div>
          </div>

          {/* ── Expiry warning ── */}
          {daysLeft <= 3 && (
            <div
              className={cn(
                "flex-shrink-0 mb-3 rounded-2xl border px-4 py-2.5 text-xs",
                daysLeft <= 1
                  ? "bg-red-400/5 border-red-400/20 text-red-400"
                  : "bg-amber-400/5 border-amber-400/20 text-amber-400",
              )}
            >
              ⚠️ This chat disappears in{" "}
              {daysLeft === 0
                ? "less than a day"
                : `${daysLeft} day${daysLeft > 1 ? "s" : ""}`}
              . Save anything important.
            </div>
          )}

          {/* ── Post reference ── */}
          {post && (
            <div
              className={cn(
                "flex-shrink-0 mb-4 rounded-2xl border px-4 py-3",
                "bg-white border-black/5",
                "dark:bg-[hsl(193_31%_15%)] dark:border-[hsl(193_31%_25%)]",
              )}
            >
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#5D51DA] dark:text-[#8B82E8]">
                Chatting about
              </span>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-foreground/80 mt-1 line-clamp-2">
                {post.content}
              </p>
            </div>
          )}

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto space-y-3 pb-2 min-h-0">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
                <FontAwesomeIcon
                  icon={faCommentDots}
                  className="h-8 w-8 text-muted-foreground"
                />
                <p className="text-sm text-muted-foreground">No messages yet</p>
              </div>
            )}

            {messages.map((m) => {
              // ✅ check both possible field names your DB might use
              const senderId = m.identityId ?? m.senderId ?? m.senderIdentityId;
              const isMine = myIdentityId !== null && senderId === myIdentityId;

              const time = m.createdAt
                ? new Date(m.createdAt).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";

              return (
                <div
                  key={m.id}
                  className={cn(
                    "flex flex-col gap-1",
                    isMine ? "items-end" : "items-start",
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm max-w-[75%]",
                      isMine
                        ? "bg-[#5D51DA] text-white rounded-br-sm"
                        : cn(
                            "rounded-bl-sm border",
                            "bg-white border-black/5 text-neutral-800",
                            "dark:bg-[hsl(193_31%_15%)] dark:border-[hsl(193_31%_25%)] dark:text-foreground",
                          ),
                    )}
                  >
                    {m.content}
                  </div>
                  {time && (
                    <span className="text-[10px] text-neutral-400 dark:text-foreground/30 px-1">
                      {time}
                    </span>
                  )}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* ── Input ── */}
          <div className="flex-shrink-0 py-4">
            <div
              className={cn(
                "flex items-center gap-2 rounded-2xl border px-4 py-2",
                "bg-white border-black/5",
                "dark:bg-[hsl(193_31%_15%)] dark:border-[hsl(193_31%_25%)]",
              )}
            >
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Write a message…"
                className={cn(
                  "flex-1 bg-transparent outline-none text-sm",
                  "text-neutral-900 placeholder:text-neutral-400",
                  "dark:text-foreground dark:placeholder:text-foreground/30",
                )}
              />
              <button
                onClick={sendMessage}
                disabled={!text.trim()}
                className={cn(
                  "h-8 w-8 flex items-center justify-center rounded-xl transition active:scale-95",
                  text.trim()
                    ? "bg-[#5D51DA] text-white hover:bg-[#5D51DA]/90"
                    : "bg-neutral-100 text-neutral-300 cursor-not-allowed dark:bg-[hsl(193_31%_22%)] dark:text-foreground/20",
                )}
              >
                <FontAwesomeIcon icon={faPaperPlane} className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
