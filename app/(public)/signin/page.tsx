"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Sign in to Happens</h1>

      <button onClick={() => signIn("google", { callbackUrl: "/" })}>
        Continue with Google
      </button>

      <br />
      <br />

      <button onClick={() => signIn("email", { callbackUrl: "/" })}>
        Continue with Email
      </button>
    </div>
  );
}
