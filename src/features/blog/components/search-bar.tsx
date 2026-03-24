"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

export function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") ?? "");
    const [isPending, startTransition] = useTransition();

    const handleSearch = useCallback(
        (value: string) => {
            setQuery(value);
            startTransition(() => {
                const params = new URLSearchParams(searchParams.toString());
                if (value) {
                    params.set("q", value);
                } else {
                    params.delete("q");
                }
                params.delete("page");
                router.push(`/blog?${params.toString()}`);
            });
        },
        [router, searchParams]
    );

    return (
        <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="記事を検索..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {isPending && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
}
