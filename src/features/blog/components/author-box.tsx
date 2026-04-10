import Image from "next/image";
import { MapPin, Globe } from "lucide-react";

interface AuthorBoxProps {
    name: string;
    bio?: string;
    avatar?: string;
    role?: string;
    location?: string;
    website?: string;
    socialTwitter?: string;
    socialInstagram?: string;
    socialYoutube?: string;
    socialFacebook?: string;
    socialTiktok?: string;
    socialGithub?: string;
    variant?: "sidebar" | "inline";
}

/** Inline SVG icons for social media brands (not available in lucide-react) */
const socialIcons = {
    twitter: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    instagram: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    ),
    youtube: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    ),
    facebook: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.044 1.613.115v3.146c-.427-.044-.72-.066-.957-.066-1.36 0-1.816.516-1.816 1.856v2.507h3.413l-.736 3.667h-2.677v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647z" />
        </svg>
    ),
    tiktok: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78c.27 0 .54.04.8.1v-3.5a6.37 6.37 0 0 0-.8-.05A6.34 6.34 0 0 0 3.15 15.3 6.34 6.34 0 0 0 9.49 21.6a6.34 6.34 0 0 0 6.34-6.34V8.78a8.18 8.18 0 0 0 3.76.92V6.69Z" />
        </svg>
    ),
    github: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
    ),
};

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
            {children}
        </a>
    );
}

export function AuthorBox({
    name,
    bio,
    avatar,
    role,
    location,
    website,
    socialTwitter,
    socialInstagram,
    socialYoutube,
    socialFacebook,
    socialTiktok,
    socialGithub,
    variant = "inline",
}: AuthorBoxProps) {
    const hasSocials = socialTwitter || socialInstagram || socialYoutube || socialFacebook || socialTiktok || socialGithub || website;

    if (variant === "sidebar") {
        return (
            <aside className="sticky top-28 space-y-6">
                {/* Avatar & Name */}
                <div className="flex flex-col items-center text-center">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 mb-4">
                        {avatar ? (
                            <Image src={avatar} alt={name} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                <span className="font-serif text-3xl font-bold text-primary">
                                    {name[0]}
                                </span>
                            </div>
                        )}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-foreground">{name}</h3>
                    {role && <p className="text-primary text-sm mt-0.5">{role}</p>}
                    {location && (
                        <p className="text-muted-foreground text-xs mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {location}
                        </p>
                    )}
                </div>

                {/* Bio */}
                {bio && (
                    <p className="text-sm text-muted-foreground leading-relaxed text-center">
                        {bio}
                    </p>
                )}

                {/* Social Links */}
                {hasSocials && (
                    <div className="flex flex-wrap justify-center gap-1">
                        {website && (
                            <SocialIcon href={website} label="Website">
                                <Globe className="w-4 h-4" />
                            </SocialIcon>
                        )}
                        {socialTwitter && (
                            <SocialIcon href={socialTwitter} label="Twitter">
                                {socialIcons.twitter}
                            </SocialIcon>
                        )}
                        {socialInstagram && (
                            <SocialIcon href={socialInstagram} label="Instagram">
                                {socialIcons.instagram}
                            </SocialIcon>
                        )}
                        {socialYoutube && (
                            <SocialIcon href={socialYoutube} label="YouTube">
                                {socialIcons.youtube}
                            </SocialIcon>
                        )}
                        {socialFacebook && (
                            <SocialIcon href={socialFacebook} label="Facebook">
                                {socialIcons.facebook}
                            </SocialIcon>
                        )}
                        {socialTiktok && (
                            <SocialIcon href={socialTiktok} label="TikTok">
                                {socialIcons.tiktok}
                            </SocialIcon>
                        )}
                        {socialGithub && (
                            <SocialIcon href={socialGithub} label="GitHub">
                                {socialIcons.github}
                            </SocialIcon>
                        )}
                    </div>
                )}
            </aside>
        );
    }

    // Inline variant (original bottom-of-article style)
    return (
        <div className="mt-12 p-8 bg-secondary rounded-2xl">
            <div className="flex items-start gap-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                    {avatar ? (
                        <Image src={avatar} alt={name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <span className="font-serif text-2xl font-bold text-primary">
                                {name[0]}
                            </span>
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-1">
                        {name}
                    </h3>
                    {role && <p className="text-primary text-sm mb-2">{role}</p>}
                    {bio && (
                        <p className="text-muted-foreground">{bio}</p>
                    )}
                    {hasSocials && (
                        <div className="flex gap-1 mt-3">
                            {website && (
                                <SocialIcon href={website} label="Website">
                                    <Globe className="w-4 h-4" />
                                </SocialIcon>
                            )}
                            {socialTwitter && (
                                <SocialIcon href={socialTwitter} label="Twitter">
                                    {socialIcons.twitter}
                                </SocialIcon>
                            )}
                            {socialInstagram && (
                                <SocialIcon href={socialInstagram} label="Instagram">
                                    {socialIcons.instagram}
                                </SocialIcon>
                            )}
                            {socialYoutube && (
                                <SocialIcon href={socialYoutube} label="YouTube">
                                    {socialIcons.youtube}
                                </SocialIcon>
                            )}
                            {socialGithub && (
                                <SocialIcon href={socialGithub} label="GitHub">
                                    {socialIcons.github}
                                </SocialIcon>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
