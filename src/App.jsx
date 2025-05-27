import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import Homepage from './Homepage'
import Tierlist from './Tierlist'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
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
            <Route path="/tierlist" element={<Tierlist />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  )
}

export default App 