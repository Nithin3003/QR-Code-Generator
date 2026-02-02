import React from 'react';
import { Box, Typography } from '@mui/material';

export const LogoIcon = ({ size = 32 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="url(#logo_grad)" />
        <path d="M8 8H14V14H8V8Z" fill="white" />
        <path d="M18 8H24V14H18V8Z" fill="white" />
        <path d="M8 18H14V24H8V18Z" fill="white" />
        <path d="M18 18H21V21H18V18Z" fill="white" />
        <path d="M21 21H24V24H21V21Z" fill="white" />
        <path d="M21 18H24V21H21V18Z" fill="white" opacity="0.5" />
        <path d="M18 21H21V24H18V21Z" fill="white" opacity="0.5" />
        <defs>
            <linearGradient id="logo_grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1976D2" />
                <stop offset="1" stopColor="#64B5F6" />
            </linearGradient>
        </defs>
    </svg>
);

export const BrandLogo = ({ size = 32 }: { size?: number }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}>
        <LogoIcon size={size} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 800, letterSpacing: -0.5, fontSize: { xs: "1.2rem", md: "1.4rem" }, color: "#202124" }}>
            QR<span style={{ color: "#1976d2" }}>Code</span>
        </Typography>
    </Box>
);
