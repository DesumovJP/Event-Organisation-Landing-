'use client';

import {
  Box,
  Container,
  Typography,
  Divider,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#fff',
  padding: theme.spacing(6, 0, 3),
}));


export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterBox>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: '#4A90A4',
              fontSize: '1.5rem',
            }}
          >
            Подаруй незабутні емоції
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#ccc',
              lineHeight: 1.6,
              maxWidth: '600px',
              mx: 'auto',
              fontSize: '1rem',
            }}
          >
            Професійна організація подій в Україні. Створюємо незабутні моменти та втілюємо ваші мрії в реальність.
          </Typography>
        </Box>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Нижня панель */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              src="http://localhost:1337/uploads/ptashka_459e72d6e9.png"
              alt="Event Manager Logo"
              sx={{
                width: 40,
                height: 40,
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: '#ccc',
                fontSize: '0.9rem',
              }}
            >
              © 2025 Solovey Stasnislav
            </Typography>
          </Box>
        </Box>
      </Container>
    </FooterBox>
  );
}
