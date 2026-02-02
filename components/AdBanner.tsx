"use client";

import React from 'react';
import { AdFrame } from './ads/AdFrame';
import { NativeAd } from './ads/NativeAd';

// 300x250 Ad Component
const AdBanner300x250 = ({ adLabel, placement }: { adLabel?: string, placement?: string }) => {
    return (
        <AdFrame
            adLabel={adLabel || (placement ? "6" : undefined)}
            width={300}
            height={250}
            adCode={`
                <script type="text/javascript">
                    atOptions = {
                        'key' : '67e830159b64ae4a1630b02bbab38e4b',
                        'format' : 'iframe',
                        'height' : 250,
                        'width' : 300,
                        'params' : {}
                    };
                </script>
                <script type="text/javascript" src="//www.highperformanceformat.com/67e830159b64ae4a1630b02bbab38e4b/invoke.js"></script>
            `}
        />
    );
};

// 728x90 Ad Component
export const AdBanner728x90 = ({ adLabel, placement }: { adLabel?: string, placement?: string }) => {
    return (
        <AdFrame
            adLabel={adLabel || (placement ? "4" : undefined)}
            width={728}
            height={90}
            adCode={`
                <script type="text/javascript">
                    atOptions = {
                        'key' : 'b29ad6bfaa9af19133c9f78db0f3f771',
                        'format' : 'iframe',
                        'height' : 90,
                        'width' : 728,
                        'params' : {}
                    };
                </script>
                <script type="text/javascript" src="//www.highperformanceformat.com/b29ad6bfaa9af19133c9f78db0f3f771/invoke.js"></script>
            `}
        />
    );
};

// Native Ad Re-export
export const NativeBanner = NativeAd;

// Legacy / Removed Ad Components (No-op)
export const SocialBar = ({ placement }: { placement?: string }) => null;
export const PopunderAd = ({ placement }: { placement?: string }) => null;
export const AdTagZone = ({ placement }: { placement?: string }) => null;
export const PropellerPushNotifications = ({ placement }: { placement?: string }) => null;
export const PropellerVignetteBanner = ({ placement }: { placement?: string }) => null;
export const PropellerInPagePush = ({ placement }: { placement?: string }) => null;

export default AdBanner300x250;
