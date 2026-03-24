"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        siteName: "Rakuda Air",
        siteDescription: "A Japanese travel & culture blog",
        siteUrl: "https://www.rakudair.com",
        contactEmail: "info@rakudair.com",
        socialTwitter: "",
        socialInstagram: "",
        socialYoutube: "",
        postsPerPage: "12",
        analyticsId: "",
    });

    useEffect(() => {
        fetch("/api/settings")
            .then((r) => r.json())
            .then((json) => {
                const data = json.data ?? {};
                setForm((f) => ({
                    ...f,
                    siteName: (data.siteName as string) ?? f.siteName,
                    siteDescription:
                        (data.siteDescription as string) ?? f.siteDescription,
                    siteUrl: (data.siteUrl as string) ?? f.siteUrl,
                    contactEmail: (data.contactEmail as string) ?? f.contactEmail,
                    socialTwitter: (data.socialTwitter as string) ?? "",
                    socialInstagram: (data.socialInstagram as string) ?? "",
                    socialYoutube: (data.socialYoutube as string) ?? "",
                    postsPerPage: String(data.postsPerPage ?? "12"),
                    analyticsId: (data.analyticsId as string) ?? "",
                }));
                setLoading(false);
            });
    }, []);

    async function handleSave() {
        setSaving(true);

        const batch = Object.entries(form).map(([key, value]) => ({
            key,
            value,
        }));

        const res = await fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(batch),
        });

        setSaving(false);

        if (!res.ok) {
            toast.error("Failed to save settings");
            return;
        }

        toast.success("Settings saved");
    }

    if (loading) {
        return (
            <div className="h-[400px] animate-pulse rounded-lg bg-neutral-100" />
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-neutral-500">General site configuration.</p>
            </div>

            {/* General */}
            <div className="rounded-lg border bg-white p-6 dark:bg-neutral-950 space-y-4">
                <h3 className="font-semibold">General</h3>
                <div className="space-y-2">
                    <Label>Site Name</Label>
                    <Input
                        value={form.siteName}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, siteName: e.target.value }))
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label>Site Description</Label>
                    <Textarea
                        value={form.siteDescription}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, siteDescription: e.target.value }))
                        }
                        rows={2}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Site URL</Label>
                    <Input
                        value={form.siteUrl}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, siteUrl: e.target.value }))
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input
                        value={form.contactEmail}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, contactEmail: e.target.value }))
                        }
                    />
                </div>
            </div>

            <Separator />

            {/* Social */}
            <div className="rounded-lg border bg-white p-6 dark:bg-neutral-950 space-y-4">
                <h3 className="font-semibold">Social Media</h3>
                <div className="space-y-2">
                    <Label>Twitter / X</Label>
                    <Input
                        value={form.socialTwitter}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, socialTwitter: e.target.value }))
                        }
                        placeholder="https://twitter.com/..."
                    />
                </div>
                <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input
                        value={form.socialInstagram}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, socialInstagram: e.target.value }))
                        }
                        placeholder="https://instagram.com/..."
                    />
                </div>
                <div className="space-y-2">
                    <Label>YouTube</Label>
                    <Input
                        value={form.socialYoutube}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, socialYoutube: e.target.value }))
                        }
                        placeholder="https://youtube.com/..."
                    />
                </div>
            </div>

            <Separator />

            {/* Performance */}
            <div className="rounded-lg border bg-white p-6 dark:bg-neutral-950 space-y-4">
                <h3 className="font-semibold">Display & Analytics</h3>
                <div className="space-y-2">
                    <Label>Posts Per Page</Label>
                    <Input
                        type="number"
                        value={form.postsPerPage}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, postsPerPage: e.target.value }))
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label>Google Analytics ID</Label>
                    <Input
                        value={form.analyticsId}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, analyticsId: e.target.value }))
                        }
                        placeholder="G-XXXXXXXXXX"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} size="lg">
                    {saving ? "Saving…" : "Save Settings"}
                </Button>
            </div>
        </div>
    );
}
