"use client";

import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Paper, Stack, Avatar, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, LinearProgress } from "@mui/material";
import { PieChart, TrendingUp, AttachMoney, Business, CloudCircle, Shield } from "@mui/icons-material";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/BrandLogo";
import AdBanner300x250, { NativeBanner, SocialBar, AdTagZone, PropellerPushNotifications } from "@/components/AdBanner";

const Header = () => (
    <AppBar position="fixed" elevation={0} sx={{ bgcolor: "#fff", borderBottom: "1px solid #f0f0f0", color: "#333" }}>
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 64, px: 2 }}>
            <Box><BrandLogo /></Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button sx={{ display: { xs: 'none', md: 'inline-flex' }, mr: 2, color: "#666" }}>Tools</Button>
                <IconButton color="inherit"><Avatar sx={{ bgcolor: "#6200ea" }}><PieChart /></Avatar></IconButton>
            </Box>
        </Toolbar>
    </AppBar>
);

const DEMO_DATA = [
    { name: "Salesforce CRM", cost: 150, category: "Sales" },
    { name: "Slack Pro", cost: 24, category: "Communication" },
    { name: "Adobe Creative Cloud", cost: 54, category: "Design" },
    { name: "AWS Hosting", cost: 85, category: "Infrastructure" },
    { name: "Zoom", cost: 15, category: "Communication" },
    { name: "DocuSign", cost: 40, category: "Legal" }
];

export default function SaasOptimizerClient() {
    const [analyzing, setAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const runAnalysis = () => {
        setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
            setShowResults(true);
        }, 2000);
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa", display: "flex", flexDirection: "column" }}>
            <SocialBar />
            <AdTagZone />
            <PropellerPushNotifications />
            <Header />

            <Container maxWidth="lg" sx={{ pt: 15, pb: 12, flex: 1 }}>
                <Grid container spacing={6}>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Typography variant="overline" sx={{ color: "#6200ea", fontWeight: 700, letterSpacing: 1.5 }}>B2B COST SAVINGS</Typography>
                        <Typography variant="h2" sx={{ fontWeight: 800, color: "#1a1a1a", mb: 2, lineHeight: 1.1 }}>
                            Stop Wasting Money on <br />
                            <span style={{ color: "#6200ea" }}>Unused SaaS.</span>
                        </Typography>
                        <Typography variant="h6" sx={{ color: "#666", mb: 6, maxWidth: 550, lineHeight: 1.6 }}>
                            Upload your expense CSV or connect securely to find hidden subscriptions, duplicate tools, and "Shadow IT" spending instantly.
                        </Typography>

                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e0e0e0", mb: 6 }}>
                            <Box sx={{ border: '2px dashed #6200ea', borderRadius: 2, bgcolor: '#f3e5f5', p: 4, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { bgcolor: '#ede7f6' } }} onClick={runAnalysis}>
                                <CloudCircle sx={{ fontSize: 48, color: '#6200ea', mb: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
                                    {analyzing ? "Analyzing Subscriptions..." : showResults ? "Analysis Complete!" : "Upload Bank Statement (CSV)"}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                                    {analyzing ? "Identifying duplicate tools..." : "or drag and drop file here"}
                                </Typography>
                                {analyzing && <LinearProgress sx={{ maxWidth: 200, mx: 'auto', mt: 2 }} color="secondary" />}
                            </Box>
                            <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'center' }}>
                                <Typography variant="caption" sx={{ color: '#999', display: 'flex', alignItems: 'center', gap: 0.5 }}><Business fontSize="inherit" /> Bank Level Security</Typography>
                                <Typography variant="caption" sx={{ color: '#999', display: 'flex', alignItems: 'center', gap: 0.5 }}><Shield fontSize="inherit" /> Encrypted Processing</Typography>
                            </Stack>
                        </Paper>

                        <Box sx={{ my: 4, p: 1, bgcolor: '#fff', borderRadius: 2 }}>
                            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#999', mb: 1, fontSize: 10 }}>SPONSORED - SOFTWARE DEALS</Typography>
                            <NativeBanner placement="saas-native" />
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 5 }}>
                        {showResults ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                                    <Box sx={{ p: 3, bgcolor: '#1a1a1a', color: '#fff' }}>
                                        <Typography variant="overline" sx={{ opacity: 0.7 }}>TOTAL MONTHLY SPEND</Typography>
                                        <Typography variant="h3" sx={{ fontWeight: 700 }}>$368.00</Typography>
                                        <Typography variant="body2" sx={{ color: '#00e676', display: 'flex', alignItems: 'center' }}>
                                            <TrendingUp fontSize="small" sx={{ mr: 0.5 }} /> Potential Savings: $145/mo
                                        </Typography>
                                    </Box>
                                    <Box sx={{ p: 0 }}>
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                                    <TableRow>
                                                        <TableCell>Tool</TableCell>
                                                        <TableCell align="right">Cost</TableCell>
                                                        <TableCell align="right">Action</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {DEMO_DATA.map((row) => (
                                                        <TableRow key={row.name}>
                                                            <TableCell component="th" scope="row">
                                                                <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
                                                                <Typography variant="caption" color="textSecondary">{row.category}</Typography>
                                                            </TableCell>
                                                            <TableCell align="right" sx={{ fontWeight: 600 }}>${row.cost}</TableCell>
                                                            <TableCell align="right">
                                                                <Chip label="Review" size="small" color={row.cost > 50 ? "error" : "default"} variant="outlined" />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                    <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
                                        <AdBanner300x250 placement="saas-result" />
                                    </Box>
                                </Paper>
                            </motion.div>
                        ) : (
                            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                                <Paper sx={{ p: 4, textAlign: 'center', width: '100%' }}>
                                    <AttachMoney sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
                                    <Typography color="textSecondary">Upload CSV to see dashboard</Typography>
                                    <Box sx={{ mt: 4, transform: 'scale(0.8)' }}>
                                        <AdBanner300x250 placement="saas-preview" />
                                    </Box>
                                </Paper>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
