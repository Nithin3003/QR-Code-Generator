import type { Metadata } from "next";
import Script from "next/script";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import SchemaJsonLd from "@/components/SchemaJsonLd";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "QR Code - Free QR Code Generator | Fast & Reliable",
    template: "%s | QR Code"
  },
  description: "Generate high-quality QR codes instantly. Free, fast, and serverless QR code generator. Create QR codes for URLs, text, WiFi, and more. No registration required.",
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
  authors: [{ name: "QR Code Team" }],
  creator: "QR Code",
  publisher: "QR Code",
  manifest: "/manifest.json",
  themeColor: "#1976d2",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "QR Code",
  },
  icons: {
    icon: "/pwa-icon.png",
    apple: "/pwa-icon.png",
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE_HERE", // TODO: User to check Google Search Console for this code
    other: {
      clckd: 'd5c826720f26284f291350170461876e',
    },
  },

  // OpenGraph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "http://free-qrcode.nithinms.cv",
    title: "QR Code - Free QR Code Generator",
    description: "Generate high-quality QR codes instantly. Free, fast, and serverless QR code generator for URLs, text, WiFi, and more.",
    siteName: "QR Code",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QR Code - Free QR Code Generator"
      }
    ]
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "QR Code - Free QR Code Generator",
    description: "Generate high-quality QR codes instantly. Free, fast, and serverless.",
    images: ["/og-image.png"],
    creator: "@qrcode"
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


  alternates: {
    canonical: "http://free-qrcode.nithinms.cv"
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
      <body>
        <SchemaJsonLd />

        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <div className="min-h-screen">
              {children}
            </div>
          </ThemeProvider>
        </AppRouterCacheProvider>



        {/* SocialBar Ad Implementation */}
        <Script
          id="socialbar-ad"
          src="//pl25586221.effectivegatecpm.com/de/62/1d/de621d9659b85141042780e157776100.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
