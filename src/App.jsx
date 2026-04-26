import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { Box } from '@mui/material'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import ViewportManager from './components/ViewportManager'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import './styles/App.css'


const Homepage = lazy(() => import('./Homepage'))
const Tierlist = lazy(() => import('./Tierlist'))
const TierlistLagu = lazy(() => import('./Tierlist_Lagu'))
const HomepageTierlist = lazy(() => import('./HomepageTierlist'))
const Calculator = lazy(() => import('./Calculator'))
const PointHistory = lazy(() => import('./PointHistory'))
const NotFound = lazy(() => import('./components/NotFound'))
const ThisOrThat = lazy(() => import('./This_or_That'))
const ToTAdmin = lazy(() => import('./ToT_admin'))
const Suggestion = lazy(() => import('./Suggestion'))
const DreamSetlist = lazy(() => import('./Dream_Setlist'))


import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function RouteProgress() {
  const location = useLocation()
  useEffect(() => {
    NProgress.start()
    NProgress.done()
  }, [location.pathname])
  return null
}

// ===== Protected Route =====
function ProtectedRoute({ element, allowed }) {
  return allowed ? element : <Navigate to="/" replace />
}

function App() {
  const user = { isAdmin: true } // contoh (bisa diganti dengan context atau auth real)

  return (
    <HelmetProvider>
      <Helmet>
        <title>JKT48 Tools Hub</title>
        <meta
          name="description"
          content="Kumpulan tools seru JKT48: Tierlist, This or That, Dream Setlist, dan lainnya!"
        />
      </Helmet>

      <Router>
        <ViewportManager />
        <RouteProgress />

        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />

          <Box sx={{ flex: 1 }}>
            <Suspense fallback={<div style={{ textAlign: 'center', marginTop: 40 }}>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route
                  path="/this-or-that"
                  element={
                    <div className="home-container">
                      <h1 className="home-title">JKT48 This or That</h1>
                      <div className="home-button-container">
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
                  }
                />
                <Route path="/homepagetierlist" element={<HomepageTierlist />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/tierlist" element={<Tierlist />} />
                <Route path="/tierlist_lagu" element={<TierlistLagu />} />
                <Route path="/dream-setlist" element={<DreamSetlist />} />
                <Route path="/point-history" element={<PointHistory />} />
                <Route path="/this-or-that/play" element={<ThisOrThat />} />
                <Route
                  path="/this-or-that/admin"
                  element={<ProtectedRoute allowed={user?.isAdmin} element={<ToTAdmin />} />}
                />
                <Route path="/this-or-that/suggest" element={<Suggestion />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Box>

          <Footer />
        </Box>
        <Analytics />
      </Router>
    </HelmetProvider>
  )
}

export default App
