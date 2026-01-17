"use client";

import { useState } from "react";

export default function SharePage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submitPost() {
    if (!content.trim()) return;

    setLoading(true);
    setMessage("");

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    setLoading(false);

    if (res.ok) {
      setContent("");
      setMessage("Post shared anonymously 🌱");
    } else {
      setMessage("Something went wrong");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Share</h1>

      <textarea
        rows={6}
        style={{ width: "100%", padding: "8px" }}
        placeholder="Write what you want to release..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <br />
      <br />

      <button onClick={submitPost} disabled={loading}>
        {loading ? "Sharing..." : "Share anonymously"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
