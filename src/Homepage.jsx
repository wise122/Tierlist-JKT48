import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
    const [selectedOption, setSelectedOption] = useState('active');
    const navigate = useNavigate();

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleStart = () => {
        // Save the selection to localStorage
        localStorage.setItem('memberType', selectedOption);
        // Navigate to tierlist page
        navigate('/tierlist');
    };

    return (
        <div className="homepage-container">
            <h1 className="title">JKT48 Member Tierlist</h1>
            <div className="dropdown-container">
                <select 
                    value={selectedOption} 
                    onChange={handleOptionChange}
                    className="member-dropdown"
                >
                    <option value="active">Active Member</option>
                    <option value="ex">Ex Member</option>
                    <option value="all">All Member</option>
                </select>
                <button 
                    onClick={handleStart}
                    className="start-button"
                >
                    Start Making Tierlist
                </button>
            </div>
        </div>
    );
};

export default Homepage; 