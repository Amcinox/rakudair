"use client";

import { useState } from "react";
import { generateSlug } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VinylIllustration } from "@/components/dashboard/illustrations";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useConfirm } from "@/hooks/use-confirm";
import { useTags, type Tag } from "@/features/tags/hooks/useTags";

export default function TagsPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Tag | null>(null);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

    const { tags, loading, create, update, remove } = useTags();
    const [ConfirmDialog, confirm] = useConfirm({
        title: "Delete tag?",
        description: "This tag will be permanently deleted and removed from all articles.",
        confirmText: "Delete",
        variant: "destructive",
    });

    function openCreate() {
        setEditing(null);
        setName("");
        setSlug("");
        setSlugManuallyEdited(false);
        setDialogOpen(true);
    }

    function openEdit(tag: Tag) {
        setEditing(tag);
        setName(tag.name);
        setSlug(tag.slug ?? "");
        setSlugManuallyEdited(true);
        setDialogOpen(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (editing) {
                await update(editing.id, { name, slug: slug || undefined });
            } else {
                await create({ name, slug: slug || undefined });
            }
            setDialogOpen(false);
        } catch {
            // handled by hook
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

    return (
        <>
            <ConfirmDialog />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight gold-gradient-text" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>Tags</h2>
                        <p className="text-muted-foreground">
                            Manage tags for fine-grained article classification.
                        </p>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreate} className="btn-gold">Add Tag</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editing ? "Edit Tag" : "New Tag"}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tagName">Name</Label>
                                    <Input
                                        id="tagName"
                                        value={name}
                                        onChange={(e) => {
                                            const n = e.target.value;
                                            setName(n);
                                            if (!slugManuallyEdited) setSlug(generateSlug(n, "tag"));
                                        }}
                                        placeholder="e.g. 桜"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tagSlug">Slug</Label>
                                    <Input
                                        id="tagSlug"
                                        value={slug}
                                        onChange={(e) => {
                                            setSlugManuallyEdited(true);
                                            setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                                        }}
                                        placeholder="auto-generated"
                                        className="font-mono text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground">Leave blank to auto-generate from name</p>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        {editing ? "Update" : "Create"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="dash-card rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Articles</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">
                                        Loading…
                                    </TableCell>
                                </TableRow>
                            ) : tags.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center py-12 text-muted-foreground"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <VinylIllustration className="w-24 h-24 opacity-70" />
                                            <p className="font-medium">No tags yet.</p>
                                            <p className="text-sm">Spin up your first label!</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tags.map((tag) => (
                                    <TableRow key={tag.id}>
                                        <TableCell className="font-medium">{tag.name}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {tag.slug}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{tag.articleCount}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEdit(tag)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive/80"
                                                    onClick={() => handleDelete(tag.id)}
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
            </div>
        </>
    );
}
