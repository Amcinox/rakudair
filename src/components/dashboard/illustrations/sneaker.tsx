export function SneakerIllustration({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 220 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Sole */}
            <path
                d="M30 108 Q20 108 18 100 L18 95 Q18 90 25 88 L185 82 Q200 82 205 88 L208 95 Q210 100 205 105 L200 108 Z"
                fill="#7c3aed"
                stroke="#5b21b6"
                strokeWidth="1.5"
            />

            {/* Sole tread lines */}
            <line x1="40" y1="108" x2="45" y2="98" stroke="#5b21b6" strokeWidth="0.8" opacity="0.5" />
            <line x1="60" y1="108" x2="65" y2="96" stroke="#5b21b6" strokeWidth="0.8" opacity="0.5" />
            <line x1="80" y1="108" x2="85" y2="94" stroke="#5b21b6" strokeWidth="0.8" opacity="0.5" />
            <line x1="100" y1="106" x2="105" y2="92" stroke="#5b21b6" strokeWidth="0.8" opacity="0.5" />
            <line x1="120" y1="105" x2="125" y2="90" stroke="#5b21b6" strokeWidth="0.8" opacity="0.5" />
            <line x1="140" y1="104" x2="145" y2="88" stroke="#5b21b6" strokeWidth="0.8" opacity="0.5" />
            <line x1="160" y1="103" x2="165" y2="86" stroke="#5b21b6" strokeWidth="0.8" opacity="0.5" />
            <line x1="180" y1="102" x2="185" y2="85" stroke="#5b21b6" strokeWidth="0.8" opacity="0.5" />

            {/* Shoe body */}
            <path
                d="M30 88 Q25 60 40 45 Q55 30 80 28 L140 28 Q160 30 175 40 Q190 55 200 80 L200 88 Z"
                fill="#f5f3ff"
                stroke="#7c3aed"
                strokeWidth="2"
            />

            {/* Toe cap */}
            <path
                d="M30 88 Q28 70 40 55 Q50 45 70 42 L70 88 Z"
                fill="#ede9fe"
                stroke="#a78bfa"
                strokeWidth="1"
            />

            {/* Swoosh / stripe */}
            <path
                d="M55 75 Q90 60 140 50 Q165 45 180 55"
                stroke="#7c3aed"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
            />

            {/* Tongue */}
            <path
                d="M115 28 L108 15 Q110 8 120 8 Q130 8 132 15 L125 28"
                fill="#ddd6fe"
                stroke="#7c3aed"
                strokeWidth="1.5"
            />

            {/* Collar / ankle */}
            <path
                d="M110 28 Q105 28 105 32 L105 45 Q105 50 115 50 L135 50 Q145 50 145 45 L145 32 Q145 28 140 28"
                fill="#ede9fe"
                stroke="#a78bfa"
                strokeWidth="1"
            />

            {/* Laces */}
            <line x1="112" y1="32" x2="128" y2="32" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="113" y1="37" x2="127" y2="37" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="114" y1="42" x2="126" y2="42" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />

            {/* Star on side */}
            <polygon
                points="160,68 163,62 170,62 165,58 167,51 160,55 153,51 155,58 150,62 157,62"
                fill="#c084fc"
                opacity="0.6"
            />

            {/* Motion lines */}
            <line x1="5" y1="70" x2="20" y2="70" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            <line x1="10" y1="80" x2="22" y2="80" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
            <line x1="8" y1="90" x2="18" y2="90" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />

            {/* Sparkles */}
            <circle cx="200" cy="30" r="2" fill="#e9d5ff" />
            <circle cx="50" cy="15" r="1.5" fill="#c084fc" opacity="0.4" />
        </svg>
    );
}
