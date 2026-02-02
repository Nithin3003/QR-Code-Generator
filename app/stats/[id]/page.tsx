"use client";

import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    CircularProgress,
    AppBar,
    Toolbar,
    Card,
    CardContent,
    Stack,
    Divider
} from "@mui/material";
import {
    BarChart as ReBarChart,
    Bar,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { BrandLogo } from '@/components/BrandLogo';
import { AdBanner728x90 } from '@/components/AdBanner';
import { AdFrame } from '@/components/ads/AdFrame';
import { NativeAd } from '@/components/ads/NativeAd';

const Header = () => (
    <AppBar position="fixed" elevation={0} sx={{ bgcolor: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e0e0e0", color: "#1976d2" }}>
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
            <Box sx={{ ml: 1 }}>
                <BrandLogo />
            </Box>
        </Toolbar>
    </AppBar>
);


interface StatsData {
    summary: {
        total: number;
        unique_visitors: number;
    };
    countries: Array<{ country: string; count: number }>;
    timeline: Array<{ date: string; count: number }>;
    os: Array<{ os: string; count: number }>;
    browsers: Array<{ name: string; count: number }>;
    devices: Array<{ name: string; count: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function StatsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [data, setData] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/stats?shortId=${id}&_t=${Date.now()}`)
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!data) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6">No data found</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa", display: 'flex' }}>
            <Header />

            {/* --- Standard Ad Slots 1 & 2 (Sidebars) --- */}
            {/* Left Sidebar Ad */}
            <Box sx={{ display: { xs: 'none', xl: 'block' }, position: 'fixed', left: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 100 }}>
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

            {/* Right Sidebar Ad */}
            <Box sx={{ display: { xs: 'none', xl: 'flex' }, position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 100, flexDirection: 'column', gap: 2 }}>
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

            <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Container maxWidth="lg" sx={{ pt: 15, pb: 10 }}>
                    {/* Header Section */}
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
                        <Typography variant="h4" component="h1" fontWeight={800} color="#202124">
                            Analytics Report
                        </Typography>
                        <Box sx={{ px: 2, py: 0.5, bgcolor: '#e3f2fd', borderRadius: 2, color: '#1976d2', fontWeight: 600 }}>
                            ID: {id}
                        </Box>
                    </Stack>

                    {/* --- Ad Slot 3 (Mobile Banner) --- */}
                    <Box sx={{ display: { xs: 'flex', xl: 'none' }, justifyContent: 'center', mb: 4 }}>
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

                    {/* Summary Cards */}
                    <Grid container spacing={3} mb={6}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #eee' }}>
                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="h2" fontWeight={800} color="#1976d2">
                                        {data.summary.total}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" fontWeight={500}>
                                        Total Scans
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #eee' }}>
                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="h2" fontWeight={800} color="#2e7d32">
                                        {data.summary.unique_visitors}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" fontWeight={500}>
                                        Unique Visitors
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* --- Ad Slot 4 (Main Banner) --- */}
                    <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
                        <AdBanner728x90 adLabel="4" />
                    </Box>

                    <Grid container spacing={4}>
                        {/* Timeline Chart */}
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: '1px solid #eee', height: '100%' }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                                    <Typography variant="h6" fontWeight={700}>Performance Over Time</Typography>
                                    <Stack direction="row" spacing={1}>
                                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#1976d2' }} />
                                        <Typography variant="caption" color="text.secondary">Scans</Typography>
                                    </Stack>
                                </Stack>
                                <Box sx={{ height: 350, width: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data.timeline}>
                                            <defs>
                                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#1976d2" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis
                                                dataKey="date"
                                                tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                tick={{ fill: '#9e9e9e', fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                                dy={10}
                                            />
                                            <YAxis
                                                tick={{ fill: '#9e9e9e', fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                                dx={-10}
                                            />
                                            <RechartsTooltip
                                                contentStyle={{
                                                    backgroundColor: '#fff',
                                                    borderRadius: 12,
                                                    border: 'none',
                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                                    padding: '12px 16px'
                                                }}
                                                itemStyle={{ color: '#333', fontWeight: 600 }}
                                                cursor={{ stroke: '#1976d2', strokeWidth: 1, strokeDasharray: '3 3' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="count"
                                                stroke="#1976d2"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorCount)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Top Countries */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: '1px solid #eee', height: '100%', overflowY: 'auto' }}>
                                <Typography variant="h6" fontWeight={700} mb={3}>Top Locations</Typography>
                                <Stack spacing={2.5}>
                                    {data.countries.length > 0 ? data.countries.map((c, i) => (
                                        <Box key={i}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="body2" fontWeight={600} color="#333">{c.country}</Typography>
                                                </Stack>
                                                <Typography variant="caption" fontWeight={700}>{c.count}</Typography>
                                            </Box>
                                            <Box sx={{ width: '100%', height: 6, bgcolor: '#f5f5f5', borderRadius: 3, overflow: 'hidden' }}>
                                                <Box
                                                    component={motion.div}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(c.count / data.summary.total) * 100}%` }}
                                                    transition={{ duration: 1, ease: 'easeOut' }}
                                                    sx={{ height: '100%', bgcolor: i === 0 ? '#1976d2' : '#90caf9' }} // Highlight top 1
                                                />
                                            </Box>
                                        </Box>
                                    )) : (
                                        <Typography variant="caption" color="text.secondary">No location data yet.</Typography>
                                    )}
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* --- Ad Slot 6 & 7 (Engagement Grid) --- */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <AdFrame
                                adLabel="6"
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
                        <Grid size={{ xs: 12, md: 6 }}>
                            <AdFrame
                                adLabel="7"
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

                        {/* Operating Systems (Donut) */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: '1px solid #eee', height: '100%', minHeight: 350 }}>
                                <Typography variant="h6" fontWeight={700} mb={1}>Operating Systems</Typography>
                                <Box sx={{ height: 250, width: '100%', position: 'relative' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data.os}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="count"
                                                nameKey="os"
                                            >
                                                {data.os.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -60%)', textAlign: 'center' }}>
                                        <Typography variant="h5" fontWeight={800}>{data.os.reduce((a, b) => a + b.count, 0)}</Typography>
                                        <Typography variant="caption" color="text.secondary">Systems</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Devices (Donut) */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: '1px solid #eee', height: '100%', minHeight: 350 }}>
                                <Typography variant="h6" fontWeight={700} mb={1}>Device Types</Typography>
                                <Box sx={{ height: 250, width: '100%', position: 'relative' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data.devices || []}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="count"
                                                nameKey="name"
                                            >
                                                {(data.devices || []).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={['#FF6B6B', '#4ECDC4'][index % 2]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Browsers (Donut) */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: '1px solid #eee', height: '100%', minHeight: 350 }}>
                                <Typography variant="h6" fontWeight={700} mb={1}>Browsers</Typography>
                                <Box sx={{ height: 250, width: '100%', position: 'relative' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data.browsers || []}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="count"
                                                nameKey="name"
                                            >
                                                {(data.browsers || []).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={['#FFD166', '#118AB2', '#06D6A0', '#EF476F'][index % 4]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* --- Ad Slot 8 (Engagement Grid 3) --- */}
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <AdFrame
                            adLabel="8"
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

                    {/* --- Ad Slot 5 (Native Ad) --- */}
                    <Box sx={{ mt: 8 }}>
                        <NativeAd adLabel="5" />
                    </Box>

                </Container>
            </Box>
        </Box>
    );
}

import { Grid as LegacyGrid } from "@mui/material"; // For any leftover references if needed, but we use Grid size
