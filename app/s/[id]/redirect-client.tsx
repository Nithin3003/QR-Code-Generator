"use client";

import React, { useEffect, useState } from 'react';
import {
    LinearProgress,
    Button,
    Typography,
    Paper,
    Box,
    Stack
} from "@mui/material";
import { motion } from "framer-motion";

interface Props {
    destination: string;
    shortId: string;
}

export default function RedirectClient({ destination, shortId }: Props) {
    const [timeLeft, setTimeLeft] = useState(3);
    const [canSkip, setCanSkip] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const hasTracked = React.useRef(false);

    let safeDestination = destination;
    if (!safeDestination.startsWith('http://') && !safeDestination.startsWith('https://')) {
        safeDestination = `https://${safeDestination}`;
    }

    useEffect(() => {
        setIsMounted(true);

        if (!hasTracked.current) {
            hasTracked.current = true;
            fetch('/api/track', {
                method: 'POST',
                keepalive: true,
                body: JSON.stringify({
                    shortId: shortId,
                    country: 'Unknown-Client',
                    ua: navigator.userAgent,
                    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
                })
            }).catch(err => console.log('Tracking error', err));
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    window.location.href = safeDestination;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        setTimeout(() => setCanSkip(true), 200);

        return () => clearInterval(interval);
    }, [safeDestination, shortId]);

    const progress = ((3 - timeLeft) / 3) * 100;

    if (!isMounted) return null;

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 6,
                border: "1px solid #dadce0",
                textAlign: "center",
                boxShadow: "0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)"
            }}
        >
            <Stack spacing={4}>
                <Box>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            color: "#202124",
                            mb: 1,
                            letterSpacing: -0.5
                        }}
                    >
                        Incoming Transmission...
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#5f6368" }}>
                        Redirecting you in <span style={{ color: "#1976d2", fontWeight: 800 }}>{timeLeft}</span> seconds.
                    </Typography>
                </Box>

                <Box sx={{ width: '100%' }}>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: '#f1f3f4',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#1976d2',
                                borderRadius: 5
                            }
                        }}
                    />
                </Box>

                <Box sx={{ minHeight: 48, display: "flex", justifyContent: "center" }}>
                    {canSkip && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ width: "100%" }}
                        >
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={() => window.location.href = safeDestination}
                                sx={{
                                    bgcolor: '#1976d2',
                                    color: '#fff',
                                    fontWeight: 700,
                                    py: 1.5,
                                    borderRadius: 10,
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    boxShadow: "none",
                                    '&:hover': { bgcolor: '#1565c0', boxShadow: "none" }
                                }}
                            >
                                Continue Immediately &rarr;
                            </Button>
                        </motion.div>
                    )}
                </Box>
            </Stack>
        </Paper>
    );
}
