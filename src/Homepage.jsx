import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import logo from './assets/icon/TierlistIcon.png';

const Homepage = () => {
    const [tierlistType, setTierlistType] = useState('');
    const [selectedMemberType, setSelectedMemberType] = useState('active');
    const [selectedGeneration, setSelectedGeneration] = useState('all');
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const handleTierlistTypeChange = (event) => {
        setTierlistType(event.target.value);
    };

    const handleMemberTypeChange = (event) => {
        setSelectedMemberType(event.target.value);
    };

    const handleGenerationChange = (event) => {
        setSelectedGeneration(event.target.value);
    };

    const handleStart = () => {
        if (!tierlistType) {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
            return;
        }

        if (tierlistType === 'setlist') {
            localStorage.setItem('tierlistType', 'setlist');
            navigate('/tierlist');
        } else {
            // Save the member selections to localStorage
            localStorage.setItem('tierlistType', 'member');
            localStorage.setItem('memberType', selectedMemberType);
            localStorage.setItem('generation', selectedGeneration);
            navigate('/tierlist');
        }
    };

    return (
        <div className="homepage-container">
            {showPopup && (
                <div className="popup-message">
                    Please select a tierlist type first!
                </div>
            )}
            <img src={logo} alt="JKT48 Tierlist Logo" className="app-logo" />
            <h1 className="title">JKT48 Member Tierlist</h1>
            <div className="dropdown-container">
                <select 
                    value={tierlistType} 
                    onChange={handleTierlistTypeChange}
                    className="member-dropdown"
                >
                    <option value="">-- Select Tierlist Type --</option>
                    <option value="member">Member Tierlist</option>
                    <option value="setlist">Setlist Tierlist</option>
                </select>

                <div className={`member-dropdowns-container ${tierlistType === 'member' ? 'show' : ''}`}>
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
                </div>

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