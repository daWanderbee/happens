"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faHandHoldingHeart,
  faHandsPraying,
  faFaceSmile,
  faBookmark,
  faEllipsis,
  faShare,
  faFlag,
  faXmark,
  faComment,
  faPaperPlane,
  faTrash,
  faPen
} from "@fortawesome/free-solid-svg-icons";
import Overlay from "../ui/Overlay";
import ModalPortal from "../ui/ModalPortal";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { toast } from "react-hot-toast";
/* =========================
   Types
========================= */

type ReactionId = "support" | "care" | "strength" | "comfort";

type Comment = {
  id: string;
  content: string;
  author: string;
  timeAgo: string;
};

type PostCardProps = {
  postId: string;
  content: string;
  emotion?: string;
  author: string;
  createdAt: Date;
  isMine?: boolean; // ✅ add this
  identityId?: string; // 👈 add this
};

function showConfirmationToast(onConfirm: () => void) {
  toast.custom((t) => (
    <div
      className={cn(
        "flex flex-col gap-3 p-4 rounded-2xl border shadow-xl min-w-[220px]",
        "bg-white border-black/5",
        "dark:bg-[hsl(193_31%_13%)] dark:border-[hsl(193_31%_22%)]",
      )}
    >
      <p className="text-[13.5px] font-medium text-neutral-800 dark:text-foreground">
        Are you sure?
      </p>

      <div className="flex gap-2">
        {/* Confirm */}
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }}
          className={cn(
            "flex-1 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95",
            "bg-[#5D51DA] text-white hover:bg-[#5D51DA]/90",
          )}
        >
          Yes
        </button>

        {/* Cancel */}
        <button
          onClick={() => toast.dismiss(t.id)}
          className={cn(
            "flex-1 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95",
            "bg-neutral-100 text-neutral-500 hover:bg-neutral-200",
            "dark:bg-[hsl(193_31%_20%)] dark:text-foreground/60 dark:hover:bg-[hsl(193_31%_24%)]",
          )}
        >
          No
        </button>
      </div>
    </div>
  ));
}

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/* =========================
   Reaction Config
========================= */

const reactionOptions: {
  id: ReactionId;
  label: string;
  icon: any;
}[] = [
  { id: "support", label: "Support", icon: faHeart },
  { id: "care", label: "Care", icon: faHandHoldingHeart },
  { id: "strength", label: "Strength", icon: faHandsPraying },
  { id: "comfort", label: "Comfort", icon: faFaceSmile },
];

const PREVIEW_LENGTH = 200;
const LONG_PRESS_MS = 450;

/* =========================
   Component
========================= */

