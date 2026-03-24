export function SprayCanIllustration({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 120 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Spray mist */}
            <circle cx="60" cy="15" r="5" fill="#c084fc" opacity="0.15" />
            <circle cx="55" cy="10" r="8" fill="#a78bfa" opacity="0.08" />
            <circle cx="65" cy="8" r="6" fill="#c084fc" opacity="0.1" />
            <circle cx="50" cy="5" r="4" fill="#ddd6fe" opacity="0.12" />
            <circle cx="70" cy="3" r="5" fill="#c084fc" opacity="0.06" />

            {/* Spray nozzle */}
            <rect
                x="55"
                y="25"
                width="10"
                height="8"
                rx="2"
                fill="#a78bfa"
                stroke="#7c3aed"
                strokeWidth="1"
            />
            <rect x="58" y="22" width="4" height="5" rx="1" fill="#7c3aed" />

            {/* Can cap */}
            <path
                d="M40 38 Q40 33 50 33 L70 33 Q80 33 80 38 L80 55 L40 55 Z"
                fill="#ddd6fe"
                stroke="#7c3aed"
                strokeWidth="1.5"
            />

            {/* Can body */}
            <rect
                x="35"
                y="55"
                width="50"
                height="110"
                rx="4"
                fill="#ede9fe"
                stroke="#7c3aed"
                strokeWidth="2"
            />

            {/* Label area */}
            <rect
                x="40"
                y="70"
                width="40"
                height="60"
                rx="3"
                fill="#f5f3ff"
                stroke="#a78bfa"
                strokeWidth="1"
            />

            {/* Label content */}
            <text
                x="60"
                y="90"
                textAnchor="middle"
                fontSize="7"
                fontWeight="bold"
                fill="#7c3aed"
                fontFamily="sans-serif"
            >
                BOOTH
            </text>
            <text
                x="60"
                y="100"
                textAnchor="middle"
                fontSize="5"
                fill="#a78bfa"
                fontFamily="sans-serif"
            >
                SPRAY
            </text>

            {/* Color dot on label */}
            <circle cx="60" cy="115" r="6" fill="#c084fc" />

            {/* Bottom of can */}
            <rect
                x="35"
                y="162"
                width="50"
                height="5"
                rx="2"
                fill="#c4b5fd"
                stroke="#7c3aed"
                strokeWidth="1"
            />

            {/* Shine on can */}
            <rect
                x="42"
                y="60"
                width="3"
                height="100"
                rx="1.5"
                fill="white"
                opacity="0.3"
            />

            {/* Drip */}
            <path
                d="M75 170 Q75 185 70 190 Q68 192 66 190 Q64 185 68 178"
                fill="#c084fc"
                opacity="0.3"
            />
        </svg>
    );
}
