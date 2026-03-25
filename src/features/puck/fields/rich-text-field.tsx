"use client";

import { useState, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
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
import { Pencil } from "lucide-react";

function MiniToolbarButton({
    isActive,
    onClick,
    children,
    title,
}: {
    isActive?: boolean;
    onClick: () => void;
    children: React.ReactNode;
    title?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`rounded p-1 text-xs hover:bg-muted transition-colors ${
                isActive ? "bg-accent text-accent-foreground" : ""
            }`}
        >
            {children}
        </button>
    );
}

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
            Placeholder.configure({ placeholder: "Start writing..." }),
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
            <div className="flex flex-wrap items-center gap-0.5 border rounded-lg px-2 py-1.5 bg-muted/30">
                <MiniToolbarButton
                    isActive={editor.isActive("bold")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Bold"
                >
                    <span className="font-bold">B</span>
                </MiniToolbarButton>
                <MiniToolbarButton
                    isActive={editor.isActive("italic")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic"
                >
                    <span className="italic">I</span>
                </MiniToolbarButton>
                <MiniToolbarButton
                    isActive={editor.isActive("underline")}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    title="Underline"
                >
                    <span className="underline">U</span>
                </MiniToolbarButton>
                <MiniToolbarButton
                    isActive={editor.isActive("strike")}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    title="Strikethrough"
                >
                    <span className="line-through">S</span>
                </MiniToolbarButton>
                <MiniToolbarButton
                    isActive={editor.isActive("highlight")}
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    title="Highlight"
                >
                    <span className="bg-yellow-200 px-0.5">H</span>
                </MiniToolbarButton>

                <Separator orientation="vertical" className="mx-0.5 h-5" />

                <MiniToolbarButton
                    isActive={editor.isActive("heading", { level: 2 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    title="Heading 2"
                >
                    H2
                </MiniToolbarButton>
                <MiniToolbarButton
                    isActive={editor.isActive("heading", { level: 3 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    title="Heading 3"
                >
                    H3
                </MiniToolbarButton>

                <Separator orientation="vertical" className="mx-0.5 h-5" />

                <MiniToolbarButton
                    isActive={editor.isActive("bulletList")}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Bullet List"
                >
                    • List
                </MiniToolbarButton>
                <MiniToolbarButton
                    isActive={editor.isActive("orderedList")}
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    title="Ordered List"
                >
                    1. List
                </MiniToolbarButton>
                <MiniToolbarButton
                    isActive={editor.isActive("blockquote")}
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    title="Blockquote"
                >
                    &ldquo;&rdquo;
                </MiniToolbarButton>
                <MiniToolbarButton
                    isActive={editor.isActive("codeBlock")}
                    onClick={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                    }
                    title="Code Block"
                >
                    {"</>"}
                </MiniToolbarButton>

                <Separator orientation="vertical" className="mx-0.5 h-5" />

                <MiniToolbarButton
                    isActive={editor.isActive({ textAlign: "left" })}
                    onClick={() =>
                        editor.chain().focus().setTextAlign("left").run()
                    }
                    title="Align Left"
                >
                    ≡L
                </MiniToolbarButton>
                <MiniToolbarButton
                    isActive={editor.isActive({ textAlign: "center" })}
                    onClick={() =>
                        editor.chain().focus().setTextAlign("center").run()
                    }
                    title="Align Center"
                >
                    ≡C
                </MiniToolbarButton>
                <MiniToolbarButton
                    isActive={editor.isActive({ textAlign: "right" })}
                    onClick={() =>
                        editor.chain().focus().setTextAlign("right").run()
                    }
                    title="Align Right"
                >
                    ≡R
                </MiniToolbarButton>

                <Separator orientation="vertical" className="mx-0.5 h-5" />

                <MiniToolbarButton
                    onClick={() =>
                        editor.chain().focus().setHorizontalRule().run()
                    }
                    title="Horizontal Rule"
                >
                    ―
                </MiniToolbarButton>
                <MiniToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    title="Undo"
                >
                    ↩
                </MiniToolbarButton>
                <MiniToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    title="Redo"
                >
                    ↪
                </MiniToolbarButton>
            </div>

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
