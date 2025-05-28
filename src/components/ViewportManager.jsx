import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ViewportManager = () => {
    const location = useLocation();

    const updateViewport = () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            if (location.pathname === '/tierlist') {
                // Get the actual screen width (accounting for device pixel ratio)
                const screenWidth = window.screen.width;
                if (screenWidth < 1024) {
                    // Add a small buffer (0.95) to ensure content fits
                    const scale = ((screenWidth / 1024) * 0.95).toFixed(3);
                    viewport.setAttribute('content', 
                        `width=1024, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}, user-scalable=no`
                    );

                    // Force a re-layout after a short delay to ensure the scale is applied
                    setTimeout(() => {
                        document.body.style.opacity = '0.99';
                        setTimeout(() => {
                            document.body.style.opacity = '1';
                        }, 10);
                    }, 100);
                } else {
                    viewport.setAttribute('content', 'width=1024, initial-scale=1.0');
                }
            } else {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=yes');
            }
        }
    };

    useEffect(() => {
        // Initial update
        updateViewport();

        // Update after a short delay to ensure proper calculation
        const timeoutId = setTimeout(updateViewport, 100);
        return () => clearTimeout(timeoutId);
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