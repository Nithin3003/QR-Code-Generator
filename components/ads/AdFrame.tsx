"use client";

import React, { useEffect, useRef, useState } from 'react';

interface AdFrameProps {
    width: number;
    height: number;
    adCode: string;
    title?: string;
    className?: string;
    adLabel?: string;
}

export const AdFrame: React.FC<AdFrameProps> = ({ width, height, adCode, title = "Advertisement", className, adLabel }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const iframe = iframeRef.current;
        if (iframe) {
            const doc = iframe.contentWindow?.document;
            if (doc) {
                doc.open();
                doc.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; overflow: hidden; }
                        </style>
                    </head>
                    <body>
                        ${adCode}
                    </body>
                    </html>
                `);
                doc.close();
            }
        }
    }, [adCode, mounted]);

    // Render a placeholder with exact dimensions to prevent layout shift during hydration
    if (!mounted) {
        return (
            <div
                className={`ad-container ${className || ''}`}
                style={{ width: width, height: height, margin: '0 auto', background: '#f8f9fa' }}
            />
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
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
                    Ad #{adLabel}
                </div>
            )}
            <div className={`ad-container ${className || ''}`} style={{ width: width, height: height, margin: '0 auto', border: adLabel ? '1px dashed rgba(255,0,0,0.3)' : 'none' }}>
                <iframe
                    ref={iframeRef}
                    title={title}
                    width={width}
                    height={height}
                    style={{ border: 'none', overflow: 'hidden' }}
                    scrolling="no"
                />
            </div>
        </div>
    );
};
