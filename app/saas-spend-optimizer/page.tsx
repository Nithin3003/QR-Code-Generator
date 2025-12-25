import { Metadata } from 'next';
import SaasOptimizerClient from './SaasOptimizerClient';

export const metadata: Metadata = {
    title: "SaaS Spend Optimizer & Expense Tracker | Free B2B Tool",
    description: "Analyze your business software subscriptions, find hidden costs, and optimize SaaS spending. Upload CSV for instant analysis. Secure and free.",
    keywords: ["SaaS spend management", "software expense tracker", "B2B cost savings", "subscription manager", "shadow IT detector"],
    openGraph: {
        title: "SaaS Spend Optimizer - Cut Software Costs Instantly",
        description: "Upload your expense report and find thousands in savings. Free tool for startups and enterprises.",
        type: "website",
    }
};

export default function Page() {
    return <SaasOptimizerClient />;
}
