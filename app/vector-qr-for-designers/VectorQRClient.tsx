"use client";

import React, { useState, useRef, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, TextField, Box, Container, IconButton, Paper, CircularProgress, Stack, Avatar, Grid } from "@mui/material";
import { Brush, AutoFixHigh, Download } from "@mui/icons-material";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/BrandLogo";
import AdBanner300x250, { NativeBanner, SocialBar, AdTagZone, PropellerPushNotifications, PropellerVignetteBanner } from "@/components/AdBanner";

const Header = () => (
    <AppBar position="fixed" elevation={0} sx={{ bgcolor: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e0e0e0", color: "#1976d2" }}>
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 64, px: 2 }}>
            <Box><BrandLogo /></Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button sx={{ display: { xs: 'none', md: 'inline-flex' }, mr: 2, color: "#5f6368" }}>Tools</Button>
                <IconButton color="inherit"><Avatar sx={{ bgcolor: "#E91E63" }}><Brush /></Avatar></IconButton>
            </Box>
        </Toolbar>
    </AppBar>
);

export default function VectorQRClient() {
    const [text, setText] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAd, setShowAd] = useState(false);
    const [adCountdown, setAdCountdown] = useState(5);
    const qrRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (showAd && adCountdown > 0) {
            const timer = setTimeout(() => setAdCountdown(p => p - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [showAd, adCountdown]);

    const handleCreate = async () => {
        if (!text) return;
        setLoading(true);
        try {
            const res = await fetch("/api/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: text }),
            });
            const data = await res.json();
            if (data.shortUrl) {
                setShortUrl(data.shortUrl);
                setShowAd(true);
                setAdCountdown(5);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#fff", display: "flex", flexDirection: "column" }}>
            <SocialBar />
            <AdTagZone />
            <PropellerPushNotifications />
            {/* <PropellerVignetteBanner /> */}
            <Header />

            <Container maxWidth="lg" sx={{ pt: 15, pb: 12, flex: 1 }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 8 }}>
                    <Box sx={{ flex: 1.2 }}>
                        <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: "2.5rem", md: "3.5rem" }, color: "#202124", mb: 2 }}>
                            QR Codes for Designers: <br />
                            <span style={{ color: "#E91E63" }}>SVG & Vector Ready.</span>
                        </Typography>
                        <Typography variant="h6" sx={{ color: "#5f6368", mb: 8, maxWidth: 500 }}>
                            Generate scalable, sharp QR codes for print, billboards, and packaging. Export in high-res PNG (SVG coming soon).
                        </Typography>

                        <Paper elevation={0} sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, borderRadius: 10, border: "1px solid #dadce0", maxWidth: 700 }}>
                            <Box sx={{ ml: 2, color: '#E91E63' }}><Brush /></Box>
                            <TextField
                                fullWidth
                                variant="standard"
                                placeholder="Paste design link or URL..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                InputProps={{ disableUnderline: true, sx: { fontSize: "1.1rem", px: 2, py: 1 } }}
                            />
                            <Button variant="contained" onClick={handleCreate} disabled={loading || !text} sx={{ borderRadius: 8, px: 5, py: 2, bgcolor: "#E91E63", fontWeight: 700, "&:hover": { bgcolor: "#c2185b" } }}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : "GENERATE VECTOR QR"}
                            </Button>
                        </Paper>

                        <Box sx={{ mt: 8 }}>
                            <Typography variant="overline" sx={{ color: "#70757a", fontWeight: 700 }}>DESIGN FEATURES</Typography>
                            <Stack direction="row" spacing={3} sx={{ mt: 2, color: '#5f6368', fontWeight: 600 }}>
                                <span>300 DPI Ready</span>
                                <span>Transparent BG</span>
                                <span>Custom Colors</span>
                            </Stack>
                        </Box>

                        <Box sx={{ my: 6, p: 3, border: '1px solid #eee', borderRadius: 4 }}>
                            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#999', mb: 2 }}>SPONSORED - DESIGN TOOLS</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}><NativeBanner placement="vector-native" /></Box>
                        </Box>
                    </Box>

                    <Box sx={{ flex: 0.8, display: 'flex', justifyContent: 'center' }}>
                        <AnimatePresence mode="wait">
                            {!shortUrl && !loading ? (
                                <Box sx={{ width: '100%', height: 400, borderRadius: 8, border: '2px dashed #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fbfbfb' }}>
                                    <Typography sx={{ color: '#aaa', fontWeight: 500 }}>High-Res QR Preview</Typography>
                                </Box>
                            ) : loading ? (
                                <Box sx={{ height: 400, display: 'flex', alignItems: 'center' }}><CircularProgress sx={{ color: '#E91E63' }} /></Box>
                            ) : showAd ? (
                                <Box sx={{ width: '100%', height: 400, bgcolor: '#000', borderRadius: 8, p: 4, color: '#fff', textAlign: 'center' }}>
                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button size="small" variant="contained" onClick={() => { setShowAd(false); setAdCountdown(5) }} disabled={adCountdown > 0} sx={{ bgcolor: '#fff', color: '#000' }}>{adCountdown > 0 ? `${adCountdown}s` : 'Skip'}</Button>
                                    </Box>
                                    <NativeBanner placement="interstitial-vector" />
                                </Box>
                            ) : (
                                <Paper elevation={0} sx={{ p: 4, borderRadius: 8, border: '1px solid #eee', width: '100%', textAlign: 'center' }} ref={qrRef}>
                                    <Box sx={{ p: 2, border: '4px solid #E91E63', borderRadius: 4, display: 'inline-block', mb: 3 }}>
                                        <QRCodeCanvas value={shortUrl} size={300} imageSettings={{ src: "", height: 24, width: 24, excavate: true }} />
                                    </Box>
                                    <Typography variant="caption" display="block" sx={{ mb: 2, color: '#888' }}>Right click &gt; Save As for High Res</Typography>
                                    <Button variant="contained" fullWidth sx={{ mb: 2, bgcolor: '#E91E63', borderRadius: 4, py: 1.5 }}>Download PNG</Button>
                                    <AdBanner300x250 placement="vector-result" />
                                </Paper>
                            )}
                        </AnimatePresence>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
