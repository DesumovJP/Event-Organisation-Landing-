'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Rating,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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

const testimonials = [
  {
    id: 1,
    text: "Професійний підхід до організації нашого корпоративного заходу вразив усю команду. Кожна деталь була продумана до дрібниць, а подія пройшла бездоганно. Рекомендую!",
    author: "Олександр Петренко",
    position: "CEO, TechCorp",
    rating: 5,
    avatar: "👨‍💼"
  },
  {
    id: 2,
    text: "Весільна церемонія була просто чарівною! Організатор зробив нашу мрію реальністю. Всі гості були в захваті від уваги до деталей та професійного підходу.",
    author: "Марія Коваленко",
    position: "Наречена",
    rating: 5,
    avatar: "👰"
  },
  {
    id: 3,
    text: "День народження моєї доньки став справжнім святом завдяки професійній організації. Діти були в захваті, а дорослі отримали незабутні враження.",
    author: "Андрій Сидоренко",
    position: "Батько",
    rating: 5,
    avatar: "👨‍👧"
  },
  {
    id: 4,
    text: "Неймовірний рівень сервісу та комунікації. Усе було чітко, вчасно і без зайвого стресу. Свято пройшло краще, ніж ми очікували.",
    author: "Ірина Мельник",
    position: "HR Manager, BrightLabs",
    rating: 5,
    avatar: "💼"
  },
  {
    id: 5,
    text: "Корпоратив на 200 осіб організовано бездоганно. Програма, звук, світло — все на високому рівні. Колеги досі згадують!",
    author: "Дмитро Кравчук",
    position: "Операційний директор",
    rating: 5,
    avatar: "🎤"
  },
  {
    id: 6,
    text: "Дуже сподобалась увага до деталей і дружня атмосфера. Було відчутно, що команда справді любить свою справу.",
    author: "Олена Шевченко",
    position: "Організатор подій",
    rating: 5,
    avatar: "🌟"
  }
];

const TestimonialCard = styled(Card)(({ theme }) => ({
  maxWidth: 800,
  margin: '0 auto',
  textAlign: 'center',
  boxShadow: theme.shadows[4],
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

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animationClass, setAnimationClass] = useState('');

  const handlePrevious = () => {
    setAnimationClass('testimonial-exit-right');
    setTimeout(() => {
      setCurrentTestimonial((prev) => 
        prev === 0 ? testimonials.length - 1 : prev - 1
      );
      setAnimationClass('testimonial-enter-left');
      setTimeout(() => setAnimationClass(''), 500);
    }, 300);
  };

  const handleNext = () => {
    setAnimationClass('testimonial-exit-left');
    setTimeout(() => {
      setCurrentTestimonial((prev) => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
      setAnimationClass('testimonial-enter-right');
      setTimeout(() => setAnimationClass(''), 500);
    }, 300);
  };

  const current = testimonials[currentTestimonial];

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

        {/* Fixed-height wrapper to avoid layout jump when slides change */}
        <Box sx={{ minHeight: { xs: '44rem', sm: '36rem', md: '34rem' } }}>
          <Box sx={{ position: 'relative', px: 4 }}>
            <NavigationButton
            className="left"
            onClick={handlePrevious}
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

            <TestimonialCard 
              className={animationClass}
              sx={{ 
                boxShadow: 'none', 
                border: '1px solid #ccc',
                height: { xs: '36rem', sm: '28rem', md: '26rem' },
              }}
            >
              <CardContent sx={{ p: { xs: 5, sm: 6 }, pb: 8, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 3,
                  fontSize: '2rem',
                  bgcolor: '#4A90A4',
                  color: '#fff',
                }}
              >
                {current.avatar}
              </Avatar>

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Rating
                  value={current.rating}
                  readOnly
                  size="large"
                  icon={<StarSvg filled />}
                  emptyIcon={<StarSvg filled={false} />}
                  sx={{
                    '& .MuiRating-icon': { mx: 0.3 },
                  }}
                />
              </Box>

              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontStyle: 'italic',
                    mb: 4,
                    lineHeight: 1.7,
                    color: '#000',
                    maxWidth: 600,
                    mx: 'auto',
                    fontSize: '1.1rem',
                  }}
                >
                  "{current.text}"
                </Typography>
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#000',
                  mb: 1,
                  fontSize: '1.1rem',
                }}
              >
                {current.author}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: '#000',
                  fontWeight: 500,
                  fontSize: '1rem',
                }}
              >
                {current.position}
              </Typography>
              </CardContent>
            </TestimonialCard>

            <NavigationButton
              className="right"
              onClick={handleNext}
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

          {/* Індикатори */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1 }}>
            {testimonials.map((_, index) => (
              <Box
                key={index}
                onClick={() => {
                  if (index !== currentTestimonial) {
                    setAnimationClass('testimonial-exit-left');
                    setTimeout(() => {
                      setCurrentTestimonial(index);
                      setAnimationClass('testimonial-enter-right');
                      setTimeout(() => setAnimationClass(''), 500);
                    }, 300);
                  }
                }}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: index === currentTestimonial ? '#4A90A4' : '#ccc',
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

        {/* Посилання на Girko */}
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
            endIcon={<OpenInNewIcon />}
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
      </Container>
    </Box>
  );
}
