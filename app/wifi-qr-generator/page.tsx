import { Metadata } from 'next';
import WifiQRClient from './WifiQRClient';

export const metadata: Metadata = {
    title: "Free WiFi QR Code Generator | Instant Connect for Cafes & Hotels",
    description: "Create WiFi Access QR codes instantly. Perfect for restaurants, hotels, and offices. No more password sharing. Safe, fast, and print-ready.",
    keywords: ["wifi qr code", "share wifi password", "qr code for wifi", "cafe wifi connect", "hotel guest wifi"],
    openGraph: {
        title: "WiFi QR Generator - Connect in One Scan",
        description: "Generate a scan-to-connect WiFi QR code for your guests instantly.",
        type: "website",
    }
};

export default function Page() {
    return <WifiQRClient />;
}
