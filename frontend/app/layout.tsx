import type { Metadata } from "next";
import Layout from "@/components/Layout";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Momentumz — AI-Curated News",
    template: "%s | Momentumz",
  },
  description: "AI-curated global news summaries from trusted sources. Politics, tech, and science distilled into what matters.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL ||
    "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    title: "Momentumz",
    description: "AI-curated global news summaries from trusted sources.",
    siteName: "Momentumz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Momentumz",
    description: "AI-curated global news summaries from trusted sources.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
