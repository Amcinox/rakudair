export function EmptyMicIllustration({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Background circle */}
            <circle cx="100" cy="100" r="85" fill="#f5f3ff" opacity="0.5" />

            {/* Dropped microphone */}
            <g transform="rotate(35 100 100)">
                {/* Mic body */}
                <rect
                    x="88"
                    y="70"
                    width="24"
                    height="45"
                    rx="5"
                    fill="#ede9fe"
                    stroke="#7c3aed"
                    strokeWidth="2"
                />

                {/* Mic head */}
                <path
                    d="M88 70 Q88 48 100 42 Q112 48 112 70"
                    fill="#f5f3ff"
                    stroke="#7c3aed"
                    strokeWidth="2"
                />

                {/* Grille lines */}
                <line x1="91" y1="50" x2="109" y2="50" stroke="#c084fc" strokeWidth="0.8" opacity="0.5" />
                <line x1="90" y1="55" x2="110" y2="55" stroke="#c084fc" strokeWidth="0.8" opacity="0.5" />
                <line x1="89" y1="60" x2="111" y2="60" stroke="#c084fc" strokeWidth="0.8" opacity="0.5" />
                <line x1="89" y1="65" x2="111" y2="65" stroke="#c084fc" strokeWidth="0.8" opacity="0.5" />

                {/* Ring */}
                <rect x="86" y="68" width="28" height="4" rx="2" fill="#7c3aed" opacity="0.6" />
            </g>

            {/* Impact lines (mic drop!) */}
            <line x1="90" y1="148" x2="80" y2="158" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <line x1="100" y1="150" x2="100" y2="162" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            <line x1="110" y1="148" x2="120" y2="158" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

            {/* Small bounce circles */}
            <circle cx="85" cy="145" r="2" fill="#c084fc" opacity="0.3" />
            <circle cx="115" cy="145" r="2" fill="#c084fc" opacity="0.3" />
            <circle cx="100" cy="148" r="1.5" fill="#7c3aed" opacity="0.2" />

            {/* "MIC DROP" text */}
            <text
                x="100"
                y="182"
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="#7c3aed"
                opacity="0.4"
                fontFamily="sans-serif"
                letterSpacing="2"
            >
                MIC DROP
            </text>

            {/* Music notes floating away */}
            <text x="55" y="50" fontSize="14" fill="#c084fc" opacity="0.3">
                ♪
            </text>
            <text x="140" y="40" fontSize="10" fill="#a78bfa" opacity="0.25">
                ♫
            </text>
            <text x="45" y="90" fontSize="10" fill="#ddd6fe" opacity="0.4">
                ♬
            </text>
        </svg>
    );
}
