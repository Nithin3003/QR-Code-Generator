"use client";

import React, { useState, useRef, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, TextField, Box, Container, IconButton, Paper, CircularProgress, Stack, Avatar, Grid } from "@mui/material";
import { Settings, AccountCircle, CurrencyBitcoin, Security } from "@mui/icons-material";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/BrandLogo";
import AdBanner300x250, { NativeBanner, AdTagZone, PropellerPushNotifications, PropellerVignetteBanner, SocialBar } from "@/components/AdBanner";

const Header = () => (
    <AppBar position="fixed" elevation={0} sx={{ bgcolor: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e0e0e0", color: "#1976d2" }}>
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 64, px: 2 }}>
            <Box><BrandLogo /></Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button sx={{ display: { xs: 'none', md: 'inline-flex' }, mr: 2, color: "#5f6368" }}>Tools</Button>
                <IconButton color="inherit"><Avatar sx={{ bgcolor: "#F7931A" }}><CurrencyBitcoin /></Avatar></IconButton>
            </Box>
        </Toolbar>
    </AppBar>
);

export default function CryptoQRClient() {
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
                            Accept Crypto Payments <br />
                            <span style={{ color: "#F7931A" }}>with Static QR Codes.</span>
                        </Typography>
                        <Typography variant="h6" sx={{ color: "#5f6368", mb: 8, maxWidth: 500 }}>
                            Generate Bitcoin, Ethereum, and USDT payment QR codes tailored for merchants and freelancers. Secure & Fast.
                        </Typography>

                        <Paper elevation={0} sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, borderRadius: 10, border: "1px solid #dadce0", maxWidth: 700 }}>
                            <Box sx={{ ml: 2, color: '#F7931A' }}><CurrencyBitcoin /></Box>
                            <TextField
                                fullWidth
                                variant="standard"
                                placeholder="Enter Wallet Address..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                InputProps={{ disableUnderline: true, sx: { fontSize: "1.1rem", px: 2, py: 1 } }}
                            />
                            <Button variant="contained" onClick={handleCreate} disabled={loading || !text} sx={{ borderRadius: 8, px: 5, py: 2, bgcolor: "#F7931A", fontWeight: 700, "&:hover": { bgcolor: "#e68a19" } }}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : "GENERATE CRYPTO QR"}
                            </Button>
                        </Paper>

                        <Box sx={{ mt: 8 }}>
                            <Typography variant="overline" sx={{ color: "#70757a", fontWeight: 700 }}>SUPPORTED CHAINS</Typography>
                            <Stack direction="row" spacing={3} sx={{ mt: 2, color: '#5f6368', fontWeight: 600 }}>
                                <span>Bitcoin (BTC)</span>
                                <span>Ethereum (ETH)</span>
                                <span>Solana (SOL)</span>
                                <span>USDT (TRC20)</span>
                            </Stack>
                        </Box>

                        <Box sx={{ my: 6, p: 3, border: '1px solid #eee', borderRadius: 4 }}>
                            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#999', mb: 2 }}>SPONSORED</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}><NativeBanner placement="crypto-native" /></Box>
                        </Box>
                    </Box>

                    <Box sx={{ flex: 0.8, display: 'flex', justifyContent: 'center' }}>
                        <AnimatePresence mode="wait">
                            {!shortUrl && !loading ? (
                                <Box sx={{ width: '100%', height: 400, borderRadius: 8, border: '2px dashed #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fbfbfb' }}>
                                    <Typography sx={{ color: '#aaa', fontWeight: 500 }}>Wallet QR will appear here</Typography>
                                </Box>
                            ) : loading ? (
                                <Box sx={{ height: 400, display: 'flex', alignItems: 'center' }}><CircularProgress sx={{ color: '#F7931A' }} /></Box>
                            ) : showAd ? (
                                <Box sx={{ width: '100%', height: 400, bgcolor: '#000', borderRadius: 8, p: 4, color: '#fff', textAlign: 'center' }}>
                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button size="small" variant="contained" onClick={() => { setShowAd(false); setAdCountdown(5) }} disabled={adCountdown > 0} sx={{ bgcolor: '#fff', color: '#000' }}>{adCountdown > 0 ? `${adCountdown}s` : 'Skip'}</Button>
                                    </Box>
                                    <NativeBanner placement="interstitial-crypto" />
                                </Box>
                            ) : (
                                <Paper elevation={0} sx={{ p: 4, borderRadius: 8, border: '1px solid #eee', width: '100%', textAlign: 'center' }}>
                                    <Box sx={{ p: 2, border: '4px solid #F7931A', borderRadius: 4, display: 'inline-block', mb: 3 }}>
                                        <QRCodeCanvas value={shortUrl} size={220} />
                                    </Box>
                                    <Button variant="contained" fullWidth sx={{ mb: 2, bgcolor: '#F7931A', borderRadius: 4, py: 1.5 }} onClick={() => {
                                        const canvas = qrRef.current?.querySelector("canvas");
                                    }}>Download Wallet QR</Button>
                                    <AdBanner300x250 placement="crypto-result" />
                                </Paper>
                            )}
                        </AnimatePresence>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
