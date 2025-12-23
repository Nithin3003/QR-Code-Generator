import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import "./globals.css";

export const metadata: Metadata = {
  title: "LuminaQR",
  description: "High-performance, Edge-native, Serverless QR Code Generator",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
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
