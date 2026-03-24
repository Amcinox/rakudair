"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import CharacterCount from "@tiptap/extension-character-count";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { EditorToolbar } from "./toolbar";
import { cn } from "@/lib/utils";
import type { JSONContent } from "@tiptap/react";

interface EditorProps {
    content?: JSONContent;
    onChange?: (json: JSONContent, html: string) => void;
    placeholder?: string;
    className?: string;
}

export function Editor({
    content,
    onChange,
    placeholder = "Start writing your article…",
    className,
}: EditorProps) {
    "use no memo";
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3, 4] },
            }),
            Placeholder.configure({ placeholder }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Underline,
            Highlight.configure({ multicolor: true }),
            TiptapLink.configure({
                openOnClick: false,
                HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
            }),
            TiptapImage.configure({ inline: false, allowBase64: false }),
            Youtube.configure({ width: 640, height: 360 }),
            CharacterCount,
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getJSON(), editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-neutral dark:prose-invert max-w-none min-h-[400px] focus:outline-none px-6 py-4",
            },
        },
    });

    if (!editor) return null;

    return (
        <div
            className={cn(
                "rounded-lg border bg-card",
                className,
            )}
        >
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} />
            <div className="flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground">
                <span>
                    {editor.storage.characterCount.words()} words ·{" "}
                    {editor.storage.characterCount.characters()} characters
                </span>
                <span>
                    ~{Math.max(1, Math.ceil(editor.storage.characterCount.words() / 200))} min read
                </span>
            </div>
        </div>
    );
}
