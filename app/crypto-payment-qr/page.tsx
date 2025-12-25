import { Metadata } from 'next';
import CryptoQRClient from './CryptoQRClient';

export const metadata: Metadata = {
    title: "Crypto Payment QR Generator | Bitcoin, Ethereum & USDT",
    description: "Generate static QR codes for cryptocurrency payments. Accept Bitcoin, Ethereum, Solana, and USDT instantly. Secure, fast, and no fees.",
    keywords: ["crypto qr generator", "bitcoin qr code", "ethereum payment qr", "usdt qr code", "accept crypto payments"],
    openGraph: {
        title: "Crypto QR Payment Generator - Accept Bitcoin Instantly",
        description: "Generate professional payment QR codes for your crypto wallet.",
        type: "website",
    }
};

export default function Page() {
    return <CryptoQRClient />;
}
