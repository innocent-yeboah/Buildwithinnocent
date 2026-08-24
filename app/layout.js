import "./globals.css";
import { Instrument_Serif, Inter } from "next/font/google";

import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/brand";

const inter = Inter({ subsets: ["latin"] });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

export const metadata = {
  metadataBase: new URL("https://buildwithinnocent.com"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "developer Accra",
    "custom software Ghana",
    "website for business Ghana",
    "Innocent Golden",
    "Build With Innocent",
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
      <body className={`${inter.className} ${instrument.variable} antialiased`}>{children}</body>
    </html>
  );
}
