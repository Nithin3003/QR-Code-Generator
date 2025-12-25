import { Metadata } from 'next';
import VectorQRClient from './VectorQRClient';

export const metadata: Metadata = {
    title: "High Resolution QR Code Generator for Designers | Vector & SVG Compatible",
    description: "Create sharp, 300 DPI QR codes for print, packaging, and billboards. Designed for graphic designers and agencies. Free high-res downloads.",
    keywords: ["vector qr code", "high resolution qr", "print ready qr code", "svg qr generator", "qr code for designers"],
    openGraph: {
        title: "Vector QR Generator - Print Ready Quality",
        description: "The best QR generator for graphic designers. 300 DPI support.",
        type: "website",
    }
};

export default function Page() {
    return <VectorQRClient />;
}
