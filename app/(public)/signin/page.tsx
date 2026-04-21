"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* Simple spinner (no extra deps) */
function Spinner() {
  return (
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
  );
}

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<"google" | "email" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    setError(null);
    setLoading("google");
    try {
      await signIn("google", { callbackUrl: "/home" });
    } catch {
      setError("Something went wrong with Google sign-in.");
      setLoading(null);
    }
  }

  async function handleEmailSignIn() {
    if (!email) return;
    setError(null);
    setLoading("email");
    try {
      await signIn("email", { email, callbackUrl: "/home" });
    } catch {
      setError("Unable to send magic link. Please try again.");
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-primary flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-[28px] border-none shadow-md bg-card">
        {/* HEADER */}
        <CardHeader className="flex flex-col items-center text-center pt-8">
          <Image
            src="/logo/logo.svg"
            alt="Happens logo"
            width={40}
            height={40}
            className="dark:bg-foreground rounded-full"
          />

          <h1
            className="text-[28px] font-bold tracking-wide text-foreground"
            style={{ fontFamily: '"Shadows Into Light", cursive' }}
          >
            Happens
          </h1>

          <CardDescription className="mt-3 text-[16px] text-foreground max-w-[36ch]">
            Sign in to continue anonymously.
          </CardDescription>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="flex flex-col gap-6 mt-6">
          {/* EMAIL INPUT */}
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            disabled={loading !== null}
            onChange={(e) => setEmail(e.target.value)}
            className="
              h-[56px]
              rounded-full
              px-5
              text-foreground
              placeholder:text-foreground
            "
          />

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </CardContent>

        {/* FOOTER */}
        <CardFooter className="flex flex-col gap-4 pb-8">
          <Button
            disabled={!email || loading !== null}
            onClick={handleEmailSignIn}
            className="
              h-[56px]
              rounded-full
              px-16
              text-[14px]
              font-medium
              bg-primary
              text-primary-foreground
              hover:bg-primary/90
              disabled:opacity-50
            "
          >
            {loading === "email" ? <Spinner /> : "Send magic link"}
          </Button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3">
            <div className="w-[40px] border border-gray-400 " />
            <span className="text-sm text-foreground">or</span>
            <div className="w-[40px] border border-gray-400 " />
          </div>

          {/* GOOGLE SIGN IN */}
          <Button
            variant="outline"
            disabled={loading !== null}
            onClick={handleGoogleSignIn}
            className="
              h-[56px]
              rounded-full
              px-8
              text-[14px]
              font-medium
              flex items-center justify-center gap-3
              animate-fade-in-up
            "
          >
            {loading === "google" ? (
              <Spinner />
            ) : (
              <>
                <Image
                  src="/icons/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                />
                Continue with Google
              </>
            )}
          </Button>

          <p className="text-[12px] text-foreground text-center max-w-[38ch]">
            Your email is used only for authentication.
            <br />
            Your identity is never shown publicly.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
