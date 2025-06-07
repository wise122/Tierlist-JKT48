import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ViewportManager = () => {
    const location = useLocation();

    const updateViewport = () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            // Check if current route is either tierlist or tierlist_lagu
            if (location.pathname === '/tierlist' || location.pathname === '/tierlist_lagu') {
                // Get the actual screen width (accounting for device pixel ratio)
                const screenWidth = window.screen.width;
                if (screenWidth < 1024) {
                    // Add a small buffer (0.95) to ensure content fits
                    const scale = ((screenWidth / 1024) * 0.95).toFixed(3);
                    viewport.setAttribute('content', 
                        `width=1024, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}, user-scalable=no`
                    );

                    // Apply styles to ensure footer displays correctly
                    document.documentElement.style.setProperty('--viewport-scale', scale);
                    document.body.style.minHeight = `${Math.ceil(100 / parseFloat(scale))}vh`;

                    // Force a re-layout after a short delay to ensure the scale is applied
                    setTimeout(() => {
                        document.body.style.opacity = '0.99';
                        setTimeout(() => {
                            document.body.style.opacity = '1';
                        }, 10);
                    }, 100);
                } else {
                    viewport.setAttribute('content', 'width=1024, initial-scale=1.0');
                    document.documentElement.style.removeProperty('--viewport-scale');
                    document.body.style.minHeight = '100vh';
                }
            } else {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=yes');
                document.documentElement.style.removeProperty('--viewport-scale');
                document.body.style.minHeight = '100vh';
            }
        }
    };

    useEffect(() => {
        // Initial update
        updateViewport();

        // Update after a short delay to ensure proper calculation
        const timeoutId = setTimeout(updateViewport, 100);
        return () => {
            clearTimeout(timeoutId);
            // Reset viewport and styles when component unmounts
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=yes');
            }
            document.documentElement.style.removeProperty('--viewport-scale');
            document.body.style.minHeight = '100vh';
        };
    }, [location]);

    useEffect(() => {
        // Handle orientation changes and resizes
        const handleResize = () => {
            // Add a small delay to ensure proper calculation after resize/rotation
            setTimeout(updateViewport, 100);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, [location]);

    return null;
};

export default ViewportManager; 