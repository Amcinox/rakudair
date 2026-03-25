"use client";

import { useState, useMemo, useCallback } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
    type DragMoveEvent,
    DragOverlay,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { SneakerIllustration } from "@/components/dashboard/illustrations";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useNavigation, type NavItem } from "@/features/navigation/hooks/useNavigation";
import {
    GripVertical,
    ChevronRight,
    ChevronDown,
    Eye,
    EyeOff,
    Pencil,
    Trash2,
    Plus,
    ArrowRight,
    ArrowLeft,
    CornerDownRight,
} from "lucide-react";
import { apiFetch } from "@/features/shared/api";

// ---------- Types ----------
type TreeNode = NavItem & {
    children: TreeNode[];
    depth: number;
};

// ---------- Helpers ----------
function buildTree(items: NavItem[]): TreeNode[] {
    const map = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    for (const item of items) {
        map.set(item.id, { ...item, children: [], depth: 0 });
    }
    for (const item of items) {
        const node = map.get(item.id)!;
        if (item.parentId && map.has(item.parentId)) {
            const parent = map.get(item.parentId)!;
            node.depth = parent.depth + 1;
            parent.children.push(node);
        } else {
            roots.push(node);
        }
    }

    const sortChildren = (nodes: TreeNode[]) => {
        nodes.sort((a, b) => a.sortOrder - b.sortOrder);
        for (const node of nodes) sortChildren(node.children);
    };
    sortChildren(roots);
    return roots;
}

function flattenTree(nodes: TreeNode[], depth = 0): TreeNode[] {
    const result: TreeNode[] = [];
    for (const node of nodes) {
        result.push({ ...node, depth });
        result.push(...flattenTree(node.children, depth + 1));
    }
    return result;
}

function getMaxChildDepth(flatList: TreeNode[], nodeId: string): number {
    let maxDepth = 0;
    let counting = false;
    const nodeDepth = flatList.find((n) => n.id === nodeId)?.depth ?? 0;
    for (const node of flatList) {
        if (node.id === nodeId) { counting = true; continue; }
        if (counting) {
            if (node.depth > nodeDepth) maxDepth = Math.max(maxDepth, node.depth - nodeDepth);
            else break;
        }
    }
    return maxDepth;
}

function getDescendantIds(items: NavItem[], id: string): Set<string> {
    const result = new Set<string>();
    const collect = (pid: string) => {
        for (const item of items) {
            if (item.parentId === pid) { result.add(item.id); collect(item.id); }
        }
    };
    collect(id);
    return result;
}

// ---------- Sortable Item ----------
const positionColors: Record<string, string> = {
    header: "badge-scheduled",
    footer: "bg-purple-100 text-purple-700",
    social: "badge-published",
};

interface SortableNavItemProps {
    node: TreeNode;
    onEdit: (item: NavItem) => void;
    onDelete: (id: string) => void;
    onToggleVisibility: (item: NavItem) => void;
    onAddChild: (parentId: string) => void;
    onIndent: (id: string) => void;
    onOutdent: (id: string) => void;
    collapsed: Set<string>;
    onToggleCollapse: (id: string) => void;
    hasChildren: boolean;
    isNestTarget: boolean;
}

