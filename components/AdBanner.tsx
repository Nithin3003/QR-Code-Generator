"use client";

import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';

// Adsterra 300x250 Banner
export const AdBanner300x250 = () => {
    const adContainerRef = useRef<HTMLDivElement>(null);
    const adLoadedRef = useRef(false);

    useEffect(() => {
        if (adLoadedRef.current || !adContainerRef.current) return;

        try {
            const scriptConfig = document.createElement('script');
            scriptConfig.type = 'text/javascript';
            scriptConfig.innerHTML = `
                atOptions = {
                    'key' : '67e830159b64ae4a1630b02bbab38e4b',
                    'format' : 'iframe',
                    'height' : 250,
                    'width' : 300,
                    'params' : {}
                };
            `;

            const scriptInvoke = document.createElement('script');
            scriptInvoke.type = 'text/javascript';
            scriptInvoke.src = '//www.highperformanceformat.com/67e830159b64ae4a1630b02bbab38e4b/invoke.js';
            scriptInvoke.async = true;

            adContainerRef.current.appendChild(scriptConfig);
            adContainerRef.current.appendChild(scriptInvoke);

            adLoadedRef.current = true;
        } catch (error) {
            console.error('Adsterra ad loading error:', error);
        }
    }, []);

    return (
        <Box
            ref={adContainerRef}
            sx={{
                minWidth: '300px',
                minHeight: '250px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                bgcolor: '#fafafa',
                borderRadius: 2,
                border: '1px solid #f0f0f0'
            }}
        />
    );
};

// PropellerAds Container
export const PropellerAd = ({ containerId }: { containerId: string }) => {
    const adRef = useRef<HTMLDivElement>(null);
    const loadedRef = useRef(false);

    useEffect(() => {
        if (loadedRef.current || !adRef.current) return;

        try {
            const script = document.createElement('script');
            script.async = true;
            script.dataset.cfasync = 'false';
            script.src = '//pl24183952.profitablecpmrate.com/5f51a81584d19c2bdbde3b56bee480e0/invoke.js';

            adRef.current.appendChild(script);
            loadedRef.current = true;
        } catch (error) {
            console.error('PropellerAds loading error:', error);
        }
    }, []);

    return (
        <Box
            sx={{
                minWidth: '300px',
                minHeight: '250px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                bgcolor: '#fafafa',
                borderRadius: 2,
                border: '1px solid #f0f0f0'
            }}
        >
            <div id={containerId} ref={adRef} />
        </Box>
    );
};

// Ezoic Placeholder
export const EzoicAd = ({ placeholderId }: { placeholderId: string }) => {
    return (
        <Box
            sx={{
                minWidth: '300px',
                minHeight: '250px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                bgcolor: '#fafafa',
                borderRadius: 2,
                border: '1px solid #f0f0f0'
            }}
        >
            <div id={placeholderId} style={{ minHeight: '250px', minWidth: '300px' }} />
        </Box>
    );
};

// Ad Container with Label
interface AdContainerProps {
    children: React.ReactNode;
    label?: string;
}

export const AdContainer = ({ children, label = "SPONSORED" }: AdContainerProps) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                my: 4,
                py: 3,
                borderRadius: 3,
                bgcolor: 'rgba(0,0,0,0.02)',
                transition: 'all 0.3s ease'
            }}
        >
            <Typography
                variant="caption"
                sx={{
                    color: '#999',
                    fontSize: 9,
                    letterSpacing: 1.5,
                    mb: 2,
                    fontWeight: 600,
                    opacity: 0.6
                }}
            >
                {label}
            </Typography>
            {children}
        </Box>
    );
};

export default AdBanner300x250;
