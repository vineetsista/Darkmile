import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Darkmile — CRE Deal Intelligence",
    template: "%s | Darkmile",
  },
  description:
    "AI-powered deal intelligence for independent commercial real estate brokers. Every deed transfer, building permit, and opportunity alert — in your territory, before your competitors.",
  keywords: ["commercial real estate", "CRE", "deal intelligence", "property data", "Columbus OH"],
  authors: [{ name: "Darkmile" }],
  openGraph: {
    title: "Darkmile — Every Deal in Your Market. Before Your Competitors.",
    description:
      "AI-powered deal intelligence for independent CRE brokers. Daily briefings with deed transfers, permits, and opportunity alerts.",
    type: "website",
    siteName: "Darkmile",
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