function SortableNavItem({
    node, onEdit, onDelete, onToggleVisibility, onAddChild,
    onIndent, onOutdent, collapsed, onToggleCollapse, hasChildren, isNestTarget,
}: SortableNavItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: node.id });

    const style = { transform: CSS.Transform.toString(transform), transition };
    const isCollapsed = collapsed.has(node.id);

    return (
        <div ref={setNodeRef} style={style} className={`group ${isDragging ? "opacity-40" : ""}`}>
            <div
                className={`flex items-center gap-2 rounded-lg border bg-card p-2.5 transition-all hover:bg-muted/50 ${
                    isNestTarget
                        ? "ring-2 ring-primary border-primary/40 bg-primary/5"
                        : node.depth === 0 ? "border-border" : node.depth === 1 ? "border-border/60" : "border-border/40"
                }`}
                style={{ marginLeft: `${node.depth * 28}px` }}
            >
                <button
                    type="button"
                    className="touch-none cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-0.5"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="w-4 h-4" />
                </button>

                {hasChildren ? (
                    <button type="button" onClick={() => onToggleCollapse(node.id)} className="text-muted-foreground hover:text-foreground p-0.5">
                        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                ) : (
                    <div className="w-[22px]" />
                )}

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{node.label}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{node.url}</p>
                </div>

                {isNestTarget && (
                    <span className="text-[10px] font-medium text-primary flex items-center gap-0.5 shrink-0">
                        <CornerDownRight className="w-3 h-3" /> nest here
                    </span>
                )}

                <Badge variant="secondary" className={`${positionColors[node.position] ?? ""} text-[10px] shrink-0`}>
                    {node.position}
                </Badge>

                <button
                    type="button"
                    onClick={() => onToggleVisibility(node)}
                    className={`p-1 rounded transition-colors ${node.isVisible ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground/40 hover:text-muted-foreground"}`}
                    title={node.isVisible ? "Visible" : "Hidden"}
                >
                    {node.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {node.depth > 0 && (
                        <button type="button" onClick={() => onOutdent(node.id)} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Outdent">
                            <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                    )}
                    {node.depth < 2 && (
                        <button type="button" onClick={() => onIndent(node.id)} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Indent">
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    )}
                    {node.depth < 2 && (
                        <button type="button" onClick={() => onAddChild(node.id)} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Add child">
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    )}
                    <button type="button" onClick={() => onEdit(node)} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Edit">
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => onDelete(node.id)} className="p-1 rounded text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function DragOverlayItem({ node }: { node: TreeNode }) {
    return (
        <div className="flex items-center gap-2 rounded-lg border bg-card p-2.5 shadow-lg border-primary/30 opacity-95">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{node.label}</p>
                <p className="text-[11px] text-muted-foreground truncate">{node.url}</p>
            </div>
            <Badge variant="secondary" className={`${positionColors[node.position] ?? ""} text-[10px]`}>
                {node.position}
            </Badge>
        </div>
    );
}

// ---------- Main Page ----------
type FormState = {
    label: string;
    url: string;
    target: string;
    position: string;
    isVisible: boolean;
    parentId: string | null;
};

const DEFAULT_FORM: FormState = {
    label: "",
    url: "",
    target: "_self",
    position: "header",
    isVisible: true,
    parentId: null,
};

