import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dropdowns from './components/Dropdowns';
import BrandsCarousel from './components/BrandsCarousel';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Hero />
      <Dropdowns />
      <BrandsCarousel />
      <Gallery />
      <Reviews />
      <Contact />
      <Footer />
    </Box>
  );
}
