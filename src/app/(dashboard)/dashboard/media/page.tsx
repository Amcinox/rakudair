"use client";

import dynamic from "next/dynamic";

const MediaPageContent = dynamic(() => import("./_content"), { ssr: false });

export default function MediaPage() {
    return <MediaPageContent />;
}
