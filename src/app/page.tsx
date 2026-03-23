"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubmitted(true);
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#faf8f4] px-6 py-20">
      {/* Decorative background kanji */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center text-[32rem] font-bold leading-none text-neutral-900/3 overflow-hidden"
      >
        旅
      </span>

      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-red-700 to-transparent opacity-60" />

      {/* Content card */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-xl w-full">

        {/* Badge */}
        <Badge
          variant="outline"
          className="border-red-700/30 bg-red-50 text-red-700 tracking-widest text-xs uppercase px-4 py-1 rounded-full"
        >
          Coming Soon
        </Badge>

        {/* Logo / Brand */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm tracking-[0.4em] text-neutral-400 uppercase font-light">
            らくだエア
          </p>
          <h1 className="text-6xl font-bold tracking-tight text-neutral-900 leading-none">
            Rakuda Air
          </h1>
        </div>

        <Separator className="w-12 bg-red-700/40" />

        {/* Description */}
        <p className="text-base leading-relaxed text-neutral-500 max-w-sm">
          A travel blog devoted to Japan — hidden shrines, mountain ryokans,
          neon‑lit streets, and everything in between.
        </p>

        {/* Email form */}
        <div className="w-full max-w-sm">
          {submitted ? (
            <div className="flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
              <span className="text-2xl">ありがとう 🎋</span>
              <p className="text-sm text-neutral-500">
                We&apos;ll let you know when we launch.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 border-neutral-200 bg-white placeholder:text-neutral-400 focus-visible:ring-red-700/40"
              />
              <Button
                type="submit"
                className="bg-red-700 hover:bg-red-800 text-white shrink-0"
              >
                Notify me
              </Button>
            </form>
          )}
        </div>

        {/* Footer note */}
        <p className="text-xs text-neutral-400 tracking-wide">
          Japan awaits — stay tuned.
        </p>

        {/* Contact */}
        <a
          href="mailto:info@rakudair.com"
          className="text-xs text-neutral-400 hover:text-red-700 transition-colors tracking-wide"
        >
          info@rakudair.com
        </a>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-red-700 to-transparent opacity-60" />
    </div>
  );
}

