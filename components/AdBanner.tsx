"use client";

import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';

// Adsterra 300x250 Banner - FIXED LOADING
export default function AdBanner300x250({ placement = "general" }: { placement?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [adLoaded, setAdLoaded] = useState(false);

    useEffect(() => {
        if (!containerRef.current || adLoaded) return;

        // Create unique container ID for this instance
        const uniqueId = `ad-${placement}-${Math.random().toString(36).substr(2, 9)}`;
        const adContainer = document.createElement('div');
        adContainer.id = uniqueId;

        // Add to DOM
        containerRef.current.appendChild(adContainer);

        // Create and inject the ad script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = `
            (function() {
                var atOptions = {
                    'key' : '67e830159b64ae4a1630b02bbab38e4b',
                    'format' : 'iframe',
                    'height' : 250,
                    'width' : 300,
                    'params' : {}
                };
                document.getElementById('${uniqueId}').innerHTML = '';
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.src = 'https://www.highperformanceformat.com/67e830159b64ae4a1630b02bbab38e4b/invoke.js';
                document.getElementById('${uniqueId}').appendChild(s);
            })();
        `;

        adContainer.appendChild(script);
        setAdLoaded(true);

        // Auto-hide after 15 seconds if ad doesn't load
        const timeout = setTimeout(() => {
            if (containerRef.current && !containerRef.current.querySelector('iframe')) {
                console.log('⚠️ Ad timeout:', placement);
            }
        }, 15000);

        return () => clearTimeout(timeout);
    }, [placement, adLoaded]);

    return (
        <Box
            ref={containerRef}
            suppressHydrationWarning
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
                AD • ADSTERRA
            </Typography>
        </Box>
    );
}

// Adsterra 728x90 Leaderboard - FIXED LOADING
export function AdBanner728x90({ placement = "general" }: { placement?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [adLoaded, setAdLoaded] = useState(false);

    useEffect(() => {
        if (!containerRef.current || adLoaded) return;

        const uniqueId = `ad-728-${placement}-${Math.random().toString(36).substr(2, 9)}`;
        const adContainer = document.createElement('div');
        adContainer.id = uniqueId;

        containerRef.current.appendChild(adContainer);

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = `
            (function() {
                var atOptions = {
                    'key' : 'b29ad6bfaa9af19133c9f78db0f3f771',
                    'format' : 'iframe',
                    'height' : 90,
                    'width' : 728,
                    'params' : {}
                };
                document.getElementById('${uniqueId}').innerHTML = '';
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.src = 'https://www.highperformanceformat.com/b29ad6bfaa9af19133c9f78db0f3f771/invoke.js';
                document.getElementById('${uniqueId}').appendChild(s);
            })();
        `;

        adContainer.appendChild(script);
        setAdLoaded(true);

        return () => { };
    }, [placement, adLoaded]);

    return (
        <Box
            ref={containerRef}
            suppressHydrationWarning
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
                AD • ADSTERRA
            </Typography>
        </Box>
    );
}

// Adsterra Native Banner - FIXED LOADING
export function NativeBanner({ placement = "general" }: { placement?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [adLoaded, setAdLoaded] = useState(false);

    useEffect(() => {
        if (!containerRef.current || adLoaded) return;

        const uniqueId = `native-${placement}-${Math.random().toString(36).substr(2, 9)}`;
        const adContainer = document.createElement('div');
        adContainer.id = 'container-9b4e84791703585706cbeb6c94a84d84';

        containerRef.current.appendChild(adContainer);

        const script = document.createElement('script');
        script.async = true;
        script.dataset.cfasync = 'false';
        script.src = 'https://pl28316798.effectivegatecpm.com/9b4e84791703585706cbeb6c94a84d84/invoke.js';

        adContainer.appendChild(script);
        setAdLoaded(true);

        return () => { };
    }, [placement, adLoaded]);

    return (
        <Box
            ref={containerRef}
            suppressHydrationWarning
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
                SPONSORED • ADSTERRA
            </Typography>
        </Box>
    );
}

// Adsterra Popunder
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

    return null;
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

    return null;
}

// Additional Ad Tag Zone
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

    return null;
}

// PropellerAds - Push Notifications
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

// PropellerAds - Vignette Banner
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

// PropellerAds - In-Page Push
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

// PropellerAds - OnClick Popunder WITH FREQUENCY CAPPING
export function PropellerOnClickPopunder() {
    const loadedRef = useRef(false);

    useEffect(() => {
        if (loadedRef.current || typeof window === 'undefined') return;

        // Frequency capping
        const STORAGE_KEY = 'propeller_onclick_shown';
        const lastShown = localStorage.getItem(STORAGE_KEY);
        const now = Date.now();
        const ONE_HOUR = 60 * 60 * 1000;

        if (lastShown && (now - parseInt(lastShown)) < ONE_HOUR) {
            console.log('🚫 OnClick Popunder: Frequency cap active, skipping');
            return;
        }

        localStorage.setItem(STORAGE_KEY, now.toString());
        console.log('✅ OnClick Popunder: Loaded (next allowed in 1 hour)');

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
