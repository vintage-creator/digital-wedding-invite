import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin } from 'lucide-react';

export default function CountdownSection() {
  // Target date: Saturday, 21st November 2026, 10:00 AM WAT
  const weddingDate = new Date('2026-11-21T10:00:00+01:00').getTime();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = weddingDate - now;

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
  }, [weddingDate]);

  return (
    <section id="countdown" className="section-padding countdown-section" style={{ background: 'var(--section-blush)' }}>
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
          Join us as we count down every second to our wedding celebration at Green Life Event Center, Lagos.
        </p>

        <div className="countdown-panel">
          {/* Selected Event Details Header */}
          <div className="countdown-event-date" style={{ marginBottom: '1.8rem' }}>
            <span className="badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.4rem' }}>
              <Calendar size={16} style={{ flexShrink: 0 }} />
              Saturday, 21st November 2026 • 10:00 AM WAT
            </span>
            <div style={{ marginTop: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <MapPin size={15} style={{ color: 'var(--gold-dark)' }} />
              <span>Green Life Event Center, Oregun, Ikeja, Lagos</span>
            </div>
          </div>

          {/* Countdown Digit Boxes Grid */}
          <div className="countdown-grid">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item) => (
              <div key={item.label} className="glass-card countdown-time-card">
                <div className="countdown-time-value">
                  {String(item.value).padStart(2, '0')}
                </div>
                <span className="countdown-time-label">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
