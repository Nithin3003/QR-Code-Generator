"use client";

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

export const AdBanner300x250 = () => {
    const adContainerRef = useRef<HTMLDivElement>(null);
    const adLoadedRef = useRef(false);

    useEffect(() => {
        if (adLoadedRef.current || !adContainerRef.current) return;

        try {
            // Create a unique container ID for this ad instance
            const containerId = `ad-${Math.random().toString(36).substr(2, 9)}`;
            adContainerRef.current.id = containerId;

            // Create script element with atOptions inline
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

            // Create invoke script
            const scriptInvoke = document.createElement('script');
            scriptInvoke.type = 'text/javascript';
            scriptInvoke.src = '//www.highperformanceformat.com/67e830159b64ae4a1630b02bbab38e4b/invoke.js';
            scriptInvoke.async = true;

            // Append both scripts
            adContainerRef.current.appendChild(scriptConfig);
            adContainerRef.current.appendChild(scriptInvoke);

            adLoadedRef.current = true;
        } catch (error) {
            console.error('Ad loading error:', error);
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
                position: 'relative'
            }}
        />
    );
};

export default AdBanner300x250;
