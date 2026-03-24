"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MicrophoneIllustration } from "@/components/dashboard/illustrations";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type Message = {
    id: string;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    status: string;
    createdAt: string;
};

const statusColors: Record<string, string> = {
    new: "badge-new",
    read: "badge-archived",
    replied: "badge-published",
};

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewing, setViewing] = useState<Message | null>(null);

    async function fetchMessages() {
        setLoading(true);
        const params = new URLSearchParams({ limit: "50" });
        if (statusFilter !== "all") params.set("status", statusFilter);

        const res = await fetch(`/api/contact?${params}`);
        const json = await res.json();
        setMessages(json.data ?? []);
        setTotal(json.total ?? 0);
        setLoading(false);
    }

    useEffect(() => {
        fetchMessages();
    }, [statusFilter]);

    async function markAs(id: string, status: string) {
        await fetch(`/api/contact/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        fetchMessages();
        if (viewing?.id === id) {
            setViewing((prev) => (prev ? { ...prev, status } : null));
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this message?")) return;
        const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
        if (!res.ok) {
            toast.error("Failed to delete");
            return;
        }
        toast.success("Deleted");
        setViewing(null);
        fetchMessages();
    }

    function openMessage(msg: Message) {
        setViewing(msg);
        if (msg.status === "new") {
            markAs(msg.id, "read");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight gold-gradient-text" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>Messages</h2>
                    <p className="text-muted-foreground">
                        {total} message{total !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="dash-card rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Received</TableHead>
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
                        ) : messages.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center py-12 text-muted-foreground"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <MicrophoneIllustration className="w-16 h-24 opacity-70" />
                                        <p className="font-medium">No messages found.</p>
                                        <p className="text-sm">Nobody on the mic yet!</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            messages.map((msg) => (
                                <TableRow
                                    key={msg.id}
                                    className={msg.status === "new" ? "font-semibold" : ""}
                                >
                                    <TableCell>
                                        <Badge
                                            className={statusColors[msg.status] ?? ""}
                                            variant="secondary"
                                        >
                                            {msg.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            className="hover:underline text-left"
                                            onClick={() => openMessage(msg)}
                                        >
                                            {msg.name}
                                            <span className="block text-xs text-muted-foreground font-normal">
                                                {msg.email}
                                            </span>
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            className="hover:underline text-left"
                                            onClick={() => openMessage(msg)}
                                        >
                                            {msg.subject ?? "(No subject)"}
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {formatDistanceToNow(new Date(msg.createdAt), {
                                            addSuffix: true,
                                        })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive/80"
                                            onClick={() => handleDelete(msg.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Message Detail Dialog */}
            <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {viewing?.subject ?? "Message"}
                        </DialogTitle>
                    </DialogHeader>
                    {viewing && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <div>
                                    <span className="font-medium">{viewing.name}</span>
                                    <span className="text-muted-foreground ml-2">
                                        {viewing.email}
                                    </span>
                                </div>
                                <Badge
                                    className={statusColors[viewing.status] ?? ""}
                                    variant="secondary"
                                >
                                    {viewing.status}
                                </Badge>
                            </div>
                            <div className="dash-card rounded-lg p-4 text-sm whitespace-pre-wrap">
                                {viewing.message}
                            </div>
                            <div className="flex justify-between">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => markAs(viewing.id, "replied")}
                                        disabled={viewing.status === "replied"}
                                    >
                                        Mark as Replied
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                    >
                                        <a href={`mailto:${viewing.email}?subject=Re: ${viewing.subject ?? ""}`}>
                                            Reply via Email
                                        </a>
                                    </Button>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600"
                                    onClick={() => handleDelete(viewing.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
