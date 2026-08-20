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
          Join us as we count down every second to our magical wedding celebrations in Abuja.
        </p>

        <div className="countdown-panel">
          {/* Event Selection Tabs */}
          <div className="countdown-tabs">
            <button
              onClick={() => setActiveTab('traditional')}
              className={activeTab === 'traditional' ? 'countdown-tab-active' : ''}
            >
              Traditional Wedding (Dec 17)
            </button>
            
            <button
              onClick={() => setActiveTab('white')}
              className={activeTab === 'white' ? 'countdown-tab-active' : ''}
            >
              White Wedding (Dec 19)
            </button>
          </div>

          {/* Selected Event Details Header */}
          <div className="countdown-event-date">
            <span className="badge-gold">
              <Calendar size={14} style={{ flexShrink: 0 }} />
              {activeTab === 'traditional'
                ? 'Thursday, 17th December 2026 • The Nest Gardens Guzape'
                : 'Saturday, 19th December 2026 • Bolton White Event Centre, Wuse'}
            </span>
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
