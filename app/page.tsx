"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    TextField,
    Box,
    Container,
    IconButton,
    Paper,
    CircularProgress,
    Stack,
    Avatar,
    Tooltip,
    Snackbar,
    Alert,
    Divider,
    Grid
} from "@mui/material";
import {
    HelpOutline,
    Settings,
    Apps,
    AccountCircle,
    Add,
    Download,
    ContentCopy,
    AutoGraph,
    Speed,
    Security
} from "@mui/icons-material";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/BrandLogo";
import AdBanner300x250, { NativeBanner, AdBanner728x90, PopunderAd, SocialBar, AdTagZone, PropellerPushNotifications, PropellerVignetteBanner, PropellerInPagePush, PropellerOnClickPopunder } from "@/components/AdBanner";

// --- Header Component ---
const Header = () => (
    <AppBar position="fixed" elevation={0} sx={{ bgcolor: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e0e0e0", color: "#1976d2" }}>
        <Toolbar sx={{ justifyContent: "space-between", minHeight: { xs: 56, md: 64 }, px: { xs: 1, sm: 2 } }}>
            <Box sx={{ ml: { xs: 0, sm: 1 } }}>
                <BrandLogo />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0, sm: 0.5 } }}>
                <Button sx={{ display: { xs: 'none', md: 'inline-flex' }, mr: 1, color: "#5f6368", textTransform: "none", fontWeight: 500 }}>Products</Button>
                <Button sx={{ display: { xs: 'none', md: 'inline-flex' }, mr: 2, color: "#5f6368", textTransform: "none", fontWeight: 500 }}>Pricing</Button>
                <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: "center", display: { xs: 'none', md: 'block' } }} />
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

const ActivityTicker = () => {
    const activities = [
        "Someone in India created a Dynamic QR",
        "New Wifi QR generated in Germany",
        "Business Card QR scanned in USA",
        "vCard created in UK",
        "Analytics report viewed in Brazil"
    ];

    return (
        <Box sx={{ width: '100%', overflow: 'hidden', bgcolor: '#f8f9fa', py: 1, borderTop: '1px solid #eee', position: 'fixed', bottom: 0 }}>
            <motion.div
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                style={{ display: 'flex', whiteSpace: 'nowrap', gap: '4rem' }}
            >
                {[...activities, ...activities].map((text, i) => (
                    <Typography key={i} variant="caption" sx={{ color: '#5f6368', fontWeight: 500 }}>
                        {text}
                    </Typography>
                ))}
            </motion.div>
        </Box>
    );
};


