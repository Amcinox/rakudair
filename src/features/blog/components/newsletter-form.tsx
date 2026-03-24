"use client";

import { useState, useTransition } from "react";
import { subscribeToNewsletter } from "@/features/blog/actions/subscribe";

interface NewsletterFormProps {
    variant?: "inline" | "footer";
}

export function NewsletterForm({ variant = "inline" }: NewsletterFormProps) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isPending, startTransition] = useTransition();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;

        startTransition(async () => {
            const result = await subscribeToNewsletter(email);
            setMessage(result.message);
            if (result.success) setEmail("");
        });
    }

    if (variant === "footer") {
        return (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="メールアドレス"
                    className="px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    required
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
                >
                    {isPending ? "..." : "登録する"}
                </button>
                {message && (
                    <p className="text-xs text-muted-foreground">{message}</p>
                )}
            </form>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
        >
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレスを入力"
                className="flex-1 px-6 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
            />
            <button
                type="submit"
                disabled={isPending}
                className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
                {isPending ? "..." : "登録する"}
            </button>
            {message && (
                <p className="text-sm text-muted-foreground text-center sm:text-left w-full">
                    {message}
                </p>
            )}
        </form>
    );
}
