'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Modal,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { request } from 'graphql-request';

interface GalleryImage {
  img: Array<{ url: string }>;
  name: string;
  description: string | Array<{
    type: string;
    children: Array<{
      type: string;
      text: string;
    }>;
  }>;
}

const GALLERY_QUERY = `
  query GalleryImages {
    galleryimgs {
      img { url }
      name
      description
    }
  }
`;

const GalleryCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: '100%',
  borderRadius: 0,
  overflow: 'hidden',
  border: '1px solid #ccc',
  transition: 'all 0.3s ease-in-out',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  opacity: 0,
  '&:hover': {
    transform: 'translateY(-0.25rem)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderColor: 'var(--primary-color)',
  },
}));

const ImageBox = styled(Box)(({ theme }) => ({
  width: '100%',
  aspectRatio: '4/3',
  position: 'relative',
  overflow: 'hidden',
  '& img': {
    transition: 'transform 0.4s ease',
    willChange: 'transform',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  },
  '&:hover .overlay': {
    opacity: 1,
  },
}));

const Overlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '1rem',
  boxShadow: theme.shadows[24],
  width: 'min(92vw, 1000px)',
  maxWidth: '100%',
  maxHeight: '90vh',
  boxSizing: 'border-box',
  overflow: 'auto',
}));

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [fadeOutPrev, setFadeOutPrev] = useState<boolean>(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        const data = await request<{ galleryimgs: GalleryImage[] }>(
          'http://localhost:1337/graphql',
          GALLERY_QUERY
        );
        setGalleryImages(data.galleryimgs);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        setError('Помилка завантаження галереї');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setSelectedIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const getImageUrl = (image: GalleryImage, index: number = 0) => {
    const url = Array.isArray(image.img) ? image.img[index]?.url : (image as any).img?.url;
    return url ? (url.startsWith('http') ? url : `http://localhost:1337${url}`) : '';
  };

  const getImageDescription = (image: GalleryImage) => {
    const desc: any = image.description as any;
    if (Array.isArray(desc)) {
      const text = desc
        .map((block: any) => (block?.children || []).map((c: any) => c?.text || '').join(''))
        .join('\n')
        .trim();
      return text || 'Опис події';
    }
    if (typeof desc === 'string' && desc.trim().length > 0) return desc.trim();
    return 'Опис події';
  };

  if (loading) {
    return (
      <Box sx={{ py: 10, bgcolor: 'background.default', display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ textAlign: 'center' }}>
            {error}
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
            Наша робота
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#000',
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto',
              fontSize: '1.1rem',
            }}
          >
            Кожна подія - це унікальна історія, яку ми створюємо разом з вами
          </Typography>
        </Box>

        <Grid 
          container 
          spacing={3} 
          sx={{ 
            justifyContent: 'center',
            maxWidth: '100%',
            mx: 'auto',
            px: { xs: '5%', sm: '3%', md: '2%' }
          }}
        >
          {galleryImages.map((image, index) => (
            <Grid 
              size={{ xs: 12, sm: 6, md: 4 }}
              key={`${image.name}-${index}`}
            >
              <GalleryCard className="gallery-card">
                <CardActionArea 
                  onClick={() => handleImageClick(image)}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <ImageBox>
                    <Box
                      component="img"
                      src={getImageUrl(image)}
                      alt={image.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    
                    <Overlay className="overlay">
                      <Box
                        sx={{
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          p: '5%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ZoomInIcon sx={{ color: 'text.primary', fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' } }} />
                      </Box>
                    </Overlay>
                  </ImageBox>
                  
                  <CardContent sx={{ p: '5%', position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' },
                        textAlign: 'center',
                        lineHeight: 1.4,
                      }}
                    >
                      {image.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </GalleryCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Модальне вікно */}
      <Modal
        open={selectedImage !== null}
        onClose={handleCloseModal}
        aria-labelledby="gallery-modal"
      >
        <ModalContent>
          {selectedImage && (
            <Box sx={{ p: '3.75%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '3.75%' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' }
                  }}
                >
                  {selectedImage.name}
                </Typography>
                <IconButton onClick={handleCloseModal} size="large">
                  <CloseIcon />
                </IconButton>
              </Box>
              
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  mb: '3.75%',
                }}
              >
                {/* Current image */}
                <Box
                  component="img"
                  src={getImageUrl(selectedImage, selectedIndex)}
                  alt={selectedImage.name}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: { xs: '50vh', md: '58vh' },
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
                {/* Previous image fading out on top for smooth crossfade */}
                {prevIndex !== null && (
                  <Box
                    component="img"
                    src={getImageUrl(selectedImage, prevIndex)}
                    alt={`${selectedImage.name}-prev`}
                    onTransitionEnd={() => {
                      setPrevIndex(null);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      backgroundColor: 'transparent',
                      opacity: fadeOutPrev ? 0 : 1,
                      transition: 'opacity 450ms ease, transform 450ms ease',
                      transform: fadeOutPrev ? 'scale(1.01)' : 'scale(1)',
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </Box>
              {/* Thumbnails as rectangular tiles under main image; fixed strip height, centered vertically; inactive are 50% grayscale */}
              <Box sx={{
                mt: '2%',
                display: 'flex',
                flexWrap: 'nowrap',
                gap: 1.5,
                justifyContent: 'center',
                alignItems: 'center',
                height: 64, // fixed to avoid layout jump
                overflowX: 'auto',
                pb: 1,
                width: '100%',
                minWidth: 0,
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': { height: 6 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#bbb', borderRadius: 3 },
              }}>
                {selectedImage.img.map((img, i) => {
                  const isActive = i === selectedIndex;
                  const tileWidth = isActive ? 64 : 48; // active bigger
                  const tileHeight = isActive ? 48 : 36;
                  return (
                    <Box
                      key={`${selectedImage.name}-${i}`}
                      onClick={() => {
                        if (i === selectedIndex) return;
                        setPrevIndex(selectedIndex);
                        setFadeOutPrev(false);
                        requestAnimationFrame(() => setFadeOutPrev(true));
                        setSelectedIndex(i);
                      }}
                      sx={{
                        width: tileWidth,
                        height: tileHeight,
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        border: isActive ? '2px solid var(--primary-color)' : '1px solid #ccc',
                        cursor: 'pointer',
                        flex: '0 0 auto',
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <Box
                        component="img"
                        src={img.url.startsWith('http') ? img.url : `http://localhost:1337${img.url}`}
                        alt={`${selectedImage.name}-${i}`}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: isActive ? 'none' : 'grayscale(1)',
                          transition: 'filter 0.2s ease-in-out',
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
              
              <Typography
                variant="h6"
                sx={{
                  color: '#000',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-line',
                  fontSize: '1.1rem',
                }}
              >
                {getImageDescription(selectedImage)}
              </Typography>
            </Box>
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
}