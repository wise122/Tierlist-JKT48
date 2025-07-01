import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { Box } from '@mui/material'
import Homepage from './Homepage'
import Tierlist from './Tierlist'
import TierlistLagu from './Tierlist_Lagu'
import HomepageTierlist from './HomepageTierlist'
import Calculator from './Calculator'
import PointHistory from './PointHistory'
import NotFound from './components/NotFound'
import Footer from './components/Footer'
import ViewportManager from './components/ViewportManager'
import ThisOrThat from './This_or_That'
import ToTAdmin from './ToT_admin'
import Suggestion from './Suggestion'
import './styles/App.css'

function App() {
  return (
    <Router>
      <ViewportManager />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/this-or-that" element={
              <div className="home-container">
                <h1 className="home-title">JKT48 This or That</h1>
                <div className="button-container">
                  <Link to="/this-or-that/play" className="home-button play">
                    Play Game
                  </Link>
                  <Link to="/this-or-that/suggest" className="home-button suggest">
                    Berikan Ide
                  </Link>
                  <Link to="/" className="home-button back">
                    Back to Homepage
                  </Link>
                </div>
              </div>
            } />
            <Route path="/homepagetierlist" element={<HomepageTierlist />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/tierlist" element={<Tierlist />} />
            <Route path="/tierlist_lagu" element={<TierlistLagu />} />
            <Route path="/point-history" element={<PointHistory />} />
            <Route path="/this-or-that/play" element={<ThisOrThat />} />
            <Route path="/this-or-that/admin" element={<ToTAdmin />} />
            <Route path="/this-or-that/suggest" element={<Suggestion />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
      <Analytics />
    </Router>
  )
}

export default App 