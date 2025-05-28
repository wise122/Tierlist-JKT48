import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ViewportManager = () => {
    const location = useLocation();

    useEffect(() => {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            if (location.pathname === '/tierlist') {
                viewport.setAttribute('content', 'width=1024, initial-scale=1.0');
            } else {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
            }
        }
    }, [location]);

    return null;
};

export default ViewportManager; 