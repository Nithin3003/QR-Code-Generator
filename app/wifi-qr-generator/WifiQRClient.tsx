"use client";

import React, { useState, useRef, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, TextField, Box, Container, IconButton, Paper, CircularProgress, Stack, Avatar, Tooltip, Snackbar, Alert, Divider, Grid } from "@mui/material";
import { Settings, AccountCircle, Add, Download, ContentCopy, Wifi, Security, Speed } from "@mui/icons-material";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/BrandLogo";
import AdBanner300x250, { NativeBanner, AdBanner728x90, PopunderAd, SocialBar, AdTagZone, PropellerPushNotifications, PropellerVignetteBanner, PropellerInPagePush } from "@/components/AdBanner";

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

export default function WifiQRClient() {
    const [text, setText] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAd, setShowAd] = useState(false);
    const [adCountdown, setAdCountdown] = useState(5);
    const [alert, setAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
    const qrRef = useRef<HTMLDivElement>(null);

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
            a.download = "lumina-wifi-qr.png";
            a.click();
        }
    };

    const handleCreate = async () => {
        if (!text) return;
        setLoading(true);
        setShortUrl("");
        try {
            const res = await fetch("/api/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: text }),
            });
            if (!res.ok) throw new Error("Service busy.");
            const data = await res.json();
            if (data.shortUrl) {
                setShortUrl(data.shortUrl);
                setShowAd(true);
                setAdCountdown(5);
                setAlert({ open: true, message: "WiFi QR Generated!", severity: 'success' });
            } else {
                throw new Error("Failed");
            }
        } catch (e: any) {
            setAlert({ open: true, message: "Error generating", severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (shortUrl) navigator.clipboard.writeText(shortUrl);
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#fff", display: "flex", flexDirection: "column" }}>
            <SocialBar />
            <AdTagZone />
            <PropellerPushNotifications />
            <PropellerVignetteBanner />
            <PropellerInPagePush />
            <Header />

            <Container maxWidth="lg" sx={{ pt: { xs: 10, md: 15 }, pb: 12, flex: 1 }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 6, md: 8 }, alignItems: "flex-start" }}>
                    <Box sx={{ flex: 1.2 }}>
                        <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: "2.5rem", md: "3.5rem" }, color: "#202124", mb: 2, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
                            Free WiFi QR Code <br />
                            <span style={{ color: "#1976d2" }}>Generator for Business.</span>
                        </Typography>
                        <Typography variant="h6" sx={{ color: "#5f6368", mb: 8, fontWeight: 400, fontSize: "1.2rem", maxWidth: 500 }}>
                            Generate instant WiFi access codes for cafes, hotels, and offices. No more typing passwords. Scan to connect.
                        </Typography>

                        <Paper elevation={0} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", gap: 1, p: 1, borderRadius: 10, border: "1px solid #dadce0", maxWidth: 700 }}>
                            <Box sx={{ display: "flex", flex: 1, alignItems: "center", gap: 1, width: "100%" }}>
                                <Box sx={{ ml: 2, color: '#1976d2' }}><Wifi /></Box>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    placeholder="Enter WiFi Name (SSID) or 'WIFI:T:WPA;S:Name;P:Pass;;'" // Hint for format
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    InputProps={{ disableUnderline: true, sx: { fontSize: "1.1rem", px: 2, py: 1 } }}
                                />
                            </Box>
                            <Button variant="contained" onClick={handleCreate} disabled={loading || !text} sx={{ borderRadius: { xs: 4, sm: 8 }, px: 5, py: 2, bgcolor: "#1976d2", textTransform: "none", fontWeight: 700, width: { xs: '100%', sm: 'auto' } }}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : "CREATE WIFI QR"}
                            </Button>
                        </Paper>

                        {/* Content for SEO */}
                        <Box sx={{ mt: 10 }}>
                            <Typography variant="overline" sx={{ color: "#70757a", letterSpacing: "0.1em", fontWeight: 700 }}>WHY USE QR FOR WIFI?</Typography>
                            <Grid container spacing={4} sx={{ mt: 1 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Speed sx={{ color: "#1976d2" }} />
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Instant Connect</Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Security sx={{ color: "#1976d2" }} />
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Secure Sharing</Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ my: 6, p: 3, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.01)', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#999', fontSize: 9, letterSpacing: 2, mb: 3 }}>SPONSORED</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}><AdBanner300x250 placement="wifi-1" /></Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}><NativeBanner placement="wifi-native" /></Box>
                        </Box>
                    </Box>

                    {/* Right: QR Canvas */}
                    <Box sx={{ flex: 0.8, width: "100%", position: 'relative', display: 'flex', justifyContent: 'center', minHeight: 400 }}>
                        <AnimatePresence mode="wait">
                            {!shortUrl && !loading ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-[400px] rounded-3xl border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden relative" style={{ background: 'radial-gradient(circle at center, #f8faff 0%, #fff 100%)' }}>
                                    <Box sx={{ textAlign: 'center', opacity: 0.4 }}>
                                        <Box sx={{ fontSize: 60, mb: 1 }}>📶</Box>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>WiFi QR appears here</Typography>
                                    </Box>
                                </motion.div>
                            ) : loading ? (
                                <CircularProgress />
                            ) : showAd ? (
                                <Paper elevation={0} sx={{ p: 5, borderRadius: 8, bgcolor: "#000", textAlign: "center", width: "100%", maxWidth: 380, mx: "auto", minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                        <Button onClick={skipAd} disabled={adCountdown > 0} variant="contained" size="small" sx={{ bgcolor: adCountdown === 0 ? '#fff' : 'rgba(255,255,255,0.3)', color: adCountdown === 0 ? '#000' : '#fff' }}>{adCountdown > 0 ? `Wait ${adCountdown}s` : 'Skip'}</Button>
                                    </Box>
                                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <AdBanner300x250 placement="interstitial-wifi" />
                                    </Box>
                                </Paper>
                            ) : (
                                <Paper elevation={0} sx={{ p: 5, borderRadius: 8, bgcolor: "#fff", textAlign: "center", border: "1px solid #1976d220", width: "100%", maxWidth: 380 }}>
                                    <Box sx={{ p: 3, bgcolor: "#fff", borderRadius: 6, mb: 4, border: "4px solid #f8f9fa" }}>
                                        <QRCodeCanvas value={shortUrl} size={240} level="H" style={{ width: "100%", height: "auto" }} />
                                    </Box>
                                    <Stack direction="row" spacing={2} justifyContent="center">
                                        <Button variant="contained" onClick={handleDownload} sx={{ borderRadius: 4, bgcolor: "#1976d2", textTransform: 'none', flex: 1 }}>Download PDF</Button>
                                        <Button variant="outlined" onClick={copyToClipboard} sx={{ borderRadius: 4, textTransform: 'none', flex: 1 }}>Copy</Button>
                                    </Stack>
                                    <Box sx={{ mt: 4 }}><AdBanner300x250 placement="qr-result-wifi" /></Box>
                                </Paper>
                            )}
                        </AnimatePresence>
                    </Box>
                </Box>
            </Container>

            <Snackbar open={alert.open} autoHideDuration={6000} onClose={() => setAlert({ ...alert, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} sx={{ width: '100%' }}>{alert.message}</Alert>
            </Snackbar>
        </Box>
    );
}
