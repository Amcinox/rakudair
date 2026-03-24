export function VinylIllustration({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Sleeve peeking out */}
            <rect
                x="30"
                y="25"
                width="145"
                height="150"
                rx="6"
                fill="#f5f3ff"
                stroke="#c084fc"
                strokeWidth="1.5"
                strokeDasharray="4 3"
            />
            <text
                x="55"
                y="55"
                fontSize="10"
                fontWeight="bold"
                fill="#7c3aed"
                opacity="0.5"
                fontFamily="sans-serif"
            >
                RAKUDA AIR
            </text>

            {/* Record */}
            <circle
                cx="115"
                cy="100"
                r="70"
                fill="#1e1b4b"
                stroke="#312e81"
                strokeWidth="1.5"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 115 100"
                    to="360 115 100"
                    dur="4s"
                    repeatCount="indefinite"
                />
            </circle>

            {/* Record grooves */}
            <circle
                cx="115"
                cy="100"
                r="58"
                fill="none"
                stroke="#312e81"
                strokeWidth="0.5"
                opacity="0.6"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 115 100"
                    to="360 115 100"
                    dur="4s"
                    repeatCount="indefinite"
                />
            </circle>
            <circle
                cx="115"
                cy="100"
                r="50"
                fill="none"
                stroke="#312e81"
                strokeWidth="0.5"
                opacity="0.5"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 115 100"
                    to="360 115 100"
                    dur="4s"
                    repeatCount="indefinite"
                />
            </circle>
            <circle
                cx="115"
                cy="100"
                r="42"
                fill="none"
                stroke="#312e81"
                strokeWidth="0.5"
                opacity="0.4"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 115 100"
                    to="360 115 100"
                    dur="4s"
                    repeatCount="indefinite"
                />
            </circle>

            {/* Record label */}
            <circle cx="115" cy="100" r="22" fill="#7c3aed">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 115 100"
                    to="360 115 100"
                    dur="4s"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx="115" cy="100" r="18" fill="#8b5cf6" />
            <circle cx="115" cy="100" r="3" fill="#1e1b4b" />

            {/* Label text (rotates with record) */}
            <g>
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 115 100"
                    to="360 115 100"
                    dur="4s"
                    repeatCount="indefinite"
                />
                <text
                    x="115"
                    y="96"
                    textAnchor="middle"
                    fontSize="5"
                    fontWeight="bold"
                    fill="white"
                    opacity="0.8"
                >
                    THE BOOTH
                </text>
                <text
                    x="115"
                    y="108"
                    textAnchor="middle"
                    fontSize="4"
                    fill="white"
                    opacity="0.6"
                >
                    VOL. 1
                </text>
            </g>

            {/* Shine highlight */}
            <ellipse
                cx="95"
                cy="80"
                rx="20"
                ry="35"
                fill="white"
                opacity="0.04"
                transform="rotate(-30 95 80)"
            />

            {/* Sparkles */}
            <circle cx="50" cy="40" r="2" fill="#c084fc" opacity="0.4" />
            <circle cx="170" cy="55" r="1.5" fill="#e9d5ff" opacity="0.5" />
            <circle cx="45" cy="160" r="1.5" fill="#a78bfa" opacity="0.3" />
        </svg>
    );
}
