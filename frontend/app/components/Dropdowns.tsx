'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MetricIcon from './MetricIcon';

const Section = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '24px',
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '1.1fr 1fr',
    alignItems: 'center',
  },
}));

const Placeholder = styled(Box)(({ theme }) => ({
  width: '100%',
  aspectRatio: '4 / 3',
  backgroundColor: '#e3e3e3',
  border: '1px dashed #bdbdbd',
  borderRadius: '8px',
}));

const TilesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '16px',
  [theme.breakpoints.up('sm')]: { gridTemplateColumns: '1fr 1fr' },
}));

const ImageQuad = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: '12px',
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('sm')]: { gridTemplateColumns: '1fr 1fr' },
}));

const TwoCol = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: '20px',
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('md')]: { gridTemplateColumns: '1fr 1fr' },
}));

const BenefitItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  padding: theme.spacing(2.5, 2.5),
  borderRadius: '12px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: '#fff',
  border: '1px solid rgba(74, 144, 164, 0.1)',
  borderLeft: '3px solid transparent',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: 'rgba(74, 144, 164, 0.03)',
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(74, 144, 164, 0.12)',
    borderColor: '#4A90A4',
    borderLeftColor: '#4A90A4',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 2),
  },
}));

const BenefitNumber = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  minWidth: 48,
  minHeight: 48,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #4A90A4 0%, #3a7a8a 100%)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '1.25rem',
  flexShrink: 0,
  lineHeight: 1,
  padding: 0,
  boxShadow: '0 4px 12px rgba(74, 144, 164, 0.3)',
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    fontSize: '1.1rem',
  },
}));

const BenefitTitle = styled(Typography)(({ theme }) => ({
  color: '#4A90A4',
  fontWeight: 600,
  fontSize: '1.15rem',
  marginBottom: theme.spacing(1),
  lineHeight: 1.3,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.05rem',
  },
}));

const BenefitText = styled(Typography)(({ theme }) => ({
  color: '#000',
  lineHeight: 1.75,
  fontSize: '1rem',
  fontWeight: 400,
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.95rem',
    lineHeight: 1.7,
  },
}));

const WhyTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: '#4A90A4',
  fontSize: '1.75rem',
  textAlign: 'center',
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
    marginBottom: theme.spacing(4),
  },
}));

const StatsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
  gap: theme.spacing(3),
  textAlign: 'left',
  marginTop: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(2.5),
    marginTop: theme.spacing(5),
  },
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '56px 1fr',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  backgroundColor: 'rgba(74, 144, 164, 0.02)',
  border: '1px solid transparent',
  '&:hover': {
    backgroundColor: 'rgba(74, 144, 164, 0.05)',
    borderColor: 'rgba(74, 144, 164, 0.2)',
    transform: 'translateX(4px)',
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '48px 1fr',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.5),
  },
}));

const HighlightedText = styled('span')({
  fontWeight: 600,
  color: '#4A90A4',
});

const CircleBadge = styled(Box)(({ theme }) => ({
  width: 56,
  height: 56,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #4A90A4 0%, #3a7a8a 100%)',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  fontSize: '0.85rem',
  textAlign: 'center',
  padding: theme.spacing(0.5, 0.6),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 4px 12px rgba(74, 144, 164, 0.25)',
  border: '2px solid rgba(255, 255, 255, 0.2)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-4px) scale(1.08)',
    boxShadow: '0 8px 20px rgba(74, 144, 164, 0.4)',
    '&::before': {
      opacity: 1,
    },
  },
  [theme.breakpoints.up('sm')]: {
    width: 68,
    height: 68,
    fontSize: '0.9rem',
  },
}));

const CircleBadgeIcon = styled('span')(({ theme }) => ({
  fontSize: '1.2rem',
  lineHeight: 1,
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.4rem',
  },
}));

const CircleBadgeText = styled('span')(({ theme }) => ({
  fontSize: '0.7rem',
  fontWeight: 600,
  lineHeight: 1.2,
  [theme.breakpoints.up('sm')]: {
    fontSize: '0.8rem',
  },
}));

const BadgesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(3),
  alignItems: 'center',
}));

const QuoteBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(5),
  padding: theme.spacing(3.5, 3.5, 3.5, 4.5),
  background: 'linear-gradient(135deg, rgba(74, 144, 164, 0.08) 0%, rgba(74, 144, 164, 0.03) 100%)',
  borderLeft: '5px solid #4A90A4',
  borderRadius: '8px',
  position: 'relative',
  boxShadow: '0 2px 8px rgba(74, 144, 164, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(74, 144, 164, 0.15)',
    transform: 'translateX(2px)',
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4, 4, 4, 5),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 3, 3, 4),
  },
}));

const QuoteText = styled(Typography)(({ theme }) => ({
  color: '#000',
  fontStyle: 'italic',
  fontSize: '1.15rem',
  lineHeight: 1.85,
  fontWeight: 500,
  position: 'relative',
  margin: 0,
  '&::before': {
    content: '"',
    fontSize: '5rem',
    color: '#4A90A4',
    opacity: 0.15,
    position: 'absolute',
    left: theme.spacing(-1.5),
    top: theme.spacing(-0.5),
    fontFamily: 'Georgia, serif',
    fontWeight: 700,
    lineHeight: 1,
    [theme.breakpoints.down('md')]: {
      fontSize: '4rem',
      left: theme.spacing(-1),
      top: theme.spacing(-0.3),
    },
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.05rem',
  },
}));

const ServiceCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  border: '1px solid rgba(74, 144, 164, 0.15)',
  borderRadius: '8px',
  padding: theme.spacing(2, 2.5),
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    backgroundColor: '#4A90A4',
    borderRadius: '0 4px 4px 0',
    transition: 'width 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(74, 144, 164, 0.15)',
    borderColor: '#4A90A4',
    '&::before': {
      width: '6px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 2),
  },
}));

const ServiceIcon = styled(Box)(({ theme }) => ({
  width: 36,
  height: 36,
  minWidth: 36,
  borderRadius: '50%',
  backgroundColor: 'rgba(74, 144, 164, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  color: '#4A90A4',
  fontWeight: 700,
  marginRight: theme.spacing(2),
  flexShrink: 0,
  [theme.breakpoints.down('sm')]: {
    width: 32,
    height: 32,
    minWidth: 32,
    fontSize: '1rem',
    marginRight: theme.spacing(1.5),
  },
}));

const ServiceContent = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 16,
});

const ServiceText = styled(Typography)(({ theme }) => ({
  color: '#000',
  lineHeight: 1.7,
  fontSize: '1.05rem',
  fontWeight: 400,
  flex: 1,
  margin: 0,
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.95rem',
  },
}));

const ServicesTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: '#4A90A4',
  fontSize: '1.75rem',
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
}));

type DropdownItem = {
  title: string;
  description: string;
  render: () => JSX.Element;
};

// Константи
const GRAPHQL_ENDPOINT = 'http://localhost:1337/graphql';
const ACCORDION_TRANSITION_TIMEOUT = 400;
const SCROLL_DELAY_MS = 450;
const NAVBAR_OFFSET = 30;
const DEFAULT_NAVBAR_HEIGHT = 80;

