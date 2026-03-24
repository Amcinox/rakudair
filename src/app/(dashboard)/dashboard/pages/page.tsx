"use client";

import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type PageItem = {
    id: string;
    title: string;
    slug: string;
    status: string;
    template: string;
    showInNav: boolean;
    locale: string;
    createdAt: string;
    updatedAt: string;
};

export default function PagesPage() {
    const [pages, setPages] = useState<PageItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);

    async function fetchPages() {
        setLoading(true);
        const params = new URLSearchParams({ page: String(page), limit: "20" });
        if (search) params.set("search", search);
        if (statusFilter !== "all") params.set("status", statusFilter);

        const res = await fetch(`/api/pages?${params}`);
        const json = await res.json();
        setPages(json.data ?? []);
        setTotal(json.total ?? 0);
        setLoading(false);
    }

    useEffect(() => {
        fetchPages();
    }, [page, statusFilter]);

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this page?")) return;
        const res = await fetch(`/api/pages/${id}`, { method: "DELETE" });
        if (!res.ok) {
            toast.error("Failed to delete");
            return;
        }
        toast.success("Page deleted");
        fetchPages();
    }

    return (
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
                    onKeyDown={(e) => e.key === "Enter" && fetchPages()}
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
    );
}
