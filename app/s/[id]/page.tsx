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
import { Grid } from "@mui/material";
import RedirectClient from './redirect-client';
import { BrandLogo } from '@/components/BrandLogo';
import { AdFrame } from "@/components/ads/AdFrame";
import { NativeAd } from "@/components/ads/NativeAd";

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

const TopAds = () => (
    <Box sx={{ mt: 10, display: 'flex', justifyContent: 'center' }}>
        {/* Desktop Leaderboard */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <AdFrame
                adLabel="4"
                width={728}
                height={90}
                adCode={`
                    <script type="text/javascript">
                        atOptions = {
                            'key' : 'b29ad6bfaa9af19133c9f78db0f3f771',
                            'format' : 'iframe',
                            'height' : 90,
                            'width' : 728,
                            'params' : {}
                        };
                    </script>
                    <script type="text/javascript" src="//www.highperformanceformat.com/b29ad6bfaa9af19133c9f78db0f3f771/invoke.js"></script>
                `}
            />
        </Box>
        {/* Mobile Banner */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <AdFrame
                adLabel="3"
                width={320}
                height={50}
                adCode={`
                    <script type="text/javascript">
                        atOptions = {
                            'key' : '54b7571156c573476acce06be6baa394',
                            'format' : 'iframe',
                            'height' : 50,
                            'width' : 320,
                            'params' : {}
                        };
                    </script>
                    <script type="text/javascript" src="//www.highperformanceformat.com/54b7571156c573476acce06be6baa394/invoke.js"></script>
                `}
            />
        </Box>
    </Box>
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

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10, px: 2 }}>
                {/* Left Sidebar Ad */}
                <Box sx={{ display: { xs: 'none', lg: 'block' }, position: 'fixed', left: 20, top: 100 }}>
                    <AdFrame
                        adLabel="1"
                        width={160}
                        height={600}
                        adCode={`
                            <script type="text/javascript">
                                atOptions = {
                                    'key' : '89f66e5408cb76f040257ec542ae678b',
                                    'format' : 'iframe',
                                    'height' : 600,
                                    'width' : 160,
                                    'params' : {}
                                };
                            </script>
                            <script type="text/javascript" src="//www.highperformanceformat.com/89f66e5408cb76f040257ec542ae678b/invoke.js"></script>
                        `}
                    />
                </Box>

                {/* Main Content */}
                <Container maxWidth="sm" sx={{ px: 3, pb: 10, mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TopAds />
                    <RedirectClient
                        destination={destination}
                        shortId={id}
                    />

                    {/* --- Ads 6, 7, 8 Grid (Stacked on Mobile) --- */}
                    <Box sx={{ mt: 8, width: '100%' }}>
                        <Grid container spacing={2} justifyContent="center">
                            {[6, 7, 8].map((label) => (
                                <Grid size={{ xs: 12 }} key={label} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <AdFrame
                                        adLabel={label.toString()}
                                        width={300}
                                        height={250}
                                        adCode={`
                                            <script type="text/javascript">
                                                atOptions = {
                                                    'key' : '67e830159b64ae4a1630b02bbab38e4b',
                                                    'format' : 'iframe',
                                                    'height' : 250,
                                                    'width' : 300,
                                                    'params' : {}
                                                };
                                            </script>
                                            <script type="text/javascript" src="//www.highperformanceformat.com/67e830159b64ae4a1630b02bbab38e4b/invoke.js"></script>
                                        `}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* --- Native Ad (Ad Label 5) --- */}
                    <Box sx={{ mt: 8 }}>
                        <NativeAd adLabel="5" />
                    </Box>
                </Container>

                {/* Right Sidebar Ad */}
                <Box sx={{ display: { xs: 'none', lg: 'block' }, position: 'fixed', right: 20, top: 100 }}>
                    <AdFrame
                        adLabel="2"
                        width={300}
                        height={250}
                        adCode={`
                            <script type="text/javascript">
                                atOptions = {
                                    'key' : '67e830159b64ae4a1630b02bbab38e4b',
                                    'format' : 'iframe',
                                    'height' : 250,
                                    'width' : 300,
                                    'params' : {}
                                };
                            </script>
                            <script type="text/javascript" src="//www.highperformanceformat.com/67e830159b64ae4a1630b02bbab38e4b/invoke.js"></script>
                        `}
                    />
                </Box>
            </Box>
        </Box>
    );
}

type Props = {
    params: Promise<{ id: string }>;
};
