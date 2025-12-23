"use client";

import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';

// Adsterra 300x250 Banner
export default function AdBanner300x250({ placement = "general" }: { placement?: string }) {
    const adRef = useRef<HTMLDivElement>(null);
    const loadedRef = useRef(false);
    const [showPlaceholder, setShowPlaceholder] = useState(true);

    useEffect(() => {
        if (loadedRef.current || !adRef.current) return;

        const scriptConfig = document.createElement('script');
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
        scriptInvoke.src = 'https://www.highperformanceformat.com/67e830159b64ae4a1630b02bbab38e4b/invoke.js';
        scriptInvoke.async = true;

        adRef.current.appendChild(scriptConfig);
        adRef.current.appendChild(scriptInvoke);
        loadedRef.current = true;

        // Hide after 10 seconds if ad doesn't load
        const timeout = setTimeout(() => setShowPlaceholder(false), 10000);
        return () => clearTimeout(timeout);
    }, []);

    // Don't render if timed out
    if (!showPlaceholder) return null;

    return (
        <Box
            ref={adRef}
            sx={{
                width: '300px',
                minHeight: '250px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                border: '1px solid #f0f0f0',
                borderRadius: 2,
                bgcolor: '#fafafa',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Typography variant="caption" sx={{ position: 'absolute', top: 4, fontSize: 8, color: '#999', opacity: 0.5, zIndex: 1 }}>
                ADVERTISEMENT
            </Typography>

            {/* Nice placeholder while ad loads */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                py: 4
            }}>
                <Box sx={{
                    fontSize: 32,
                    opacity: 0.3,
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                        '0%, 100%': { opacity: 0.3 },
                        '50%': { opacity: 0.6 }
                    }
                }}>
                    📢
                </Box>
                <Typography variant="caption" sx={{ color: '#bbb', fontSize: 11, textAlign: 'center', px: 2 }}>
                    Ad content loading...
                </Typography>
            </Box>
        </Box>
    );
}

// Adsterra 728x90 Leaderboard
export function AdBanner728x90({ placement = "general" }: { placement?: string }) {
    const adRef = useRef<HTMLDivElement>(null);
    const loadedRef = useRef(false);
    const [showPlaceholder, setShowPlaceholder] = useState(true);

    useEffect(() => {
        if (loadedRef.current || !adRef.current) return;

        const scriptConfig = document.createElement('script');
        scriptConfig.innerHTML = `
            atOptions = {
                'key' : 'b29ad6bfaa9af19133c9f78db0f3f771',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
            };
        `;

        const scriptInvoke = document.createElement('script');
        scriptInvoke.src = 'https://www.highperformanceformat.com/b29ad6bfaa9af19133c9f78db0f3f771/invoke.js';
        scriptInvoke.async = true;

        adRef.current.appendChild(scriptConfig);
        adRef.current.appendChild(scriptInvoke);
        loadedRef.current = true;

        // Hide after 10 seconds if ad doesn't load
        const timeout = setTimeout(() => setShowPlaceholder(false), 10000);
        return () => clearTimeout(timeout);
    }, []);

    // Don't render if timed out
    if (!showPlaceholder) return null;

    return (
        <Box
            ref={adRef}
            sx={{
                width: '100%',
                maxWidth: '728px',
                minHeight: '90px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                gap: 2,
                border: '1px solid #f0f0f0',
                borderRadius: 2,
                bgcolor: '#fafafa',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Typography variant="caption" sx={{ position: 'absolute', top: 4, fontSize: 8, color: '#999', opacity: 0.5, zIndex: 1 }}>
                ADVERTISEMENT
            </Typography>
            <Box sx={{ fontSize: 24, opacity: 0.3, animation: 'pulse 2s ease-in-out infinite' }}>📊</Box>
            <Typography variant="caption" sx={{ color: '#bbb', fontSize: 10 }}>Loading banner ad...</Typography>
        </Box>
    );
}

// Adsterra Native Banner
export function NativeBanner({ placement = "general" }: { placement?: string }) {
    const adRef = useRef<HTMLDivElement>(null);
    const loadedRef = useRef(false);
    const [showPlaceholder, setShowPlaceholder] = useState(true);

    useEffect(() => {
        if (loadedRef.current || !adRef.current) return;

        const script = document.createElement('script');
        script.async = true;
        script.dataset.cfasync = 'false';
        script.src = 'https://pl28316798.effectivegatecpm.com/9b4e84791703585706cbeb6c94a84d84/invoke.js';

        adRef.current.appendChild(script);
        loadedRef.current = true;

        // Hide after 10 seconds if ad doesn't load
        const timeout = setTimeout(() => setShowPlaceholder(false), 10000);
        return () => clearTimeout(timeout);
    }, []);

    // Don't render if timed out
    if (!showPlaceholder) return null;

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '800px',
                minHeight: '120px',
                mx: 'auto',
                my: 2,
                p: 2,
                border: '1px solid #f0f0f0',
                borderRadius: 3,
                bgcolor: '#fafafa',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Typography variant="caption" sx={{ fontSize: 8, color: '#999', opacity: 0.6, mb: 1, display: 'block', textAlign: 'center', zIndex: 1, position: 'relative' }}>
                SPONSORED CONTENT
            </Typography>
            <div id="container-9b4e84791703585706cbeb6c94a84d84" ref={adRef} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, py: 2 }}>
                <Box sx={{ fontSize: 28, opacity: 0.3, animation: 'pulse 2s ease-in-out infinite' }}>🎯</Box>
                <Typography variant="caption" sx={{ color: '#bbb', fontSize: 11 }}>Loading native content...</Typography>
            </Box>
        </Box>
    );
}

