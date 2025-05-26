import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './Homepage'
import Tierlist from './Tierlist'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/tierlist" element={<Tierlist />} />
      </Routes>
    </Router>
  )
}

export default App 