import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Link Analytics | QR Code',
    description: 'Detailed analytics and scan statistics for your QR code or short link.',
    robots: {
        index: false, // Don't index individual stats pages
        follow: true,
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
