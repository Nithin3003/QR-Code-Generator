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
    AutoGraph
} from "@mui/icons-material";
import RedirectClient from './redirect-client';

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
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, ml: { xs: 0, sm: 1 } }}>
                <Box sx={{ width: 32, height: 32, borderRadius: "8px", background: "linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)", display: "flex", alignItems: "center", justify: "center", color: "#fff" }}>
                    <AutoGraph sx={{ fontSize: 20 }} />
                </Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 800, letterSpacing: -0.5, fontSize: { xs: "1.2rem", md: "1.5rem" }, color: "#202124" }}>
                    Lumina<span style={{ color: "#1976d2" }}>QR</span>
                </Typography>
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
                <Box sx={{ mt: 6, width: "100%", height: 250, bgcolor: "#f8f9fa", border: "1px solid #dadce0", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                    <Typography variant="overline" sx={{ color: "#70757a", letterSpacing: 2, fontWeight: 700 }}>
                        Sponsored Transmission
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

type Props = {
    params: Promise<{ id: string }>;
};