export default function PostCard({
  postId,
  content,
  emotion,
  author = "Anonymous",
  createdAt,
  isMine = false, // ✅ add this
  identityId, // 👈 add this
}: PostCardProps) {
  /* =========================
     State
  ========================= */
  const [reactions, setReactions] = useState<Record<ReactionId, number>>({
    support: 0,
    care: 0,
    strength: 0,
    comfort: 0,
  });

  const [activeReaction, setActiveReaction] = useState<ReactionId | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [savingEdit, setSavingEdit] = useState(false);

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  //  comments
  const [comments, setComments] = useState<Comment[]>([]);

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);
  const isLong = content.length > PREVIEW_LENGTH;
  const preview = isLong ? content.slice(0, PREVIEW_LENGTH) + "…" : content;

  const activeOption = reactionOptions.find((r) => r.id === activeReaction);

  /* =========================
     Utilities
  ========================= */

  function vibrate(ms = 12) {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(ms);
    }
  }

  async function handleReaction(id: ReactionId) {
    vibrate(18);

    const res = await fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        postId,
        type: id,
      }),
    });

    if (!res.ok) {
      console.error("API error", res.status);
      return;
    }

    const text = await res.text();
    if (!text) return;

    const data = JSON.parse(text);
    setReactions(data);

    setActiveReaction(id);
  }

  function startLongPress() {
    longPressTimer.current = setTimeout(() => {
      vibrate(25);
      setShowReactions(true);
    }, LONG_PRESS_MS);
  }

  function cancelLongPress() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }
  async function handleUpdatePost() {
    if (!editContent.trim()) return;

    try {
      setSavingEdit(true);

      const res = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editContent,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Post updated");
      setEditing(false);
      window.location.reload(); // or router.refresh()
    } catch (err) {
      toast.error("Failed to update post");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleSave() {
    try {
      const res = await fetch("/api/posts/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      if (!res.ok) {
        throw new Error("Save failed");
      }

      const data = await res.json();

      setSaved(data.saved);

      if (data.saved) {
        toast.success("Post saved");
      } else {
        toast("Post removed from saved");
      }
    } catch (err) {
      toast.error("Failed to save post");
      console.error(err);
    }
  } 

  
  async function handleAddComment() {
    if (!newComment.trim()) return;

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        content: newComment,
      }),
    });

    const saved = await res.json();

    setComments((prev) => [
      ...prev,
      {
        id: saved.id,
        content: saved.content,
        author: "Anonymous",
        timeAgo: "Just now",
      },
    ]);

    setNewComment("");
    vibrate(12);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadReactions() {
      try {
        const res = await fetch(`/api/reactions?postId=${postId}`, {
          credentials: "include", // important for auth/session
        });

        if (!res.ok) return;

        const text = await res.text();
        if (!text) return; // ✅ prevents JSON.parse crash

        const data = JSON.parse(text);

        if (!cancelled) {
          setReactions(data.reactions ?? {});
          setActiveReaction(data.active ?? null);
        }
      } catch (err) {
        console.error("Reaction fetch failed", err);
      }
    }

    loadReactions();

    return () => {
      cancelled = true;
    };
  }, [postId]);

  useEffect(() => {
    if (!postId) return;

    const es = new EventSource("/api/reactions/stream");

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);

        if (data.postId === postId) {
          // ✅ re-fetch reactions safely
          fetch(`/api/reactions?postId=${postId}`, {
            credentials: "include",
          })
            .then((res) => res.text())
            .then((text) => {
              if (!text) return;

              const data = JSON.parse(text);
              setReactions(data.reactions ?? {});
              setActiveReaction(data.active ?? null);
            })
            .catch(() => {});
        }
      } catch {
        // ignore malformed SSE payloads
      }
    };

    es.onerror = () => {
      es.close(); // ✅ prevents zombie connections
    };

    return () => {
      es.close();
    };
  }, [postId]);

  useEffect(() => {
    if (!showCommentsModal) return;

    fetch(`/api/comments?postId=${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(
          data.map((c: any) => ({
            id: c.id,
            content: c.content,
            author: c.author || "anonymous",
          })),
        );
      });
  }, [showCommentsModal, postId]);

  /* =========================
     Render
  ========================= */

  return (
    <>
      <article
        className={cn(
          "w-full rounded-2xl bg-white dark:bg-card",
          "border-b dark:border-0",
          "transition-shadow hover:shadow-md",
        )}
      >
        {/* HEADER */}
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold">
            {author.charAt(0).toUpperCase()}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-foreground/40">
            <span>{isMine ? "Me" : author}</span>
            <span>•</span>
            <span>{timeAgo(createdAt)}</span>
            {emotion && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[9px]">
                {emotion}
              </span>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-5 py-4">
          <p className="text-[15.5px] leading-relaxed text-foreground">
            {preview}
          </p>

          {isLong && (
            <button
              onClick={() => {
                setShowCommentsModal(true);
                setShowCommentInput(false);
              }}
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              Read more
            </button>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-4 py-3 flex items-center gap-3">
          {/* REACTIONS */}
          <div className="relative">
            <HoverCard open={showReactions} onOpenChange={setShowReactions}>
              <HoverCardTrigger asChild>
                <button
                  onMouseDown={startLongPress}
                  onMouseUp={cancelLongPress}
                  onMouseLeave={cancelLongPress}
                  onTouchStart={startLongPress}
                  onTouchEnd={cancelLongPress}
                  onClick={() => setShowReactions((v) => !v)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition",
                    activeReaction
                      ? "bg-primary/15 text-primary"
                      : "bg-black/5 text-foreground/70 hover:bg-black/10",
                  )}
                >
                  <FontAwesomeIcon
                    icon={activeOption?.icon ?? faHeart}
                    className="h-4 w-4"
                  />

                  {totalReactions > 0 && (
                    <span className="text-xs font-semibold">
                      {totalReactions}
                    </span>
                  )}
                </button>
              </HoverCardTrigger>

              <HoverCardContent
                side="top"
                align="start"
                sideOffset={12}
                className="w-auto p-0 border-0 bg-transparent"
              >
                <div className="flex items-center gap-2 rounded-full bg-card px-3 py-2 shadow-xl border border-border/50">
                  {reactionOptions.map((reaction) => (
                    <ReactionIcon
                      key={reaction.id}
                      icon={reaction.icon}
                      active={activeReaction === reaction.id}
                      onClick={() => handleReaction(reaction.id)}
                    />
                  ))}
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          <div className="flex-1" />

          {/* SAVE */}
          <IconButton
            icon={faBookmark}
            active={saved}
            onClick={() => {
              vibrate(12);
              setSaved(!saved);
              handleSave();
              
            }}
          />

          {/* MENU */}
          <div className="relative">
            <IconButton
              icon={faEllipsis}
              onClick={() => setShowMenu(!showMenu)}
            />

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 bottom-full mb-2 z-20 w-48 rounded-xl bg-card border shadow-lg py-1">
                  <MenuButton
                    icon={faComment}
                    label="Comment"
                    onClick={() => {
                      setShowMenu(false);
                      setShowCommentsModal(true);
                      setShowCommentInput(true);
                    }}
                  />

                  <MenuButton
                    icon={faShare}
                    label="Share"
                    onClick={() => {
                      setShowMenu(false);
                      vibrate(12);
                      const sharePost = async () => {
                        const url = `${globalThis.location.origin}/post/${postId}`;

                        await navigator.clipboard.writeText(url);
                        alert("Link copied!");
                      };
                      sharePost();
                    }}
                  />

                  {isMine && (
                    <MenuButton
                      icon={faTrash}
                      label="Delete"
                      onClick={() => {
                        setShowMenu(false);
                        vibrate(12);

                        showConfirmationToast(async () => {
                          const res = await fetch(
                            `/api/posts/${postId}/delete`,
                            {
                              method: "DELETE",
                            },
                          );

                          if (res.ok) {
                            toast.success("Post deleted successfully!");
                            window.location.reload();
                          } else {
                            toast.error("Failed to delete post");
                          }
                        });
                      }}
                    />
                  )}

                  {isMine && (
                    <MenuButton
                      icon={faPen}
                      label="Edit"
                      onClick={() => {
                        setShowMenu(false);
                        setEditing(true);
                      }}
                    />
                  )}

                  <div className="my-1 border-t" />

                  <MenuButton
                    icon={faFlag}
                    label="Report"
                    danger
                    onClick={async () => {
                      setShowMenu(false);
                      vibrate(12);
                      await fetch("/api/posts/report", {
                        method: "POST",
                        body: JSON.stringify({
                          postId: postId,
                          reason: "Inappropriate content",
                        }),
                      });

                      alert("Post reported");
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </article>

      {/* COMMENTS MODAL */}
      {showCommentsModal && (
        <>
          <Overlay open onClick={() => setShowCommentsModal(false)} />
          <ModalPortal open>
            <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center">
              <div className="w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl bg-card border shadow-xl max-h-[85vh] sm:max-h-[80vh] flex flex-col">
                {/* HEADER */}
                <div className="flex items-center justify-between px-5 py-4 border-b">
                  <h3 className="text-lg font-semibold">Post & Comments</h3>
                  <button
                    onClick={() => setShowCommentsModal(false)}
                    className="h-9 w-9 rounded-full hover:bg-black/5 flex items-center justify-center transition"
                  >
                    <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                  {/* POST CONTENT */}
                  <div className="pb-4 border-b">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-semibold">
                        {author.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-foreground/50">
                        <span className="font-medium">{author}</span>
                        <span>•</span>
                        <span>{timeAgo(createdAt)}</span>
                      </div>
                    </div>
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                      {content}
                    </p>
                  </div>

                  {/* COMMENTS SECTION */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-foreground/70">
                      Comments ({comments.length})
                    </h4>

                    {comments.length === 0 ? (
                      <div className="text-center py-8">
                        <FontAwesomeIcon
                          icon={faComment}
                          className="h-8 w-8 text-foreground/20 mb-2"
                        />
                        <p className="text-sm text-foreground/40">
                          No comments yet. Be the first to comment!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {comments.map((c) => (
                          <div
                            key={c.id}
                            className="p-3 rounded-lg bg-muted/30 border border-border/50"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-semibold">
                                {c.author.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-foreground/50">
                                <span className="font-medium">{c.author}</span>
                                <span>•</span>
                                <span>{c.timeAgo}</span>
                              </div>
                            </div>
                            <p className="text-sm leading-relaxed">
                              {c.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* COMMENT INPUT */}
                {showCommentInput && (
                  <div className="border-t p-4">
                    <div className="flex items-end gap-2">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment();
                          }
                        }}
                        placeholder="Write a supportive comment..."
                        className="flex-1 resize-none rounded-xl border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px] max-h-32"
                        rows={1}
                      />
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className={cn(
                          "h-11 w-11 rounded-xl flex items-center justify-center transition",
                          newComment.trim()
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-muted text-foreground/30 cursor-not-allowed",
                        )}
                      >
                        <FontAwesomeIcon
                          icon={faPaperPlane}
                          className="h-4 w-4"
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ModalPortal>
        </>
      )}

      {editing && (
        <>
          <Overlay open onClick={() => setEditing(false)} />

          <ModalPortal open>
            <div className="fixed inset-0 z-[10000] flex items-center justify-center">
              <div className="w-full max-w-xl rounded-2xl bg-card border shadow-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">Edit Post</h3>

                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full min-h-[120px] resize-none rounded-xl border p-3 bg-muted/30"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 rounded-lg bg-muted"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleUpdatePost}
                    disabled={savingEdit}
                    className="px-4 py-2 rounded-lg bg-primary text-white"
                  >
                    {savingEdit ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </ModalPortal>
        </>
      )}
    </>
  );
}

/* =========================
   Helpers
========================= */

function ReactionIcon({
  icon,
  active,
  onClick,
}: {
  icon: any;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-10 w-10 flex items-center justify-center rounded-full",
        "transition-all duration-200 ease-out",
        "hover:scale-110 active:scale-95",
        active
          ? "bg-primary/20 text-primary scale-105"
          : "text-foreground/70 hover:bg-primary/10",
      )}
      aria-label="React"
    >
      <FontAwesomeIcon icon={icon} className="h-4 w-4" />
    </button>
  );
}

function IconButton({
  icon,
  onClick,
  active = false,
}: {
  icon: any;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-8 w-8 flex items-center justify-center rounded-md transition",
        active
          ? "text-primary bg-primary/15"
          : "text-foreground/60 hover:bg-black/5",
      )}
    >
      <FontAwesomeIcon icon={icon} className="h-4 w-4" />
    </button>
  );
}

function MenuButton({
  icon,
  label,
  danger = false,
  onClick,
}: {
  icon: any;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full px-4 py-2.5 flex items-center gap-3 text-sm transition",
        danger
          ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          : "hover:bg-black/5",
      )}
    >
      <FontAwesomeIcon icon={icon} className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
