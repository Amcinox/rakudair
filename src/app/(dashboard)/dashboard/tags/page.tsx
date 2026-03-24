"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";

type Tag = {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    articleCount: number;
};

export default function TagsPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Tag | null>(null);
    const [name, setName] = useState("");

    async function fetchTags() {
        const res = await fetch("/api/tags");
        const json = await res.json();
        setTags(json.data ?? []);
        setLoading(false);
    }

    useEffect(() => {
        fetchTags();
    }, []);

    function openCreate() {
        setEditing(null);
        setName("");
        setDialogOpen(true);
    }

    function openEdit(tag: Tag) {
        setEditing(tag);
        setName(tag.name);
        setDialogOpen(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const url = editing ? `/api/tags/${editing.id}` : "/api/tags";
        const method = editing ? "PATCH" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });

        if (!res.ok) {
            const json = await res.json();
            toast.error(json.error ?? "Failed to save tag");
            return;
        }

        toast.success(editing ? "Tag updated" : "Tag created");
        setDialogOpen(false);
        fetchTags();
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this tag?")) return;

        const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
        if (!res.ok) {
            toast.error("Failed to delete tag");
            return;
        }

        toast.success("Tag deleted");
        fetchTags();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Tags</h2>
                    <p className="text-neutral-500">
                        Manage tags for fine-grained article classification.
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreate}>Add Tag</Button>
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
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. cherry-blossoms"
                                    required
                                />
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

            <div className="rounded-md border bg-white dark:bg-neutral-950">
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
                                    className="text-center py-8 text-neutral-500"
                                >
                                    No tags yet. Create your first one.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tags.map((tag) => (
                                <TableRow key={tag.id}>
                                    <TableCell className="font-medium">{tag.name}</TableCell>
                                    <TableCell className="text-neutral-500">
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
                                                className="text-red-600 hover:text-red-700"
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
    );
}
