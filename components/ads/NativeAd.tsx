"use client";

import React, { useEffect, useRef, useState } from 'react';

interface NativeAdProps {
    adLabel?: string;
    placement?: string;
}

export const NativeAd: React.FC<NativeAdProps> = ({ adLabel, placement }) => {
    const label = adLabel || (placement ? "5" : undefined); // Fallback to 5 for any placement if adLabel missing
    const containerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && containerRef.current && !containerRef.current.querySelector('script')) {
            const script = document.createElement('script');
            script.async = true;
            script.dataset.cfasync = "false";
            script.src = "https://pl28316798.effectivegatecpm.com/9b4e84791703585706cbeb6c94a84d84/invoke.js";

            containerRef.current.appendChild(script);
        }
    }, [mounted]);

    if (!mounted) {
        return <div className="w-full flex justify-center my-8" style={{ minHeight: '100px' }} />;
    }

    return (
        <div className="w-full flex flexDirection-column items-center my-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {adLabel && (
                <div style={{
                    position: 'absolute',
                    top: -24,
                    left: 0,
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 100,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                    Ad #{label}
                </div>
            )}
            <div id="container-9b4e84791703585706cbeb6c94a84d84" ref={containerRef} style={{ border: label ? '1px dashed rgba(255,0,0,0.3)' : 'none' }}></div>
        </div>
    );
};
