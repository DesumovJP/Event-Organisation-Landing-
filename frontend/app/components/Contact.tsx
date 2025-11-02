'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    inquiry: '',
    message: '',
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSelectChange = (event: any) => {
    setFormData({
      ...formData,
      inquiry: event.target.value,
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrors({});

    // Валідація
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Ім'я обов'язкове";
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email обов\'язковий';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Невірний формат email';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Повідомлення обов\'язкове';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    // Тут буде логіка відправки форми (інтеграція з API)
    try {
      // TODO: Інтегрувати з Strapi API або email service
      await new Promise(resolve => setTimeout(resolve, 1000)); // Імітація запиту
      
      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        inquiry: '',
        message: '',
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ 
      py: 12, 
      bgcolor: '#f5f5f5',
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 8,
          alignItems: 'start'
        }}>
          {/* Left side - Marketing text block */}
          <Box sx={{ pr: { md: 4 } }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                color: '#4A90A4',
                mb: 3,
                lineHeight: 1.1,
              }}
            >
              Зв'яжіться з нами
            </Typography>
            
            {/* Separator line */}
            <Box sx={{ 
              width: '100%', 
              height: '1px', 
              bgcolor: '#000', 
              mb: 4 
            }} />
            
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                color: '#000',
                mb: 3,
                lineHeight: 1.6,
              }}
            >
              Готові організувати вашу подію або просто хочете привітатися? 
              Напишіть нам, і ми зробимо все можливе, щоб відповісти протягом 24 годин!
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                color: '#000',
                lineHeight: 1.6,
              }}
            >
              Якщо форми зв'язку не для вас... надішліть нам email на{' '}
              <Box 
                component="a" 
                href="mailto:info@eventmanager.ua"
                sx={{ 
                  color: '#000', 
                  textDecoration: 'underline',
                  '&:hover': {
                    color: 'var(--primary-color)',
                    textDecoration: 'none'
                  }
                }}
              >
                info@eventmanager.ua
              </Box>
            </Typography>
          </Box>

          {/* Right side - Contact form */}
          <Box id="contact-section">
            {submitStatus === 'success' && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 0 }}>
                Дякуємо! Ваше повідомлення відправлено. Ми зв'яжемося з вами найближчим часом.
              </Alert>
            )}
            {submitStatus === 'error' && Object.keys(errors).length === 0 && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 0 }}>
                Виникла помилка при відправці. Спробуйте ще раз або напишіть на email.
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Name fields */}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#000',
                      mb: 1,
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  >
                    Ім'я*
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      placeholder="Ім'я"
                      value={formData.firstName}
                      onChange={handleInputChange('firstName')}
                      required
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                      variant="outlined"
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                          border: '1px solid #ccc',
                          '& fieldset': {
                            border: 'none',
                          },
                          '&:hover fieldset': {
                            border: 'none',
                          },
                          '&.Mui-focused fieldset': {
                            border: '1px solid #000',
                          },
                        },
                        '& .MuiInputBase-input': {
                          py: 1.5,
                          px: 2,
                          fontSize: '0.9rem',
                        },
                      }}
                    />
                    <TextField
                      placeholder="Прізвище"
                      value={formData.lastName}
                      onChange={handleInputChange('lastName')}
                      required
                      variant="outlined"
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                          border: '1px solid #ccc',
                          '& fieldset': {
                            border: 'none',
                          },
                          '&:hover fieldset': {
                            border: 'none',
                          },
                          '&.Mui-focused fieldset': {
                            border: '1px solid #000',
                          },
                        },
                        '& .MuiInputBase-input': {
                          py: 1.5,
                          px: 2,
                          fontSize: '0.9rem',
                        },
                      }}
                    />
                  </Box>
                </Box>

                {/* Inquiry field */}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#000',
                      mb: 1,
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  >
                    Тип запиту*
                  </Typography>
                  <FormControl 
                    fullWidth 
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                        border: '1px solid #ccc',
                        '& fieldset': {
                          border: 'none',
                        },
                        '&:hover fieldset': {
                          border: 'none',
                        },
                        '&.Mui-focused fieldset': {
                          border: '1px solid #000',
                        },
                      },
                      '& .MuiInputBase-input': {
                        py: 1.5,
                        px: 2,
                        fontSize: '0.9rem',
                      },
                    }}
                  >
                    <Select
                      value={formData.inquiry}
                      onChange={handleSelectChange}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        <em>Оберіть тип запиту</em>
                      </MenuItem>
                      <MenuItem value="corporate">Корпоративний захід</MenuItem>
                      <MenuItem value="wedding">Весілля</MenuItem>
                      <MenuItem value="birthday">День народження</MenuItem>
                      <MenuItem value="conference">Конференція</MenuItem>
                      <MenuItem value="collab">Співпраця/Клієнт</MenuItem>
                      <MenuItem value="other">Інше</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Email field */}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#000',
                      mb: 1,
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  >
                    Email*
                  </Typography>
                    <TextField
                      placeholder="info@eventmanager.ua"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      required
                      error={!!errors.email}
                      helperText={errors.email}
                      variant="outlined"
                      fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                        border: '1px solid #ccc',
                        '& fieldset': {
                          border: 'none',
                        },
                        '&:hover fieldset': {
                          border: 'none',
                        },
                        '&.Mui-focused fieldset': {
                          border: '1px solid #000',
                        },
                      },
                      '& .MuiInputBase-input': {
                        py: 1.5,
                        px: 2,
                        fontSize: '0.9rem',
                      },
                    }}
                  />
                </Box>

                {/* Message field */}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#000',
                      mb: 1,
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  >
                    Повідомлення*
                  </Typography>
                  <TextField
                    placeholder="Привіт..."
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange('message')}
                    required
                    error={!!errors.message}
                    helperText={errors.message}
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                        border: '1px solid #ccc',
                        '& fieldset': {
                          border: 'none',
                        },
                        '&:hover fieldset': {
                          border: 'none',
                        },
                        '&.Mui-focused fieldset': {
                          border: '1px solid #000',
                        },
                      },
                      '& .MuiInputBase-input': {
                        py: 1.5,
                        px: 2,
                        fontSize: '0.9rem',
                      },
                    }}
                  />
                </Box>

                {/* Send button */}
                <Button
                  type="submit"
                  variant="outlined"
                  disabled={isSubmitting}
                  sx={{
                    alignSelf: 'flex-start',
                    border: '1px solid #ccc',
                    color: '#000',
                    bgcolor: '#fff',
                    borderRadius: 0,
                    px: 3,
                    py: 1,
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    minWidth: 120,
                    '&:hover': {
                      border: '1px solid var(--primary-color)',
                      bgcolor: 'var(--primary-color)',
                      color: 'white',
                    },
                    '&:disabled': {
                      opacity: 0.6,
                    },
                  }}
                >
                  {isSubmitting ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} />
                      Відправка...
                    </Box>
                  ) : (
                    'Надіслати'
                  )}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}