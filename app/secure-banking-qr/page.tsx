import { Metadata } from 'next';
import BankingQRClient from './BankingQRClient';

export const metadata: Metadata = {
    title: "Secure Banking QR Generator | Encrypted & Compliant for Finance",
    description: "Generate compliant, encrypted QR codes for banks, insurance agencies, and mortgage brokers. Secure document sharing and high-level encryption.",
    keywords: ["banking QR code", "secure QR generator", "financial document sharing", "encrypted QR", "insurance quote QR"],
    openGraph: {
        title: "Secure Banking QR - Fintech Grade Encryption",
        description: "The trusted QR generator for financial institutions and legal documents.",
        type: "website",
    }
};

export default function Page() {
    return <BankingQRClient />;
}
