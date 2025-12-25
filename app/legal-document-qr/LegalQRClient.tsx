"use client";

import React, { useState, useRef, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, TextField, Box, Container, IconButton, Paper, CircularProgress, Stack, Avatar, Grid } from "@mui/material";
import { Gavel, FolderShared, Assignment, BusinessCenter } from "@mui/icons-material";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/BrandLogo";
import AdBanner300x250, { NativeBanner, AdTagZone, PropellerPushNotifications, PropellerVignetteBanner, SocialBar } from "@/components/AdBanner";

const Header = () => (
    <AppBar position="fixed" elevation={0} sx={{ bgcolor: "#2c3e50", borderBottom: "1px solid #34495e", color: "#fff" }}>
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 64, px: 2 }}>
            <Box sx={{ filter: 'brightness(2)' }}><BrandLogo /></Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button sx={{ display: { xs: 'none', md: 'inline-flex' }, mr: 2, color: "#bdc3c7" }}>Legal Solutions</Button>
                <IconButton color="inherit"><Avatar sx={{ bgcolor: "#ecf0f1", color: '#2c3e50' }}><Gavel /></Avatar></IconButton>
            </Box>
        </Toolbar>
    </AppBar>
);

export default function LegalQRClient() {
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
            const res = await fetch("/api/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: text }) });
            const data = await res.json();
            if (data.shortUrl) {
                setShortUrl(data.shortUrl);
                setShowAd(true);
                setAdCountdown(5);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f5f6fa", display: "flex", flexDirection: "column" }}>
            <SocialBar />
            <AdTagZone />
            <PropellerPushNotifications />
            <PropellerVignetteBanner />
            <Header />

            <Container maxWidth="lg" sx={{ pt: 15, pb: 12, flex: 1 }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 8 }}>
                    <Box sx={{ flex: 1.2 }}>
                        <Typography variant="overline" sx={{ color: "#7f8c8d", fontWeight: 700, letterSpacing: 1.5 }}>FOR LAW FIRMS & ATTORNEYS</Typography>
                        <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: "2.5rem", md: "3.5rem" }, color: "#2c3e50", mb: 2 }}>
                            QR Solutions for <br />
                            <span style={{ color: "#3498db" }}>Case Management.</span>
                        </Typography>
                        <Typography variant="h6" sx={{ color: "#7f8c8d", mb: 8, maxWidth: 550, lineHeight: 1.6 }}>
                            Streamline discovery and client intake. Generate professional QR codes for case files, legal briefs, and firm marketing.
                        </Typography>

                        <Paper elevation={0} sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, borderRadius: 1, border: "1px solid #bdc3c7", maxWidth: 700 }}>
                            <Box sx={{ ml: 2, color: '#2c3e50' }}><BusinessCenter /></Box>
                            <TextField
                                fullWidth
                                variant="standard"
                                placeholder="Case File Link or Marketing URL..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                InputProps={{ disableUnderline: true, sx: { fontSize: "1.1rem", px: 2, py: 1.5 } }}
                            />
                            <Button variant="contained" onClick={handleCreate} disabled={loading || !text} sx={{ borderRadius: 1, px: 4, py: 2, bgcolor: "#2c3e50", fontWeight: 700, "&:hover": { bgcolor: "#34495e" } }}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : "CREATE LEGAL QR"}
                            </Button>
                        </Paper>

                        <Box sx={{ mt: 10 }}>
                            <Typography variant="overline" sx={{ color: "#7f8c8d", fontWeight: 700 }}>PRACTICE MANAGEMENT</Typography>
                            <Grid container spacing={4} sx={{ mt: 1 }}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Stack direction="row" spacing={2} alignItems="flex-start">
                                        <Assignment sx={{ color: "#3498db", fontSize: 32 }} />
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: '#2c3e50' }}>Document Sharing</Typography>
                                            <Typography variant="body2" sx={{ color: '#7f8c8d' }}>Instantly share discovery documents or intake forms with clients.</Typography>
                                        </Box>
                                    </Stack>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Stack direction="row" spacing={2} alignItems="flex-start">
                                        <FolderShared sx={{ color: "#3498db", fontSize: 32 }} />
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: '#2c3e50' }}>Archive Integration</Typography>
                                            <Typography variant="body2" sx={{ color: '#7f8c8d' }}>Link physical case files to digital archives securely.</Typography>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ my: 6, p: 4, border: '1px solid #dcdcdc', borderRadius: 1, bgcolor: '#fff' }}>
                            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#999', mb: 2 }}>LEGAL RESOURCES</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}><NativeBanner placement="legal-native" /></Box>
                        </Box>
                    </Box>

                    {/* Right Panel */}
                    <Box sx={{ flex: 0.8, display: 'flex', justifyContent: 'center' }}>
                        <AnimatePresence mode="wait">
                            {!shortUrl && !loading ? (
                                <Box sx={{ width: '100%', height: 450, borderRadius: 2, border: '1px solid #bdc3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff', flexDirection: 'column', gap: 2 }}>
                                    <Gavel sx={{ fontSize: 60, color: '#ecf0f1' }} />
                                    <Typography sx={{ color: '#bdc3c7', fontWeight: 500 }}>Legal Preview</Typography>
                                </Box>
                            ) : loading ? (
                                <Box sx={{ height: 450, display: 'flex', alignItems: 'center' }}><CircularProgress sx={{ color: '#2c3e50' }} /></Box>
                            ) : showAd ? (
                                <Box sx={{ width: '100%', height: 450, bgcolor: '#2c3e50', borderRadius: 2, p: 4, color: '#fff', textAlign: 'center' }}>
                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button size="small" variant="contained" onClick={() => { setShowAd(false); setAdCountdown(5) }} disabled={adCountdown > 0} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}>{adCountdown > 0 ? `${adCountdown}s` : 'Skip'}</Button>
                                    </Box>
                                    <NativeBanner placement="interstitial-legal" />
                                </Box>
                            ) : (
                                <Paper elevation={4} sx={{ p: 5, borderRadius: 1, width: '100%', textAlign: 'center' }} ref={qrRef}>
                                    <Box sx={{ p: 2, border: '4px double #2c3e50', display: 'inline-block', mb: 3 }}>
                                        <QRCodeCanvas value={shortUrl} size={220} />
                                    </Box>
                                    <Typography variant="body2" sx={{ mb: 3, color: '#2c3e50', fontWeight: 600 }}>Professional Use Only</Typography>
                                    <Button variant="contained" fullWidth sx={{ mb: 2, bgcolor: '#34495e', borderRadius: 0, py: 1.5 }}>Download Case QR</Button>
                                    <AdBanner300x250 placement="legal-result" />
                                </Paper>
                            )}
                        </AnimatePresence>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
