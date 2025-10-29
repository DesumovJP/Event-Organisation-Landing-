'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { request } from 'graphql-request';

interface Brand {
  name: string;
  logo: {
    url: string;
  };
}

const BRANDS_QUERY = `
  query Brands {
    brands {
      name
      logo { url }
    }
  }
`;

const scroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const ScrollingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '200%', // Подвоюємо ширину для безперервної анімації
  animation: `${scroll} 30s linear infinite`,
  '&:hover': {
    animationPlayState: 'paused',
  },
}));

const BrandCard = styled(Card)(({ theme }) => ({
  flexShrink: 0,
  width: '11rem',
  height: '7rem',
  margin: theme.spacing(0, '2%'),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-0.25rem)',
    '& img': {
      filter: 'grayscale(0%) brightness(1)',
    },
  },
}));

export default function BrandsCarousel() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const data = await request<{ brands: Brand[] }>(
          'http://localhost:1337/graphql',
          BRANDS_QUERY
        );
        setBrands(data.brands);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('Помилка завантаження брендів');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const getLogoUrl = (brand: Brand) => {
    return `http://localhost:1337${brand.logo.url}`;
  };

  if (loading) {
    return (
      <Box sx={{ py: 8, bgcolor: 'grey.50', display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ textAlign: 'center' }}>
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  if (brands.length === 0) {
    return (
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: 'text.primary',
              }}
            >
              Нам довіряють
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
              }}
            >
              Організували події для провідних українських компаній
            </Typography>
          </Box>
          <Alert severity="info" sx={{ textAlign: 'center' }}>
            Поки що немає брендів для відображення. Додайте бренди в Strapi.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 12, bgcolor: '#fff' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 3,
              color: '#4A90A4',
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Нам довіряють
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#000',
              fontWeight: 400,
              fontSize: '1.1rem',
            }}
          >
            Організували події для провідних українських компаній
          </Typography>
        </Box>
        
        <Box sx={{ overflow: 'hidden', position: 'relative', py: 2 }}>
          {/* Градієнт зліва */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '5rem',
              background: 'linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
          {/* Градієнт справа */}
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '5rem',
              background: 'linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
          <ScrollingContainer>
            {/* Перший набір брендів */}
            {brands.map((brand, index) => (
              <BrandCard key={`first-${brand.name}-${index}`} elevation={0} sx={{ border: '1px solid #ccc' }}>
                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: '1rem' }}>
                  <Box
                    component="img"
                    src={getLogoUrl(brand)}
                    alt={brand.name}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      filter: 'grayscale(100%) brightness(0.7)',
                      transition: 'filter 0.3s ease',
                    }}
                  />
                </Box>
              </BrandCard>
            ))}
            {/* Другий набір брендів для безперервності */}
            {brands.map((brand, index) => (
              <BrandCard key={`second-${brand.name}-${index}`} elevation={0} sx={{ border: '1px solid #ccc' }}>
                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: '1rem' }}>
                  <Box
                    component="img"
                    src={getLogoUrl(brand)}
                    alt={brand.name}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      filter: 'grayscale(100%) brightness(0.7)',
                      transition: 'filter 0.3s ease',
                    }}
                  />
                </Box>
              </BrandCard>
            ))}
          </ScrollingContainer>
        </Box>
      </Container>
    </Box>
  );
}