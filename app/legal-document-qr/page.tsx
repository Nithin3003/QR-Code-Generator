import { Metadata } from 'next';
import LegalQRClient from './LegalQRClient';

export const metadata: Metadata = {
    title: "Legal QR Code Generator for Law Firms | Secure Case Management",
    description: "Professional QR code solutions for attorneys and law firms. Share discovery documents, client intake forms, and case files securely.",
    keywords: ["legal QR code", "attorney QR generator", "law firm case management", "legal document sharing", "secure QR for lawyers"],
    openGraph: {
        title: "Legal QR Solutions - Secure Case Management",
        description: "Streamline client intake and document discovery with professional QR codes.",
        type: "website",
    }
};

export default function Page() {
    return <LegalQRClient />;
}
