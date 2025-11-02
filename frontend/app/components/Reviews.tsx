"use client";

import { useEffect, useMemo, useState, useCallback } from 'react';
import { request } from 'graphql-request';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Button,
  Modal,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

function StarSvg({ filled = true }: { filled?: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="12,2 14.945,8.356 22,9.27 16.8,13.97 18.09,21 12,17.6 5.91,21 7.2,13.97 2,9.27 9.055,8.356"
        fill={filled ? '#FFC107' : 'transparent'}
        stroke="#4A90A4"
        strokeWidth="1.2"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
      />
    </svg>
  );
}

interface ReviewGql {
  slug: string;
  name: string;
  message: string;
  stars: number;
  published: string;
  img: { url: string }[];
}

interface ReviewUi {
  slug: string;
  name: string;
  message: string;
  stars: number;
  published: string;
  avatarUrl: string | null;
  attachmentUrls: string[];
}

const REVIEWS_QUERY = `
  query Reviews {
    reviews(pagination: { pageSize: 100 }, sort: ["publishedAt:desc"]) {
      slug
      name
      message
      stars
      published
      img { url }
    }
  }
`;

const ReviewCard = styled(Card)(({ theme }) => ({
  maxWidth: 800,
  margin: '0 auto',
  textAlign: 'center',
  border: '1px solid rgba(74, 144, 164, 0.15)',
  boxShadow: '0 4px 20px rgba(74, 144, 164, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
  borderRadius: '20px',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#fff',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #4A90A4 0%, #3a7a8a 100%)',
  },
  '&:hover': {
    boxShadow: '0 8px 32px rgba(74, 144, 164, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
    transform: 'translateY(-2px)',
    borderColor: 'rgba(74, 144, 164, 0.25)',
  },
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: '#fff',
  border: '1px solid rgba(74, 144, 164, 0.2)',
  boxShadow: '0 4px 12px rgba(74, 144, 164, 0.15)',
  color: '#4A90A4',
  width: 48,
  height: 48,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: '#4A90A4',
    color: '#fff',
    transform: 'translateY(-50%) scale(1.1)',
    boxShadow: '0 6px 20px rgba(74, 144, 164, 0.3)',
    borderColor: '#4A90A4',
  },
  '&.left': {
    left: -24,
  },
  '&.right': {
    right: -24,
  },
  [theme.breakpoints.down('sm')]: {
    width: 40,
    height: 40,
    '&.left': {
      left: -16,
    },
    '&.right': {
      right: -16,
    },
  },
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '1rem',
  boxShadow: theme.shadows[24],
  width: 'min(88vw, 900px)',
  maxWidth: '100%',
  maxHeight: '80vh',
  boxSizing: 'border-box',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

function pluralizeUa(value: number, forms: [string, string, string]) {
  const n = Math.abs(value) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
}

function formatRelativeTime(iso?: string) {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  let diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 0) diff = 0;

  const years = Math.floor(diff / (365 * 24 * 3600));
  if (years > 0) return `${years} ${pluralizeUa(years, ['рік', 'роки', 'років'])} назад`;
  const months = Math.floor(diff / (30 * 24 * 3600));
  if (months > 0) return `${months} ${pluralizeUa(months, ['місяць', 'місяці', 'місяців'])} назад`;
  const days = Math.floor(diff / (24 * 3600));
  if (days > 0) return `${days} ${pluralizeUa(days, ['день', 'дні', 'днів'])} назад`;
  const hours = Math.floor(diff / 3600);
  if (hours > 0) return `${hours} ${pluralizeUa(hours, ['година', 'години', 'годин'])} назад`;
  const minutes = Math.floor(diff / 60);
  if (minutes > 0) return `${minutes} ${pluralizeUa(minutes, ['хвилина', 'хвилини', 'хвилин'])} назад`;
  return 'щойно';
}

