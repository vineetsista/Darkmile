import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Darkmile — CRE Deal Intelligence",
    template: "%s | Darkmile",
  },
  description:
    "AI-powered deal intelligence for independent commercial real estate brokers. Every deed transfer, building permit, and opportunity alert — in your territory, before your competitors.",
  keywords: ["commercial real estate", "CRE", "deal intelligence", "property data", "Columbus OH", "AI", "signal intelligence"],
  authors: [{ name: "Darkmile" }],
  openGraph: {
    title: "Darkmile — Every Deal in Your Market. Before Your Competitors.",
    description:
      "AI-powered deal intelligence for independent CRE brokers. Daily briefings with deed transfers, permits, and opportunity alerts.",
    type: "website",
    siteName: "Darkmile",
    images: [{ url: "/og.svg", width: 1280, height: 640, alt: "Darkmile — signal intelligence for CRE brokers" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Darkmile — CRE Deal Intelligence",
    description: "Every deed transfer, permit, and opportunity alert in your territory — scored, ranked, and delivered before your competition sees it.",
    images: ["/og.svg"],
  },
  icons: {
    icon: "/og.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#06040A",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased" style={{ background: "var(--void)", color: "var(--text-primary)" }}>
        {children}
      </body>
    </html>
  );
}
