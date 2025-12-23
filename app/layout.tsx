import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LuminaQR - Free QR Code Generator | Fast & Reliable",
    template: "%s | LuminaQR"
  },
  description: "Generate high-quality QR codes instantly with LuminaQR. Free, fast, and serverless QR code generator. Create QR codes for URLs, text, WiFi, and more. No registration required.",
  keywords: [
    "QR code generator",
    "free QR code",
    "QR code maker",
    "create QR code",
    "generate QR code online",
    "QR code creator",
    "dynamic QR code",
    "URL shortener",
    "link shortener",
    "QR code scanner",
    "business QR code",
    "WiFi QR code",
    "vCard QR code"
  ],
  authors: [{ name: "LuminaQR Team" }],
  creator: "LuminaQR",
  publisher: "LuminaQR",
  manifest: "/manifest.json",

  // OpenGraph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lumina-qr.vercel.app",
    title: "LuminaQR - Free QR Code Generator",
    description: "Generate high-quality QR codes instantly. Free, fast, and serverless QR code generator for URLs, text, WiFi, and more.",
    siteName: "LuminaQR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LuminaQR - Free QR Code Generator"
      }
    ]
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "LuminaQR - Free QR Code Generator",
    description: "Generate high-quality QR codes instantly. Free, fast, and serverless.",
    images: ["/og-image.png"],
    creator: "@luminaqr"
  },

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },

  alternates: {
    canonical: "https://lumina-qr.vercel.app"
  },

  category: "Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* 7searchppc Verification */}
        <meta name="7searchppc" content="984482e6f5006ccb66e4205b1736541e" />

        {/* Ezoic Privacy Scripts - Load First */}
        <script
          data-cfasync="false"
          src="https://cmp.gatekeeperconsent.com/min.js"
        ></script>
        <script
          data-cfasync="false"
          src="https://the.gatekeeperconsent.com/cmp.min.js"
        ></script>

        {/* Ezoic Header Script */}
        <script async src="//www.ezojs.com/ezoic/sa.min.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.ezstandalone = window.ezstandalone || {};
              ezstandalone.cmd = ezstandalone.cmd || [];
            `
          }}
        />

        {/* Ad scripts removed - now loaded via components for better control */}
      </head>
      <body>
        {/* PropellerAds In-Page Push Container */}
        <div id="container-5f51a81584d19c2bdbde3b56bee480e0"></div>

        {/* PropellerAds Native Banner Container */}
        <div id="container-9b4e84791703585706cbeb6c94a84d84"></div>

        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <div className="min-h-screen">
              {children}
            </div>

            <div id="carbon-ads-placeholder" className="fixed bottom-4 right-4 z-50 opacity-50 hover:opacity-100 transition-opacity">
              {/* Ad Script would go here */}
              <div className="text-[10px] text-gray-500 border border-gray-800 bg-black px-2 py-1 rounded">
                ADS via Antigravity
              </div>
            </div>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
