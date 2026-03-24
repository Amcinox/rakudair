import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TurntableIllustration } from "@/components/dashboard/illustrations";
import { db } from "@/lib/db";
import { articles, pages, subscribers, contactSubmissions } from "@/lib/db/schema";
import { eq, count, sql } from "drizzle-orm";

export default async function DashboardPage() {
    const [articleStats, pageCount, subscriberCount, newMessagesCount] =
        await Promise.all([
            db
                .select({
                    status: articles.status,
                    count: count(),
                })
                .from(articles)
                .groupBy(articles.status),
            db.select({ count: count() }).from(pages),
            db
                .select({ count: count() })
                .from(subscribers)
                .where(eq(subscribers.status, "active")),
            db
                .select({ count: count() })
                .from(contactSubmissions)
                .where(eq(contactSubmissions.status, "new")),
        ]);

    const totalArticles = articleStats.reduce((acc, s) => acc + s.count, 0);
    const publishedArticles =
        articleStats.find((s) => s.status === "published")?.count ?? 0;
    const draftArticles =
        articleStats.find((s) => s.status === "draft")?.count ?? 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <TurntableIllustration className="hidden md:block w-24 h-auto opacity-80" />
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight gold-gradient-text" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>Dashboard</h2>
                        <p className="text-muted-foreground">
                            Overview of your Rakuda Air blog.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button asChild className="btn-gold">
                        <Link href="/dashboard/articles/new">New Article</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/pages/new">New Page</Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="dash-card gold-glow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium gold-text">
                            Total Articles
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{totalArticles}</div>
                        <p className="text-xs text-muted-foreground">
                            {publishedArticles} published · {draftArticles} drafts
                        </p>
                    </CardContent>
                </Card>
                <Card className="dash-card gold-glow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium gold-text">Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{pageCount[0].count}</div>
                    </CardContent>
                </Card>
                <Card className="dash-card gold-glow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium gold-text">Subscribers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                            {subscriberCount[0].count}
                        </div>
                        <p className="text-xs text-muted-foreground">Active subscribers</p>
                    </CardContent>
                </Card>
                <Card className="dash-card gold-glow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium gold-text">
                            New Messages
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                            {newMessagesCount[0].count}
                        </div>
                        <p className="text-xs text-muted-foreground">Unread contact messages</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
