"use client";

import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    AppBar,
    Toolbar,
    Divider,
    IconButton,
    InputBase,
    Stack,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Card,
    CardContent,
    CardActions,
    Tooltip,
    Chip,
    Switch,
    FormControlLabel
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    QrCode2,
    BarChart,
    Settings,
    Search,
    Notifications,
    Add,
    Download,
    ShowChart,
    Delete,
    Edit,
    Visibility,
    MoreVert,
    PauseCircle,
    PlayCircle
} from "@mui/icons-material";
import { BrandLogo } from '@/components/BrandLogo';
import Link from 'next/link';
import { QRCodeCanvas } from "qrcode.react";
import { AdBanner728x90 } from '@/components/AdBanner';
import { AdFrame } from '@/components/ads/AdFrame';
import { NativeAd } from '@/components/ads/NativeAd';

// Sidebar Component
const Sidebar = ({ currentView, onChangeView }: { currentView: string, onChangeView: (view: string) => void }) => (
    <Paper
        elevation={0}
        sx={{
            width: 280,
            minWidth: 280,
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            borderRight: '1px solid #e0e0e0',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bgcolor: '#fff',
            zIndex: 1200
        }}
    >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <BrandLogo />
        </Box>

        <Box sx={{ px: 2, mt: 2 }}>
            <Button
                variant="contained"
                startIcon={<Add />}
                fullWidth
                sx={{
                    bgcolor: '#1976d2',
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 2,
                    py: 1.5,
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                }}
                href="/"
                component={Link}
            >
                Create QR Code
            </Button>
        </Box>

        <List sx={{ px: 2, mt: 3 }}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                    selected={currentView === 'my-codes'}
                    onClick={() => onChangeView('my-codes')}
                    sx={{
                        borderRadius: 2,
                        bgcolor: currentView === 'my-codes' ? '#e3f2fd' : 'transparent',
                        color: currentView === 'my-codes' ? '#1976d2' : '#5f6368',
                        '&.Mui-selected': { bgcolor: '#e3f2fd', color: '#1976d2' }
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><DashboardIcon /></ListItemIcon>
                    <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                    selected={currentView === 'my-codes'} // Keeping consistent
                    onClick={() => onChangeView('my-codes')}
                    sx={{
                        borderRadius: 2,
                        bgcolor: 'transparent',
                        color: '#5f6368',
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><QrCode2 /></ListItemIcon>
                    <ListItemText primary="My QR Codes" primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                    selected={currentView === 'analysis'}
                    onClick={() => onChangeView('analysis')}
                    sx={{
                        borderRadius: 2,
                        bgcolor: currentView === 'analysis' ? '#e3f2fd' : 'transparent',
                        color: currentView === 'analysis' ? '#1976d2' : '#5f6368',
                        '&.Mui-selected': { bgcolor: '#e3f2fd', color: '#1976d2' }
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><BarChart /></ListItemIcon>
                    <ListItemText primary="Analysis" primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                    selected={currentView === 'settings'}
                    onClick={() => onChangeView('settings')}
                    sx={{
                        borderRadius: 2,
                        bgcolor: currentView === 'settings' ? '#e3f2fd' : 'transparent',
                        color: currentView === 'settings' ? '#1976d2' : '#5f6368',
                        '&.Mui-selected': { bgcolor: '#e3f2fd', color: '#1976d2' }
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><Settings /></ListItemIcon>
                    <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItemButton>
            </ListItem>
        </List>
    </Paper>
);

interface LocalQR {
    id: string;
    url: string;
    email?: string;
    createdAt: string;
    shortUrl: string;
    status?: 'active' | 'paused'; // New field for UI state
    scans?: number;
}

export default function DashboardPage() {
    const [qrs, setQrs] = useState<LocalQR[]>([]);
    const [mounted, setMounted] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [loginOpen, setLoginOpen] = useState(false);
    const [emailInput, setEmailInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentView, setCurrentView] = useState('my-codes');

    // Dialog States
    const [editOpen, setEditOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedQr, setSelectedQr] = useState<LocalQR | null>(null);

    useEffect(() => {
        setMounted(true);
        const storedEmail = localStorage.getItem('user_email');
        if (storedEmail) {
            setUserEmail(storedEmail);
            fetchQrs(storedEmail);
        } else {
            setLoginOpen(true);
        }
    }, []);

    const fetchQrs = async (email: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/user/links?email=${encodeURIComponent(email)}`);
            if (res.ok) {
                const data = await res.json();
                // Augment data with default status if missing
                const augmented = data.map((d: any) => ({ ...d, status: 'active' }));
                setQrs(augmented);
            }
        } catch (e) {
            console.error("Failed to load QRs", e);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        if (!emailInput) return;
        localStorage.setItem('user_email', emailInput);
        setUserEmail(emailInput);
        setLoginOpen(false);
        fetchQrs(emailInput);
    };

    const handleLogout = () => {
        localStorage.removeItem('user_email');
        setUserEmail("");
        setQrs([]);
        setLoginOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this QR code? This action cannot be undone.")) {
            const newQrs = qrs.filter(q => q.id !== id);
            setQrs(newQrs);
            // TODO: Call API to delete
        }
    };

    const handleDownload = (id: string, url: string) => {
        const canvas = document.getElementById(`qr-canvas-${id}`) as HTMLCanvasElement;
        if (canvas) {
            const pngUrl = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = pngUrl;
            a.download = `qrcode-${id}.png`;
            a.click();
        }
    };

    const handleEdit = (qr: LocalQR) => {
        setSelectedQr(qr);
        setEditOpen(true);
    };

    const handleView = (qr: LocalQR) => {
        setSelectedQr(qr);
        setViewOpen(true);
    };

    const togglePause = (id: string) => {
        setQrs(qrs.map(q => {
            if (q.id === id) {
                return { ...q, status: q.status === 'active' ? 'paused' : 'active' };
            }
            return q;
        }));
    };

    if (!mounted) return null;

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa", display: 'flex' }}>
            <Sidebar currentView={currentView} onChangeView={setCurrentView} />

            {/* --- Left Sidebar Ad (Always Visible) --- */}
            <Box sx={{
                display: { xs: 'none', xl: 'block' },
                position: 'fixed',
                left: 300,
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

            {/* --- Right Sidebar Ad (Always Visible) --- */}
            <Box sx={{
                display: { xs: 'none', xl: 'flex' },
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

            <Box sx={{ flex: 1, ml: { xs: 0, md: '280px' }, display: 'flex', flexDirection: 'column' }}>
                {/* Dashboard Header */}
                <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#fff', borderBottom: '1px solid #e0e0e0', color: '#333' }}>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ display: { xs: 'block', md: 'none' } }}>
                            Dashboard
                        </Typography>
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', bgcolor: '#f1f3f4', px: 2, py: 0.5, borderRadius: 2, minWidth: 300 }}>
                            <Search sx={{ color: '#5f6368', mr: 1 }} />
                            <InputBase placeholder="Search your QR codes..." fullWidth sx={{ fontSize: '0.9rem' }} />
                        </Box>

                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button
                                variant="outlined"
                                sx={{ display: { xs: 'flex', md: 'none' } }}
                                startIcon={<Add />}
                                href="/"
                                component={Link}
                            >
                                New
                            </Button>
                            <IconButton><Notifications /></IconButton>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2', fontSize: '1rem', cursor: 'pointer' }} onClick={handleLogout} title="Logout">
                                {userEmail ? userEmail[0].toUpperCase() : 'U'}
                            </Avatar>
                        </Stack>
                    </Toolbar>
                </AppBar>

                {/* Content */}
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    {currentView === 'my-codes' && (
                        <>
                            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" mb={4}>
                                <Box>
                                    <Typography variant="h4" fontWeight={800} color="#202124" mb={0.5}>
                                        My QR Codes
                                    </Typography>
                                    <Typography variant="body2" color="#5f6368">
                                        Manage, track, and customize your generated codes.
                                    </Typography>
                                </Box>
                                {/* Summary Cards */}
                                <Stack direction="row" spacing={2} sx={{ mt: { xs: 2, sm: 0 } }}>
                                    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #e0e0e0', minWidth: 120 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Active QRs</Typography>
                                        <Typography variant="h4" fontWeight={800} color="#1976d2">{qrs.filter(q => q.status === 'active').length}</Typography>
                                    </Paper>
                                </Stack>
                            </Stack>

                            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                                <AdBanner728x90 adLabel="4" />
                            </Box>

                            {/* Mobile Ad Banner */}
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

                            {/* QR List */}
                            <Grid container spacing={3}>
                                {qrs.length === 0 ? (
                                    <Grid size={{ xs: 12 }}>
                                        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 4, border: '1px solid #eee' }}>
                                            <QrCode2 sx={{ fontSize: 48, color: '#ddd', mb: 2 }} />
                                            <Typography variant="h6" color="text.secondary">No QR codes found</Typography>
                                            <Typography variant="body2" color="text.secondary" mb={3}>Create your first QR code to see it here.</Typography>
                                            <Button variant="contained" href="/" component={Link}>Create Now</Button>
                                        </Paper>
                                    </Grid>
                                ) : (
                                    qrs.map((qr) => (
                                        <Grid size={{ xs: 12, lg: 6 }} key={qr.id}>
                                            <Card
                                                elevation={0}
                                                sx={{
                                                    borderRadius: 4,
                                                    border: '1px solid #e0e0e0',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        borderColor: '#1976d2',
                                                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                                                    }
                                                }}
                                            >
                                                <CardContent sx={{ p: 3 }}>
                                                    <Stack direction="row" spacing={3} alignItems="flex-start">
                                                        {/* QR Preview (Clickable) */}
                                                        <Box
                                                            sx={{
                                                                p: 1.5,
                                                                bgcolor: '#fff',
                                                                border: '1px solid #eee',
                                                                borderRadius: 2,
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={() => handleView(qr)}
                                                        >
                                                            <QRCodeCanvas
                                                                id={`qr-canvas-${qr.id}`}
                                                                value={qr.shortUrl}
                                                                size={100}
                                                            />
                                                        </Box>

                                                        {/* Info */}
                                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                                <Box>
                                                                    <Typography variant="subtitle1" fontWeight={700} noWrap title={qr.url} sx={{ mb: 0.5 }}>
                                                                        {qr.url}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                                        {qr.shortUrl}
                                                                    </Typography>
                                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                                        <Chip
                                                                            label={qr.status === 'active' ? 'Active' : 'Paused'}
                                                                            size="small"
                                                                            color={qr.status === 'active' ? 'success' : 'default'}
                                                                            variant="outlined"
                                                                            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                                                                        />
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            • Created {new Date(qr.createdAt).toLocaleDateString()}
                                                                        </Typography>
                                                                    </Stack>
                                                                </Box>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEdit(qr);
                                                                    }}
                                                                >
                                                                    <MoreVert />
                                                                </IconButton>
                                                            </Stack>
                                                        </Box>
                                                    </Stack>
                                                </CardContent>

                                                <Divider />

                                                {/* Actions */}
                                                <CardActions sx={{ px: 2, py: 1.5, justifyContent: 'space-between' }}>
                                                    <Stack direction="row" spacing={1}>
                                                        <Tooltip title="View Stats">
                                                            <IconButton component={Link} href={`/dashboard/stats/${qr.id}`} size="small" color="primary">
                                                                <BarChart fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="View QR">
                                                            <IconButton size="small" onClick={() => handleView(qr)}>
                                                                <Visibility fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Download">
                                                            <IconButton size="small" onClick={() => handleDownload(qr.id, qr.url)}>
                                                                <Download fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title={qr.status === 'active' ? "Pause" : "Resume"}>
                                                            <IconButton size="small" onClick={() => togglePause(qr.id)} color={qr.status === 'active' ? 'default' : 'success'}>
                                                                {qr.status === 'active' ? <PauseCircle fontSize="small" /> : <PlayCircle fontSize="small" />}
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>

                                                    <Stack direction="row" spacing={1}>
                                                        <Tooltip title="Edit">
                                                            <IconButton size="small" onClick={() => handleEdit(qr)}>
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete">
                                                            <IconButton size="small" color="error" onClick={() => handleDelete(qr.id)}>
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                )}
                            </Grid>
                        </>
                    )}

                    {currentView === 'analysis' && (
                        <Box>
                            <Typography variant="h4" fontWeight={800} color="#202124" mb={2}>Analytics Overview</Typography>
                            <Typography variant="body1" color="text.secondary">
                                Select a QR code from the Dashboard to view detailed analytics.
                            </Typography>
                            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setCurrentView('my-codes')}>
                                Go to Dashboard
                            </Button>
                        </Box>
                    )}

                    {currentView === 'settings' && (
                        <Box>
                            <Typography variant="h4" fontWeight={800} color="#202124" mb={2}>Settings</Typography>
                            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e0e0e0', maxWidth: 600 }}>
                                <Typography variant="h6" fontWeight={700} mb={2}>Account</Typography>
                                <Typography variant="body2" color="text.secondary" mb={2}>
                                    Logged in as: <strong>{userEmail}</strong>
                                </Typography>
                                <Button variant="outlined" color="error" onClick={handleLogout}>
                                    Log Out
                                </Button>
                            </Paper>
                        </Box>
                    )}

                    {/* --- Ads 6, 7, 8 Grid --- */}
                    <Box sx={{ mt: 8, mb: 8 }}>
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

                    {/* --- Native Ad (Ad Label 5) --- */}
                    <Box sx={{ mt: 8 }}>
                        <NativeAd adLabel="5" />
                    </Box>
                </Box>

                {/* Login Dialog */}
                <Dialog open={loginOpen} disableEscapeKeyDown>
                    <DialogTitle>Login to Dashboard</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Enter the email address you used to create your QR codes to access your history.
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="outlined"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => window.location.href = '/'} color="inherit">Cancel & Go Home</Button>
                        <Button onClick={handleLogin} variant="contained">Access Dashboard</Button>
                    </DialogActions>
                </Dialog>

                {/* Edit/Customize Dialog (Placeholder) */}
                <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Edit QR Code</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Customization options like color and logo are coming soon.
                        </Typography>
                        <TextField
                            margin="dense"
                            label="Destination URL"
                            fullWidth
                            variant="outlined"
                            value={selectedQr?.url || ''}
                            disabled
                            helperText="Destination URL cannot be changed yet."
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditOpen(false)}>Close</Button>
                        <Button variant="contained" disabled>Save Changes</Button>
                    </DialogActions>
                </Dialog>

                {/* View/Scan Dialog */}
                <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="xs" fullWidth>
                    <DialogTitle sx={{ textAlign: 'center' }}>Scan Me</DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 4 }}>
                        <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, border: '1px solid #eee', mb: 2 }}>
                            {selectedQr && (
                                <QRCodeCanvas value={selectedQr.shortUrl} size={250} />
                            )}
                        </Box>
                        <Typography variant="body1" fontWeight={600} align="center" gutterBottom>
                            {selectedQr?.url}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {selectedQr?.shortUrl}
                        </Typography>
                        <Stack direction="row" spacing={2} mt={3}>
                            <Button variant="outlined" startIcon={<Download />} onClick={() => selectedQr && handleDownload(selectedQr.id, selectedQr.url)}>
                                Download
                            </Button>
                        </Stack>
                    </DialogContent>
                </Dialog>
            </Box>
        </Box>
    );
}
