import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "iFluenter",
  description: "The universe to be fluent",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "iFluenter",
    description: "Master fluency in a virtual world.",
    url: "https://ifluenter.com",
    siteName: "iFluenter",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "iFluenter Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* <Script
          src="https://app.lemonsqueezy.com/js/lemon.js"
          defer
          strategy="afterInteractive"
        /> */}
      </head>
      <body className={`dark antialiased`}>{children}</body>
    </html>
  );
}
