"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface CategoryFilterProps {
    categories: Category[];
    activeSlug?: string;
}

export function CategoryFilter({ categories, activeSlug }: CategoryFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleCategoryClick = useCallback(
        (slug: string | null) => {
            const params = new URLSearchParams(searchParams.toString());
            if (slug) {
                params.set("category", slug);
            } else {
                params.delete("category");
            }
            // Reset page when changing category
            params.delete("page");
            router.push(`/blog?${params.toString()}`);
        },
        [router, searchParams]
    );

    return (
        <div className="flex flex-wrap justify-center gap-3">
            <button
                onClick={() => handleCategoryClick(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!activeSlug
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground hover:bg-primary/10 border border-border"
                    }`}
            >
                すべて
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeSlug === category.slug
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-foreground hover:bg-primary/10 border border-border"
                        }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}
