"use client";

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

interface AdBannerProps {
    width?: number;
    height?: number;
    adKey?: string;
}

export const AdBanner300x250 = () => {
    const adContainerRef = useRef<HTMLDivElement>(null);
    const scriptLoadedRef = useRef(false);

    useEffect(() => {
        // Prevent duplicate script loading
        if (scriptLoadedRef.current) return;

        // Configure ad options
        (window as any).atOptions = {
            'key': '67e830159b64ae4a1630b02bbab38e4b',
            'format': 'iframe',
            'height': 250,
            'width': 300,
            'params': {}
        };

        // Load the ad script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://www.highperformanceformat.com/67e830159b64ae4a1630b02bbab38e4b/invoke.js';
        script.async = true;

        if (adContainerRef.current) {
            adContainerRef.current.appendChild(script);
            scriptLoadedRef.current = true;
        }

        return () => {
            // Cleanup if needed
            if (adContainerRef.current && script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return (
        <Box
            ref={adContainerRef}
            sx={{
                width: '300px',
                height: '250px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                overflow: 'hidden'
            }}
        />
    );
};

export default AdBanner300x250;
