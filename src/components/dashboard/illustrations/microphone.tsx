export function MicrophoneIllustration({
    className,
}: {
    className?: string;
}) {
    return (
        <svg
            viewBox="0 0 160 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Mic stand base */}
            <ellipse
                cx="80"
                cy="200"
                rx="40"
                ry="8"
                fill="#ede9fe"
                stroke="#7c3aed"
                strokeWidth="1.5"
            />

            {/* Mic stand pole */}
            <rect
                x="77"
                y="110"
                width="6"
                height="90"
                rx="3"
                fill="#c4b5fd"
                stroke="#7c3aed"
                strokeWidth="1"
            />

            {/* Mic clip */}
            <rect
                x="72"
                y="105"
                width="16"
                height="12"
                rx="3"
                fill="#a78bfa"
                stroke="#7c3aed"
                strokeWidth="1.5"
            />

            {/* Mic body */}
            <rect
                x="65"
                y="55"
                width="30"
                height="55"
                rx="6"
                fill="#ddd6fe"
                stroke="#7c3aed"
                strokeWidth="2"
            />

            {/* Mic head / grille */}
            <path
                d="M65 55 Q65 25 80 20 Q95 25 95 55"
                fill="#f5f3ff"
                stroke="#7c3aed"
                strokeWidth="2"
            />

            {/* Grille lines */}
            <line
                x1="68"
                y1="30"
                x2="92"
                y2="30"
                stroke="#c084fc"
                strokeWidth="0.8"
                opacity="0.5"
            />
            <line
                x1="67"
                y1="35"
                x2="93"
                y2="35"
                stroke="#c084fc"
                strokeWidth="0.8"
                opacity="0.5"
            />
            <line
                x1="66"
                y1="40"
                x2="94"
                y2="40"
                stroke="#c084fc"
                strokeWidth="0.8"
                opacity="0.5"
            />
            <line
                x1="66"
                y1="45"
                x2="94"
                y2="45"
                stroke="#c084fc"
                strokeWidth="0.8"
                opacity="0.5"
            />
            <line
                x1="65"
                y1="50"
                x2="95"
                y2="50"
                stroke="#c084fc"
                strokeWidth="0.8"
                opacity="0.5"
            />

            {/* Mic ring */}
            <rect
                x="63"
                y="53"
                width="34"
                height="5"
                rx="2"
                fill="#7c3aed"
                opacity="0.7"
            />

            {/* Sound waves */}
            <path
                d="M105 35 Q115 40 105 50"
                stroke="#c084fc"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
            />
            <path
                d="M112 28 Q125 40 112 55"
                stroke="#c084fc"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.3"
            />
            <path
                d="M55 35 Q45 40 55 50"
                stroke="#c084fc"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
            />
            <path
                d="M48 28 Q35 40 48 55"
                stroke="#c084fc"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.3"
            />

            {/* Stars */}
            <circle cx="120" cy="20" r="2" fill="#e9d5ff" />
            <circle cx="40" cy="15" r="1.5" fill="#c084fc" opacity="0.5" />
            <circle cx="130" cy="60" r="1.5" fill="#ddd6fe" />
        </svg>
    );
}
