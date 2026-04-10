"use client";

import { useState, createElement } from "react";
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
import {
    MapPin, Compass, Camera, Globe, Plane, Mountain, Palmtree, Sun, Moon, Star,
    Heart, BookOpen, Music, Coffee, Utensils, ShoppingBag, Building, Car, Train,
    Bike, Ship, Tent, Umbrella, Waves, Flame, Snowflake, Cloud, Sparkles,
    Trophy, Flag, Map, Landmark, TreePine, Flower, Bird, Fish, Dog, Cat, type LucideIcon,
} from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { generateSlug } from "@/lib/slug";
import { useCategories, type Category } from "@/features/categories/hooks/useCategories";

const ICON_OPTIONS: { name: string; Icon: LucideIcon }[] = [
    { name: "map-pin", Icon: MapPin },
    { name: "compass", Icon: Compass },
    { name: "camera", Icon: Camera },
    { name: "globe", Icon: Globe },
    { name: "plane", Icon: Plane },
    { name: "mountain", Icon: Mountain },
    { name: "palmtree", Icon: Palmtree },
    { name: "sun", Icon: Sun },
    { name: "moon", Icon: Moon },
    { name: "star", Icon: Star },
    { name: "heart", Icon: Heart },
    { name: "book-open", Icon: BookOpen },
    { name: "music", Icon: Music },
    { name: "coffee", Icon: Coffee },
    { name: "utensils", Icon: Utensils },
    { name: "shopping-bag", Icon: ShoppingBag },
    { name: "building", Icon: Building },
    { name: "car", Icon: Car },
    { name: "train", Icon: Train },
    { name: "bike", Icon: Bike },
    { name: "ship", Icon: Ship },
    { name: "tent", Icon: Tent },
    { name: "umbrella", Icon: Umbrella },
    { name: "waves", Icon: Waves },
    { name: "flame", Icon: Flame },
    { name: "snowflake", Icon: Snowflake },
    { name: "cloud", Icon: Cloud },
    { name: "sparkles", Icon: Sparkles },
    { name: "trophy", Icon: Trophy },
    { name: "flag", Icon: Flag },
    { name: "map", Icon: Map },
    { name: "landmark", Icon: Landmark },
    { name: "tree-pine", Icon: TreePine },
    { name: "flower", Icon: Flower },
    { name: "bird", Icon: Bird },
    { name: "fish", Icon: Fish },
    { name: "dog", Icon: Dog },
    { name: "cat", Icon: Cat },
];

function getIconComponent(name: string | null): LucideIcon | null {
    if (!name) return null;
    return ICON_OPTIONS.find((o) => o.name === name)?.Icon ?? null;
}

export default function CategoriesPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        color: "#b91c1c",
        icon: "",
        sortOrder: 0,
    });
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

    const { categories, loading, create, update, remove } = useCategories();
    const [ConfirmDialog, confirm] = useConfirm({
        title: "Delete category?",
        description: "This category will be permanently deleted. Articles using it will be unlinked.",
        confirmText: "Delete",
        variant: "destructive",
    });

    function openCreate() {
        setEditing(null);
        setSlugManuallyEdited(false);
        setForm({ name: "", slug: "", description: "", color: "#b91c1c", icon: "", sortOrder: 0 });
        setDialogOpen(true);
    }

    function openEdit(cat: Category) {
        setEditing(cat);
        setSlugManuallyEdited(true); // don't auto-overwrite existing slug
        setForm({
            name: cat.name,
            slug: cat.slug ?? "",
            description: cat.description ?? "",
            color: cat.color ?? "#b91c1c",
            icon: cat.icon ?? "",
            sortOrder: cat.sortOrder,
        });
        setDialogOpen(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const payload = {
            ...form,
            icon: form.icon || undefined,
        };
        try {
            if (editing) {
                await update(editing.id, payload);
            } else {
                await create(payload);
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

    const SelectedIcon = getIconComponent(form.icon);

    return (
        <>
            <ConfirmDialog />
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
                        <DialogContent className="sm:max-w-lg max-h-[90dvh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    {editing ? "Edit Category" : "New Category"}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Preview */}
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: form.color + "20", color: form.color }}
                                    >
                                        {SelectedIcon ? (
                                            createElement(SelectedIcon, { className: "w-6 h-6" })
                                        ) : (
                                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: form.color }} />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm truncate">
                                            {form.name || "Category Name"}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {form.description || "Description preview"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={form.name}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            const autoSlug = slugManuallyEdited
                                                ? form.slug
                                                : generateSlug(name, "category");
                                            setForm({ ...form, name, slug: autoSlug });
                                        }}
                                        placeholder="e.g. City Guides"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={form.slug}
                                        onChange={(e) => {
                                            setSlugManuallyEdited(true);
                                            setForm({ ...form, slug: e.target.value });
                                        }}
                                        placeholder="e.g. city-guides"
                                        className="font-mono text-sm"
                                    />
                                    <p className="text-[11px] text-muted-foreground">
                                        Used in URLs. Leave blank to auto-generate. Required for Japanese names.
                                    </p>
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
                                        rows={2}
                                        className="w-full max-w-full resize-none max-h-32 overflow-y-auto"
                                    />
                                </div>

                                {/* Color & Sort Order */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="color">Color</Label>
                                        <div className="flex items-center gap-2 h-9">
                                            <input
                                                type="color"
                                                id="color"
                                                value={form.color}
                                                onChange={(e) =>
                                                    setForm({ ...form, color: e.target.value })
                                                }
                                                className="h-9 w-9 cursor-pointer rounded border shrink-0"
                                            />
                                            <Input
                                                value={form.color}
                                                onChange={(e) =>
                                                    setForm({ ...form, color: e.target.value })
                                                }
                                                className="font-mono text-sm h-9"
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
                                            className="h-9"
                                        />
                                    </div>
                                </div>

                                {/* Icon picker */}
                                <div className="space-y-2">
                                    <Label>Icon</Label>
                                    <div className="grid grid-cols-8 gap-1.5 max-h-[160px] overflow-y-auto rounded-lg border p-2">
                                        {/* No icon option */}
                                        <button
                                            type="button"
                                            onClick={() => setForm({ ...form, icon: "" })}
                                            className={`w-8 h-8 rounded-md flex items-center justify-center text-xs transition-colors ${!form.icon
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-muted text-muted-foreground"
                                                }`}
                                            title="No icon"
                                        >
                                            ✕
                                        </button>
                                        {ICON_OPTIONS.map(({ name, Icon }) => (
                                            <button
                                                key={name}
                                                type="button"
                                                onClick={() => setForm({ ...form, icon: name })}
                                                className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${form.icon === name
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                                    }`}
                                                title={name}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">
                                        {form.icon ? `Selected: ${form.icon}` : "No icon selected"}
                                    </p>
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
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
                                <TableHead className="w-[60px]">Icon</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead className="w-[60px]">Order</TableHead>
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
                                categories.map((cat) => {
                                    const CatIcon = getIconComponent(cat.icon);
                                    return (
                                        <TableRow key={cat.id}>
                                            <TableCell>
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                    style={{
                                                        backgroundColor: (cat.color ?? "#ccc") + "20",
                                                        color: cat.color ?? "#ccc",
                                                    }}
                                                >
                                                    {CatIcon ? (
                                                        <CatIcon className="w-4 h-4" />
                                                    ) : (
                                                        <div
                                                            className="w-4 h-4 rounded-full"
                                                            style={{ backgroundColor: cat.color ?? "#ccc" }}
                                                        />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{cat.name}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
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
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
