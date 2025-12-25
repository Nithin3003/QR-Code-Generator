"use client";

import React, { useState, useRef, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, TextField, Box, Container, IconButton, Paper, CircularProgress, Stack, Avatar, Grid } from "@mui/material";
import { AccountBalance, Lock, Security, Shield } from "@mui/icons-material";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/BrandLogo";
import AdBanner300x250, { NativeBanner, AdTagZone, PropellerPushNotifications, PropellerVignetteBanner, SocialBar } from "@/components/AdBanner";

const Header = () => (
    <AppBar position="fixed" elevation={0} sx={{ bgcolor: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e0e0e0", color: "#1976d2" }}>
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 64, px: 2 }}>
            <Box><BrandLogo /></Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button sx={{ display: { xs: 'none', md: 'inline-flex' }, mr: 2, color: "#5f6368" }}>Enterprise</Button>
                <IconButton color="inherit"><Avatar sx={{ bgcolor: "#004d40" }}><AccountBalance /></Avatar></IconButton>
            </Box>
        </Toolbar>
    </AppBar>
);

export default function BankingQRPage() {
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
        <Box sx={{ minHeight: "100vh", bgcolor: "#fcfcfc", display: "flex", flexDirection: "column" }}>
            <SocialBar />
            <AdTagZone />
            <PropellerPushNotifications />
            <PropellerVignetteBanner />
            <Header />

            <Container maxWidth="lg" sx={{ pt: 15, pb: 12, flex: 1 }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 8 }}>
                    <Box sx={{ flex: 1.2 }}>
                        {/* High-Intent Finance Copy */}
                        <Typography variant="overline" sx={{ color: "#00695c", fontWeight: 700, letterSpacing: 1.5 }}>ENTERPRISE FINTECH SOLUTIONS</Typography>
                        <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: "2.5rem", md: "3.5rem" }, color: "#202124", mb: 2 }}>
                            Secure QR Codes for <br />
                            <span style={{ color: "#004d40" }}>Banking & Finance.</span>
                        </Typography>
                        <Typography variant="h6" sx={{ color: "#5f6368", mb: 8, maxWidth: 550, lineHeight: 1.6 }}>
                            Encrypted, compliant QR solutions for mortgage applications, insurance quotes, and secure document sharing. Trusted by financial institutions.
                        </Typography>

                        <Paper elevation={0} sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, borderRadius: 2, border: "1px solid #dadce0", maxWidth: 700, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <Box sx={{ ml: 2, color: '#004d40' }}><Lock /></Box>
                            <TextField
                                fullWidth
                                variant="standard"
                                placeholder="Secure Document Link (e.g., Mortgage App)"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                InputProps={{ disableUnderline: true, sx: { fontSize: "1.1rem", px: 2, py: 1.5 } }}
                            />
                            <Button variant="contained" onClick={handleCreate} disabled={loading || !text} sx={{ borderRadius: 2, px: 4, py: 2, bgcolor: "#004d40", fontWeight: 700, "&:hover": { bgcolor: "#00695c" } }}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : "GENERATE SECURE QR"}
                            </Button>
                        </Paper>

                        {/* Finance Keywords Section - Critical for Ad Targeting */}
                        <Box sx={{ mt: 10 }}>
                            <Typography variant="overline" sx={{ color: "#70757a", fontWeight: 700 }}>BANKING GRADE SECURITY</Typography>
                            <Grid container spacing={4} sx={{ mt: 1 }}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Stack direction="row" spacing={2} alignItems="flex-start">
                                        <Shield sx={{ color: "#004d40", fontSize: 32 }} />
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>Encrypted Data Transport</Typography>
                                            <Typography variant="body2" sx={{ color: '#666' }}>Ideal for sensitive financial documents, loan agreements, and insurance policies.</Typography>
                                        </Box>
                                    </Stack>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Stack direction="row" spacing={2} alignItems="flex-start">
                                        <Security sx={{ color: "#004d40", fontSize: 32 }} />
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>Compliance Ready</Typography>
                                            <Typography variant="body2" sx={{ color: '#666' }}>Built for highly regulated industries including Banking, Insurance, and Wealth Management.</Typography>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* High Value Ads */}
                        <Box sx={{ my: 6, p: 4, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fff' }}>
                            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#999', mb: 2 }}>FINANCIAL PARTNERS</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}><NativeBanner placement="finance-native" /></Box>
                        </Box>
                    </Box>

                    {/* Right Panel */}
                    <Box sx={{ flex: 0.8, display: 'flex', justifyContent: 'center' }}>
                        <AnimatePresence mode="wait">
                            {!shortUrl && !loading ? (
                                <Box sx={{ width: '100%', height: 450, borderRadius: 4, border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff', flexDirection: 'column', gap: 2 }}>
                                    <Shield sx={{ fontSize: 60, color: '#e0e0e0' }} />
                                    <Typography sx={{ color: '#aaa', fontWeight: 500 }}>Secure Preview Area</Typography>
                                </Box>
                            ) : loading ? (
                                <Box sx={{ height: 450, display: 'flex', alignItems: 'center' }}><CircularProgress sx={{ color: '#004d40' }} /></Box>
                            ) : showAd ? (
                                <Box sx={{ width: '100%', height: 450, bgcolor: '#004d40', borderRadius: 4, p: 4, color: '#fff', textAlign: 'center' }}>
                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button size="small" variant="contained" onClick={() => { setShowAd(false); setAdCountdown(5) }} disabled={adCountdown > 0} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}>{adCountdown > 0 ? `${adCountdown}s` : 'Skip'}</Button>
                                    </Box>
                                    <NativeBanner placement="interstitial-finance" />
                                </Box>
                            ) : (
                                <Paper elevation={4} sx={{ p: 5, borderRadius: 2, width: '100%', textAlign: 'center' }} ref={qrRef}>
                                    <Box sx={{ p: 2, border: '1px solid #eee', display: 'inline-block', mb: 3 }}>
                                        <QRCodeCanvas value={shortUrl} size={220} />
                                    </Box>
                                    <Typography variant="body2" sx={{ mb: 3, color: 'green', fontWeight: 600 }}>🔒 Encrypted QR Ready</Typography>
                                    <Button variant="contained" fullWidth sx={{ mb: 2, bgcolor: '#004d40', borderRadius: 1, py: 1.5 }}>Download Secure PNG</Button>
                                    <AdBanner300x250 placement="finance-result" />
                                </Paper>
                            )}
                        </AnimatePresence>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
