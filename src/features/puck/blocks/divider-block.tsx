interface DividerBlockProps {
    style: "solid" | "dashed" | "dotted" | "gradient" | "ornament";
    width: "sm" | "md" | "lg" | "full";
    spacing: "sm" | "md" | "lg";
    color: "default" | "primary" | "muted";
}

const widthMap = {
    sm: "max-w-xs",
    md: "max-w-lg",
    lg: "max-w-3xl",
    full: "max-w-full",
};

const spacingMap = {
    sm: "py-4",
    md: "py-8",
    lg: "py-12",
};

export function DividerBlock({
    style = "solid",
    width = "lg",
    spacing = "md",
    color = "default",
}: DividerBlockProps) {
    const colorClass =
        color === "primary"
            ? "border-primary/30"
            : color === "muted"
              ? "border-muted-foreground/10"
              : "border-border";

    if (style === "gradient") {
        return (
            <div className={`${spacingMap[spacing]} px-4`}>
                <div
                    className={`${widthMap[width]} mx-auto h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent`}
                />
            </div>
        );
    }

    if (style === "ornament") {
        return (
            <div className={`${spacingMap[spacing]} px-4 flex items-center justify-center gap-4`}>
                <div className="flex-1 max-w-24 h-px bg-border" />
                <span className="text-primary/60 text-lg">✦</span>
                <div className="flex-1 max-w-24 h-px bg-border" />
            </div>
        );
    }

    const borderStyle =
        style === "dashed"
            ? "border-dashed"
            : style === "dotted"
              ? "border-dotted"
              : "border-solid";

    return (
        <div className={`${spacingMap[spacing]} px-4`}>
            <hr
                className={`${widthMap[width]} mx-auto border-t ${borderStyle} ${colorClass}`}
            />
        </div>
    );
}
