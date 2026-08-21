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
import CoupleDashboard from './components/CoupleDashboard';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import PetalsCanvas from './components/PetalsCanvas';
import Toast from './components/Toast';
import { ArrowUp } from 'lucide-react';

const DASHBOARD_PATH = '/dashboard';
const DASHBOARD_SESSION_KEY = 'deborah_tom_dashboard_passcode';

const normalizePath = (path) => {
  const normalized = path.replace(/\/+$/, '');
  return normalized || '/';
};

const isDashboardRoute = () => (
  typeof window !== 'undefined' && normalizePath(window.location.pathname) === DASHBOARD_PATH
);

const getStoredDashboardPasscode = () => {
  if (typeof window === 'undefined') return '';
  if (!isDashboardRoute()) return '';
  try {
    return window.sessionStorage.getItem(DASHBOARD_SESSION_KEY) || '';
  } catch (err) {
    return '';
  }
};

export default function App() {
  const [dashboardPasscode, setDashboardPasscode] = useState(getStoredDashboardPasscode);
  const [envelopeOpened, setEnvelopeOpened] = useState(() => Boolean(getStoredDashboardPasscode()));
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

  useEffect(() => {
    const handleRouteChange = () => {
      if (isDashboardRoute()) {
        const storedPasscode = getStoredDashboardPasscode();
        setDashboardPasscode(storedPasscode);
        setEnvelopeOpened(Boolean(storedPasscode));
      } else {
        setDashboardPasscode('');
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  useEffect(() => {
    if (dashboardPasscode) {
      try {
        window.sessionStorage.setItem(DASHBOARD_SESSION_KEY, dashboardPasscode);
      } catch (err) {}

      if (!isDashboardRoute()) {
        window.history.pushState({ view: 'dashboard' }, '', DASHBOARD_PATH);
      }
    }
  }, [dashboardPasscode]);

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
    if (isDashboardRoute()) {
      window.history.replaceState(null, '', '/');
    }
  };

  const handleDashboardOpen = (passcode) => {
    try {
      window.sessionStorage.setItem(DASHBOARD_SESSION_KEY, passcode);
    } catch (err) {}

    if (!isDashboardRoute()) {
      window.history.pushState({ view: 'dashboard' }, '', DASHBOARD_PATH);
    }

    setDashboardPasscode(passcode);
    setEnvelopeOpened(true);
    setIsMusicPlaying(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  const handleDashboardExit = () => {
    try {
      window.sessionStorage.removeItem(DASHBOARD_SESSION_KEY);
    } catch (err) {}

    if (isDashboardRoute()) {
      window.history.pushState({ view: 'invitation' }, '', '/');
    }

    setDashboardPasscode('');
    setEnvelopeOpened(true);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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
      {!dashboardPasscode && <EnvelopeCover onOpen={handleEnvelopeOpen} onDashboardOpen={handleDashboardOpen} />}

      {dashboardPasscode ? (
        <CoupleDashboard
          dashboardPasscode={dashboardPasscode}
          onTriggerToast={triggerToast}
          onExit={handleDashboardExit}
        />
      ) : (
        <>
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
        </>
      )}

      {/* Floating Audio Controls */}
      {!dashboardPasscode && <MusicPlayer isPlaying={isMusicPlaying} setIsPlaying={setIsMusicPlaying} />}

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
