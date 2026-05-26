import "./globals.css";
import { Inter } from "next/font/google";

import { SiteChatWidget } from "@/components/SiteChatWidget";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/brand";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://buildwithinnocent.com"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "digital business systems Africa",
    "custom software Ghana",
    "web developer Ghana",
    "Accra software development",
    "WhatsApp automation",
    "business operating systems",
  ],
  authors: [{ name: "Innocent Golden" }],
  creator: "Innocent Golden",
  publisher: "Build With Innocent",
  robots: "index, follow",
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "https://buildwithinnocent.com",
    siteName: "Build With Innocent",
    locale: "en_GH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/images/logo-icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/icon.png",
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
        <SiteChatWidget />
      </body>
    </html>
  );
}
