"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function HomePage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");

  if (session) {
    return (
      <div>
        <p>Signed in</p>
        <p>Come to the read page <a href="/read">here</a></p>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Happens</h1>

      <button onClick={() => signIn("google")}>Sign in with Google</button>

      <hr />

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={() => signIn("email", { email, callbackUrl: "/read" })}>
        Send magic link
      </button>
    </div>
  );
}
