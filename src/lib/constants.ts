export const ARTICLE_STATUSES = ["draft", "published", "scheduled", "archived"] as const;
export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];

export const PAGE_STATUSES = ["draft", "published"] as const;
export type PageStatus = (typeof PAGE_STATUSES)[number];

export const PAGE_TEMPLATES = ["default", "full-width", "contact", "blank"] as const;
export type PageTemplate = (typeof PAGE_TEMPLATES)[number];

export const CONTACT_STATUSES = ["new", "read", "replied"] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export const SUBSCRIBER_STATUSES = ["active", "unsubscribed"] as const;
export type SubscriberStatus = (typeof SUBSCRIBER_STATUSES)[number];

export const NAV_POSITIONS = ["header", "footer", "social"] as const;
export type NavPosition = (typeof NAV_POSITIONS)[number];

export const REDIRECT_TYPES = [301, 302] as const;
export type RedirectType = (typeof REDIRECT_TYPES)[number];

export const LOCALES = ["en", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const ROLES = ["admin", "editor", "viewer"] as const;

export const DEFAULT_PAGE_SIZE = 20;

export const SITE_URL = "https://www.rakudair.com";
export const SITE_NAME = "Rakuda Air";
