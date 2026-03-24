export function HeadphonesIllustration({
    className,
}: {
    className?: string;
}) {
    return (
        <svg
            viewBox="0 0 200 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Headband */}
            <path
                d="M40 110 Q40 35 100 25 Q160 35 160 110"
                stroke="#7c3aed"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
            />

            {/* Headband inner */}
            <path
                d="M50 110 Q50 50 100 40 Q150 50 150 110"
                stroke="#c4b5fd"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.4"
            />

            {/* Left ear cup — outer */}
            <rect
                x="22"
                y="90"
                width="40"
                height="55"
                rx="12"
                fill="#ede9fe"
                stroke="#7c3aed"
                strokeWidth="2.5"
            />

            {/* Left ear cup — pad */}
            <rect
                x="27"
                y="95"
                width="30"
                height="45"
                rx="8"
                fill="#ddd6fe"
                stroke="#a78bfa"
                strokeWidth="1"
            />

            {/* Left ear cup — inner */}
            <ellipse
                cx="42"
                cy="117"
                rx="10"
                ry="14"
                fill="#c4b5fd"
                opacity="0.5"
            />

            {/* Right ear cup — outer */}
            <rect
                x="138"
                y="90"
                width="40"
                height="55"
                rx="12"
                fill="#ede9fe"
                stroke="#7c3aed"
                strokeWidth="2.5"
            />

            {/* Right ear cup — pad */}
            <rect
                x="143"
                y="95"
                width="30"
                height="45"
                rx="8"
                fill="#ddd6fe"
                stroke="#a78bfa"
                strokeWidth="1"
            />

            {/* Right ear cup — inner */}
            <ellipse
                cx="158"
                cy="117"
                rx="10"
                ry="14"
                fill="#c4b5fd"
                opacity="0.5"
            />

            {/* Cable from left cup */}
            <path
                d="M42 145 Q42 165 55 170 Q60 172 55 175"
                stroke="#7c3aed"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.6"
            />

            {/* Music notes floating */}
            <g opacity="0.5">
                <text x="75" y="25" fontSize="14" fill="#c084fc">
                    ♫
                </text>
                <text x="115" y="20" fontSize="10" fill="#a78bfa">
                    ♪
                </text>
                <text x="95" y="15" fontSize="12" fill="#7c3aed" opacity="0.6">
                    ♬
                </text>
            </g>

            {/* Sparkle decorations */}
            <circle cx="15" cy="85" r="2" fill="#e9d5ff" />
            <circle cx="185" cy="80" r="1.5" fill="#c084fc" opacity="0.4" />
            <circle cx="100" cy="10" r="2" fill="#ddd6fe" />
        </svg>
    );
}
