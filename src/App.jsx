import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EnvelopeCover from './components/EnvelopeCover';
import HeroSection from './components/HeroSection';
import InvitationCardSection from './components/InvitationCardSection';
import CountdownSection from './components/CountdownSection';
import EventsSection from './components/EventsSection';
import OrderOfDaySection from './components/OrderOfDaySection';
import ColorPaletteSection from './components/ColorPaletteSection';
import PhotoGallerySection from './components/PhotoGallerySection';
import GiftRegistrySection from './components/GiftRegistrySection';
import RsvpSection from './components/RsvpSection';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import PetalsCanvas from './components/PetalsCanvas';
import Toast from './components/Toast';
import { ArrowUp } from 'lucide-react';

export default function App() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = (nextToast) => {
    setToast(nextToast);
  };

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Monitor scroll for Back To Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEnvelopeOpen = () => {
    setEnvelopeOpened(true);
    setIsMusicPlaying(true);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Background Floating Petals Canvas */}
      <PetalsCanvas active={envelopeOpened} />

      {/* Landing Envelope Cover */}
      <EnvelopeCover onOpen={handleEnvelopeOpen} />

      {/* Main Wedding Website Header & Navigation */}
      <Navbar />

      {/* Main Sections */}
      <main>
        <HeroSection />
        <CountdownSection />
        <InvitationCardSection />
        <EventsSection />
        <RsvpSection onTriggerToast={triggerToast} />
        <OrderOfDaySection />
        <ColorPaletteSection />
        <GiftRegistrySection onTriggerToast={triggerToast} />
        <PhotoGallerySection onTriggerToast={triggerToast} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Audio Controls */}
      <MusicPlayer isPlaying={isMusicPlaying} setIsPlaying={setIsMusicPlaying} />

      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Floating Back To Top Button */}
      {showBackToTop && (
        <button
          className="back-to-top"
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '28px',
            left: '28px',
            zIndex: 900,
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'rgba(91, 14, 45, 0.90)',
            backdropFilter: 'blur(12px)',
            border: '1.5px solid var(--gold)',
            color: '#E4C889',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.3s ease, background 0.3s ease',
            animation: 'fadeIn 0.3s ease'
          }}
          title="Back to Top"
          aria-label="Scroll Back to Top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
