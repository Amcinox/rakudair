export function BoomboxIllustration({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 280 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Sound waves */}
            <path
                d="M40 60 Q30 80 40 100"
                stroke="#c084fc"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
            />
            <path
                d="M30 50 Q15 80 30 110"
                stroke="#c084fc"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.3"
            />
            <path
                d="M240 60 Q250 80 240 100"
                stroke="#c084fc"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
            />
            <path
                d="M250 50 Q265 80 250 110"
                stroke="#c084fc"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.3"
            />

            {/* Main body */}
            <rect
                x="55"
                y="50"
                width="170"
                height="95"
                rx="12"
                fill="#f5f3ff"
                stroke="#7c3aed"
                strokeWidth="2.5"
            />

            {/* Top handle */}
            <path
                d="M105 50 L105 35 Q140 15 175 35 L175 50"
                stroke="#7c3aed"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
            />

            {/* Left speaker */}
            <circle
                cx="105"
                cy="97"
                r="30"
                fill="#ede9fe"
                stroke="#7c3aed"
                strokeWidth="2"
            />
            <circle
                cx="105"
                cy="97"
                r="20"
                fill="#ddd6fe"
                stroke="#7c3aed"
                strokeWidth="1.5"
            />
            <circle cx="105" cy="97" r="8" fill="#7c3aed" />

            {/* Right speaker */}
            <circle
                cx="175"
                cy="97"
                r="30"
                fill="#ede9fe"
                stroke="#7c3aed"
                strokeWidth="2"
            />
            <circle
                cx="175"
                cy="97"
                r="20"
                fill="#ddd6fe"
                stroke="#7c3aed"
                strokeWidth="1.5"
            />
            <circle cx="175" cy="97" r="8" fill="#7c3aed" />

            {/* Cassette deck */}
            <rect
                x="120"
                y="68"
                width="40"
                height="22"
                rx="4"
                fill="#ddd6fe"
                stroke="#7c3aed"
                strokeWidth="1.5"
            />
            <circle cx="131" cy="79" r="4" fill="#7c3aed" opacity="0.5" />
            <circle cx="149" cy="79" r="4" fill="#7c3aed" opacity="0.5" />

            {/* EQ bars */}
            <rect x="123" y="55" width="3" height="8" rx="1" fill="#a78bfa">
                <animate
                    attributeName="height"
                    values="8;14;5;11;8"
                    dur="0.8s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="y"
                    values="55;52;56;53;55"
                    dur="0.8s"
                    repeatCount="indefinite"
                />
            </rect>
            <rect x="129" y="53" width="3" height="10" rx="1" fill="#c084fc">
                <animate
                    attributeName="height"
                    values="10;6;13;7;10"
                    dur="0.7s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="y"
                    values="53;55;51;56;53"
                    dur="0.7s"
                    repeatCount="indefinite"
                />
            </rect>
            <rect x="135" y="54" width="3" height="9" rx="1" fill="#a78bfa">
                <animate
                    attributeName="height"
                    values="9;15;6;12;9"
                    dur="0.9s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="y"
                    values="54;51;57;52;54"
                    dur="0.9s"
                    repeatCount="indefinite"
                />
            </rect>
            <rect x="141" y="52" width="3" height="11" rx="1" fill="#c084fc">
                <animate
                    attributeName="height"
                    values="11;7;14;8;11"
                    dur="0.65s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="y"
                    values="52;54;50;55;52"
                    dur="0.65s"
                    repeatCount="indefinite"
                />
            </rect>
            <rect x="147" y="56" width="3" height="7" rx="1" fill="#a78bfa">
                <animate
                    attributeName="height"
                    values="7;12;5;10;7"
                    dur="0.75s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="y"
                    values="56;53;57;54;56"
                    dur="0.75s"
                    repeatCount="indefinite"
                />
            </rect>
            <rect x="153" y="54" width="3" height="9" rx="1" fill="#c084fc">
                <animate
                    attributeName="height"
                    values="9;5;13;7;9"
                    dur="0.85s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="y"
                    values="54;56;51;55;54"
                    dur="0.85s"
                    repeatCount="indefinite"
                />
            </rect>

            {/* Feet */}
            <rect
                x="75"
                y="145"
                width="15"
                height="6"
                rx="3"
                fill="#7c3aed"
                opacity="0.6"
            />
            <rect
                x="190"
                y="145"
                width="15"
                height="6"
                rx="3"
                fill="#7c3aed"
                opacity="0.6"
            />

            {/* Music notes */}
            <g opacity="0.6">
                <text x="45" y="38" fontSize="18" fill="#c084fc">
                    ♪
                </text>
                <text x="230" y="35" fontSize="14" fill="#a78bfa">
                    ♫
                </text>
                <text x="25" y="130" fontSize="12" fill="#7c3aed">
                    ♪
                </text>
                <text x="255" y="125" fontSize="16" fill="#c084fc">
                    ♬
                </text>
            </g>

            {/* Stars / sparkles */}
            <circle cx="60" cy="30" r="2" fill="#e9d5ff" />
            <circle cx="220" cy="25" r="1.5" fill="#e9d5ff" />
            <circle cx="258" cy="70" r="2" fill="#ddd6fe" />
        </svg>
    );
}
