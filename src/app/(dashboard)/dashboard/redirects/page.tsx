"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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

type Redirect = {
    id: string;
    fromPath: string;
    toPath: string;
    type: number;
    isActive: boolean;
    createdAt: string;
};

export default function RedirectsPage() {
    const [items, setItems] = useState<Redirect[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Redirect | null>(null);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        fromPath: "",
        toPath: "",
        type: 301,
        isActive: true,
    });

    async function fetchRedirects() {
        setLoading(true);
        const res = await fetch("/api/redirects");
        const json = await res.json();
        setItems(json.data ?? []);
        setTotal(json.total ?? 0);
        setLoading(false);
    }

    useEffect(() => {
        fetchRedirects();
    }, []);

    function openCreate() {
        setEditing(null);
        setForm({ fromPath: "", toPath: "", type: 301, isActive: true });
        setOpen(true);
    }

    function openEdit(item: Redirect) {
        setEditing(item);
        setForm({
            fromPath: item.fromPath,
            toPath: item.toPath,
            type: item.type,
            isActive: item.isActive,
        });
        setOpen(true);
    }

    async function handleSave() {
        if (!form.fromPath.trim() || !form.toPath.trim()) {
            toast.error("From and To paths are required");
            return;
        }

        setSaving(true);

        const url = editing
            ? `/api/redirects/${editing.id}`
            : "/api/redirects";
        const method = editing ? "PATCH" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        setSaving(false);

        if (!res.ok) {
            toast.error("Failed to save");
            return;
        }

        toast.success(editing ? "Updated" : "Created");
        setOpen(false);
        fetchRedirects();
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this redirect?")) return;
        const res = await fetch(`/api/redirects/${id}`, { method: "DELETE" });
        if (!res.ok) {
            toast.error("Failed to delete");
            return;
        }
        toast.success("Deleted");
        fetchRedirects();
    }

    async function toggleActive(item: Redirect) {
        await fetch(`/api/redirects/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !item.isActive }),
        });
        fetchRedirects();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Redirects</h2>
                    <p className="text-neutral-500">
                        {total} redirect{total !== 1 ? "s" : ""} configured
                    </p>
                </div>
                <Button onClick={openCreate}>Add Redirect</Button>
            </div>

            <div className="rounded-md border bg-white dark:bg-neutral-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>From</TableHead>
                            <TableHead>To</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Active</TableHead>
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
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center py-8 text-neutral-500"
                                >
                                    No redirects configured.
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-mono text-sm">
                                        {item.fromPath}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {item.toPath}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={
                                                item.type === 301
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }
                                        >
                                            {item.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={item.isActive}
                                            onCheckedChange={() => toggleActive(item)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openEdit(item)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => handleDelete(item.id)}
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

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? "Edit Redirect" : "Add Redirect"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>From Path</Label>
                            <Input
                                value={form.fromPath}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, fromPath: e.target.value }))
                                }
                                placeholder="/old-path"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>To Path</Label>
                            <Input
                                value={form.toPath}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, toPath: e.target.value }))
                                }
                                placeholder="/new-path"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                                value={String(form.type)}
                                onValueChange={(v) =>
                                    setForm((f) => ({ ...f, type: Number(v) }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="301">301 (Permanent)</SelectItem>
                                    <SelectItem value="302">302 (Temporary)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Active</Label>
                            <Switch
                                checked={form.isActive}
                                onCheckedChange={(v) =>
                                    setForm((f) => ({ ...f, isActive: v }))
                                }
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? "Saving…" : editing ? "Update" : "Create"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
