"use client";
import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography, Paper, TextField, Button as MuiButton } from "@mui/material";

interface ScanData {
    date: string;
    scans: number;
}

export default function AdminPage() {
    const [authorized, setAuthorized] = useState(false);
    const [password, setPassword] = useState("");
    const [stats, setStats] = useState<ScanData[]>([]);

    const handleLogin = () => {
        // Simple environment variable check (In production, use NextAuth)
        // For this MVP, we match against a client-side check or a server action
        // Here we just simulate a "secret" check.
        if (password === "antigravity") {
            setAuthorized(true);
            // Mock Data for the Chart
            setStats([
                { date: 'Mon', scans: 12 },
                { date: 'Tue', scans: 19 },
                { date: 'Wed', scans: 3 },
                { date: 'Thu', scans: 45 },
                { date: 'Fri', scans: 80 },
                { date: 'Sat', scans: 120 },
                { date: 'Sun', scans: 150 },
            ]);
        } else {
            alert("Access Denied");
        }
    };

    if (!authorized) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="bg-neutral-900 p-8 rounded-2xl border border-white/10 w-full max-w-md space-y-4">
                    <Typography variant="h5" color="white" align="center">Restricted Access</Typography>
                    <TextField
                        fullWidth
                        type="password"
                        label="Enter Secret Key"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ input: { color: 'white' }, label: { color: 'gray' }, fieldset: { borderColor: 'gray' } }}
                    />
                    <MuiButton fullWidth variant="contained" onClick={handleLogin}>Authenticate</MuiButton>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <Typography variant="h4" className="mb-8 font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                    Mission Control
                </Typography>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Typography variant="h6" color="cyan" gutterBottom>Scan Velocity (7 Days)</Typography>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats}>
                                    <defs>
                                        <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="date" stroke="#666" />
                                    <YAxis stroke="#666" />
                                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                                    <Area type="monotone" dataKey="scans" stroke="#06b6d4" fillOpacity={1} fill="url(#colorScans)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Paper>

                    <div className="space-y-4">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/20">
                            <div className="text-gray-400 text-sm uppercase tracking-wider">Total Active Links</div>
                            <div className="text-5xl font-mono mt-2 text-purple-400">1,024</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-900/20 to-black border border-green-500/20">
                            <div className="text-gray-400 text-sm uppercase tracking-wider">Global Scans</div>
                            <div className="text-5xl font-mono mt-2 text-green-400">85,291</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