export default function CreatorPage() {
    const [text, setText] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAd, setShowAd] = useState(false);
    const [adCountdown, setAdCountdown] = useState(5);
    const [alert, setAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
    const qrRef = useRef<HTMLDivElement>(null);

    // Countdown timer for ad
    useEffect(() => {
        if (showAd && adCountdown > 0) {
            const timer = setTimeout(() => setAdCountdown(adCountdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [showAd, adCountdown]);

    const skipAd = () => {
        setShowAd(false);
        setAdCountdown(5);
    };

    const handleDownload = () => {
        const canvas = qrRef.current?.querySelector("canvas");
        if (canvas) {
            const url = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = url;
            a.download = "lumina-qr.png";
            a.click();
        }
    };

    const handleCreate = async () => {
        if (!text) return;

        // Auto-add https:// if missing
        let processedUrl = text.trim();
        if (!/^https?:\/\//i.test(processedUrl)) {
            processedUrl = `https://${processedUrl}`;
            setText(processedUrl);
        }

        setLoading(true);
        setShortUrl("");

        try {
            const res = await fetch("/api/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: processedUrl }),
            });

            if (!res.ok) throw new Error("Service is temporarily busy. Please try again.");

            const data = await res.json();
            if (data.shortUrl) {
                setShortUrl(data.shortUrl);
                setShowAd(true); // Show ad before QR
                setAdCountdown(5); // Reset countdown
                setAlert({ open: true, message: "QR Code generated successfully!", severity: 'success' });
            } else {
                throw new Error(data.error || "Failed to generate QR");
            }
        } catch (e: any) {
            console.error(e);
            setAlert({ open: true, message: e.message || "Network error occurred", severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (shortUrl) {
            navigator.clipboard.writeText(shortUrl);
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#fff", display: "flex", flexDirection: "column" }}>
            {/* Popunder Ad REMOVED for better UX */}
            {/* <PopunderAd /> */}

            {/* Social Bar - Sticky bottom */}
            <SocialBar />

            {/* Ad Tag Zone - zone 195419 */}
            <AdTagZone />

            {/* PropellerAds Zones */}
            <PropellerPushNotifications />
            {/* <PropellerVignetteBanner /> */}
            <PropellerInPagePush />
            {/* OnClick Popunder REMOVED for better UX */}

            <Header />

            <Container maxWidth="lg" sx={{ pt: { xs: 10, md: 15 }, pb: 12, flex: 1 }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 6, md: 8 }, alignItems: "flex-start" }}>

                    {/* Left: Input & Hero */}
                    <Box sx={{ flex: 1.2 }}>
                        <Typography
                            variant="h1"
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: "2.5rem", md: "4rem" },
                                color: "#202124",
                                mb: 2,
                                letterSpacing: "-0.04em",
                                lineHeight: 1.1
                            }}
                        >
                            The Gold Standard for <br />
                            <span style={{ color: "#1976d2" }}>QR Generation.</span>
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ color: "#5f6368", mb: 8, fontWeight: 400, fontSize: "1.2rem", maxWidth: 500 }}
                        >
                            High-speed, trackable, and infinitely scalable. Built for modern brands and global creators.
                        </Typography>

                        <Paper
                            elevation={0}
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                alignItems: "center",
                                gap: 1,
                                p: 1,
                                borderRadius: 10,
                                border: "1px solid #dadce0",
                                maxWidth: 700,
                                transition: "all 0.3s ease",
                                "&:hover": { borderColor: "#1976d2", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }
                            }}
                        >
                            <Box sx={{ display: "flex", flex: 1, alignItems: "center", gap: 1, width: "100%" }}>
                                <Box sx={{ display: { xs: 'none', lg: 'flex' }, ml: 2, alignItems: 'center', color: '#1976d2' }}>
                                    <Add sx={{ fontSize: 20 }} />
                                </Box>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    placeholder="Paste your link here..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                                    InputProps={{
                                        disableUnderline: true,
                                        sx: { fontSize: "1.1rem", px: 2, py: 1, color: "#3c4043" }
                                    }}
                                />
                            </Box>
                            <Button
                                variant="contained"
                                fullWidth={true}
                                onClick={handleCreate}
                                disabled={loading || !text}
                                sx={{
                                    borderRadius: { xs: 4, sm: 8 },
                                    px: { xs: 2, sm: 5 },
                                    py: 2,
                                    bgcolor: "#1976d2",
                                    color: "#fff",
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    fontWeight: 700,
                                    boxShadow: "0 4px 10px rgba(25,118,210,0.3)",
                                    "&:hover": { bgcolor: "#1565c0", transform: "translateY(-1px)", boxShadow: "0 6px 15px rgba(25,118,210,0.4)" },
                                    "&:disabled": { bgcolor: "#f1f3f4", color: "#bdc1c6" },
                                    width: { xs: "100%", sm: "auto" }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "GENERATE NOW"}
                            </Button>
                        </Paper>


                        {/* Featured Tools / Credibility Section */}
                        <Box sx={{ mt: 10 }}>
                            <Typography variant="overline" sx={{ color: "#70757a", letterSpacing: "0.1em", fontWeight: 700 }}>
                                WHY CHOOSE LUMINA
                            </Typography>
                            <Grid container spacing={4} sx={{ mt: 1 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Speed sx={{ color: "#1976d2" }} />
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Instant Edge Generation</Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Security sx={{ color: "#1976d2" }} />
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Zero Data Tracking</Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <AutoGraph sx={{ color: "#1976d2" }} />
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Real-time Analytics</Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* ========== COMPREHENSIVE AD ZONE - After Hero Section ========== */}
                        <Box
                            sx={{
                                my: 6,
                                p: 3,
                                borderRadius: 4,
                                bgcolor: 'rgba(0,0,0,0.01)',
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    display: 'block',
                                    textAlign: 'center',
                                    color: '#999',
                                    fontSize: 9,
                                    letterSpacing: 2,
                                    mb: 3,
                                    opacity: 0.6
                                }}
                            >
                                SPONSORED CONTENT - SUPPORT FREE SERVICES
                            </Typography>

                            {/* 728x90 Leaderboard - Top - MOVED TO BOTTOM */}

                            {/* 300x250 Banner #1 */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                                <AdBanner300x250 placement="hero-300-1" />
                            </Box>

                            {/* Native Banner - 4 images */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                                <NativeBanner placement="hero-native" />
                            </Box>

                            {/* 300x250 Banner #2 */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                                <AdBanner300x250 placement="hero-300-2" />
                            </Box>

                            {/* 728x90 Leaderboard - Bottom */}
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <AdBanner728x90 placement="hero-bottom" />
                            </Box>
                        </Box>
                    </Box>

                    {/* Right: QR Canvas & Illustration Style Result */}
                    <Box sx={{ flex: 0.8, width: "100%", position: 'relative', display: 'flex', justifyContent: 'center', minHeight: 400 }}>
                        <AnimatePresence mode="wait">
                            {!shortUrl && !loading ? (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="w-full h-[400px] rounded-3xl border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden relative"
                                    style={{ background: 'radial-gradient(circle at center, #f8faff 0%, #fff 100%)' }}
                                >
                                    <Box sx={{ textAlign: 'center', opacity: 0.4 }}>
                                        <Box sx={{ fontSize: 60, mb: 1 }}>✨</Box>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Your QR will appear here</Typography>
                                    </Box>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                        className="absolute inset-0 opacity-[0.03]"
                                        style={{ border: '2px solid #1976d2', borderRadius: '50%', margin: '20px' }}
                                    />
                                </motion.div>
                            ) : loading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center h-[400px]"
                                >
                                    <CircularProgress size={60} thickness={2} sx={{ color: '#1976d2' }} />
                                    <Typography variant="body2" sx={{ mt: 2, color: '#5f6368', fontWeight: 500 }}>
                                        Crafting your QR...
                                    </Typography>
                                </motion.div>
                            ) : showAd ? (
                                <motion.div
                                    key="ad-interstitial"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="w-full"
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: { xs: 3, sm: 5 },
                                            borderRadius: 8,
                                            bgcolor: "#000",
                                            textAlign: "center",
                                            width: "100%",
                                            maxWidth: { xs: "100%", sm: 380 },
                                            mx: "auto",
                                            position: 'relative',
                                            overflow: "hidden",
                                            minHeight: 400,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        {/* Skip Button - Top Right */}
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                            <Button
                                                onClick={skipAd}
                                                disabled={adCountdown > 0}
                                                variant="contained"
                                                size="small"
                                                sx={{
                                                    bgcolor: adCountdown === 0 ? '#fff' : 'rgba(255,255,255,0.3)',
                                                    color: adCountdown === 0 ? '#000' : '#fff',
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    fontSize: '0.75rem',
                                                    borderRadius: 2,
                                                    px: 2,
                                                    py: 0.5,
                                                    '&:hover': {
                                                        bgcolor: adCountdown === 0 ? '#f5f5f5' : 'rgba(255,255,255,0.4)'
                                                    },
                                                    '&:disabled': {
                                                        bgcolor: 'rgba(255,255,255,0.3)',
                                                        color: '#fff'
                                                    }
                                                }}
                                            >
                                                {adCountdown > 0 ? `Skip in ${adCountdown}s` : 'Skip Ad →'}
                                            </Button>
                                        </Box>

                                        {/* Ad Content - Show multiple ads during 5 seconds */}
                                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
                                            <Typography variant="caption" sx={{ color: '#fff', fontSize: 10, letterSpacing: 1.5, mb: 1, opacity: 0.8 }}>
                                                SPONSORED CONTENT
                                            </Typography>

                                            {/* Show different ads based on countdown */}
                                            {adCountdown > 3 ? (
                                                <AdBanner300x250 placement="interstitial-1" />
                                            ) : adCountdown > 0 ? (
                                                <Box sx={{ width: '100%', maxWidth: 360 }}>
                                                    <NativeBanner placement="interstitial-2" />
                                                </Box>
                                            ) : (
                                                <AdBanner300x250 placement="interstitial-3" />
                                            )}
                                        </Box>

                                        {/* Info Text */}
                                        <Typography variant="caption" sx={{ color: '#999', mt: 2 }}>
                                            Your QR code will be revealed after the ad
                                        </Typography>
                                    </Paper>
                                </motion.div>
                            ) : (

                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: { xs: 3, sm: 5 },
                                            borderRadius: 8,
                                            bgcolor: "#fff",
                                            textAlign: "center",
                                            border: "1px solid #1976d220",
                                            boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
                                            width: "100%",
                                            maxWidth: { xs: "100%", sm: 380 },
                                            mx: "auto",
                                            position: 'relative',
                                            overflow: "hidden"
                                        }}
                                        ref={qrRef}
                                    >
                                        <Box sx={{
                                            p: 3,
                                            bgcolor: "#fff",
                                            borderRadius: 6,
                                            mb: 4,
                                            border: "4px solid #f8f9fa",
                                            display: "inline-block",
                                            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)'
                                        }}>
                                            <QRCodeCanvas
                                                value={shortUrl}
                                                size={240}
                                                level="H"
                                                style={{ width: "100%", height: "auto" }}
                                            />
                                        </Box>

                                        <Typography variant="h5" sx={{ fontWeight: 800, color: "#202124", mb: 1 }}>
                                            Success! 🚀
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#5f6368", mb: 4, px: 2 }}>
                                            Your high-resolution QR code is ready. Share it directly or download it for print.
                                        </Typography>

                                        <Stack direction="row" spacing={2} justifyContent="center">
                                            <Button
                                                variant="contained"
                                                startIcon={<Download />}
                                                onClick={handleDownload}
                                                sx={{
                                                    borderRadius: 4,
                                                    textTransform: "none",
                                                    fontWeight: 700,
                                                    bgcolor: "#1976d2",
                                                    boxShadow: "none",
                                                    flex: 1,
                                                    py: 1.5
                                                }}
                                            >
                                                Download
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                startIcon={<ContentCopy />}
                                                onClick={copyToClipboard}
                                                sx={{
                                                    borderRadius: 4,
                                                    textTransform: "none",
                                                    fontWeight: 700,
                                                    borderColor: "#dadce0",
                                                    color: "#3c4043",
                                                    flex: 1,
                                                    py: 1.5
                                                }}
                                            >
                                                Copy
                                            </Button>
                                        </Stack>

                                        {/* Ad Placement 3 - In QR Result */}
                                        <Box sx={{ mt: 4, pt: 3, borderTop: '1px dashed #eee', display: 'flex', justifyContent: 'center' }}>
                                            <AdBanner300x250 placement="qr-result" />
                                        </Box>

                                    </Paper>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Box>
                </Box>
            </Container >

            {/* Featured Tools Section below fold */}
            <Box sx={{ borderTop: '1px solid #f1f3f4', bgcolor: '#fff', py: 12 }}>

                <Container maxWidth="lg">
                    {/* Ad Placement - Native Banner Above Tools */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                        <NativeBanner placement="above-tools" />
                    </Box>


                    {/* Ad Placement - Leaderboard (Moved from Top) */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
                        <AdBanner728x90 placement="more-tools-header" />
                    </Box>

                    <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', mb: 8 }}>More Tools for Creators</Typography>
                    <Grid container spacing={4}>
                        {[
                            { title: 'WiFi QR Generator', desc: 'Create instant WiFi access codes for customers', link: '/wifi-qr-generator', status: 'NEW' },
                            { title: 'Crypto Payment QR', desc: 'Accept Bitcoin & Crypto payments securely', link: '/crypto-payment-qr', status: 'HOT' },
                            { title: 'Vector QR for Designers', desc: 'Print-ready high resolution codes', link: '/vector-qr-for-designers', status: 'PRO' },
                            { title: 'Secure Banking QR', desc: 'Encrypted codes for mortgage & finance', link: '/secure-banking-qr', status: 'ENTERPRISE' },
                            { title: 'Legal Document QR', desc: 'Case management for law firms', link: '/legal-document-qr', status: 'LEGAL' },
                            { title: 'SaaS Spend Optimizer', desc: 'Find unused subscriptions in 1 click', link: '/saas-spend-optimizer', status: 'B2B SAVER' }
                        ].map((tool, i) => (
                            <Grid size={{ xs: 12, md: 4 }} key={i}>
                                <Paper
                                    component="a"
                                    href={tool.link}
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        borderRadius: 6,
                                        border: '1px solid #eee',
                                        transition: 'all 0.3s',
                                        display: 'block',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', borderColor: '#1976d2' }
                                    }}
                                >
                                    {tool.status && (
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                            px: 1,
                                            py: 0.5,
                                            bgcolor: tool.status === 'NEW' ? '#e3f2fd' : tool.status === 'HOT' ? '#fff3e0' : '#f3f3f3',
                                            color: tool.status === 'NEW' ? '#1976d2' : tool.status === 'HOT' ? '#e65100' : '#666',
                                            fontSize: 10,
                                            fontWeight: 700,
                                            borderRadius: 1
                                        }}>
                                            {tool.status}
                                        </Box>
                                    )}
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{tool.title}</Typography>
                                    <Typography variant="body2" sx={{ color: '#5f6368' }}>{tool.desc}</Typography>
                                    {tool.link !== '#' && <Typography variant="caption" sx={{ mt: 2, display: 'block', color: '#1976d2', fontWeight: 600 }}>Try Now →</Typography>}
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Ad Placement 5 - Below Tools */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                        <AdBanner300x250 placement="below-tools" />
                    </Box>

                </Container>
            </Box >

            <ActivityTicker />

            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={() => setAlert({ ...alert, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} variant="filled" sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </Box >
    );
}
