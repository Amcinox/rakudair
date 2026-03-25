import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[oklch(0.97_0.015_85)] text-[oklch(0.25_0.03_50)]">


            <div className="relative z-10 text-center max-w-lg mx-auto space-y-8">
                {/* Compass icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-[oklch(0.55_0.12_55)]/10 flex items-center justify-center">
                            <Compass className="w-12 h-12 text-[oklch(0.55_0.12_55)] animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* 404 Text */}
                <div>
                    <h1
                        className="text-8xl font-bold tracking-tighter text-[oklch(0.55_0.12_55)]"
                        style={{
                            fontFamily: "var(--font-display)",
                            letterSpacing: "0.05em",
                        }}
                    >
                        404
                    </h1>
                    <p
                        className="text-2xl font-bold mt-2"
                        style={{ fontFamily: "var(--font-noto-serif)" }}
                    >
                        砂漠で迷子になりました
                    </p>
                    <p className="text-muted-foreground mt-3 leading-relaxed">
                        お探しのページは見つかりませんでした。砂嵐に飲み込まれたか、<br />
                        まだ誰も足を踏み入れていない場所かもしれません。
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        The page you&apos;re looking for doesn&apos;t exist or
                        has been moved.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button
                        asChild
                        size="lg"
                        className="bg-[oklch(0.55_0.12_55)] hover:bg-[oklch(0.55_0.12_55)]/90 text-white"
                    >
                        <Link href="/">ホームに戻る</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="/blog">ブログを読む</Link>
                    </Button>
                </div>

                {/* Footer hint */}
                <p className="text-xs text-muted-foreground">
                    Rakuda Air — 砂漠の風に導かれ、未知なる冒険へ
                </p>
            </div>
        </div>
    );
}
