import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

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
          maxWidth: '100%',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '4px',
          background: 'var(--nude-bg)',
          padding: '6px',
          borderRadius: '40px',
          border: '1.5px solid var(--nude-border)',
          boxShadow: '0 2px 10px rgba(38, 54, 34, 0.06)',
          marginBottom: '2.5rem'
        }}>
          <button
            onClick={() => setActiveTab('traditional')}
            style={{
              padding: '10px 20px',
              borderRadius: '30px',
              border: activeTab === 'traditional' ? '1.5px solid #C5A059' : '1px solid transparent',
              background: activeTab === 'traditional' ? 'linear-gradient(135deg, #FAF6F0, #EFE5D5)' : 'transparent',
              color: activeTab === 'traditional' ? '#2B2318' : 'var(--text-muted)',
              fontWeight: 500,
              fontSize: '0.86rem',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === 'traditional' ? '0 4px 14px rgba(197, 160, 89, 0.2)' : 'none'
            }}
          >
            Traditional Wedding (Dec 17)
          </button>
          
          <button
            onClick={() => setActiveTab('white')}
            style={{
              padding: '10px 20px',
              borderRadius: '30px',
              border: activeTab === 'white' ? '1.5px solid #C5A059' : '1px solid transparent',
              background: activeTab === 'white' ? 'linear-gradient(135deg, #FAF6F0, #EFE5D5)' : 'transparent',
              color: activeTab === 'white' ? '#2B2318' : 'var(--text-muted)',
              fontWeight: 500,
              fontSize: '0.86rem',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === 'white' ? '0 4px 14px rgba(197, 160, 89, 0.2)' : 'none'
            }}
          >
            White Wedding (Dec 19)
          </button>
        </div>

        {/* Selected Event Details Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge-gold" style={{ maxWidth: '100%', wordBreak: 'break-word', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} style={{ flexShrink: 0 }} />
            {activeTab === 'traditional'
              ? 'Thursday, 17th December 2026 • The Nest Gardens Guzape'
              : 'Saturday, 19th December 2026 • Bolton White Event Centre, Wuse'}
          </span>
        </div>

        {/* Countdown Digit Boxes Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 'clamp(0.4rem, 2vw, 1.25rem)',
          maxWidth: '680px',
          width: '100%',
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
                padding: 'clamp(0.9rem, 2.5vw, 1.5rem) clamp(0.3rem, 1.5vw, 1rem)',
                textAlign: 'center',
                border: '1.5px solid var(--nude-border)',
                background: 'var(--nude-card)',
                borderRadius: '16px'
              }}
            >
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.7rem, 5.5vw, 3.6rem)',
                fontWeight: 700,
                color: 'var(--burgundy-dark)',
                lineHeight: 1
              }}>
                {String(item.value).padStart(2, '0')}
              </div>
              <span style={{
                display: 'block',
                marginTop: '6px',
                fontSize: 'clamp(0.62rem, 1.8vw, 0.75rem)',
                fontWeight: 600,
                letterSpacing: '0.12em',
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
