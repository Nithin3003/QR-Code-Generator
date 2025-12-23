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
    const [mounted, setMounted] = useState(false);
    const [text, setText] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAd, setShowAd] = useState(false);
    const [adCountdown, setAdCountdown] = useState(5);
    const [alert, setAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
    const qrRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);

        // Initialize Ezoic ads after mount
        if (typeof window !== 'undefined' && (window as any).ezstandalone) {
            (window as any).ezstandalone.cmd.push(function () {
                (window as any).ezstandalone.showAds(101, 102, 103, 104, 105);
            });
        }
    }, []);

    // Countdown timer for ad
    useEffect(() => {
        if (showAd && adCountdown > 0) {
            const timer = setTimeout(() => setAdCountdown(adCountdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [showAd, adCountdown]);

    if (!mounted) return null;

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

                        {/* Ezoic Ad Placement 101 - Below Input */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
                            <div id="ezoic-pub-ad-placeholder-101"></div>
                        </Box>


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

                                        {/* PropellerAds In-Page Push will display here */}
                                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                            <Typography variant="caption" sx={{ color: '#999', fontSize: 10, letterSpacing: 1, mb: 2 }}>
                                                SPONSORED
                                            </Typography>
                                            <div id="container-5f51a81584d19c2bdbde3b56bee480e0"></div>
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

                                        {/* Ezoic Ad Placement 103 - In QR Result */}
                                        <Box sx={{ mt: 4, pt: 3, borderTop: '1px dashed #eee', display: 'flex', justifyContent: 'center' }}>
                                            <div id="ezoic-pub-ad-placeholder-103"></div>
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
                    {/* Ezoic Ad Placement 104 - Above Tools */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                        <div id="ezoic-pub-ad-placeholder-104"></div>
                    </Box>


                    <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', mb: 8 }}>More Tools for Creators</Typography>
                    <Grid container spacing={4}>
                        {[
                            { title: 'Dynamic Links', desc: 'Edit target URL without changing QR' },
                            { title: 'Analytics Pro', desc: 'Detailed scan reports and location data' },
                            { title: 'Custom Branding', desc: 'Add logos and brand colors to QRs' }
                        ].map((tool, i) => (
                            <Grid size={{ xs: 12, md: 4 }} key={i}>
                                <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: '1px solid #eee', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' } }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{tool.title}</Typography>
                                    <Typography variant="body2" sx={{ color: '#5f6368' }}>{tool.desc}</Typography>
                                    <Button sx={{ mt: 2, p: 0, textTransform: 'none', fontWeight: 600 }}>Coming Soon →</Button>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>


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
