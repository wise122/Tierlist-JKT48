import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ViewportManager = () => {
    const location = useLocation();

    useEffect(() => {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            if (location.pathname === '/tierlist') {
                // Calculate the zoom level needed to fit 1024px width
                const screenWidth = window.innerWidth;
                if (screenWidth < 1024) {
                    const scale = (screenWidth / 1024).toFixed(2);
                    viewport.setAttribute('content', `width=1024, initial-scale=${scale}, maximum-scale=${scale}, user-scalable=no`);
                } else {
                    viewport.setAttribute('content', 'width=1024, initial-scale=1.0');
                }
            } else {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=yes');
            }
        }
    }, [location]);

    // Also handle resize events for better responsiveness
    useEffect(() => {
        const handleResize = () => {
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport && location.pathname === '/tierlist') {
                const screenWidth = window.innerWidth;
                if (screenWidth < 1024) {
                    const scale = (screenWidth / 1024).toFixed(2);
                    viewport.setAttribute('content', `width=1024, initial-scale=${scale}, maximum-scale=${scale}, user-scalable=no`);
                } else {
                    viewport.setAttribute('content', 'width=1024, initial-scale=1.0');
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [location]);

    return null;
};

export default ViewportManager; 