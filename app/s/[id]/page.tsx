import { notFound } from 'next/navigation';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Container,
    IconButton,
    Avatar,
    Tooltip
} from "@mui/material";
import {
    Settings,
    AccountCircle,
} from "@mui/icons-material";
import RedirectClient from './redirect-client';
import { BrandLogo } from '@/components/BrandLogo';
import AdBanner300x250 from '@/components/AdBanner';

// Cloudflare Helper
async function getLink(key: string) {
    const accountId = process.env.CF_ACCOUNT_ID;
    const namespaceId = process.env.CF_NAMESPACE_ID;
    const token = process.env.CF_API_TOKEN;

    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`;

    const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
    });

    if (!res.ok) return null;
    return await res.text();
}

const Header = () => (
    <AppBar position="fixed" elevation={0} sx={{ bgcolor: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e0e0e0", color: "#1976d2" }}>
        <Toolbar sx={{ justifyContent: "space-between", minHeight: { xs: 56, md: 64 }, px: { xs: 1, sm: 2 } }}>
            <Box sx={{ ml: { xs: 0, sm: 1 } }}>
                <BrandLogo />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0, sm: 0.5 } }}>
                <Tooltip title="Settings">
                    <IconButton color="inherit" size="small" sx={{ color: "#5f6368" }}><Settings /></IconButton>
                </Tooltip>
                <IconButton color="inherit" sx={{ ml: 0.5 }}>
                    <Avatar sx={{ width: { xs: 28, md: 32 }, height: { xs: 28, md: 32 }, bgcolor: "#1976d2" }}>
                        <AccountCircle sx={{ fontSize: { xs: 20, md: 24 } }} />
                    </Avatar>
                </IconButton>
            </Box>
        </Toolbar>
    </AppBar>
);

export default async function InterstitialPage({ params }: Props) {
    const { id } = await params;
    const destination = await getLink(id);

    if (!destination) {
        return notFound();
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#fff", display: "flex", flexDirection: "column" }}>
            <Header />
            <Container maxWidth="sm" sx={{ mt: { xs: 12, md: 20 }, px: 3, pb: 10 }}>
                <RedirectClient
                    destination={destination}
                    shortId={id}
                />

                {/* AD PLACEHOLDER */}
                {/* AD - 300x250 */}
                <Box sx={{ mt: 6, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography variant="overline" sx={{ color: "#70757a", letterSpacing: 2, fontWeight: 700, mb: 2 }}>
                        Sponsored Transmission
                    </Typography>
                    <AdBanner300x250 />
                </Box>
            </Container>
        </Box>
    );
}

type Props = {
    params: Promise<{ id: string }>;
};
