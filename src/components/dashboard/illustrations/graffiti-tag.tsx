export function GraffitiTagIllustration({
    className,
}: {
    className?: string;
}) {
    return (
        <svg
            viewBox="0 0 240 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Spray can drip */}
            <path
                d="M220 30 L220 55"
                stroke="#c084fc"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.3"
            />

            {/* Spray dots */}
            <circle cx="218" cy="25" r="1" fill="#c084fc" opacity="0.2" />
            <circle cx="222" cy="22" r="0.8" fill="#a78bfa" opacity="0.15" />
            <circle cx="215" cy="20" r="1.2" fill="#c084fc" opacity="0.1" />

            {/* Graffiti "FRESH" text - bold block letters */}
            {/* F */}
            <path
                d="M20 25 L20 75 M20 25 L45 25 M20 48 L40 48"
                stroke="#7c3aed"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* R */}
            <path
                d="M55 75 L55 25 L72 25 Q82 25 82 37.5 Q82 48 72 48 L55 48 M72 48 L85 75"
                stroke="#8b5cf6"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* E */}
            <path
                d="M95 25 L95 75 M95 25 L118 25 M95 50 L113 50 M95 75 L118 75"
                stroke="#a78bfa"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* S */}
            <path
                d="M140 32 Q128 25 128 37 Q128 50 140 50 Q152 50 152 63 Q152 75 140 75"
                stroke="#7c3aed"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* H */}
            <path
                d="M162 25 L162 75 M162 50 L185 50 M185 25 L185 75"
                stroke="#8b5cf6"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Exclamation */}
            <line
                x1="200"
                y1="25"
                x2="200"
                y2="58"
                stroke="#c084fc"
                strokeWidth="6"
                strokeLinecap="round"
            />
            <circle cx="200" cy="72" r="4" fill="#c084fc" />

            {/* Underline swoosh */}
            <path
                d="M15 85 Q60 92 120 88 Q180 84 210 90"
                stroke="#7c3aed"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.4"
            />

            {/* Crown above */}
            <path
                d="M80 12 L85 4 L95 10 L105 2 L115 10 L120 4 L125 12"
                stroke="#c084fc"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.5"
            />

            {/* Sparkle dots */}
            <circle cx="10" cy="50" r="2" fill="#e9d5ff" opacity="0.5" />
            <circle cx="230" cy="70" r="1.5" fill="#ddd6fe" opacity="0.4" />
        </svg>
    );
}
