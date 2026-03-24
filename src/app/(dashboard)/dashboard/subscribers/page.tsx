"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeadphonesIllustration } from "@/components/dashboard/illustrations";
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

type Subscriber = {
    id: string;
    email: string;
    name: string | null;
    status: string;
    subscribedAt: string;
    unsubscribedAt: string | null;
};

export default function SubscribersPage() {
    const [subs, setSubs] = useState<Subscriber[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);

    async function fetchSubs() {
        setLoading(true);
        const params = new URLSearchParams({ page: String(page), limit: "50" });
        if (statusFilter !== "all") params.set("status", statusFilter);

        const res = await fetch(`/api/subscribers?${params}`);
        const json = await res.json();
        setSubs(json.data ?? []);
        setTotal(json.total ?? 0);
        setLoading(false);
    }

    useEffect(() => {
        fetchSubs();
    }, [page, statusFilter]);

    async function toggleStatus(sub: Subscriber) {
        const newStatus =
            sub.status === "active" ? "unsubscribed" : "active";
        await fetch(`/api/subscribers/${sub.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        fetchSubs();
    }

    async function handleDelete(id: string) {
        if (!confirm("Permanently delete this subscriber?")) return;
        const res = await fetch(`/api/subscribers/${id}`, { method: "DELETE" });
        if (!res.ok) {
            toast.error("Failed to delete");
            return;
        }
        toast.success("Deleted");
        fetchSubs();
    }

    async function exportCsv() {
        const allRes = await fetch("/api/subscribers?limit=10000");
        const json = await allRes.json();
        const data: Subscriber[] = json.data ?? [];

        const csv = [
            "Email,Name,Status,Subscribed At",
            ...data.map(
                (s) =>
                    `"${s.email}","${s.name ?? ""}","${s.status}","${s.subscribedAt}"`
            ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "subscribers.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight gold-gradient-text" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>Subscribers</h2>
                    <p className="text-muted-foreground">
                        {total} subscriber{total !== 1 ? "s" : ""}
                    </p>
                </div>
                <Button variant="outline" onClick={exportCsv}>
                    Export CSV
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="dash-card rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Subscribed</TableHead>
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
                        ) : subs.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center py-12 text-muted-foreground"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <HeadphonesIllustration className="w-24 h-24 opacity-70" />
                                        <p className="font-medium">No subscribers found.</p>
                                        <p className="text-sm">Your audience is on the way!</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            subs.map((sub) => (
                                <TableRow key={sub.id}>
                                    <TableCell className="font-medium">{sub.email}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {sub.name ?? "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={
                                                sub.status === "active"
                                                    ? "badge-published"
                                                    : "bg-muted text-foreground"
                                            }
                                        >
                                            {sub.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {formatDistanceToNow(new Date(sub.subscribedAt), {
                                            addSuffix: true,
                                        })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleStatus(sub)}
                                            >
                                                {sub.status === "active"
                                                    ? "Unsubscribe"
                                                    : "Reactivate"}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive/80"
                                                onClick={() => handleDelete(sub.id)}
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

            {total > 50 && (
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
                        Page {page} of {Math.ceil(total / 50)}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= Math.ceil(total / 50)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
