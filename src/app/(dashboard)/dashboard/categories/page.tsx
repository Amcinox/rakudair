"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SprayCanIllustration } from "@/components/dashboard/illustrations";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";

type Category = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    icon: string | null;
    sortOrder: number;
    createdAt: string;
};

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [form, setForm] = useState({
        name: "",
        description: "",
        color: "#b91c1c",
        sortOrder: 0,
    });

    async function fetchCategories() {
        const res = await fetch("/api/categories");
        const json = await res.json();
        setCategories(json.data ?? []);
        setLoading(false);
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    function openCreate() {
        setEditing(null);
        setForm({ name: "", description: "", color: "#b91c1c", sortOrder: 0 });
        setDialogOpen(true);
    }

    function openEdit(cat: Category) {
        setEditing(cat);
        setForm({
            name: cat.name,
            description: cat.description ?? "",
            color: cat.color ?? "#b91c1c",
            sortOrder: cat.sortOrder,
        });
        setDialogOpen(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const url = editing
            ? `/api/categories/${editing.id}`
            : "/api/categories";
        const method = editing ? "PATCH" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (!res.ok) {
            const json = await res.json();
            toast.error(json.error ?? "Failed to save category");
            return;
        }

        toast.success(editing ? "Category updated" : "Category created");
        setDialogOpen(false);
        fetchCategories();
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this category?")) return;

        const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
        if (!res.ok) {
            toast.error("Failed to delete category");
            return;
        }

        toast.success("Category deleted");
        fetchCategories();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight gold-gradient-text" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>Categories</h2>
                    <p className="text-muted-foreground">Organize your articles by category.</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreate} className="btn-gold">Add Category</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editing ? "Edit Category" : "New Category"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                    placeholder="e.g. City Guides"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                    placeholder="Optional description"
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="color">Color</Label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            id="color"
                                            value={form.color}
                                            onChange={(e) =>
                                                setForm({ ...form, color: e.target.value })
                                            }
                                            className="h-9 w-9 cursor-pointer rounded border"
                                        />
                                        <Input
                                            value={form.color}
                                            onChange={(e) =>
                                                setForm({ ...form, color: e.target.value })
                                            }
                                            className="w-28"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sortOrder">Sort Order</Label>
                                    <Input
                                        id="sortOrder"
                                        type="number"
                                        value={form.sortOrder}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                sortOrder: parseInt(e.target.value) || 0,
                                            })
                                        }
                                        className="w-24"
                                    />
                                </div>
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
                            <TableHead>Color</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Order</TableHead>
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
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center py-12 text-muted-foreground"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <SprayCanIllustration className="w-20 h-28 opacity-70" />
                                        <p className="font-medium">No categories yet.</p>
                                        <p className="text-sm">Tag your first collection!</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell>
                                        <div
                                            className="h-5 w-5 rounded-full border"
                                            style={{ backgroundColor: cat.color ?? "#ccc" }}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {cat.slug}
                                    </TableCell>
                                    <TableCell>{cat.sortOrder}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openEdit(cat)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive/80"
                                                onClick={() => handleDelete(cat.id)}
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
