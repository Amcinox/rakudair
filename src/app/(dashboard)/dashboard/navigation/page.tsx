"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SneakerIllustration } from "@/components/dashboard/illustrations";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useNavigation, type NavItem } from "@/features/navigation/hooks/useNavigation";

const positionColors: Record<string, string> = {
    header: "badge-scheduled",
    footer: "bg-purple-100 text-purple-700",
    social: "badge-published",
};

export default function NavigationPage() {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<NavItem | null>(null);
    const [saving, setSaving] = useState(false);
    const [posFilter, setPosFilter] = useState("all");

    const [form, setForm] = useState({
        label: "",
        url: "",
        target: "_self",
        position: "header",
        sortOrder: 0,
        isVisible: true,
    });

    const { items, loading, create, update, remove } = useNavigation(
        posFilter !== "all" ? posFilter : undefined,
    );

    const [ConfirmDialog, confirm] = useConfirm({
        title: "Delete navigation item?",
        description: "This navigation item will be permanently deleted.",
        confirmText: "Delete",
        variant: "destructive",
    });

    function openCreate() {
        setEditing(null);
        setForm({
            label: "",
            url: "",
            target: "_self",
            position: "header",
            sortOrder: 0,
            isVisible: true,
        });
        setOpen(true);
    }

    function openEdit(item: NavItem) {
        setEditing(item);
        setForm({
            label: item.label,
            url: item.url,
            target: item.target,
            position: item.position,
            sortOrder: item.sortOrder,
            isVisible: item.isVisible,
        });
        setOpen(true);
    }

    async function handleSave() {
        if (!form.label.trim() || !form.url.trim()) {
            toast.error("Label and URL are required");
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

    async function toggleVisibility(item: NavItem) {
        try {
            await update(item.id, { isVisible: !item.isVisible });
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
                        <h2 className="text-2xl font-bold tracking-tight gold-gradient-text" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>Navigation</h2>
                        <p className="text-muted-foreground">
                            Manage header, footer, and social navigation links.
                        </p>
                    </div>
                    <Button onClick={openCreate} className="btn-gold">Add Link</Button>
                </div>

                <div className="flex items-center gap-4">
                    <Select value={posFilter} onValueChange={setPosFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Position" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Positions</SelectItem>
                            <SelectItem value="header">Header</SelectItem>
                            <SelectItem value="footer">Footer</SelectItem>
                            <SelectItem value="social">Social</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="dash-card rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Label</TableHead>
                                <TableHead>URL</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Visible</TableHead>
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
                            ) : items.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-12 text-muted-foreground"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <SneakerIllustration className="w-28 h-20 opacity-70" />
                                            <p className="font-medium">No navigation items.</p>
                                            <p className="text-sm">Set the path — add a link!</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="text-muted-foreground">
                                            {item.sortOrder}
                                        </TableCell>
                                        <TableCell className="font-medium">{item.label}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                                            {item.url}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={positionColors[item.position] ?? ""}
                                                variant="secondary"
                                            >
                                                {item.position}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={item.isVisible}
                                                onCheckedChange={() => toggleVisibility(item)}
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

                {/* Create / Edit Dialog */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editing ? "Edit Link" : "Add Navigation Link"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Label</Label>
                                <Input
                                    value={form.label}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, label: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>URL</Label>
                                <Input
                                    value={form.url}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, url: e.target.value }))
                                    }
                                    placeholder="/about or https://..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Position</Label>
                                    <Select
                                        value={form.position}
                                        onValueChange={(v) =>
                                            setForm((f) => ({ ...f, position: v }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="header">Header</SelectItem>
                                            <SelectItem value="footer">Footer</SelectItem>
                                            <SelectItem value="social">Social</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Target</Label>
                                    <Select
                                        value={form.target}
                                        onValueChange={(v) =>
                                            setForm((f) => ({ ...f, target: v }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="_self">Same Tab</SelectItem>
                                            <SelectItem value="_blank">New Tab</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Sort Order</Label>
                                <Input
                                    type="number"
                                    value={form.sortOrder}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Visible</Label>
                                <Switch
                                    checked={form.isVisible}
                                    onCheckedChange={(v) =>
                                        setForm((f) => ({ ...f, isVisible: v }))
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
