import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import logo from '/asset/icon/HomepageLogo.png';

const Homepage = () => {
    const navigate = useNavigate();

    return (
        <div className="homepage-container">
            <img src={logo} alt="JKT48 Fan Tools Logo" className="app-logo" />
            <h1 className="title">JKT48 Fan Tools</h1>
            <div className="nav-buttons-container">
                <button 
                    className="nav-button"
                    onClick={() => navigate('/homepagetierlist')}
                >
                    Tierlist Maker
                </button>
                <button 
                    className="nav-button"
                    onClick={() => navigate('/calculator')}
                >
                    Wishlist Calculator
                </button>
            </div>
        </div>
    );
};

export default Homepage; 