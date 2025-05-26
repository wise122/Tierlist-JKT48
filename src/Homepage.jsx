import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import logo from './assets/icon/TierlistIcon.png';

const Homepage = () => {
    const [selectedMemberType, setSelectedMemberType] = useState('active');
    const [selectedGeneration, setSelectedGeneration] = useState('all');
    const navigate = useNavigate();

    const handleMemberTypeChange = (event) => {
        setSelectedMemberType(event.target.value);
    };

    const handleGenerationChange = (event) => {
        setSelectedGeneration(event.target.value);
    };

    const handleStart = () => {
        // Save the selections to localStorage
        localStorage.setItem('memberType', selectedMemberType);
        localStorage.setItem('generation', selectedGeneration);
        // Navigate to tierlist page
        navigate('/tierlist');
    };

    return (
        <div className="homepage-container">
            <img src={logo} alt="JKT48 Tierlist Logo" className="app-logo" />
            <h1 className="title">JKT48 Member Tierlist</h1>
            <div className="dropdown-container">
                <select 
                    value={selectedMemberType} 
                    onChange={handleMemberTypeChange}
                    className="member-dropdown"
                >
                    <option value="active">Active Member</option>
                    <option value="ex">Ex Member</option>
                    <option value="all">All Member</option>
                </select>
                <select 
                    value={selectedGeneration} 
                    onChange={handleGenerationChange}
                    className="member-dropdown"
                >
                    <option value="all">All Generations</option>
                    {Array.from({ length: 13 }, (_, i) => i + 1).map(gen => (
                        <option key={gen} value={`gen${gen}`}>Generation {gen}</option>
                    ))}
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