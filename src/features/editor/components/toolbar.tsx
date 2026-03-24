"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ImageDialog } from "./image-dialog";
import { LinkDialog } from "./link-dialog";
import { YoutubeDialog } from "./youtube-dialog";

interface ToolbarProps {
    editor: Editor;
}

function ToolbarButton({
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
            className={cn(
                "rounded p-1.5 text-sm hover:bg-muted transition-colors",
                isActive && "bg-accent text-accent-foreground",
            )}
        >
            {children}
        </button>
    );
}

export function EditorToolbar({ editor }: ToolbarProps) {
    const [imageOpen, setImageOpen] = useState(false);
    const [linkOpen, setLinkOpen] = useState(false);
    const [youtubeOpen, setYoutubeOpen] = useState(false);

    return (
        <>
            <ImageDialog
                open={imageOpen}
                onOpenChange={setImageOpen}
                onInsert={(url, alt) =>
                    editor
                        .chain()
                        .focus()
                        .setImage({ src: url, alt: alt ?? "" })
                        .run()
                }
            />
            <LinkDialog
                open={linkOpen}
                onOpenChange={setLinkOpen}
                onInsert={(url, newTab) =>
                    editor
                        .chain()
                        .focus()
                        .setLink({
                            href: url,
                            target: newTab ? "_blank" : undefined,
                        })
                        .run()
                }
                initialUrl={editor.getAttributes("link").href ?? ""}
            />
            <YoutubeDialog
                open={youtubeOpen}
                onOpenChange={setYoutubeOpen}
                onInsert={(url) =>
                    editor.chain().focus().setYoutubeVideo({ src: url }).run()
                }
            />
            <div className="flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">
                {/* Text formatting */}
                <ToolbarButton
                    isActive={editor.isActive("bold")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Bold"
                >
                    <span className="font-bold">B</span>
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive("italic")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic"
                >
                    <span className="italic">I</span>
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive("underline")}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    title="Underline"
                >
                    <span className="underline">U</span>
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive("strike")}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    title="Strikethrough"
                >
                    <span className="line-through">S</span>
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive("highlight")}
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    title="Highlight"
                >
                    <span className="bg-yellow-200 px-0.5">H</span>
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Headings */}
                <ToolbarButton
                    isActive={editor.isActive("heading", { level: 2 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    title="Heading 2"
                >
                    H2
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive("heading", { level: 3 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    title="Heading 3"
                >
                    H3
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive("heading", { level: 4 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 4 }).run()
                    }
                    title="Heading 4"
                >
                    H4
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive("paragraph")}
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    title="Paragraph"
                >
                    ¶
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Lists */}
                <ToolbarButton
                    isActive={editor.isActive("bulletList")}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Bullet List"
                >
                    • List
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive("orderedList")}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    title="Ordered List"
                >
                    1. List
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive("blockquote")}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    title="Blockquote"
                >
                    &ldquo;&rdquo;
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive("codeBlock")}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    title="Code Block"
                >
                    {"</>"}
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Align */}
                <ToolbarButton
                    isActive={editor.isActive({ textAlign: "left" })}
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    title="Align Left"
                >
                    ≡L
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive({ textAlign: "center" })}
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    title="Align Center"
                >
                    ≡C
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive({ textAlign: "right" })}
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    title="Align Right"
                >
                    ≡R
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Insert */}
                <ToolbarButton
                    onClick={() => setImageOpen(true)}
                    title="Insert Image"
                >
                    🖼
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => setYoutubeOpen(true)}
                    title="YouTube Video"
                >
                    ▶
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive("link")}
                    onClick={() => setLinkOpen(true)}
                    title="Insert Link"
                >
                    🔗
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Horizontal Rule"
                >
                    ―
                </ToolbarButton>
                <ToolbarButton
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                            .run()
                    }
                    title="Insert Table"
                >
                    ⊞
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Undo/Redo */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    title="Undo"
                >
                    ↩
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    title="Redo"
                >
                    ↪
                </ToolbarButton>
            </div>
        </>
    );
}
