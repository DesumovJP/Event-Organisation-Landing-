'use client';

import { useState, useEffect } from 'react';
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

type DropdownItem = {
  title: string;
  description: string;
  render: () => JSX.Element;
};

export default function Dropdowns() {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('http://localhost:1337/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `query { galleryimgs { img { url } } }` }),
        });
        const json = await res.json();
        const arr: string[] = (json?.data?.galleryimgs || [])
          .flatMap((g: any) => (Array.isArray(g?.img) ? g.img : []))
          .map((i: any) => (typeof i?.url === 'string' ? i.url : ''))
          .filter((u: string) => !!u);
        setGalleryUrls(arr);
      } catch (_) {
        // ignore; placeholders will remain
      }
    };
    fetchGallery();
  }, []);

  const abs = (url?: string) => (url && url.startsWith('http') ? url : url ? `http://localhost:1337${url}` : '');

  const media = (idx: number) => {
    const url = galleryUrls.length ? abs(galleryUrls[idx % galleryUrls.length]) : '';
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
          <Box component="img" src={url} alt={`gallery-${idx}`} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
      </Box>
    );
  };

  const MetricIcon = ({ type }: { type: 'ring' | 'briefcase' | 'cap' | 'balloon' }) => {
    if (type === 'ring') {
      return (
        <Box component="svg" viewBox="0 0 64 64" sx={{ width: 56, height: 56, color: '#4A90A4' }}>
          <circle cx="32" cy="40" r="18" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M28 16h8l6 6h-20z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          <path d="M32 12l4 4-4 4-4-4z" fill="currentColor" />
        </Box>
      );
    }
    if (type === 'briefcase') {
      return (
        <Box component="svg" viewBox="0 0 64 64" sx={{ width: 56, height: 56, color: '#4A90A4' }}>
          <rect x="10" y="20" width="44" height="28" rx="4" ry="4" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M24 20v-4a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M10 32h44" stroke="currentColor" strokeWidth="3" />
        </Box>
      );
    }
    if (type === 'cap') {
      return (
        <Box component="svg" viewBox="0 0 64 64" sx={{ width: 56, height: 56, color: '#4A90A4' }}>
          <path d="M6 26l26-12 26 12-26 12z" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M16 32v8c0 4 12 8 16 8s16-4 16-8v-8" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M58 26v14" stroke="currentColor" strokeWidth="3" />
          <circle cx="58" cy="44" r="3" fill="currentColor" />
        </Box>
      );
    }
    return (
      <Box component="svg" viewBox="0 0 64 64" sx={{ width: 56, height: 56, color: '#4A90A4' }}>
        <path d="M32 8c8 0 14 6 14 13s-6 15-14 15-14-8-14-15 6-13 14-13z" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M32 36c0 6-4 10-8 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </Box>
    );
  };

  const dropdownItems: DropdownItem[] = [
  {
    title: 'Давайте знайомитись',
    description: 'Кілька слів про мене та підхід до роботи.',
    render: () => (
      <Section>
        {media(0)}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#4A90A4', mb: 2 }}>
            ДАВАЙТЕ ЗНАЙОМИТИСЬ
          </Typography>
          <Typography sx={{ color: '#000', lineHeight: 1.8, mb: 1.5 }}>
            Мене звати Соловей Станіслав, але для вас можна просто Стас, і тут я повинен влучною фразою зачепити Вас…
          </Typography>
          <Typography sx={{ color: '#000', lineHeight: 1.8, mb: 1.5 }}>
            …Але, пропоную залишити це у минулому. Адже сучасний івент — це про Легкість, Гумор, Естетику і Драйв.
          </Typography>
          <Typography sx={{ color: '#000', lineHeight: 1.8 }}>
            Саме ці 4 пункти я гарантую вже з нашої першої зустрічі.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Typography sx={{ color: '#000', fontStyle: 'italic' }}>
              “Головна нагорода за мою працю — задоволення усіх гостей, починаючи від малого до старого”
            </Typography>
          </Box>
        </Box>
      </Section>
    ),
  },
  {
    title: 'Чому саме я?',
    description: 'Переваги співпраці та мій професійний підхід.',
    render: () => (
      <Box>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#4A90A4' }}>
            ЧОМУ САМЕ Я?
          </Typography>
        </Box>
        <TilesGrid>
          <Box>
            <Typography sx={{ color: '#000' }}>
              1 — Я пропоную абсолютно новий рівень Вашого заходу. Жодного «радянщини» — всі розваги побудовані на комунікації та digital.
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ color: '#000' }}>
              2 — А не тамада з баяном, а ведучий нової школи, який не буде перетягувати увагу гостей і змушувати робити те, чого ви не захочете.
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ color: '#000' }}>
              3 — Професійна освіта від престижного університету.
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ color: '#000' }}>
              4 — За 4 роки я зібрав навколо себе професійну команду.
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ color: '#000' }}>
              5 — Унікальний сценарій за допомогою авторської анкети.
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ color: '#000' }}>
              6 — Індивідуальний підхід до кожного клієнта.
            </Typography>
          </Box>
        </TilesGrid>
        <Box sx={{ mt: 4 }}>
          <ImageQuad>
            {media(1)}
            {media(2)}
          </ImageQuad>
        </Box>
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#4A90A4', mb: 3 }}>
            ЗА МОЇМИ ПЛЕЧИМА БІЛЬШЕ 4 РОКІВ ДОСВІДУ СУЧАСНИХ ДРАЙВОВИХ ІВЕНТІВ:
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, textAlign: 'left' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '56px 1fr', alignItems: 'center', gap: 2 }}>
            <MetricIcon type="ring" />
              <Typography sx={{ color: '#000' }}>Понад 200 щасливих молодих</Typography>
            </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '56px 1fr', alignItems: 'center', gap: 2 }}>
            <MetricIcon type="briefcase" />
              <Typography sx={{ color: '#000' }}>Більше 100 HRів, які отримали підвищення після мого корпоративу</Typography>
            </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '56px 1fr', alignItems: 'center', gap: 2 }}>
            <MetricIcon type="cap" />
              <Typography sx={{ color: '#000' }}>Понад 50 класів зустріли зі мною свята</Typography>
            </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '56px 1fr', alignItems: 'center', gap: 2 }}>
            <MetricIcon type="balloon" />
              <Typography sx={{ color: '#000' }}>Та ще багато конференцій, ювілеїв, відкриттів та ін.</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    ),
  },
  {
    title: 'Що входить у вартість?',
    description: 'Повний цикл організації події від ідеї до реалізації.',
    render: () => (
      <Box>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#4A90A4' }}>
            ЩО ВХОДИТЬ У ВАРТІСТЬ?
          </Typography>
        </Box>
        <TwoCol>
          <Box>
            <Typography sx={{ color: '#000', mb: 1.2 }}>• Підбір підрядників (фотографи, відеографи, декоратори, координатори, артисти шоу-програми, музиканти та ін.);</Typography>
            <Typography sx={{ color: '#000', mb: 1.2 }}>• Зустріч та консультація;</Typography>
            <Typography sx={{ color: '#000', mb: 1.2 }}>• Розробка сценарію через авторську анкету;</Typography>
            <Typography sx={{ color: '#000', mb: 1.2 }}>• Консультація 24/7 по будь-яким питанням (Viber, Telegram, Instagram);</Typography>
            <Typography sx={{ color: '#000', mb: 1.2 }}>• Таймінг івенту (не пізніше ніж за 20 днів);</Typography>
          </Box>
          <Box>
            <Typography sx={{ color: '#000', mb: 1.2 }}>• Прибуття на локацію не пізніше ніж за 2 години до початку свята;</Typography>
            <Typography sx={{ color: '#000', mb: 1.2 }}>• Робота діджея від 6 годин і більше;</Typography>
            <Typography sx={{ color: '#000', mb: 1.2 }}>• Робота ведучого від 6 годин і більше;</Typography>
            <Typography sx={{ color: '#000', mb: 1.2 }}>• Монтаж, демонтаж, доставка апаратури;</Typography>
            <Typography sx={{ color: '#000', mb: 1.2 }}>• Незабутні емоції та смішні жарти.</Typography>
          </Box>
        </TwoCol>
        <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          {media(3)}
          {media(4)}
        </Box>
      </Box>
    ),
  },
  ];
  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

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
              TransitionProps={{ timeout: 400 }}
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
