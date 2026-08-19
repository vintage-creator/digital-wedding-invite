import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sparkles } from 'lucide-react';

export default function CountdownSection() {
  const [activeTab, setActiveTab] = useState('traditional'); // 'traditional' | 'white'

  // Target dates: Dec 17, 2026 for Traditional, Dec 19, 2026 for White Wedding
  const traditionalDate = new Date('2026-12-17T10:00:00+01:00').getTime();
  const whiteDate = new Date('2026-12-19T11:00:00+01:00').getTime();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetTime = activeTab === 'traditional' ? traditionalDate : whiteDate;
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [activeTab]);

  return (
    <section id="countdown" className="section-padding" style={{ background: 'var(--nude-bg)' }}>
      <div className="max-w-content text-center">
        
        {/* Eyebrow & Title */}
        <span className="section-eyebrow">
          <Clock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Counting Down The Moments
        </span>
        <h2 className="section-title-script">
          Until We Say "I Do"
        </h2>
        <p className="section-subtitle">
          Join us as we count down every second to our magical wedding celebrations in Abuja.
        </p>

        {/* Event Selection Tabs */}
        <div style={{
          display: 'inline-flex',
          background: '#FFFFFF',
          padding: '6px',
          borderRadius: '40px',
          border: '1px solid var(--nude-border)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2.5rem'
        }}>
          <button
            onClick={() => setActiveTab('traditional')}
            style={{
              padding: '10px 24px',
              borderRadius: '30px',
              border: 'none',
              background: activeTab === 'traditional' ? 'linear-gradient(135deg, var(--burgundy), var(--burgundy-dark))' : 'transparent',
              color: activeTab === 'traditional' ? '#FFFFFF' : 'var(--burgundy)',
              fontWeight: 600,
              fontSize: '0.88rem',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Traditional Wedding (Dec 17)
          </button>
          
          <button
            onClick={() => setActiveTab('white')}
            style={{
              padding: '10px 24px',
              borderRadius: '30px',
              border: 'none',
              background: activeTab === 'white' ? 'linear-gradient(135deg, var(--olive), var(--olive-dark))' : 'transparent',
              color: activeTab === 'white' ? '#FFFFFF' : 'var(--olive)',
              fontWeight: 600,
              fontSize: '0.88rem',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            White Wedding (Dec 19)
          </button>
        </div>

        {/* Selected Event Details Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span className={activeTab === 'traditional' ? 'badge-burgundy' : 'badge-gold'}>
            <Calendar size={14} />
            {activeTab === 'traditional'
              ? 'Thursday, 17th December 2026 • The Nest Gardens Guzape'
              : 'Saturday, 19th December 2026 • Bolton White Hotels Abuja'}
          </span>
        </div>

        {/* Countdown Digit Boxes Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '1.25rem',
          maxWidth: '680px',
          margin: '0 auto'
        }}>
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds }
          ].map((item) => (
            <div
              key={item.label}
              className="glass-card"
              style={{
                padding: '1.5rem 1rem',
                textAlign: 'center',
                border: '1.5px solid var(--nude-border)',
                background: '#FFFFFF'
              }}
            >
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
                fontWeight: 700,
                color: activeTab === 'traditional' ? 'var(--burgundy)' : 'var(--olive-dark)',
                lineHeight: 1
              }}>
                {String(item.value).padStart(2, '0')}
              </div>
              <span style={{
                display: 'block',
                marginTop: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--gold-dark)'
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
