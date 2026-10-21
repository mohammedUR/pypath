import type { Metadata, Viewport } from "next";
import nextDynamic from "next/dynamic";
import "./globals.css";
const Toaster = nextDynamic(() => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })));

/**
 * PyPath — بايثون إلى الاحتراف
 * Single-route shell: all navigation is client-side (hash routing, ADR-0007).
 * <html> lang/dir/data-theme are managed at runtime by the client root (AppRoot).
 * System font stacks only (no network fonts) — see src/styles/tokens.css.
 */
export const metadata: Metadata = {
  title: "PyPath — بايثون إلى الاحتراف",
  description:
    "Interactive bilingual (Arabic/English) Python & AI learning platform. Learn Python in your browser — local-first, calm, and warm.",
  icons: { icon: "/logo.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
