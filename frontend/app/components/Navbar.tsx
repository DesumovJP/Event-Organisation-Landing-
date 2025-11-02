'use client';

import { useState, useEffect } from 'react';
import { AppBar, Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'isScrolled',
})<{ isScrolled: boolean }>(({ theme, isScrolled }) => ({
  backgroundColor: isScrolled ? '#fff' : 'transparent',
  boxShadow: isScrolled ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
  transition: 'background-color 0.2s linear, box-shadow 0.2s linear',
  transform: 'translateZ(0)',
  willChange: 'background-color, box-shadow',
  // Запобігаємо розтягуванню та bounce ефекту
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1100,
  // Фіксована висота - не дозволяємо розтягуватись
  flexShrink: 0,
}));

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Використовуємо requestAnimationFrame для плавної перевірки без пружини
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <StyledAppBar position="fixed" isScrolled={isScrolled}>
      <Box
        sx={{
          width: '100%',
          px: { xs: '5%', sm: '3%', md: '2%' },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: { xs: '4rem', sm: '4.5rem', md: '5rem' },
          minHeight: { xs: '4rem', sm: '4.5rem', md: '5rem' },
          maxHeight: { xs: '4rem', sm: '4.5rem', md: '5rem' },
          overflow: 'hidden',
        }}
      >
        {/* Логотип та ім'я зліва */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: '0 0 auto', gap: { xs: '0.75rem', sm: '1rem' } }}>
          <Box
            component="img"
            src="http://localhost:1337/uploads/ptashka_459e72d6e9.png"
            alt="Event Manager Logo"
            sx={{
              width: { xs: '3rem', sm: '3.5rem', md: '4rem' },
              height: { xs: '3rem', sm: '3.5rem', md: '4rem' },
              objectFit: 'contain',
              filter: isScrolled ? 'none' : 'brightness(0) invert(1)',
              transition: 'filter 0.2s linear',
            }}
          />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: { sm: '1rem', md: '1.1rem' },
                fontWeight: 700,
                color: isScrolled ? '#4A90A4' : 'white',
                lineHeight: 1.2,
                transition: 'color 0.2s linear',
              }}
            >
              Соловей Станіслав
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: { sm: '0.75rem', md: '0.8rem' },
                fontWeight: 400,
                color: isScrolled ? '#666' : 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.2,
                transition: 'color 0.2s linear',
              }}
            >
              Професійний ведучий сучасного формату
            </Typography>
          </Box>
        </Box>

        {/* Простір посередині */}
        <Box sx={{ flex: 1 }} />

        {/* Кнопка справа */}
        <Box sx={{ flex: '0 0 auto' }}>
          <Button
            variant="outlined"
            component="a"
            href="https://t.me/your_telegram_username"
            target="_blank"
            rel="noopener noreferrer"
            className="pulse-animation"
            sx={{
              border: isScrolled ? '1px solid #000' : '1px solid rgba(255, 255, 255, 0.5)',
              color: isScrolled ? '#000' : 'white',
              backgroundColor: isScrolled ? '#fff' : 'transparent',
              borderRadius: 0,
              px: { xs: '1.5rem', sm: '2rem' },
              py: '0.75rem',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 500,
              textTransform: 'none',
              transition: 'background-color 0.2s linear, border-color 0.2s linear, color 0.2s linear',
              textDecoration: 'none',
              '&:hover': {
                backgroundColor: isScrolled ? 'rgba(74, 144, 164, 0.8)' : 'rgba(255, 255, 255, 0.1)',
                border: isScrolled ? '1px solid rgba(74, 144, 164, 0.8)' : '1px solid rgba(255, 255, 255, 0.7)',
                color: isScrolled ? 'white' : 'white',
                textDecoration: 'none',
                animation: 'none', // Зупиняємо пульсацію при hover
              },
            }}
          >
            Забронювати подію
          </Button>
        </Box>
      </Box>
    </StyledAppBar>
  );
}
