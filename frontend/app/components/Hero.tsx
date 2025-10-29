'use client';

import { Box, Typography, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroSection = styled(Box)(({ theme }) => ({
  height: '100vh',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  backgroundImage: 'url(http://localhost:1337/uploads/photo_2024_09_13_01_49_50_e89474522a.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  filter: 'grayscale(50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 5%',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  color: theme.palette.common.white,
}));

export default function Hero() {
  return (
    <HeroSection className="hero-section">
      <HeroContent>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
            fontWeight: 700,
            mb: '3%',
            letterSpacing: '0.02em',
          }}
          className="hero-title"
        >
          Соловей Станіслав
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: '1.25rem', md: '1.5rem', lg: '2rem' },
            maxWidth: '80%',
            mx: 'auto',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 400,
          }}
          className="hero-subtitle"
        >
          Професійний ведучий сучасного формату
        </Typography>
      </HeroContent>
    </HeroSection>
  );
}
