import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, Gift, Camera, Calendar, Palette, Clock } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Events', href: '#events', icon: <Calendar size={16} /> },
    { name: 'RSVP', href: '#rsvp', icon: <Heart size={16} /> },
    { name: 'Timeline', href: '#order', icon: <Clock size={16} /> },
    { name: 'Dress Code', href: '#colors', icon: <Palette size={16} /> },
    { name: 'Gifts', href: '#gifts', icon: <Gift size={16} /> },
    { name: 'Guest Gallery', href: '#gallery', icon: <Camera size={16} /> }
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-navbar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 800,
        transition: 'all 0.35s ease',
        background: scrolled
          ? 'rgba(250, 246, 240, 0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--nude-border)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 20px rgba(91, 14, 45, 0.06)' : 'none',
        padding: scrolled ? '0.75rem 1.5rem' : '1.25rem 1.5rem'
      }}
    >
      <div className="max-w-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand / Logo */}
        <a href="#hero" className="navbar-brand" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontFamily: 'var(--font-script)',
            fontSize: '1.8rem',
            color: 'var(--burgundy)',
            fontWeight: 600
          }}>
            Deborah & Tom
          </span>
          <span className="badge-gold" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
            Dec 2026
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.8rem' }} className="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.85rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--burgundy-dark)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-dark)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--burgundy-dark)')}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--burgundy)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          className="mobile-toggle"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(250, 246, 240, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--nude-border)',
          padding: '1.5rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={handleLinkClick}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.1rem',
                color: 'var(--burgundy)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.5rem 0',
                borderBottom: '1px dashed rgba(197, 160, 89, 0.3)'
              }}
            >
              <span style={{ color: 'var(--gold)' }}>{link.icon}</span>
              {link.name}
            </a>
          ))}
        </div>
      )}

      {/* Inline Responsive Styles */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
