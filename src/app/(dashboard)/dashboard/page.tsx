import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-neutral-500">
                        Overview of your Rakuda Air blog.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/dashboard/articles/new">New Article</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/pages/new">New Page</Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Articles
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalArticles}</div>
                        <p className="text-xs text-neutral-500">
                            {publishedArticles} published · {draftArticles} drafts
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pageCount[0].count}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {subscriberCount[0].count}
                        </div>
                        <p className="text-xs text-neutral-500">Active subscribers</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            New Messages
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {newMessagesCount[0].count}
                        </div>
                        <p className="text-xs text-neutral-500">Unread contact messages</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
