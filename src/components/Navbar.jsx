import React, { useState } from 'react'
import { AppBar, Toolbar, IconButton, Typography, Box, Drawer, List, ListItem, ListItemText, Button } from '@mui/material'
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material'
import { NavLink } from 'react-router-dom'

const pages = [
  { label: 'Home', path: '/' },
  { label: 'Tierlist', path: '/tierlist' },
  { label: 'Tierlist Lagu', path: '/tierlist_lagu' },
  { label: 'Dream Setlist', path: '/dream-setlist' },
  { label: 'Calculator', path: '/calculator' },
  { label: 'This or That', path: '/this-or-that' },
  { label: 'Points', path: '/point-history' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleDrawer = () => setMobileOpen(!mobileOpen)

  const drawer = (
    <Box
      onClick={toggleDrawer}
      sx={{
        textAlign: 'center',
        backgroundColor: '#111',
        height: '100%',
        color: 'white',
        p: 2,
      }}
    >
      <IconButton onClick={toggleDrawer} sx={{ color: 'white', position: 'absolute', right: 10, top: 10 }}>
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" sx={{ my: 2 }}>
        JKT48 Tools
      </Typography>
      <List>
        {pages.map((page) => (
          <ListItem key={page.path} disablePadding>
            <ListItemText>
              <NavLink
                to={page.path}
                style={({ isActive }) => ({
                  display: 'block',
                  textDecoration: 'none',
                  color: isActive ? '#ff4081' : 'white',
                  fontWeight: isActive ? 600 : 400,
                  padding: '8px 0',
                })}
              >
                {page.label}
              </NavLink>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <AppBar position="static" sx={{ backgroundColor: '#0d0d0d', boxShadow: '0px 2px 8px rgba(0,0,0,0.3)' }}>
      <Toolbar>
        {/* Logo / Judul */}
        <Typography
          variant="h6"
          component={NavLink}
          to="/"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            color: 'white',
            textDecoration: 'none',
            '&:hover': { color: '#ff4081' },
          }}
        >
          JKT48 Tools
        </Typography>

        {/* Menu Desktop */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {pages.map((page) => (
            <Button
              key={page.path}
              component={NavLink}
              to={page.path}
              sx={{
                color: 'white',
                textTransform: 'none',
                fontWeight: 500,
                '&.active': { color: '#ff4081', fontWeight: 600 },
                '&:hover': { color: '#ff4081' },
              }}
            >
              {page.label}
            </Button>
          ))}
        </Box>

        {/* Menu Mobile */}
        <IconButton color="inherit" edge="end" sx={{ display: { md: 'none' } }} onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Drawer Mobile */}
      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
        {drawer}
      </Drawer>
    </AppBar>
  )
}
