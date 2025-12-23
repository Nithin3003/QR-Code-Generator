"use client";

import { Box, Typography } from '@mui/material';

interface AdBannerProps {
    placement?: string;
}

export default function AdBanner300x250({ placement = "general" }: AdBannerProps) {
    return (
        <Box
            sx={{
                width: '300px',
                minHeight: '250px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                my: 2,
                p: 0,
                position: 'relative',
                border: '1px solid #f0f0f0',
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: '#fafafa'
            }}
        >
            <Typography
                variant="caption"
                sx={{
                    position: 'absolute',
                    top: 4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#999',
                    fontSize: 9,
                    letterSpacing: 1.5,
                    opacity: 0.5,
                    zIndex: 0
                }}
            >
                ADVERTISEMENT
            </Typography>

            {/* The 300x250 ad will load here via the script in layout.tsx */}
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 250
                }}
            >
                {/* PropellerAds 300x250 banner */}
            </Box>
        </Box>
    );
}

// 728x90 Leaderboard Banner Component
export function AdBanner728x90({ placement = "general" }: AdBannerProps) {
    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '728px',
                minHeight: '90px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                my: 2,
                p: 0,
                position: 'relative',
                border: '1px solid #f0f0f0',
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: '#fafafa'
            }}
        >
            <Typography
                variant="caption"
                sx={{
                    position: 'absolute',
                    top: 4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#999',
                    fontSize: 9,
                    letterSpacing: 1.5,
                    opacity: 0.5,
                    zIndex: 0
                }}
            >
                ADVERTISEMENT
            </Typography>

            {/* The 728x90 ad will load here via the script in layout.tsx */}
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 90
                }}
            >
                {/* PropellerAds 728x90 leaderboard */}
            </Box>
        </Box>
    );
}

// Native Banner Component
export function NativeBanner({ placement = "general" }: AdBannerProps) {
    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '800px',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                mx: 'auto',
                my: 3,
                p: 2,
                position: 'relative',
                border: '1px solid #f0f0f0',
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: '#fafafa'
            }}
        >
            <Typography
                variant="caption"
                sx={{
                    color: '#999',
                    fontSize: 9,
                    letterSpacing: 1.5,
                    mb: 1,
                    opacity: 0.6,
                    textAlign: 'center'
                }}
            >
                SPONSORED CONTENT
            </Typography>

            {/* Native Banner Container - PropellerAds will populate this */}
            <div id="container-9b4e84791703585706cbeb6c94a84d84" style={{ width: '100%' }}></div>
        </Box>
    );
}