export default function NavigationPage() {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<NavItem | null>(null);
    const [saving, setSaving] = useState(false);
    const [posFilter, setPosFilter] = useState("all");
    const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
    const [activeId, setActiveId] = useState<string | null>(null);
    const [nestTarget, setNestTarget] = useState<string | null>(null);

    const [form, setForm] = useState<FormState>(DEFAULT_FORM);

    const { items, loading, create, update, remove, refetch } = useNavigation(
        posFilter !== "all" ? posFilter : undefined,
    );

    const [ConfirmDialog, confirm] = useConfirm({
        title: "Delete navigation item?",
        description: "This item and all its children will be permanently deleted.",
        confirmText: "Delete",
        variant: "destructive",
    });

    const tree = useMemo(() => buildTree(items), [items]);
    const flatList = useMemo(() => {
        const groups: Record<string, TreeNode[]> = {};
        for (const root of tree) {
            const pos = root.position;
            if (!groups[pos]) groups[pos] = [];
            groups[pos].push(root);
        }
        const result: TreeNode[] = [];
        for (const pos of ["header", "footer", "social"]) {
            if (groups[pos]) result.push(...flattenTree(groups[pos]));
        }
        return result;
    }, [tree]);

    const visibleList = useMemo(() => {
        const hidden = new Set<string>();
        const hideDescendants = (nodes: TreeNode[]) => {
            for (const node of nodes) {
                if (collapsed.has(node.id)) {
                    const markHidden = (children: TreeNode[]) => {
                        for (const child of children) {
                            hidden.add(child.id);
                            markHidden(child.children);
                        }
                    };
                    markHidden(node.children);
                }
                hideDescendants(node.children);
            }
        };
        hideDescendants(tree);
        return flatList.filter((n) => !hidden.has(n.id));
    }, [flatList, collapsed, tree]);

    const positionGrouped = useMemo(() => {
        const groups: Record<string, TreeNode[]> = {};
        for (const node of visibleList) {
            const pos = node.position;
            if (!groups[pos]) groups[pos] = [];
            groups[pos].push(node);
        }
        return groups;
    }, [visibleList]);

    // Items available as parent in the dialog
    const availableParents = useMemo(() => {
        const excludeIds = editing
            ? new Set([editing.id, ...getDescendantIds(items, editing.id)])
            : new Set<string>();

        return flatList.filter((n) =>
            n.position === form.position &&
            !excludeIds.has(n.id) &&
            n.depth < 2 // child would be at depth n.depth+1 ≤ 2
        );
    }, [flatList, form.position, editing, items]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    function openCreate() {
        setEditing(null);
        setForm(DEFAULT_FORM);
        setOpen(true);
    }

    function openCreateChild(parentId: string) {
        setEditing(null);
        const parent = items.find((i) => i.id === parentId);
        setForm({ ...DEFAULT_FORM, position: parent?.position ?? "header", parentId });
        setOpen(true);
    }

    function openEdit(item: NavItem) {
        setEditing(item);
        setForm({
            label: item.label,
            url: item.url,
            target: item.target,
            position: item.position,
            isVisible: item.isVisible,
            parentId: item.parentId,
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
                const maxSort = items.reduce((m, i) => Math.max(m, i.sortOrder), -1);
                await create({ ...form, sortOrder: maxSort + 1 });
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
        const toDelete = [id];
        const collectChildren = (pid: string) => {
            for (const item of items) {
                if (item.parentId === pid) { toDelete.push(item.id); collectChildren(item.id); }
            }
        };
        collectChildren(id);
        try {
            for (const deleteId of toDelete.reverse()) await remove(deleteId);
        } catch { /* handled */ }
    }

    async function toggleVisibility(item: NavItem) {
        try { await update(item.id, { isVisible: !item.isVisible }); } catch { /* handled */ }
    }

    function toggleCollapse(id: string) {
        setCollapsed((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    }

    const hasChildren = useCallback((id: string) => items.some((i) => i.parentId === id), [items]);

    async function saveOrder(newFlatList: TreeNode[]) {
        const payload = newFlatList.map((n, i) => ({ id: n.id, sortOrder: i, parentId: n.parentId }));
        try {
            await apiFetch("/api/navigation/reorder", { method: "PUT", body: JSON.stringify(payload) });
            await refetch();
        } catch {
            toast.error("Failed to save order");
            await refetch();
        }
    }

    async function handleIndent(id: string) {
        const idx = flatList.findIndex((n) => n.id === id);
        if (idx <= 0) return;
        const node = flatList[idx];
        if (node.depth >= 2) return;
        let prevSibling: TreeNode | null = null;
        for (let i = idx - 1; i >= 0; i--) {
            if (flatList[i].position !== node.position) break;
            if (flatList[i].depth === node.depth) { prevSibling = flatList[i]; break; }
            if (flatList[i].depth < node.depth) break;
        }
        if (!prevSibling) return;
        const maxChild = getMaxChildDepth(flatList, id);
        if (node.depth + 1 + maxChild > 2) return;

        const newList = flatList.map((n) =>
            n.id === id ? { ...n, parentId: prevSibling!.id, depth: node.depth + 1 } : n,
        );
        let adjusting = false;
        const updatedList = newList.map((n, i) => {
            if (n.id === id) { adjusting = true; return n; }
            if (adjusting && i > idx) {
                const origNode = flatList[i];
                if (origNode.depth > node.depth) return { ...n, depth: origNode.depth + 1 };
                adjusting = false;
            }
            return n;
        });
        await saveOrder(updatedList);
    }

    async function handleOutdent(id: string) {
        const idx = flatList.findIndex((n) => n.id === id);
        if (idx < 0) return;
        const node = flatList[idx];
        if (node.depth === 0) return;
        const parent = items.find((i) => i.id === node.parentId);
        if (!parent) return;

        const newList = flatList.map((n) =>
            n.id === id ? { ...n, parentId: parent.parentId, depth: node.depth - 1 } : n,
        );
        let adjusting = false;
        const updatedList = newList.map((n, i) => {
            if (n.id === id) { adjusting = true; return n; }
            if (adjusting && i > idx) {
                const origNode = flatList[i];
                if (origNode.depth > node.depth) return { ...n, depth: origNode.depth - 1 };
                adjusting = false;
            }
            return n;
        });
        await saveOrder(updatedList);
    }

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
        setNestTarget(null);
    }

    function handleDragMove(event: DragMoveEvent) {
        const { active, over, delta } = event;
        if (!over || active.id === over.id) { setNestTarget(null); return; }
        const overNode = visibleList.find((n) => n.id === over.id as string);
        if (!overNode || overNode.depth >= 2) { setNestTarget(null); return; }
        // If dragged more than 40px to the right → show nest-as-child indicator
        setNestTarget(delta.x > 40 ? over.id as string : null);
    }

    async function handleDragEnd(event: DragEndEvent) {
        const currentNestTarget = nestTarget;
        setActiveId(null);
        setNestTarget(null);

        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = visibleList.findIndex((n) => n.id === active.id);
        const newIndex = visibleList.findIndex((n) => n.id === over.id);
        if (oldIndex < 0 || newIndex < 0) return;

        const draggedNode = visibleList[oldIndex];
        const targetNode = visibleList[newIndex];

        if (draggedNode.position !== targetNode.position) return;

        const draggedIds = new Set<string>([draggedNode.id]);
        const collectDesc = (pid: string) => {
            for (const item of flatList) {
                if (item.parentId === pid) { draggedIds.add(item.id); collectDesc(item.id); }
            }
        };
        collectDesc(draggedNode.id);

        const remaining = flatList.filter((n) => !draggedIds.has(n.id));
        const dragged = flatList.filter((n) => draggedIds.has(n.id));

        // --- NEST mode: dragged right → drop as child of target ---
        if (currentNestTarget === over.id as string) {
            const maxDescDepth = getMaxChildDepth(flatList, draggedNode.id);
            if (targetNode.depth + 1 + maxDescDepth > 2) {
                toast.error("Maximum 3 nesting levels allowed");
                return;
            }
            // Insert after target's last descendant in remaining
            let insertAfterIdx = remaining.findIndex((n) => n.id === targetNode.id);
            while (
                insertAfterIdx + 1 < remaining.length &&
                remaining[insertAfterIdx + 1].depth > targetNode.depth
            ) {
                insertAfterIdx++;
            }
            const depthDiff = (targetNode.depth + 1) - draggedNode.depth;
            const updatedDragged = dragged.map((n) =>
                n.id === draggedNode.id
                    ? { ...n, parentId: targetNode.id, depth: targetNode.depth + 1 }
                    : { ...n, depth: n.depth + depthDiff },
            );
            const newList = [
                ...remaining.slice(0, insertAfterIdx + 1),
                ...updatedDragged,
                ...remaining.slice(insertAfterIdx + 1),
            ];
            await saveOrder(newList);
            return;
        }

        // --- REORDER mode (existing logic) ---
        const targetIdx = remaining.findIndex((n) => n.id === targetNode.id);
        if (targetIdx < 0) return;

        const newParentId = targetNode.parentId;
        const newDepth = targetNode.depth;
        const depthDiff = newDepth - draggedNode.depth;
        const maxDescDepth = getMaxChildDepth(flatList, draggedNode.id);
        if (newDepth + maxDescDepth > 2) {
            toast.error("Maximum 3 nesting levels allowed");
            return;
        }

        const updatedDragged = dragged.map((n) =>
            n.id === draggedNode.id
                ? { ...n, parentId: newParentId, depth: newDepth }
                : { ...n, depth: n.depth + depthDiff },
        );

        const insertIdx = oldIndex < newIndex ? targetIdx + 1 : targetIdx;
        const newList = [
            ...remaining.slice(0, insertIdx),
            ...updatedDragged,
            ...remaining.slice(insertIdx),
        ];
        await saveOrder(newList);
    }

    const activeNode = activeId ? visibleList.find((n) => n.id === activeId) : null;

    return (
        <>
            <ConfirmDialog />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight gold-gradient-text" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>Navigation</h2>
                        <p className="text-muted-foreground">Build your menu hierarchy — drag to reorder, drag right to nest (3 levels max).</p>
                    </div>
                    <Button onClick={openCreate} className="btn-gold">
                        <Plus className="w-4 h-4 mr-1.5" /> Add Item
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <Select value={posFilter} onValueChange={setPosFilter}>
                        <SelectTrigger className="w-40"><SelectValue placeholder="Position" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Positions</SelectItem>
                            <SelectItem value="header">Header</SelectItem>
                            <SelectItem value="footer">Footer</SelectItem>
                            <SelectItem value="social">Social</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""}</p>
                </div>

                <div className="dash-card rounded-lg p-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Loading…</div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
                            <SneakerIllustration className="w-28 h-20 opacity-70" />
                            <p className="font-medium">No navigation items.</p>
                            <p className="text-sm">Set the path — add a link!</p>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragMove={handleDragMove}
                            onDragEnd={handleDragEnd}
                        >
                            {["header", "footer", "social"].filter((pos) => positionGrouped[pos]?.length > 0).map((pos) => (
                                <div key={pos}>
                                    {posFilter === "all" && (
                                        <div className="flex items-center gap-2 pt-3 pb-1.5 first:pt-0">
                                            <Badge variant="secondary" className={`${positionColors[pos] ?? ""} text-[10px] capitalize`}>{pos}</Badge>
                                            <div className="flex-1 h-px bg-border" />
                                        </div>
                                    )}
                                    <SortableContext items={positionGrouped[pos].map((n) => n.id)} strategy={verticalListSortingStrategy}>
                                        <div className="space-y-1.5">
                                            {positionGrouped[pos].map((node) => (
                                                <SortableNavItem
                                                    key={node.id}
                                                    node={node}
                                                    onEdit={openEdit}
                                                    onDelete={handleDelete}
                                                    onToggleVisibility={toggleVisibility}
                                                    onAddChild={openCreateChild}
                                                    onIndent={handleIndent}
                                                    onOutdent={handleOutdent}
                                                    collapsed={collapsed}
                                                    onToggleCollapse={toggleCollapse}
                                                    hasChildren={hasChildren(node.id)}
                                                    isNestTarget={nestTarget === node.id}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </div>
                            ))}
                            <DragOverlay>{activeNode && <DragOverlayItem node={activeNode} />}</DragOverlay>
                        </DndContext>
                    )}
                </div>

                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><GripVertical className="w-3 h-3" /> Drag to reorder</span>
                    <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Indent (nest)</span>
                    <span className="flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Outdent</span>
                    <span className="flex items-center gap-1"><CornerDownRight className="w-3 h-3" /> Drag right to nest</span>
                    <span className="flex items-center gap-1"><Plus className="w-3 h-3" /> Add child</span>
                </div>

                {/* Create / Edit Dialog */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editing ? "Edit Navigation Item" : form.parentId ? "Add Child Item" : "Add Navigation Item"}
                            </DialogTitle>
                            <DialogDescription>
                                {editing ? "Update this navigation item." : "Add a new item to the navigation menu."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            {form.parentId && !editing && (
                                <p className="text-xs text-muted-foreground bg-muted rounded-md px-3 py-2">
                                    Adding as child of: <strong>{items.find((i) => i.id === form.parentId)?.label ?? "Unknown"}</strong>
                                </p>
                            )}
                            <div className="space-y-2">
                                <Label>Label</Label>
                                <Input
                                    value={form.label}
                                    onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                                    placeholder="e.g. About Us"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>URL</Label>
                                <Input
                                    value={form.url}
                                    onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                                    placeholder="/about or https://..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Position</Label>
                                    <Select
                                        value={form.position}
                                        onValueChange={(v) => setForm((f) => ({ ...f, position: v, parentId: null }))}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
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
                                        onValueChange={(v) => setForm((f) => ({ ...f, target: v }))}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="_self">Same Tab</SelectItem>
                                            <SelectItem value="_blank">New Tab</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Parent selector */}
                            <div className="space-y-2">
                                <Label>Parent Item</Label>
                                <Select
                                    value={form.parentId ?? ""}
                                    onValueChange={(v) => setForm((f) => ({ ...f, parentId: v || null }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="None (root level)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">None (root level)</SelectItem>
                                        {availableParents.map((parent) => (
                                            <SelectItem key={parent.id} value={parent.id}>
                                                {"\u00a0\u00a0".repeat(parent.depth)}
                                                {parent.depth > 0 ? "└ " : ""}
                                                {parent.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-[11px] text-muted-foreground">
                                    Choose a parent to nest this item (max 3 levels).
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <Label>Visible</Label>
                                <Switch
                                    checked={form.isVisible}
                                    onCheckedChange={(v) => setForm((f) => ({ ...f, isVisible: v }))}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
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
