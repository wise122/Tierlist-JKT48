import React from 'react';
import { Box, IconButton, Link, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import XIcon from '@mui/icons-material/X';

const Footer = () => {
  const buttonSize = 30; // Reduced from 60 to 30
  const backgroundSize = buttonSize * 1.2;

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1, // Reduced from 2
        padding: '1rem', // Reduced from 2rem
        marginTop: 'auto',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '0.75rem', // Reduced from 1.5rem
          color: 'white',
          marginBottom: 0.75, // Reduced from 1.5
          textShadow: `
            -1px -1px 0 #000,  
             1px -1px 0 #000,
            -1px  1px 0 #000,
             1px  1px 0 #000,
            -1.5px 0 0 #000,
             1.5px 0 0 #000,
             0 -1.5px 0 #000,
             0 1.5px 0 #000
          `, // Reduced shadow sizes
        }}
      >
        You can give Feedback, Contribution, and Bug Report to:
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1.5, // Reduced from 3
        }}
      >
        <Link
          href="https://github.com/MrcellSbst/Tierlist-Member-JKT48"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Box
            sx={{
              width: `${backgroundSize}px`,
              height: `${backgroundSize}px`,
              backgroundColor: '#f6f8fa',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: '#e1e4e8',
              },
            }}
          >
            <IconButton
              aria-label="GitHub repository"
              sx={{
                color: '#24292e',
                width: `${buttonSize}px`,
                height: `${buttonSize}px`,
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <GitHubIcon sx={{ fontSize: '1.25rem' }} /> {/* Reduced from 2.5rem */}
            </IconButton>
          </Box>
        </Link>
        <Link
          href="https://x.com/criscrosbre"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Box
            sx={{
              width: `${backgroundSize}px`,
              height: `${backgroundSize}px`,
              backgroundColor: '#eff3f4',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: '#e1e4e8',
              },
            }}
          >
            <IconButton
              aria-label="X (Twitter) profile"
              sx={{
                color: '#000000',
                width: `${buttonSize}px`,
                height: `${buttonSize}px`,
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <XIcon sx={{ fontSize: '1.25rem' }} /> {/* Reduced from 2.5rem */}
            </IconButton>
          </Box>
        </Link>
      </Box>
    </Box>
  );
};

export default Footer; 