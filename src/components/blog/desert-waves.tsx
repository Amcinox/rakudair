export function DesertWaves() {
    return (
        <div
            className="relative h-64 overflow-hidden bg-[oklch(0.97_0.015_85)] pointer-events-none select-none"
            aria-hidden
        >
            {/* Fade from page background into sandy — seamless transition at the top */}
            <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-background to-transparent z-10" />

            {/* Far dune — exact copy from the 404 page */}
            <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20">
                <svg
                    viewBox="0 0 1440 320"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                >
                    <path
                        fill="oklch(0.7 0.1 70)"
                        d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,229.3C672,245,768,235,864,208C960,181,1056,139,1152,138.7C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    />
                </svg>
            </div>

            {/* Near dune — exact copy from the 404 page */}
            <div className="absolute bottom-0 left-0 right-0 h-48 opacity-10">
                <svg
                    viewBox="0 0 1440 320"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                >
                    <path
                        fill="oklch(0.55 0.12 55)"
                        d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    />
                </svg>
            </div>
        </div>
    );
}
