import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Homepage.css'
import logo from '/asset/icon/HomepageLogo.png'

const Homepage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Reset meta viewport agar layout responsif di semua perangkat
    const viewport = document.querySelector('meta[name=viewport]')
    if (viewport) {
      viewport.content = 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1'
    } else {
      const meta = document.createElement('meta')
      meta.name = 'viewport'
      meta.content = 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1'
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <div className="homepage-container">
      <img
        src={logo}
        alt="JKT48 Tools Hub Logo"
        className="app-logo"
        onError={(e) => (e.target.style.display = 'none')}
      />

      <h1 className="title">JKT48 Tools Hub</h1>
      <p className="subtitle">Kumpulan tools seru untuk fans JKT48 🎶</p>

      <div className="nav-buttons-container">
        <button className="nav-button" onClick={() => navigate('/homepagetierlist')}>
          Tierlist Maker
        </button>
        <button className="nav-button" onClick={() => navigate('/calculator')}>
          Wishlist Calculator
        </button>
        <button className="nav-button" onClick={() => navigate('/dream-setlist')}>
          Dream Setlist
        </button>
        <button className="nav-button" onClick={() => navigate('/this-or-that')}>
          This or That Game
        </button>
      </div>
    </div>
  )
}

export default Homepage
