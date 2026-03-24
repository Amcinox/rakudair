"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyMicIllustration } from "@/components/dashboard/illustrations";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { useConfirm } from "@/hooks/use-confirm";
import { useArticles } from "@/features/articles/hooks/useArticles";

const statusColors: Record<string, string> = {
    draft: "bg-muted text-foreground",
    published: "badge-published",
    scheduled: "badge-scheduled",
    archived: "badge-archived",
};

export default function ArticlesPage() {
    const [search, setSearch] = useState("");
    const [committedSearch, setCommittedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);

    const { articles, total, loading, remove } = useArticles(
        page,
        20,
        statusFilter !== "all" ? statusFilter : undefined,
        committedSearch || undefined,
    );
    const [ConfirmDialog, confirm] = useConfirm({
        title: "Delete article?",
        description: "This article will be permanently deleted. This action cannot be undone.",
        confirmText: "Delete",
        variant: "destructive",
    });

    async function handleDelete(id: string) {
        if (!(await confirm())) return;
        try {
            await remove(id);
        } catch {
            // handled by hook
        }
    }

    return (
        <>
            <ConfirmDialog />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight gold-gradient-text" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>Articles</h2>
                        <p className="text-muted-foreground">
                            {total} article{total !== 1 ? "s" : ""} total
                        </p>
                    </div>
                    <Button asChild className="btn-gold">
                        <Link href="/dashboard/articles/new">New Article</Link>
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { setCommittedSearch(search); setPage(1); } }}
                        placeholder="Search articles…"
                        className="max-w-sm"
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="dash-card rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Updated</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        Loading…
                                    </TableCell>
                                </TableRow>
                            ) : articles.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center py-12 text-muted-foreground"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <EmptyMicIllustration className="w-28 h-28 opacity-70" />
                                            <p className="font-medium">No articles found.</p>
                                            <p className="text-sm">Time to drop some bars!</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                articles.map((article) => (
                                    <TableRow key={article.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/dashboard/articles/${article.id}/edit`}
                                                    className="font-medium hover:underline"
                                                >
                                                    {article.title}
                                                </Link>
                                                {article.isFeatured && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Featured
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {article.categoryName ?? "—"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={statusColors[article.status] ?? ""}
                                                variant="secondary"
                                            >
                                                {article.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {formatDistanceToNow(new Date(article.updatedAt), {
                                                addSuffix: true,
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/dashboard/articles/${article.id}/edit`}>
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive/80"
                                                    onClick={() => handleDelete(article.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {total > 20 && (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {page} of {Math.ceil(total / 20)}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page >= Math.ceil(total / 20)}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
