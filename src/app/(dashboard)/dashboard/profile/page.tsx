"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ImagePicker } from "@/components/dashboard/image-picker";
import {
    Globe,
    User,
    Pen,
} from "lucide-react";

interface ProfileForm {
    displayName: string;
    slug: string;
    bio: string;
    avatar: string;
    role: string;
    location: string;
    website: string;
    socialTwitter: string;
    socialInstagram: string;
    socialYoutube: string;
    socialFacebook: string;
    socialTiktok: string;
    socialGithub: string;
}

const defaults: ProfileForm = {
    displayName: "",
    slug: "",
    bio: "",
    avatar: "",
    role: "",
    location: "",
    website: "",
    socialTwitter: "",
    socialInstagram: "",
    socialYoutube: "",
    socialFacebook: "",
    socialTiktok: "",
    socialGithub: "",
};

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<ProfileForm>(defaults);

    useEffect(() => {
        fetch("/api/profile")
            .then((r) => r.json())
            .then((json) => {
                const d = json.data;
                if (d) {
                    setForm({
                        displayName: d.displayName ?? "",
                        slug: d.slug ?? "",
                        bio: d.bio ?? "",
                        avatar: d.avatar ?? "",
                        role: d.role ?? "",
                        location: d.location ?? "",
                        website: d.website ?? "",
                        socialTwitter: d.socialTwitter ?? "",
                        socialInstagram: d.socialInstagram ?? "",
                        socialYoutube: d.socialYoutube ?? "",
                        socialFacebook: d.socialFacebook ?? "",
                        socialTiktok: d.socialTiktok ?? "",
                        socialGithub: d.socialGithub ?? "",
                    });
                }
                setLoading(false);
            });
    }, []);

    async function handleSave() {
        if (!form.displayName.trim()) {
            toast.error("Display name is required");
            return;
        }
        if (!form.slug.trim()) {
            toast.error("Slug is required");
            return;
        }

        setSaving(true);
        const res = await fetch("/api/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setSaving(false);

        if (!res.ok) {
            toast.error("Failed to save profile");
            return;
        }
        toast.success("Profile saved");
    }

    function generateSlug() {
        const slug = form.displayName
            .toLowerCase()
            .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g, "-")
            .replace(/^-+|-+$/g, "");
        setForm((f) => ({ ...f, slug }));
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                <div className="h-4 w-64 animate-pulse rounded bg-muted" />
                <div className="h-[400px] animate-pulse rounded-lg bg-muted" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2
                    className="text-2xl font-bold tracking-tight gold-gradient-text"
                    style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
                >
                    Profile
                </h2>
                <p className="text-muted-foreground">
                    Your author profile displayed on articles.
                </p>
            </div>

            {/* Identity */}
            <div className="dash-card rounded-lg p-6 space-y-5">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                        <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Identity</h3>
                        <p className="text-xs text-muted-foreground">Your name, avatar, and role</p>
                    </div>
                </div>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Display Name</Label>
                                <Input
                                    value={form.displayName}
                                    onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                                    placeholder="Rakudair"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={form.slug}
                                        onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                                        placeholder="rakudair"
                                    />
                                    <Button variant="outline" size="sm" onClick={generateSlug} className="shrink-0">
                                        Generate
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Role / Title</Label>
                                <Input
                                    value={form.role}
                                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                                    placeholder="トラベルライター"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input
                                    value={form.location}
                                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                                    placeholder="東京, 日本"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Avatar</Label>
                        <ImagePicker
                            value={form.avatar}
                            onChange={(url) => setForm((f) => ({ ...f, avatar: url }))}
                            placeholder="Upload avatar"
                        />
                    </div>
                </div>
            </div>

            {/* Bio */}
            <div className="dash-card rounded-lg p-6 space-y-5">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                        <Pen className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">About</h3>
                        <p className="text-xs text-muted-foreground">A short bio displayed on your articles</p>
                    </div>
                </div>
                <Separator />
                <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                        value={form.bio}
                        onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                        rows={4}
                        placeholder="世界中の砂漠を旅し、その美しさと文化を記録しています…"
                    />
                    <p className="text-xs text-muted-foreground">{form.bio.length}/2000</p>
                </div>
            </div>

            {/* Links & Social */}
            <div className="dash-card rounded-lg p-6 space-y-5">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                        <Globe className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Links & Social Media</h3>
                        <p className="text-xs text-muted-foreground">Your website and social profiles. Leave empty to hide.</p>
                    </div>
                </div>
                <Separator />
                <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                        value={form.website}
                        onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                        placeholder="https://rakudair.com"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Twitter / X</Label>
                        <Input
                            value={form.socialTwitter}
                            onChange={(e) => setForm((f) => ({ ...f, socialTwitter: e.target.value }))}
                            placeholder="https://twitter.com/..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Instagram</Label>
                        <Input
                            value={form.socialInstagram}
                            onChange={(e) => setForm((f) => ({ ...f, socialInstagram: e.target.value }))}
                            placeholder="https://instagram.com/..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>YouTube</Label>
                        <Input
                            value={form.socialYoutube}
                            onChange={(e) => setForm((f) => ({ ...f, socialYoutube: e.target.value }))}
                            placeholder="https://youtube.com/..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Facebook</Label>
                        <Input
                            value={form.socialFacebook}
                            onChange={(e) => setForm((f) => ({ ...f, socialFacebook: e.target.value }))}
                            placeholder="https://facebook.com/..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>TikTok</Label>
                        <Input
                            value={form.socialTiktok}
                            onChange={(e) => setForm((f) => ({ ...f, socialTiktok: e.target.value }))}
                            placeholder="https://tiktok.com/..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>GitHub</Label>
                        <Input
                            value={form.socialGithub}
                            onChange={(e) => setForm((f) => ({ ...f, socialGithub: e.target.value }))}
                            placeholder="https://github.com/..."
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={saving} size="lg">
                    {saving ? "Saving…" : "Save Profile"}
                </Button>
            </div>
        </div>
    );
}