export default function Dropdowns() {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  // Завантаження галереї
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            query: 'query { galleryimgs { img { url } } }' 
          }),
        });
        const json = await res.json();
        const urls: string[] = (json?.data?.galleryimgs || [])
          .flatMap((g: any) => (Array.isArray(g?.img) ? g.img : []))
          .map((i: any) => (typeof i?.url === 'string' ? i.url : ''))
          .filter((u: string) => !!u);
        setGalleryUrls(urls);
      } catch {
        // Ігноруємо помилки; будуть використані placeholder'и
      }
    };
    fetchGallery();
  }, []);

  // Допоміжні функції
  const getAbsoluteUrl = (url?: string): string => {
    if (!url) return '';
    return url.startsWith('http') ? url : `http://localhost:1337${url}`;
  };

  const renderMediaItem = (idx: number) => {
    const url = galleryUrls.length 
      ? getAbsoluteUrl(galleryUrls[idx % galleryUrls.length]) 
      : '';
    
    return (
      <Box sx={{
        width: '100%',
        aspectRatio: '4 / 3',
        backgroundColor: '#e3e3e3',
        border: url ? 'none' : '1px dashed #bdbdbd',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        {url && (
          <Box 
            component="img" 
            src={url} 
            alt={`gallery-${idx}`} 
            sx={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              display: 'block' 
            }} 
          />
        )}
      </Box>
    );
  };


  // Обробники подій
  const handleChange = (panel: string) => (
    event: React.SyntheticEvent, 
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Скрол до відкритого дропдауну
  useEffect(() => {
    if (!expanded) return;

    const timeoutId = setTimeout(() => {
      const accordionElements = document.querySelectorAll('.MuiAccordion-root');
      const panelIndex = parseInt(expanded.replace('panel', ''));
      const targetAccordion = accordionElements[panelIndex] as HTMLElement;
      
      if (!targetAccordion) return;

      const summaryElement = targetAccordion.querySelector(
        '.MuiAccordionSummary-root'
      ) as HTMLElement;
      
      if (!summaryElement) return;

      const rect = summaryElement.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const navbar = document.querySelector('.MuiAppBar-root') as HTMLElement;
      const navbarHeight = navbar ? navbar.offsetHeight : DEFAULT_NAVBAR_HEIGHT;
      
      const offset = navbarHeight + NAVBAR_OFFSET;
      const targetPosition = rect.top + scrollTop - offset;
      
      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth',
      });
    }, SCROLL_DELAY_MS);
    
    return () => clearTimeout(timeoutId);
  }, [expanded]);

  // Дані дропдаунів
  const dropdownItems: DropdownItem[] = [
  {
    title: 'Давайте знайомитись',
    description: 'Кілька слів про мене та підхід до роботи.',
    render: () => (
      <Section>
        {renderMediaItem(0)}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#4A90A4', mb: 3.5, fontSize: { xs: '1.6rem', md: '2.1rem' }, letterSpacing: '0.02em' }}>
            ДАВАЙТЕ ЗНАЙОМИТИСЬ
          </Typography>
          <Typography sx={{ color: '#000', lineHeight: 1.95, mb: 2.5, fontSize: '1.08rem', fontWeight: 400 }}>
            Мене звати <HighlightedText>Соловей Станіслав</HighlightedText>, але для вас можна просто <HighlightedText>Стас</HighlightedText>, і тут я повинен влучною фразою зачепити Вас…
          </Typography>
          <Typography sx={{ color: '#000', lineHeight: 1.95, mb: 3, fontSize: '1.08rem', fontWeight: 400 }}>
            …Але, пропоную залишити це у минулому. Адже сучасний івент — це про:
          </Typography>
          <BadgesContainer>
            {[
              { text: 'Легкість', icon: '✨' },
              { text: 'Гумор', icon: '😄' },
              { text: 'Естетику', icon: '🎨' },
              { text: 'Драйв', icon: '⚡' },
            ].map((item, idx, arr) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CircleBadge>
                  <CircleBadgeIcon>{item.icon}</CircleBadgeIcon>
                  <CircleBadgeText>{item.text}</CircleBadgeText>
                </CircleBadge>
                {idx < arr.length - 1 && (
                  <Typography
                    component="span"
                    sx={{
                      color: '#4A90A4',
                      fontSize: '1.2rem',
                      mx: { xs: 0.5, sm: 1 },
                      display: { xs: idx === 1 ? 'none' : 'inline', sm: 'inline' },
                    }}
                  >
                    •
                  </Typography>
                )}
              </Box>
            ))}
          </BadgesContainer>
          <Typography sx={{ color: '#000', lineHeight: 1.9, mb: 3, fontSize: '1.05rem' }}>
            Саме ці <HighlightedText sx={{ fontWeight: 700, fontSize: '1.2rem' }}>4 пункти</HighlightedText> я гарантую вже з нашої першої зустрічі.
          </Typography>
          <QuoteBox>
            <QuoteText>
              Головна нагорода за мою працю — задоволення усіх гостей, починаючи від малого до старого
            </QuoteText>
          </QuoteBox>
        </Box>
      </Section>
    ),
  },
  {
    title: 'Чому саме я?',
    description: 'Переваги співпраці та мій професійний підхід.',
    render: () => (
      <Box>
        <WhyTitle variant="h5">
          ЧОМУ САМЕ Я?
        </WhyTitle>
        <TilesGrid>
          {[
            {
              num: '1',
              title: 'Сучасний підхід',
              text: 'Я пропоную абсолютно новий рівень Вашого заходу. Жодного «радянщини» — всі розваги побудовані на комунікації та digital-технологіях.',
            },
            {
              num: '2',
              title: 'Професійний ведучий',
              text: 'А не тамада з баяном, а ведучий нової школи, який не буде перетягувати увагу гостей і змушувати робити те, чого ви не захочете.',
            },
            {
              num: '3',
              title: 'Освіта та досвід',
              text: 'Професійна освіта від престижного університету та понад 4 роки практичного досвіду.',
            },
            {
              num: '4',
              title: 'Професійна команда',
              text: 'За 4 роки я зібрав навколо себе надійну команду професіоналів, які розуміють ваші потреби.',
            },
            {
              num: '5',
              title: 'Унікальність',
              text: 'Унікальний сценарій для кожної події за допомогою авторської анкети та особистого підходу.',
            },
            {
              num: '6',
              title: 'Індивідуальність',
              text: 'Індивідуальний підхід до кожного клієнта та врахування всіх ваших побажань і особливостей.',
            },
          ].map((item, idx) => (
            <BenefitItem key={idx}>
              <BenefitNumber>{item.num}</BenefitNumber>
              <Box sx={{ flex: 1 }}>
                <BenefitTitle>{item.title}</BenefitTitle>
                <BenefitText>{item.text}</BenefitText>
              </Box>
            </BenefitItem>
          ))}
        </TilesGrid>
        <Box sx={{ mt: 5 }}>
          <ImageQuad>
            {renderMediaItem(1)}
            {renderMediaItem(2)}
          </ImageQuad>
        </Box>
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#4A90A4', mb: 4, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
            ЗА МОЇМИ ПЛЕЧИМА БІЛЬШЕ 4 РОКІВ ДОСВІДУ СУЧАСНИХ ДРАЙВОВИХ ІВЕНТІВ:
          </Typography>
          <StatsGrid>
            <StatItem>
              <MetricIcon type="ring" />
              <Typography sx={{ color: '#000', fontSize: { xs: '0.95rem', sm: '1rem' } }}>Понад 200 щасливих молодих</Typography>
            </StatItem>
            <StatItem>
              <MetricIcon type="briefcase" />
              <Typography sx={{ color: '#000', fontSize: { xs: '0.95rem', sm: '1rem' } }}>Більше 100 HRів, які отримали підвищення після мого корпоративу</Typography>
            </StatItem>
            <StatItem>
              <MetricIcon type="cap" />
              <Typography sx={{ color: '#000', fontSize: { xs: '0.95rem', sm: '1rem' } }}>Понад 50 класів зустріли зі мною свята</Typography>
            </StatItem>
            <StatItem>
              <MetricIcon type="balloon" />
              <Typography sx={{ color: '#000', fontSize: { xs: '0.95rem', sm: '1rem' } }}>Та ще багато конференцій, ювілеїв, відкриттів та ін.</Typography>
            </StatItem>
          </StatsGrid>
        </Box>
      </Box>
    ),
  },
  {
    title: 'Що входить у вартість?',
    description: 'Повний цикл організації події від ідеї до реалізації.',
    render: () => (
      <Box>
        <ServicesTitle variant="h5">
          ЩО ВХОДИТЬ У ВАРТІСТЬ?
        </ServicesTitle>
        <TwoCol>
          <Box>
            <ServiceCard>
              <ServiceContent>
                <ServiceIcon>📋</ServiceIcon>
                <ServiceText>Підбір підрядників (фотографи, відеографи, декоратори, координатори, артисти шоу-програми, музиканти та ін.)</ServiceText>
              </ServiceContent>
            </ServiceCard>
            <ServiceCard>
              <ServiceContent>
                <ServiceIcon>💬</ServiceIcon>
                <ServiceText>Зустріч та консультація</ServiceText>
              </ServiceContent>
            </ServiceCard>
            <ServiceCard>
              <ServiceContent>
                <ServiceIcon>📝</ServiceIcon>
                <ServiceText>Розробка сценарію через авторську анкету</ServiceText>
              </ServiceContent>
            </ServiceCard>
            <ServiceCard>
              <ServiceContent>
                <ServiceIcon>📱</ServiceIcon>
                <ServiceText>Консультація 24/7 по будь-яким питанням (Viber, Telegram, Instagram)</ServiceText>
              </ServiceContent>
            </ServiceCard>
            <ServiceCard>
              <ServiceContent>
                <ServiceIcon>⏰</ServiceIcon>
                <ServiceText>Таймінг івенту (не пізніше ніж за 20 днів)</ServiceText>
              </ServiceContent>
            </ServiceCard>
          </Box>
          <Box>
            <ServiceCard>
              <ServiceContent>
                <ServiceIcon>📍</ServiceIcon>
                <ServiceText>Прибуття на локацію не пізніше ніж за 2 години до початку свята</ServiceText>
              </ServiceContent>
            </ServiceCard>
            <ServiceCard>
              <ServiceContent>
                <ServiceIcon>🎧</ServiceIcon>
                <ServiceText>Робота діджея від 6 годин і більше</ServiceText>
              </ServiceContent>
            </ServiceCard>
            <ServiceCard>
              <ServiceContent>
                <ServiceIcon>🎤</ServiceIcon>
                <ServiceText>Робота ведучого від 6 годин і більше</ServiceText>
              </ServiceContent>
            </ServiceCard>
            <ServiceCard>
              <ServiceContent>
                <ServiceIcon>🔌</ServiceIcon>
                <ServiceText>Монтаж, демонтаж, доставка апаратури</ServiceText>
              </ServiceContent>
            </ServiceCard>
            <ServiceCard>
              <ServiceContent>
                <ServiceIcon>✨</ServiceIcon>
                <ServiceText>Незабутні емоції та смішні жарти</ServiceText>
              </ServiceContent>
            </ServiceCard>
          </Box>
        </TwoCol>
        <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          {renderMediaItem(3)}
          {renderMediaItem(4)}
        </Box>
      </Box>
    ),
  },
  ];

  return (
    <Box sx={{ py: 12, bgcolor: '#f5f5f5' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: '#4A90A4',
              fontSize: { xs: '2rem', md: '3rem' },
              mb: 3,
            }}
          >
            Привіт!
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: '#000', fontWeight: 400, fontSize: '1.1rem' }}
          >
            Шукаєш організатора для незабутньої події? 😎
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {dropdownItems.map((item, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              TransitionProps={{ timeout: ACCORDION_TRANSITION_TIMEOUT }}
              sx={{
                boxShadow: 'none',
                border: '1px solid #ccc',
                borderRadius: 0,
                overflow: 'hidden',
                transition: 'border-color 300ms ease, box-shadow 300ms ease, transform 200ms ease',
                '&:before': { display: 'none' },
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                  borderColor: 'var(--primary-color)'
                },
                '&.Mui-expanded': {
                  margin: 0,
                  borderColor: 'var(--primary-color)',
                  boxShadow: '0 10px 24px rgba(0,0,0,0.08)'
                },
                '& .MuiAccordionSummary-root': {
                  transition: 'background-color 300ms ease',
                },
                '& .MuiAccordionSummary-expandIconWrapper': {
                  transition: 'transform 300ms ease',
                },
                '&.Mui-expanded .MuiAccordionSummary-expandIconWrapper': {
                  transform: 'rotate(180deg)',
                },
                '& .MuiAccordionDetails-root': {
                  opacity: 0,
                  transform: 'translateY(-8px)',
                  transition: 'opacity 300ms ease, transform 300ms ease',
                },
                '&.Mui-expanded .MuiAccordionDetails-root': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#000' }} />}
                sx={{
                  backgroundColor: '#fff',
                  borderBottom: expanded === `panel${index}` ? '1px solid #ccc' : 'none',
                  '&:hover': { backgroundColor: 'rgba(74, 144, 164, 0.1)' },
                  '&.Mui-expanded': { borderBottom: '1px solid #ccc' },
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ fontWeight: 500, color: '#4A90A4', fontSize: '1.1rem' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mt: 0.5, fontSize: '0.95rem' }}>
                    {item.description}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: { xs: 2.5, md: 3.5 }, backgroundColor: '#fff' }}>
                {item.render()}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
