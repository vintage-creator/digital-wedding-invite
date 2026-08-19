import React, { useState } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

export default function OrderOfDaySection() {
  const [activeTab, setActiveTab] = useState('traditional');

  const traditionalSchedule = [
    { time: '10:00 AM', title: 'Guest Arrival & Welcome', desc: 'Arrival of guests at The Nest Gardens Guzape, welcomed with traditional music.' },
    { time: '11:00 AM', title: 'Bride & Groom Entrance', desc: 'Grand entry of the families and couple in rich traditional regal attire.' },
    { time: '12:30 PM', title: 'Dowry & Marriage Rites', desc: 'Traditional blessing, exchange of gifts, and cultural marriage rites.' },
    { time: '02:00 PM', title: 'Buffet Feast & Refreshments', desc: 'Sumptuous local delicacies, fine wines, and cultural dance performances.' },
    { time: '04:00 PM', title: 'Photo Sessions & Toast', desc: 'Family photographs, cutting of traditional cake, and open floor dancing.' }
  ];

  const whiteSchedule = [
    { time: '11:00 AM', title: 'Holy Matrimony Ceremony', desc: 'Exchange of vows and rings at Bolton White Hotels hall.' },
    { time: '12:30 PM', title: 'Cocktail & Mocktail Hour', desc: 'Canapés, acoustic music, and arrival photo booth.' },
    { time: '01:30 PM', title: 'Grand Reception Entry', desc: 'Entrance of bridal party, Deborah & Tom’s first dance.' },
    { time: '03:00 PM', title: 'Gourmet Banquet & Speeches', desc: 'Three-course dinner, family toasts, and cake cutting.' },
    { time: '05:00 PM', title: 'After-Party & Celebration', desc: 'DJ music, dancing, bouquet toss, and midnight snacks.' }
  ];

  const currentSchedule = activeTab === 'traditional' ? traditionalSchedule : whiteSchedule;

  return (
    <section id="order" className="section-padding" style={{ background: '#FFFFFF' }}>
      <div className="max-w-narrow text-center">
        
        <span className="section-eyebrow">
          <Clock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Program Schedule
        </span>
        <h2 className="section-title-script">
          Order of the Day
        </h2>
        <p className="section-subtitle">
          Here is what to expect as we celebrate each milestone of our wedding weekend.
        </p>

        {/* Tab Selection */}
        <div className="schedule-tabs" style={{
          display: 'inline-flex',
          background: 'var(--nude-bg)',
          padding: '6px',
          borderRadius: '40px',
          border: '1px solid var(--nude-border)',
          marginBottom: '2.5rem'
        }}>
          <button
            onClick={() => setActiveTab('traditional')}
            style={{
              padding: '10px 20px',
              borderRadius: '30px',
              border: 'none',
              background: activeTab === 'traditional' ? 'var(--burgundy)' : 'transparent',
              color: activeTab === 'traditional' ? '#FFFFFF' : 'var(--burgundy)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Traditional Schedule (Dec 17)
          </button>
          
          <button
            onClick={() => setActiveTab('white')}
            style={{
              padding: '10px 20px',
              borderRadius: '30px',
              border: 'none',
              background: activeTab === 'white' ? 'var(--olive)' : 'transparent',
              color: activeTab === 'white' ? '#FFFFFF' : 'var(--olive)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            White Wedding Schedule (Dec 19)
          </button>
        </div>

        {/* Timeline Items */}
        <div style={{ position: 'relative', paddingLeft: '2.5rem', textAlign: 'left' }}>
          {/* Vertical Timeline Line */}
          <div style={{
            position: 'absolute',
            left: '14px',
            top: '10px',
            bottom: '10px',
            width: '2px',
            background: 'linear-gradient(180deg, var(--gold), var(--burgundy-medium), var(--olive))'
          }} />

          {currentSchedule.map((item, idx) => (
            <div key={item.title} style={{ position: 'relative', paddingBottom: '2.2rem' }}>
              {/* Dot */}
              <div style={{
                position: 'absolute',
                left: '-2.5rem',
                top: '2px',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: `2px solid ${activeTab === 'traditional' ? 'var(--burgundy)' : 'var(--olive)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <CheckCircle2 size={14} style={{ color: activeTab === 'traditional' ? 'var(--burgundy)' : 'var(--olive)' }} />
              </div>

              {/* Time Badge */}
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--gold-dark)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}>
                {item.time}
              </span>

              {/* Title & Desc */}
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                color: 'var(--text-dark)',
                margin: '0.3rem 0'
              }}>
                {item.title}
              </h3>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
