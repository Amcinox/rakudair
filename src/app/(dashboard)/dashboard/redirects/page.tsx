"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SneakerIllustration } from "@/components/dashboard/illustrations";
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
import { useConfirm } from "@/hooks/use-confirm";
import { useRedirects, type Redirect } from "@/features/redirects/hooks/useRedirects";

export default function RedirectsPage() {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Redirect | null>(null);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        fromPath: "",
        toPath: "",
        type: 301,
        isActive: true,
    });

    const { redirects, total, loading, create, update, remove } = useRedirects();

    const [ConfirmDialog, confirm] = useConfirm({
        title: "Delete redirect?",
        description: "This redirect will be permanently deleted.",
        confirmText: "Delete",
        variant: "destructive",
    });

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
        try {
            if (editing) {
                await update(editing.id, form);
            } else {
                await create(form);
            }
            setOpen(false);
        } catch {
            // handled by hook
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!(await confirm())) return;
        try {
            await remove(id);
        } catch {
            // handled by hook
        }
    }

    async function toggleActive(item: Redirect) {
        try {
            await update(item.id, { isActive: !item.isActive });
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
                        <h2 className="text-2xl font-bold tracking-tight gold-gradient-text" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>Redirects</h2>
                        <p className="text-muted-foreground">
                            {total} redirect{total !== 1 ? "s" : ""} configured
                        </p>
                    </div>
                    <Button onClick={openCreate} className="btn-gold">Add Redirect</Button>
                </div>

                <div className="dash-card rounded-lg">
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
                            ) : redirects.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center py-12 text-muted-foreground"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <SneakerIllustration className="w-28 h-20 opacity-70" />
                                            <p className="font-medium">No redirects configured.</p>
                                            <p className="text-sm">No detours on the track!</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                redirects.map((item) => (
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
                                                        ? "badge-scheduled"
                                                        : "badge-archived"
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
                                                    className="text-destructive hover:text-destructive/80"
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
        </>
    );
}
