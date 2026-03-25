interface SpacerBlockProps {
    height: number;
}

export function SpacerBlock({ height }: SpacerBlockProps) {
    return <div style={{ height: `${height ?? 64}px` }} aria-hidden />;
}
