"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeadphonesIllustration } from "@/components/dashboard/illustrations";
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
import { usePages } from "@/features/pages/hooks/usePages";

export default function PagesPage() {
    const [search, setSearch] = useState("");
    const [committedSearch, setCommittedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);

    const { pages, total, loading, remove } = usePages(
        page,
        20,
        statusFilter !== "all" ? statusFilter : undefined,
        committedSearch || undefined,
    );
    const [ConfirmDialog, confirm] = useConfirm({
        title: "Delete page?",
        description: "This page will be permanently deleted. This action cannot be undone.",
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
                        <h2 className="text-2xl font-bold tracking-tight gold-gradient-text" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>Pages</h2>
                        <p className="text-muted-foreground">
                            {total} page{total !== 1 ? "s" : ""} total
                        </p>
                    </div>
                    <Button asChild className="btn-gold">
                        <Link href="/dashboard/pages/new">New Page</Link>
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { setCommittedSearch(search); setPage(1); } }}
                        placeholder="Search pages…"
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
                        </SelectContent>
                    </Select>
                </div>

                <div className="dash-card rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Template</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Nav</TableHead>
                                <TableHead>Updated</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        Loading…
                                    </TableCell>
                                </TableRow>
                            ) : pages.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-12 text-muted-foreground"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <HeadphonesIllustration className="w-24 h-24 opacity-70" />
                                            <p className="font-medium">No pages found.</p>
                                            <p className="text-sm">Nothing playing yet — create one!</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pages.map((pg) => (
                                    <TableRow key={pg.id}>
                                        <TableCell>
                                            <Link
                                                href={`/dashboard/pages/${pg.id}/edit`}
                                                className="font-medium hover:underline"
                                            >
                                                {pg.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {pg.template}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    pg.status === "published"
                                                        ? "badge-published"
                                                        : "bg-muted text-foreground"
                                                }
                                                variant="secondary"
                                            >
                                                {pg.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {pg.showInNav && (
                                                <Badge variant="outline" className="text-xs">
                                                    In Nav
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {formatDistanceToNow(new Date(pg.updatedAt), {
                                                addSuffix: true,
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/dashboard/pages/${pg.id}/edit`}>
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive/80"
                                                    onClick={() => handleDelete(pg.id)}
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
