import type { Metadata } from "next";
import { Suspense } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist, Geist_Mono, Inter, Bebas_Neue, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-display" });

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto-sans' });

const notoSerifJP = Noto_Serif_JP({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-noto-serif' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://www.rakudair.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rakuda Air — Japanese Travel Blog",
    template: "%s | Rakuda Air",
  },
  description:
    "Rakuda Air (らくだエア) is a travel blog dedicated to exploring Japan — from hidden temples and ryokan retreats to bustling Tokyo streets and serene mountain trails.",
  keywords: [
    "Japan travel",
    "Japanese travel blog",
    "Rakudair",
    "Rakuda Air",
    "Japan guide",
    "Tokyo",
    "Kyoto",
    "Japanese culture",
    "travel Japan",
    "Japan tips",
  ],
  authors: [{ name: "Rakuda Air" }],
  creator: "Rakuda Air",
  publisher: "Rakuda Air",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ja_JP"],
    url: siteUrl,
    siteName: "Rakuda Air",
    title: "Rakuda Air — Japanese Travel Blog",
    description:
      "Discover Japan through the eyes of a traveller. Stories, guides, and inspiration for your next Japanese adventure.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rakuda Air — Japanese Travel Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rakuda Air — Japanese Travel Blog",
    description:
      "Discover Japan through the eyes of a traveller. Stories, guides, and inspiration for your next Japanese adventure.",
    images: ["/og-image.jpg"],
    creator: "@rakudair",
    site: "@rakudair",
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": siteUrl,
      "ja-JP": `${siteUrl}/ja`,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable, bebasNeue.variable, notoSansJP.variable, notoSerifJP.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <QueryProvider>
            <TooltipProvider>
              <Suspense>
                {children}
              </Suspense>
            </TooltipProvider>
          </QueryProvider>
          <Toaster richColors position="top-right" />
        </ClerkProvider>
      </body>
      <GoogleAnalytics gaId="G-Z6KPXL8DJX" />
    </html>
  );
}
