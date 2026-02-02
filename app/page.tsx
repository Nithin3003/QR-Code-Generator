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
    Settings,
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
import { AdFrame } from "@/components/ads/AdFrame";
import { NativeAd } from "@/components/ads/NativeAd";


// --- Header Component ---
const Header = () => (
    <AppBar position="fixed" elevation={0} sx={{ bgcolor: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e0e0e0", color: "#1976d2" }}>
        <Toolbar sx={{ justifyContent: "space-between", minHeight: { xs: 56, md: 64 }, px: { xs: 1, sm: 2 } }}>
            <Box sx={{ ml: { xs: 0, sm: 1 } }}>
                <BrandLogo />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0, sm: 0.5 } }}>
                <Button href="/dashboard" sx={{ display: { xs: 'none', md: 'inline-flex' }, mr: 1, color: "#1976d2", textTransform: "none", fontWeight: 700 }}>Your Dashboard</Button>
                <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: "center", display: { xs: 'none', md: 'block' } }} />
                <Tooltip title="Settings">
                    <IconButton color="inherit" size="small" sx={{ color: "#5f6368" }} suppressHydrationWarning><Settings /></IconButton>
                </Tooltip>
                <IconButton color="inherit" sx={{ ml: 0.5 }} suppressHydrationWarning>
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
        <Box sx={{ width: '100%', overflow: 'hidden', bgcolor: '#f8f9fa', py: 1, borderTop: '1px solid #eee', position: 'fixed', bottom: 0, zIndex: 1200 }}>
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
    const [email, setEmail] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
    const qrRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const canvas = qrRef.current?.querySelector("canvas");
        if (canvas) {
            const url = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = url;
            a.download = "qr-code.png";
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
                body: JSON.stringify({ url: processedUrl, email }),
            });

            if (!res.ok) throw new Error("Service is temporarily busy. Please try again.");

            const data = await res.json();

            // Save to LocalStorage for "My QRs" dashboard
            try {
                const newQr = {
                    id: data.shortId,
                    url: processedUrl,
                    email: email, // Optional
                    createdAt: new Date().toISOString(),
                    shortUrl: data.shortUrl
                };

                const existing = JSON.parse(localStorage.getItem('my_qrs') || '[]');
                // UPSERT: Remove existing with same ID, then add new one to top
                const filtered = existing.filter((q: any) => q.id !== data.shortId);
                localStorage.setItem('my_qrs', JSON.stringify([newQr, ...filtered]));
            } catch (e) {
                console.error("Failed to save to local history", e);
            }

            if (data.shortUrl) {
                setShortUrl(data.shortUrl);
                setAlert({ open: true, message: "QR Code created successfully!", severity: "success" });
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

    const handleUpdateEmail = async () => {
        if (!email || !shortUrl) return;
        const shortId = shortUrl.split('/').pop();

        try {
            setLoading(true);
            const res = await fetch("/api/update-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ shortId, email }),
            });

            if (!res.ok) throw new Error("Failed to link email. Please try again.");

            // Update local storage
            const existing = JSON.parse(localStorage.getItem('my_qrs') || '[]');
            const updated = existing.map((q: any) => q.id === shortId ? { ...q, email } : q);
            localStorage.setItem('my_qrs', JSON.stringify(updated));

            setAlert({ open: true, message: "Email linked! Tracking is now active.", severity: "success" });
        } catch (e: any) {
            setAlert({ open: true, message: e.message, severity: 'error' });
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

            {/* --- Left Sidebar Ad (Always Visible for Testing) --- */}
            <Box sx={{
                display: 'block',
                position: 'fixed',
                left: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 100
            }}>
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

            {/* --- Right Sidebar Ad (Always Visible for Testing) --- */}
            <Box sx={{
                display: 'flex',
                position: 'fixed',
                right: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 100,
                flexDirection: 'column',
                gap: 2
            }}>
                <AdFrame
                    adLabel="2"
                    width={160}
                    height={300}
                    adCode={`
                        <script type="text/javascript">
                            atOptions = {
                                'key' : '594741aa5ed9ccc237ebaa546c1ffee3',
                                'format' : 'iframe',
                                'height' : 300,
                                'width' : 160,
                                'params' : {}
                            };
                        </script>
                        <script type="text/javascript" src="//www.highperformanceformat.com/594741aa5ed9ccc237ebaa546c1ffee3/invoke.js"></script>
                    `}
                />
            </Box>


            <Container maxWidth="lg" sx={{ pt: { xs: 10, md: 15 }, pb: 12, flex: 1 }}>

                {/* Mobile Ad Banner (Always Visible for Testing) */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
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
                            <span style={{ color: "#1976d2" }}>Free QR Generation.</span>
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ color: "#5f6368", mb: 8, fontWeight: 400, fontSize: "1.2rem", maxWidth: 500 }}
                        >
                            Completely free, high-speed, trackable, and infinitely scalable. Built for modern brands and global creators. No credit card required.
                        </Typography>

                        <Paper
                            elevation={0}
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                alignItems: "center",
                                gap: 0,
                                p: { xs: 1, md: "6px" },
                                borderRadius: 12,
                                border: "1px solid #e0e4e9",
                                bgcolor: "#fff",
                                maxWidth: 800,
                                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:focus-within": { borderColor: "#1976d2", boxShadow: "0 10px 40px rgba(25,118,210,0.12)" }
                            }}
                        >
                            <Box sx={{ display: "flex", flex: 1, alignItems: "center", width: "100%" }}>
                                <Box sx={{ display: 'flex', ml: 2, mr: 1, alignItems: 'center', color: '#1976d2' }}>
                                    <Add sx={{ fontSize: 24, fontWeight: 300 }} />
                                </Box>
                                <Divider orientation="vertical" flexItem sx={{ height: 32, my: 1, mr: 2, bgcolor: '#f1f3f4' }} />
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    placeholder="Paste your link here..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                                    InputProps={{
                                        disableUnderline: true,
                                        sx: { fontSize: "1.15rem", py: 1.5, color: "#202124", fontWeight: 400 }
                                    }}
                                    inputProps={{
                                        suppressHydrationWarning: true
                                    }}
                                />
                            </Box>

                            <Button
                                variant="contained"
                                fullWidth={true}
                                onClick={handleCreate}
                                disabled={loading || !text}
                                sx={{
                                    borderRadius: 10,
                                    px: { xs: 2, sm: 6 },
                                    py: { xs: 1.5, sm: 2 },
                                    bgcolor: "#1976d2",
                                    color: "#fff",
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    fontWeight: 700,
                                    boxShadow: "0 4px 10px rgba(25,118,210,0.3)",
                                    "&:hover": { bgcolor: "#1565c0", transform: "translateY(-1px)", boxShadow: "0 6px 15px rgba(25,118,210,0.4)" },
                                    "&:disabled": { bgcolor: "#f1f3f4", color: "#bdc1c6" },
                                    width: { xs: "100%", md: "auto" }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "GENERATE NOW"}
                            </Button>
                        </Paper>

                        {/* Featured Tools / Credibility Section */}
                        <Box sx={{ mt: 8 }}>
                            <Typography variant="overline" sx={{ color: "#70757a", letterSpacing: "0.1em", fontWeight: 700 }}>
                                WHY CHOOSE QR CODE
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
                                    </Paper>

                                    {/* Tracking Setup Memo/Pop */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ delay: 0.6, type: 'spring', stiffness: 100 }}
                                    >
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                mt: 4,
                                                p: 0,
                                                borderRadius: 8,
                                                overflow: 'hidden',
                                                border: "1px solid #1976d215",
                                                background: "linear-gradient(135deg, #fff 0%, #f0f7ff 100%)",
                                                textAlign: 'left',
                                                maxWidth: 400,
                                                mx: 'auto',
                                                boxShadow: "0 15px 35px rgba(25,118,210,0.08)",
                                                position: 'relative'
                                            }}
                                        >
                                            <Box sx={{ p: 3 }}>
                                                <Stack spacing={2.5}>
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                        <Box
                                                            sx={{
                                                                width: 48,
                                                                height: 48,
                                                                borderRadius: 4,
                                                                bgcolor: '#1976d2',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: '0 8px 16px rgba(25,118,210,0.2)'
                                                            }}
                                                        >
                                                            <AutoGraph sx={{ color: '#fff', fontSize: 28 }} />
                                                        </Box>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                                <Typography variant="subtitle1" fontWeight={900} color="#1a1a1a" sx={{ letterSpacing: '-0.02em' }}>
                                                                    Unlock Live Insights
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#e8f5e9', px: 1, py: 0.2, borderRadius: 10 }}>
                                                                    <Box
                                                                        component={motion.div}
                                                                        animate={{ opacity: [1, 0.4, 1] }}
                                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                                        sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#4caf50' }}
                                                                    />
                                                                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#2e7d32', textTransform: 'uppercase' }}>Live</Typography>
                                                                </Box>
                                                            </Box>
                                                            <Typography variant="body2" sx={{ color: "#5f6368", lineHeight: 1.5, fontWeight: 500 }}>
                                                                Want to know who's scanning? Link your email to get real-time maps and device analytics.
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Paper
                                                        elevation={0}
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            p: "6px 6px 6px 16px",
                                                            borderRadius: 5,
                                                            border: "1px solid #e0e4e9",
                                                            bgcolor: "#fff",
                                                            transition: 'all 0.3s',
                                                            "&:focus-within": { borderColor: "#1976d2", boxShadow: '0 0 0 3px rgba(25,118,210,0.1)' }
                                                        }}
                                                    >
                                                        <TextField
                                                            fullWidth
                                                            variant="standard"
                                                            placeholder="Email for dashboard access..."
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            InputProps={{
                                                                disableUnderline: true,
                                                                sx: { fontSize: "0.95rem", fontWeight: 500 }
                                                            }}
                                                        />
                                                        <Button
                                                            variant="contained"
                                                            size="medium"
                                                            onClick={handleUpdateEmail}
                                                            disabled={!email || loading}
                                                            sx={{
                                                                fontWeight: 800,
                                                                textTransform: 'none',
                                                                borderRadius: 4,
                                                                px: 3,
                                                                boxShadow: 'none',
                                                                '&:hover': { boxShadow: '0 4px 12px rgba(25,118,210,0.2)' }
                                                            }}
                                                        >
                                                            {loading ? <CircularProgress size={18} color="inherit" /> : "Enable"}
                                                        </Button>
                                                    </Paper>
                                                </Stack>
                                            </Box>
                                            <Box sx={{ bgcolor: '#1976d208', py: 1, px: 3, borderTop: '1px solid #1976d210' }}>
                                                <Typography variant="caption" sx={{ color: '#1976d2', fontWeight: 700, fontSize: '0.7rem' }}>
                                                    ⚡ Free forever • Real-time notifications • Pro Dashboard
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Box>
                </Box>
            </Container >

            {/* Featured Tools Section below fold */}
            <Box sx={{ borderTop: '1px solid #f1f3f4', bgcolor: '#fff', py: 12 }}>

                <Container maxWidth="lg">

                    {/* Banner (468x60) - Keeping below fold as footer banner */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
                        <AdFrame
                            adLabel="4"
                            width={468}
                            height={60}
                            adCode={`
                                <script type="text/javascript">
                                    atOptions = {
                                        'key' : '4212cc39c0b2f9663051a46b7a0082ea',
                                        'format' : 'iframe',
                                        'height' : 60,
                                        'width' : 468,
                                        'params' : {}
                                    };
                                </script>
                                <script type="text/javascript" src="//www.highperformanceformat.com/4212cc39c0b2f9663051a46b7a0082ea/invoke.js"></script>
                            `}
                        />
                    </Box>

                    {/* 3 Side-by-Side Ads (Labels 6, 7, 8) */}
                    <Box sx={{ mb: 8 }}>
                        <Grid container spacing={2} justifyContent="center">
                            {[6, 7, 8].map((label) => (
                                <Grid size={{ xs: 12, md: 4 }} key={label} sx={{ display: 'flex', justifyContent: 'center' }}>
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

                    {/* Native Ad Section */}
                    <Box sx={{ mt: 8 }}>
                        <NativeAd adLabel="5" />
                    </Box>

                </Container>
            </Box>

            {/* Footer */}
            <Box component="footer" sx={{ bgcolor: '#fff', borderTop: '1px solid #e0e0e0', pt: 8, pb: 12, mt: 'auto' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} justifyContent="space-between">
                        <Grid size={{ xs: 12, md: 4 }}>
                            <BrandLogo />
                            <Typography variant="body2" sx={{ color: '#5f6368', mt: 2, mb: 3, maxWidth: 300 }}>
                                Create high-quality QR codes for free. Fast, reliable, and secure QR generation for everyone.
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 6, md: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Product</Typography>
                            <Stack spacing={1}>
                                <Button href="/dashboard" sx={{ justifyContent: 'flex-start', color: '#5f6368', textTransform: 'none', px: 0 }}>Dashboard</Button>
                                <Button href="/" sx={{ justifyContent: 'flex-start', color: '#5f6368', textTransform: 'none', px: 0 }}>Generator</Button>
                                <Button href="/stats" sx={{ justifyContent: 'flex-start', color: '#5f6368', textTransform: 'none', px: 0 }}>Analytics</Button>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 6, md: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Legal</Typography>
                            <Stack spacing={1}>
                                <Button sx={{ justifyContent: 'flex-start', color: '#5f6368', textTransform: 'none', px: 0 }}>Privacy Policy</Button>
                                <Button sx={{ justifyContent: 'flex-start', color: '#5f6368', textTransform: 'none', px: 0 }}>Terms of Service</Button>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 4 }} />
                    <Typography variant="body2" sx={{ color: '#9e9e9e', textAlign: 'center' }}>
                        © {new Date().getFullYear()} QR Code. All rights reserved.
                    </Typography>
                </Container>
            </Box>

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
        </Box>
    );
}
