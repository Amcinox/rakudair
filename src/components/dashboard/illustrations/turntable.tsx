export function TurntableIllustration({
    className,
}: {
    className?: string;
}) {
    return (
        <svg
            viewBox="0 0 260 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Turntable base */}
            <rect
                x="20"
                y="40"
                width="220"
                height="130"
                rx="10"
                fill="#f5f3ff"
                stroke="#7c3aed"
                strokeWidth="2"
            />

            {/* Inner panel */}
            <rect
                x="30"
                y="50"
                width="200"
                height="110"
                rx="6"
                fill="#ede9fe"
                stroke="#a78bfa"
                strokeWidth="1"
                opacity="0.5"
            />

            {/* Platter */}
            <circle
                cx="120"
                cy="110"
                r="52"
                fill="#ddd6fe"
                stroke="#7c3aed"
                strokeWidth="1.5"
            />

            {/* Record on platter */}
            <circle cx="120" cy="110" r="45" fill="#1e1b4b">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 120 110"
                    to="360 120 110"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </circle>

            {/* Record grooves */}
            <circle
                cx="120"
                cy="110"
                r="38"
                fill="none"
                stroke="#312e81"
                strokeWidth="0.5"
                opacity="0.5"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 120 110"
                    to="360 120 110"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </circle>
            <circle
                cx="120"
                cy="110"
                r="32"
                fill="none"
                stroke="#312e81"
                strokeWidth="0.5"
                opacity="0.4"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 120 110"
                    to="360 120 110"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </circle>
            <circle
                cx="120"
                cy="110"
                r="26"
                fill="none"
                stroke="#312e81"
                strokeWidth="0.5"
                opacity="0.3"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 120 110"
                    to="360 120 110"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </circle>

            {/* Record label */}
            <circle cx="120" cy="110" r="14" fill="#7c3aed">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 120 110"
                    to="360 120 110"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx="120" cy="110" r="2.5" fill="#1e1b4b" />

            {/* Tonearm base */}
            <circle
                cx="205"
                cy="60"
                r="8"
                fill="#c4b5fd"
                stroke="#7c3aed"
                strokeWidth="1.5"
            />

            {/* Tonearm */}
            <line
                x1="205"
                y1="60"
                x2="155"
                y2="90"
                stroke="#7c3aed"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <line
                x1="155"
                y1="90"
                x2="145"
                y2="95"
                stroke="#a78bfa"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Cartridge/needle */}
            <rect
                x="140"
                y="92"
                width="8"
                height="5"
                rx="1"
                fill="#7c3aed"
                transform="rotate(-15 144 94)"
            />

            {/* Pitch slider area */}
            <rect
                x="195"
                y="90"
                width="15"
                height="50"
                rx="3"
                fill="#ddd6fe"
                stroke="#a78bfa"
                strokeWidth="1"
            />
            <rect x="200" y="108" width="5" height="12" rx="2" fill="#7c3aed" />

            {/* Power LED */}
            <circle cx="40" cy="55" r="3" fill="#22c55e" opacity="0.8">
                <animate
                    attributeName="opacity"
                    values="0.8;0.4;0.8"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </circle>

            {/* Brand text */}
            <text
                x="55"
                y="57"
                fontSize="6"
                fontWeight="bold"
                fill="#7c3aed"
                opacity="0.4"
                fontFamily="sans-serif"
            >
                THE BOOTH
            </text>

            {/* Music notes */}
            <g opacity="0.4">
                <text x="70" y="35" fontSize="12" fill="#c084fc">
                    ♪
                </text>
                <text x="160" y="30" fontSize="10" fill="#a78bfa">
                    ♫
                </text>
            </g>
        </svg>
    );
}
