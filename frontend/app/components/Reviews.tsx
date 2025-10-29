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
  border: '1px solid #ccc',
  boxShadow: 'none',
  borderRadius: 16,
  display: 'flex',
  flexDirection: 'column',
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
  '&.left': {
    left: -24,
  },
  '&.right': {
    right: -24,
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

        <Box sx={{ minHeight: { xs: '52rem', sm: '42rem', md: '40rem' } }}>
          <Box sx={{ position: 'relative', px: 4 }}>
            <NavigationButton
              className="left"
              onClick={goPrev}
              size="large"
              sx={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                color: '#000',
                '&:hover': {
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                },
              }}
            >
              <ArrowBackIosIcon />
            </NavigationButton>

            <ReviewCard className={animationClass} sx={{ height: { xs: '44rem', sm: '34rem', md: '32rem' } }}>
              <CardContent sx={{ p: { xs: 5, sm: 6 }, pb: 8, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Avatar
                  src={current.avatarUrl || undefined}
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    fontSize: '2rem',
                    bgcolor: '#4A90A4',
                    color: '#fff',
                  }}
                />

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#000',
                    mb: 1,
                    fontSize: '1.1rem',
                  }}
                >
                  {current.name}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, gap: 0.5 }}>
                  <Rating
                    value={current.stars || 0}
                    readOnly
                    size="large"
                    icon={<StarSvg filled />}
                    emptyIcon={<StarSvg filled={false} />}
                    sx={{ '& .MuiRating-icon': { mx: 0.3 } }}
                  />
                 
                </Box>

                <Chip
                  size="small"
                  label={current.published}
                  sx={{ alignSelf: 'center', mb: 2 }}
                />

                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontStyle: 'italic',
                      lineHeight: 1.7,
                      color: '#000',
                      maxWidth: 600,
                      mx: 'auto',
                      fontSize: '1.1rem',
                    }}
                  >
                    "{short}"
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  {hasMore && (
                    <Button variant="outlined" onClick={() => openModal(0)} sx={{ borderRadius: 0 }}>
                      Читати далі
                    </Button>
                  )}
                  {current.attachmentUrls.length > 0 && (
                    <Button variant="outlined" onClick={() => openModal(0)} sx={{ borderRadius: 0 }}>
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
              sx={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                color: '#000',
                '&:hover': {
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                },
              }}
            >
              <ArrowForwardIosIcon />
            </NavigationButton>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1 }}>
            {reviews.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentIndex(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: index === currentIndex ? '#4A90A4' : '#ccc',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'var(--primary-color)',
                    transform: 'scale(1.2)',
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
              <Box sx={{ p: { xs: 2, md: 2.5 }, maxHeight: 'inherit', overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 1.5, md: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={current.avatarUrl || undefined} sx={{ width: 40, height: 40 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '0.95rem', md: '1.05rem' } }}>
                        {current.name}
                      </Typography>
                      <Rating value={current.stars || 0} readOnly size="small" icon={<StarSvg filled />} emptyIcon={<StarSvg filled={false} />} sx={{ mt: 0.25 }} />
                      {current.published && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          {current.published}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <IconButton onClick={closeModal} size="large">
                    <CloseIcon />
                  </IconButton>
                </Box>

                {current.attachmentUrls.length > 0 && (
                  <>
                    <Box sx={{ position: 'relative', borderRadius: '0.5rem', overflow: 'hidden', mb: { xs: 1.5, md: 2 }, height: { xs: '30vh', md: '40vh' } }}>
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
                      mt: '2%',
                      display: 'flex',
                      flexWrap: 'nowrap',
                      gap: 1.5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 64,
                      overflowX: 'auto',
                      pb: 1,
                      width: '100%',
                      minWidth: 0,
                      scrollbarWidth: 'thin',
                      '&::-webkit-scrollbar': { height: 6 },
                      '&::-webkit-scrollbar-thumb': { backgroundColor: '#bbb', borderRadius: 3 },
                    }}>
                      {current.attachmentUrls.map((url, i) => {
                        const isActive = i === selectedAttachmentIndex;
                        const tileWidth = isActive ? 64 : 48;
                        const tileHeight = isActive ? 48 : 36;
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
                              border: isActive ? '2px solid var(--primary-color)' : '1px solid #ccc',
                              cursor: 'pointer',
                              flex: '0 0 auto',
                              transition: 'all 0.2s ease-in-out',
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
                                filter: isActive ? 'none' : 'grayscale(1)',
                                transition: 'filter 0.2s ease-in-out',
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </>
                )}

                <Typography
                  variant="h6"
                  sx={{
                    fontStyle: 'italic',
                    lineHeight: 1.5,
                    color: '#000',
                    maxWidth: 720,
                    mx: 'auto',
                    fontSize: { xs: '0.92rem', md: '1rem' },
                    whiteSpace: 'pre-line',
                    mb: { xs: 1.5, md: 2 },
                  }}
                >
                  {`“${current.message}”`}
                </Typography>
              </Box>
            )}
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
}