// Adsterra Popunder - Loads once on page
export function PopunderAd() {
    const loadedRef = useRef(false);

    useEffect(() => {
        if (loadedRef.current || typeof window === 'undefined') return;

        const script = document.createElement('script');
        script.src = 'https://pl28316797.effectivegatecpm.com/ad/39/16/ad391620cfa4a924ec927c81dfc78824.js';
        script.async = true;

        document.body.appendChild(script);
        loadedRef.current = true;

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return null; // Popunder doesn't need visual component
}

// Adsterra Social Bar
export function SocialBar() {
    const loadedRef = useRef(false);

    useEffect(() => {
        if (loadedRef.current || typeof window === 'undefined') return;

        const script = document.createElement('script');
        script.src = 'https://pl28316810.effectivegatecpm.com/47/e8/1c/47e81cb75a002934d7dedacb12edca54.js';
        script.async = true;

        document.body.appendChild(script);
        loadedRef.current = true;

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return null; // Social bar is positioned automatically
}

// Additional Ad Tag Zone (quge5.com - Zone 195419)
export function AdTagZone() {
    const loadedRef = useRef(false);

    useEffect(() => {
        if (loadedRef.current || typeof window === 'undefined') return;

        const script = document.createElement('script');
        script.src = 'https://quge5.com/88/tag.min.js';
        script.dataset.zone = '195419';
        script.async = true;
        script.dataset.cfasync = 'false';

        document.body.appendChild(script);
        loadedRef.current = true;

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return null; // Loads globally
}

// PropellerAds - Push Notifications (Zone 10364466)
export function PropellerPushNotifications() {
    const loadedRef = useRef(false);

    useEffect(() => {
        if (loadedRef.current || typeof window === 'undefined') return;

        const script = document.createElement('script');
        script.src = 'https://3nbf4.com/pfe/current/micro.tag.min.js?z=10364466';
        script.dataset.cfasync = 'false';
        script.async = true;

        document.body.appendChild(script);
        loadedRef.current = true;

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return null;
}

// PropellerAds - Vignette Banner (Zone 10364465)
export function PropellerVignetteBanner() {
    const loadedRef = useRef(false);

    useEffect(() => {
        if (loadedRef.current || typeof window === 'undefined') return;

        const script = document.createElement('script');
        script.src = 'https://3nbf4.com/vignette/current/vignette.min.js?z=10364465';
        script.dataset.cfasync = 'false';
        script.async = true;

        document.body.appendChild(script);
        loadedRef.current = true;

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return null;
}

// PropellerAds - In-Page Push (Zone 10364464)
export function PropellerInPagePush() {
    const loadedRef = useRef(false);

    useEffect(() => {
        if (loadedRef.current || typeof window === 'undefined') return;

        const script = document.createElement('script');
        script.src = 'https://3nbf4.com/inpage/current/inpage.min.js?z=10364464';
        script.dataset.cfasync = 'false';
        script.async = true;

        document.body.appendChild(script);
        loadedRef.current = true;

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return null;
}

// PropellerAds - OnClick Popunder (Zone 10364463)
export function PropellerOnClickPopunder() {
    const loadedRef = useRef(false);

    useEffect(() => {
        if (loadedRef.current || typeof window === 'undefined') return;

        const script = document.createElement('script');
        script.src = 'https://3nbf4.com/onclick/current/onclick.min.js?z=10364463';
        script.dataset.cfasync = 'false';
        script.async = true;

        document.body.appendChild(script);
        loadedRef.current = true;

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return null;
}
