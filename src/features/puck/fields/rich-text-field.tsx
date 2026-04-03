"use client";

import { useState, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import { Separator } from "@/components/ui/separator";
import { LinkPicker } from "@/components/dashboard/link-picker";
import { ImagePicker } from "@/components/dashboard/image-picker";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Highlighter,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Code,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Minus,
    Undo2,
    Redo2,
    Link2,
    ImageIcon,
    Pencil,
    Link2Off,
} from "lucide-react";

// ── Toolbar button ────────────────────────────────────────────────────────────

function ToolbarBtn({
    isActive,
    onClick,
    title,
    children,
    disabled,
}: {
    isActive?: boolean;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            disabled={disabled}
            className={`rounded p-1.5 transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed ${isActive ? "bg-accent text-accent-foreground" : "text-foreground/70"
                }`}
        >
            {children}
        </button>
    );
}

// ── Link picker popover ────────────────────────────────────────────────────────

function LinkPickerPopover({ editor }: { editor: ReturnType<typeof useEditor> }) {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState("");
    const isActive = editor?.isActive("link") ?? false;

    // Pre-fill URL from existing link when opening
    const handleOpenChange = useCallback(
        (next: boolean) => {
            if (next && editor) {
                const attrs = editor.getAttributes("link");
                setUrl(attrs.href ?? "");
            }
            setOpen(next);
        },
        [editor],
    );

    const applyLink = useCallback(
        (href: string) => {
            if (!editor) return;
            if (!href.trim()) {
                editor.chain().focus().extendMarkRange("link").unsetLink().run();
            } else {
                editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .setLink({ href: href.trim(), target: "_blank", rel: "noopener noreferrer" })
                    .run();
            }
            setOpen(false);
        },
        [editor],
    );

    const removeLink = useCallback(() => {
        editor?.chain().focus().extendMarkRange("link").unsetLink().run();
        setOpen(false);
    }, [editor]);

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    title="Insert / edit link"
                    className={`rounded p-1.5 transition-colors hover:bg-muted ${isActive ? "bg-accent text-accent-foreground" : "text-foreground/70"
                        }`}
                >
                    <Link2 className="w-3.5 h-3.5" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3 space-y-3" align="start">
                <p className="text-xs font-medium text-muted-foreground">Insert / edit link</p>
                <LinkPicker
                    value={url}
                    onChange={(val) => setUrl(val)}
                />
                <div className="flex gap-2 pt-1">
                    <Button size="sm" className="flex-1" onClick={() => applyLink(url)}>
                        Apply
                    </Button>
                    {isActive && (
                        <Button size="sm" variant="outline" onClick={removeLink}>
                            <Link2Off className="w-3.5 h-3.5" />
                        </Button>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

// ── Image picker dialog ────────────────────────────────────────────────────────

function ImagePickerDialog({ editor }: { editor: ReturnType<typeof useEditor> }) {
    const [open, setOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const handleInsert = useCallback(() => {
        if (!editor || !imageUrl.trim()) return;
        editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
        setImageUrl("");
        setOpen(false);
    }, [editor, imageUrl]);

    return (
        <>
            <button
                type="button"
                title="Insert image"
                onClick={() => setOpen(true)}
                className="rounded p-1.5 transition-colors hover:bg-muted text-foreground/70"
            >
                <ImageIcon className="w-3.5 h-3.5" />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Insert Image</DialogTitle>
                    </DialogHeader>
                    <div className="py-2">
                        <ImagePicker
                            value={imageUrl}
                            onChange={(url) => setImageUrl(url)}
                            placeholder="Select or upload an image"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleInsert} disabled={!imageUrl.trim()}>
                            Insert
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

// ── Editor ────────────────────────────────────────────────────────────────────

function RichTextEditor({
    initialHtml,
    onSave,
    onCancel,
}: {
    initialHtml: string;
    onSave: (html: string) => void;
    onCancel: () => void;
}) {
    "use no memo";
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
            Placeholder.configure({ placeholder: "Start writing…" }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Underline,
            Highlight.configure({ multicolor: true }),
            TiptapLink.configure({
                openOnClick: false,
                HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
            }),
            TiptapImage.configure({ inline: false, allowBase64: false }),
        ],
        content: initialHtml || "<p></p>",
        editorProps: {
            attributes: {
                class: "prose prose-neutral dark:prose-invert max-w-none min-h-[300px] focus:outline-none px-4 py-3",
            },
        },
    });

    const handleSave = useCallback(() => {
        if (!editor) return;
        onSave(editor.getHTML());
    }, [editor, onSave]);

    if (!editor) return null;

    return (
        <div className="flex flex-col gap-2">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 border rounded-lg px-2 py-1 bg-muted/30">
                {/* Text formatting */}
                <ToolbarBtn
                    isActive={editor.isActive("bold")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Bold"
                >
                    <Bold className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn
                    isActive={editor.isActive("italic")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic"
                >
                    <Italic className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn
                    isActive={editor.isActive("underline")}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    title="Underline"
                >
                    <UnderlineIcon className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn
                    isActive={editor.isActive("strike")}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    title="Strikethrough"
                >
                    <Strikethrough className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn
                    isActive={editor.isActive("highlight")}
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    title="Highlight"
                >
                    <Highlighter className="w-3.5 h-3.5" />
                </ToolbarBtn>

                <Separator orientation="vertical" className="mx-0.5 h-5" />

                {/* Headings */}
                <ToolbarBtn
                    isActive={editor.isActive("heading", { level: 2 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    title="Heading 2"
                >
                    <Heading2 className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn
                    isActive={editor.isActive("heading", { level: 3 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    title="Heading 3"
                >
                    <Heading3 className="w-3.5 h-3.5" />
                </ToolbarBtn>

                <Separator orientation="vertical" className="mx-0.5 h-5" />

                {/* Lists */}
                <ToolbarBtn
                    isActive={editor.isActive("bulletList")}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Bullet List"
                >
                    <List className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn
                    isActive={editor.isActive("orderedList")}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    title="Ordered List"
                >
                    <ListOrdered className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn
                    isActive={editor.isActive("blockquote")}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    title="Blockquote"
                >
                    <Quote className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn
                    isActive={editor.isActive("codeBlock")}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    title="Code Block"
                >
                    <Code className="w-3.5 h-3.5" />
                </ToolbarBtn>

                <Separator orientation="vertical" className="mx-0.5 h-5" />

                {/* Alignment */}
                <ToolbarBtn
                    isActive={editor.isActive({ textAlign: "left" })}
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    title="Align Left"
                >
                    <AlignLeft className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn
                    isActive={editor.isActive({ textAlign: "center" })}
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    title="Align Center"
                >
                    <AlignCenter className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn
                    isActive={editor.isActive({ textAlign: "right" })}
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    title="Align Right"
                >
                    <AlignRight className="w-3.5 h-3.5" />
                </ToolbarBtn>

                <Separator orientation="vertical" className="mx-0.5 h-5" />

                {/* Link & Image */}
                <LinkPickerPopover editor={editor} />
                <ImagePickerDialog editor={editor} />

                <Separator orientation="vertical" className="mx-0.5 h-5" />

                {/* Misc */}
                <ToolbarBtn
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Horizontal Rule"
                >
                    <Minus className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo"
                >
                    <Undo2 className="w-3.5 h-3.5" />
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo"
                >
                    <Redo2 className="w-3.5 h-3.5" />
                </ToolbarBtn>
            </div>

            {/* Editor area */}
            <div className="rounded-lg border bg-card max-h-[50vh] overflow-y-auto">
                <EditorContent editor={editor} />
            </div>

            <DialogFooter className="pt-2">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button onClick={handleSave}>Save Content</Button>
            </DialogFooter>
        </div>
    );
}

// ── Public field component ─────────────────────────────────────────────────────

interface RichTextFieldProps {
    value: string;
    onChange: (value: string) => void;
}

export function RichTextField({ value, onChange }: RichTextFieldProps) {
    const [open, setOpen] = useState(false);

    const stripped = (value || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    const preview = stripped.length > 120 ? stripped.slice(0, 120) + "…" : stripped;

    return (
        <div className="space-y-2">
            {preview ? (
                <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground leading-relaxed line-clamp-4">
                    {preview}
                </div>
            ) : (
                <div className="rounded-lg border border-dashed bg-muted/20 p-3 text-xs text-muted-foreground text-center">
                    No content yet
                </div>
            )}
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full gap-1.5 text-xs"
                onClick={() => setOpen(true)}
            >
                <Pencil className="w-3 h-3" />
                Edit Rich Text
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Edit Rich Text Content</DialogTitle>
                    </DialogHeader>
                    {open && (
                        <RichTextEditor
                            initialHtml={value || ""}
                            onSave={(html) => {
                                onChange(html);
                                setOpen(false);
                            }}
                            onCancel={() => setOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