export default function Reviews() {
  const [reviews, setReviews] = useState<ReviewUi[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState(0);
  const [prevAttachmentIndex, setPrevAttachmentIndex] = useState<number | null>(null);
  const [fadeOutPrevAttachment, setFadeOutPrevAttachment] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await request<{ reviews: ReviewGql[] }>(
          'http://localhost:1337/graphql',
          REVIEWS_QUERY
        );
        const normalized = (data.reviews || []).map((r) => {
          const urls = (r.img || []).map((f) =>
            f.url.startsWith('http') ? f.url : `http://localhost:1337${f.url}`
          );
          const avatarUrl = urls[0] || null;
          const attachmentUrls = urls.slice(1);
          return {
            slug: r.slug,
            name: r.name,
            message: r.message,
            stars: r.stars,
            published: r.published,
            avatarUrl,
            attachmentUrls,
          } as ReviewUi;
        });
        const sorted = normalized.sort((a, b) => {
          const aCount = (a.avatarUrl ? 1 : 0) + a.attachmentUrls.length;
          const bCount = (b.avatarUrl ? 1 : 0) + b.attachmentUrls.length;
          return bCount - aCount;
        });
        setReviews(sorted);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Помилка завантаження відгуків');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const current = useMemo(() => reviews[currentIndex] || null, [reviews, currentIndex]);
  const [animationClass, setAnimationClass] = useState('');

  const goPrev = useCallback(() => {
    setAnimationClass('testimonial-exit-right');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? (reviews.length ? reviews.length - 1 : 0) : prev - 1));
      setAnimationClass('testimonial-enter-left');
      setTimeout(() => setAnimationClass(''), 500);
    }, 300);
  }, [reviews.length]);

  const goNext = useCallback(() => {
    setAnimationClass('testimonial-exit-left');
    setTimeout(() => {
      setCurrentIndex((prev) => (reviews.length ? (prev === reviews.length - 1 ? 0 : prev + 1) : 0));
      setAnimationClass('testimonial-enter-right');
      setTimeout(() => setAnimationClass(''), 500);
    }, 300);
  }, [reviews.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext]);

  const truncate = (text: string, max = 220) => {
    if (!text) return { short: '', hasMore: false };
    if (text.length <= max) return { short: text, hasMore: false };
    const slice = text.slice(0, max);
    const lastSpace = slice.lastIndexOf(' ');
    const short = (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trim() + '…';
    return { short, hasMore: true };
  };

  const openModal = (initialAttachmentIndex = 0) => {
    setSelectedAttachmentIndex(initialAttachmentIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

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

  if (!current) return null;

  const { short, hasMore } = truncate(current.message);

  return (
    <Box sx={{ py: 12, bgcolor: '#f5f5f5' }}>
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
            Що кажуть клієнти
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#000',
              fontWeight: 400,
              fontSize: '1.1rem',
            }}
          >
            Відгуки наших задоволених клієнтів
          </Typography>
        </Box>

        <Box sx={{ minHeight: { xs: '52rem', sm: '44rem', md: '42rem' } }}>
          <Box sx={{ position: 'relative', px: 4 }}>
            <NavigationButton
              className="left"
              onClick={goPrev}
              size="large"
            >
              <ArrowBackIosIcon />
            </NavigationButton>

            <ReviewCard className={animationClass} sx={{ height: { xs: '44rem', sm: '36rem', md: '34rem' } }}>
              <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 }, pb: { xs: 3, sm: 4, md: 5 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Avatar
                  src={current.avatarUrl || undefined}
                  sx={{
                    width: { xs: 64, sm: 76, md: 84 },
                    height: { xs: 64, sm: 76, md: 84 },
                    mx: 'auto',
                    mb: 1.5,
                    fontSize: '2rem',
                    bgcolor: 'linear-gradient(135deg, #4A90A4 0%, #3a7a8a 100%)',
                    background: 'linear-gradient(135deg, #4A90A4 0%, #3a7a8a 100%)',
                    color: '#fff',
                    boxShadow: '0 4px 16px rgba(74, 144, 164, 0.3)',
                    border: '3px solid rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
                  }}
                />

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#4A90A4',
                    mb: 0.75,
                    fontSize: { xs: '1.15rem', sm: '1.3rem', md: '1.4rem' },
                    letterSpacing: '0.02em',
                  }}
                >
                  {current.name}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1.5, gap: 0.5 }}>
                  <Rating
                    value={current.stars || 0}
                    readOnly
                    size="medium"
                    icon={<StarSvg filled />}
                    emptyIcon={<StarSvg filled={false} />}
                    sx={{ '& .MuiRating-icon': { mx: 0.3 } }}
                  />
                  
                  {current.published && (
                    <Chip
                      size="small"
                      label={current.published}
                      sx={{ 
                        alignSelf: 'center',
                        backgroundColor: 'rgba(74, 144, 164, 0.08)',
                        color: '#4A90A4',
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        height: '24px',
                        border: '1px solid rgba(74, 144, 164, 0.15)',
                      }}
                    />
                  )}
                </Box>

                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', mb: 1.5, minHeight: 0 }}>
                  <Box sx={{ position: 'relative', maxWidth: 640, mx: 'auto', width: '100%' }}>
                    <Typography
                      component="span"
                      sx={{
                        position: 'absolute',
                        left: { xs: -8, md: -16 },
                        top: { xs: -4, md: -8 },
                        fontSize: { xs: '3.5rem', md: '5rem' },
                        color: '#4A90A4',
                        opacity: 0.15,
                        fontFamily: 'Georgia, serif',
                        fontWeight: 700,
                        lineHeight: 1,
                        pointerEvents: 'none',
                      }}
                    >
                      "
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontStyle: 'italic',
                        lineHeight: 1.8,
                        color: '#333',
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.15rem' },
                        fontWeight: 400,
                        px: { xs: 2.5, md: 3.5 },
                      }}
                    >
                      {short}
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        position: 'absolute',
                        right: { xs: -8, md: -16 },
                        bottom: { xs: -24, md: -32 },
                        fontSize: { xs: '3.5rem', md: '5rem' },
                        color: '#4A90A4',
                        opacity: 0.15,
                        fontFamily: 'Georgia, serif',
                        fontWeight: 700,
                        lineHeight: 1,
                        pointerEvents: 'none',
                      }}
                    >
                      "
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {hasMore && (
                    <Button 
                      variant="outlined" 
                      onClick={() => openModal(0)} 
                      sx={{ 
                        borderRadius: '8px',
                        borderColor: '#4A90A4',
                        color: '#4A90A4',
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#4A90A4',
                          color: '#fff',
                          borderColor: '#4A90A4',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(74, 144, 164, 0.3)',
                        },
                      }}
                    >
                      Читати далі
                    </Button>
                  )}
                  {current.attachmentUrls.length > 0 && (
                    <Button 
                      variant="outlined" 
                      onClick={() => openModal(0)} 
                      sx={{ 
                        borderRadius: '8px',
                        borderColor: '#4A90A4',
                        color: '#4A90A4',
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#4A90A4',
                          color: '#fff',
                          borderColor: '#4A90A4',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(74, 144, 164, 0.3)',
                        },
                      }}
                    >
                      Фото: {current.attachmentUrls.length}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </ReviewCard>

            <NavigationButton
              className="right"
              onClick={goNext}
              size="large"
            >
              <ArrowForwardIosIcon />
            </NavigationButton>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, gap: 1.5 }}>
            {reviews.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentIndex(index)}
                sx={{
                  width: index === currentIndex ? 24 : 10,
                  height: 10,
                  borderRadius: '5px',
                  backgroundColor: index === currentIndex ? '#4A90A4' : 'rgba(74, 144, 164, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: index === currentIndex ? '0 2px 8px rgba(74, 144, 164, 0.4)' : 'none',
                  '&:hover': {
                    backgroundColor: '#4A90A4',
                    width: 24,
                    boxShadow: '0 2px 8px rgba(74, 144, 164, 0.4)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 0 }}>
          <Typography
            variant="body1"
            sx={{
              color: '#000',
              mb: 3,
              fontWeight: 500,
              fontSize: '1rem',
            }}
          >
            Більше відгуків на платформі Girko
          </Typography>
          <Button
            variant="outlined"
            component="a"
            href="https://girko.net/profile/13866/reviews/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              border: '1px solid #000',
              color: '#000',
              backgroundColor: '#fff',
              px: 4,
              py: 1.5,
              borderRadius: 0,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              '&:hover': {
                border: '1px solid var(--primary-color)',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            Переглянути всі відгуки
          </Button>
        </Box>

        <Modal open={isModalOpen} onClose={closeModal} aria-labelledby="review-modal">
          <ModalContent>
            {current && (
              <Box sx={{ 
                p: { xs: 3, md: 4 }, 
                overflow: 'auto',
                maxHeight: '80vh',
                borderRadius: '1rem',
                scrollbarWidth: 'thin',
                scrollbarColor: '#ccc transparent',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#ccc',
                  borderRadius: '4px',
                  margin: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#999',
                },
                '&::-webkit-scrollbar-corner': {
                  background: 'transparent',
                },
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: { xs: 3.5, md: 4.5 },
                  pb: { xs: 3, md: 4 },
                  borderBottom: '1px solid rgba(74, 144, 164, 0.1)',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 2.5 }, flex: 1 }}>
                    <Avatar 
                      src={current.avatarUrl || undefined} 
                      sx={{ 
                        width: { xs: 64, md: 72 }, 
                        height: { xs: 64, md: 72 },
                        bgcolor: 'linear-gradient(135deg, #4A90A4 0%, #3a7a8a 100%)',
                        background: 'linear-gradient(135deg, #4A90A4 0%, #3a7a8a 100%)',
                        color: '#fff',
                        boxShadow: '0 6px 20px rgba(74, 144, 164, 0.25)',
                        border: '3px solid rgba(255, 255, 255, 0.9)',
                        flexShrink: 0,
                      }} 
                    />
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 700, 
                          color: '#4A90A4', 
                          fontSize: { xs: '0.945rem', md: '1.155rem' },
                          letterSpacing: '0.01em',
                          lineHeight: 1.2,
                          mb: 0.5,
                        }}
                      >
                        {current.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
                        <Rating 
                          value={current.stars || 0} 
                          readOnly 
                          size="small" 
                          icon={<StarSvg filled />} 
                          emptyIcon={<StarSvg filled={false} />} 
                          sx={{ '& .MuiRating-icon': { mx: 0.14, width: '19.6px', height: '19.6px' } }} 
                        />
                      </Box>
                      {current.published && (
                        <Chip
                          size="small"
                          label={current.published}
                          sx={{ 
                            backgroundColor: 'rgba(74, 144, 164, 0.1)',
                            color: '#4A90A4',
                            fontWeight: 600,
                            fontSize: '0.56rem',
                            height: '19.6px',
                            border: '1px solid rgba(74, 144, 164, 0.2)',
                            borderRadius: '9.8px',
                            px: 0.7,
                            alignSelf: 'flex-start',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  <IconButton 
                    onClick={closeModal} 
                    size="medium"
                    sx={{
                      color: '#666',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      flexShrink: 0,
                      '&:hover': {
                        backgroundColor: 'rgba(74, 144, 164, 0.1)',
                        color: '#4A90A4',
                        transform: 'rotate(90deg)',
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                {current.attachmentUrls.length > 0 && (
                  <>
                    <Box sx={{ 
                      position: 'relative', 
                      borderRadius: 0, 
                      overflow: 'hidden', 
                      mb: { xs: 2.5, md: 3 }, 
                      height: { xs: '30vh', md: '40vh' },
                      backgroundColor: 'transparent',
                    }}>
                      {/* Current image */}
                      <Box
                        component="img"
                        src={current.attachmentUrls[selectedAttachmentIndex]}
                        alt={`${current.slug}-attachment-${selectedAttachmentIndex}`}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          display: 'block',
                        }}
                      />
                      {/* Previous image fading out on top for smooth crossfade */}
                      {prevAttachmentIndex !== null && (
                        <Box
                          component="img"
                          src={current.attachmentUrls[prevAttachmentIndex]}
                          alt={`${current.slug}-prev-${prevAttachmentIndex}`}
                          onTransitionEnd={() => {
                            setPrevAttachmentIndex(null);
                          }}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            backgroundColor: 'transparent',
                            opacity: fadeOutPrevAttachment ? 0 : 1,
                            transition: 'opacity 450ms ease, transform 450ms ease',
                            transform: fadeOutPrevAttachment ? 'scale(1.01)' : 'scale(1)',
                            pointerEvents: 'none',
                          }}
                        />
                      )}
                    </Box>
                    {/* Thumbnails as a separate strip below to prevent layout jump */}
                    <Box sx={{
                      mb: { xs: 3, md: 4 },
                      display: 'flex',
                      flexWrap: 'nowrap',
                      gap: 1.5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 72,
                      overflowX: 'auto',
                      pb: 1,
                      width: '100%',
                      minWidth: 0,
                      scrollbarWidth: 'thin',
                      '&::-webkit-scrollbar': { height: 6 },
                      '&::-webkit-scrollbar-thumb': { backgroundColor: '#bbb', borderRadius: 3 },
                      '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#999' },
                    }}>
                      {current.attachmentUrls.map((url, i) => {
                        const isActive = i === selectedAttachmentIndex;
                        const tileWidth = isActive ? 72 : 56;
                        const tileHeight = isActive ? 56 : 44;
                        return (
                          <Box
                            key={`${current.slug}-${i}`}
                            onClick={() => {
                              if (i === selectedAttachmentIndex) return;
                              setPrevAttachmentIndex(selectedAttachmentIndex);
                              setFadeOutPrevAttachment(false);
                              requestAnimationFrame(() => setFadeOutPrevAttachment(true));
                              setSelectedAttachmentIndex(i);
                            }}
                            sx={{
                              width: tileWidth,
                              height: tileHeight,
                              borderRadius: '0.5rem',
                              overflow: 'hidden',
                              border: isActive ? '2.5px solid #4A90A4' : '1.5px solid #ddd',
                              cursor: 'pointer',
                              flex: '0 0 auto',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: isActive ? '0 4px 12px rgba(74, 144, 164, 0.25)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                              '&:hover': {
                                borderColor: '#4A90A4',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(74, 144, 164, 0.25)',
                              },
                            }}
                          >
                            <Box
                              component="img"
                              src={url}
                              alt={`${current.slug}-${i}`}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: isActive ? 'none' : 'grayscale(0.3) brightness(0.95)',
                                transition: 'filter 0.3s ease-in-out',
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </>
                )}

                <Box sx={{ position: 'relative', maxWidth: 720, mx: 'auto' }}>
                  <Typography
                    component="span"
                    sx={{
                      position: 'absolute',
                      left: { xs: -12, md: -20 },
                      top: { xs: -8, md: -12 },
                      fontSize: { xs: '4rem', md: '5.5rem' },
                      color: '#4A90A4',
                      opacity: 0.15,
                      fontFamily: 'Georgia, serif',
                      fontWeight: 700,
                      lineHeight: 1,
                      pointerEvents: 'none',
                    }}
                  >
                    "
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: 'italic',
                      lineHeight: 1.85,
                      color: '#333',
                      fontSize: { xs: '1.05rem', md: '1.2rem' },
                      fontWeight: 400,
                      px: { xs: 3, md: 4 },
                      whiteSpace: 'pre-line',
                      mb: { xs: 2, md: 3 },
                    }}
                  >
                    {current.message}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      position: 'absolute',
                      right: { xs: -12, md: -20 },
                      bottom: { xs: -32, md: -40 },
                      fontSize: { xs: '4rem', md: '5.5rem' },
                      color: '#4A90A4',
                      opacity: 0.15,
                      fontFamily: 'Georgia, serif',
                      fontWeight: 700,
                      lineHeight: 1,
                      pointerEvents: 'none',
                    }}
                  >
                    "
                  </Typography>
                </Box>
              </Box>
            )}
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
}
