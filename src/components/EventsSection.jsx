import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Navigation } from 'lucide-react';

export default function EventsSection() {
  const [hoveredVenue, setHoveredVenue] = useState(null);

  const events = [
    {
      id: 'traditional',
      type: 'Traditional Marriage',
      date: 'Thursday, 17th December 2026',
      time: '10:00 AM WAT',
      venue: 'The Nest Gardens Guzape',
      address: 'Plot 1042, Guzape District, Abuja, Nigeria',
      attire: 'Traditional Regal Attire (Burgundy & Sage Green)',
      image: '/assets/nest_gardens.jpg',
      mapUrl: 'https://maps.google.com/?q=The+Nest+Gardens+Guzape+Abuja',
      calendarTitle: 'Deborah & Tom — Traditional Wedding',
      calendarDescription: 'Traditional Marriage Ceremony for Deborah & Tom.',
      calendarStart: '20261217T100000',
      calendarEnd: '20261217T160000'
    },
    {
      id: 'white',
      type: 'White Wedding & Reception',
      date: 'Saturday, 19th December 2026',
      time: '11:00 AM WAT',
      venue: 'Bolton White Hotels Abuja',
      address: 'Plot 700, Area 11, Garki, Abuja, Nigeria',
      attire: 'Formal / Black Tie Optional (Olive & Nude accents)',
      image: '/assets/bolton_white.jpg',
      mapUrl: 'https://maps.google.com/?q=Bolton+White+Hotels+Abuja',
      calendarTitle: 'Deborah & Tom — White Wedding & Reception',
      calendarDescription: 'White Wedding Ceremony and reception for Deborah & Tom.',
      calendarStart: '20261219T110000',
      calendarEnd: '20261219T180000'
    }
  ];

  const escapeCalendarText = (value) => value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');

  const saveToCalendar = (event) => {
    const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const calendar = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'PRODID:-//Deborah and Tom Wedding//Invitation//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}-wedding-2026@deborahandtom`,
      `DTSTAMP:${now}`,
      `DTSTART;TZID=Africa/Lagos:${event.calendarStart}`,
      `DTEND;TZID=Africa/Lagos:${event.calendarEnd}`,
      `SUMMARY:${escapeCalendarText(event.calendarTitle)}`,
      `DESCRIPTION:${escapeCalendarText(event.calendarDescription)}`,
      `LOCATION:${escapeCalendarText(event.address)}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      'DESCRIPTION:Wedding celebration tomorrow',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([calendar], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deborah-tom-${event.id}-wedding.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section id="events" className="section-padding" style={{ background: '#FFFFFF' }}>
      <div className="max-w-content text-center">
        
        <span className="section-eyebrow">
          <Calendar size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Wedding Schedule & Venues
        </span>
        <h2 className="section-title-script">
          Events & Venues
        </h2>
        <p className="section-subtitle">
          Join us as we celebrate our union across two special days in Abuja, Nigeria. Hover over venue photos for details.
        </p>

        {/* Venue Cards Grid */}
        <div className="events-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '2.5rem',
          marginTop: '3rem',
          width: '100%',
          textAlign: 'left'
        }}>
          {events.map((evt) => {
            const isHovered = hoveredVenue === evt.id;
            return (
              <div
                key={evt.id}
                onMouseEnter={() => setHoveredVenue(evt.id)}
                onMouseLeave={() => setHoveredVenue(null)}
                className="glass-card"
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: isHovered ? '1.5px solid var(--gold)' : '1.5px solid var(--nude-border)',
                  background: 'var(--nude-bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isHovered
                    ? '0 25px 55px rgba(74, 88, 63, 0.14), 0 0 20px rgba(197, 160, 89, 0.4)'
                    : '0 15px 40px rgba(0,0,0,0.06)',
                  transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                  transition: 'transform 0.4s ease, boxShadow 0.4s ease, border 0.4s ease'
                }}
              >
                <div>
                  {/* Venue Location Photograph Header with Hover Zoom */}
                  <div style={{ position: 'relative', height: '230px', overflow: 'hidden', cursor: 'pointer' }}>
                    <img
                      src={evt.image}
                      alt={evt.venue}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: isHovered
                        ? 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(59, 8, 27, 0.88) 100%)'
                        : 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(59, 8, 27, 0.78) 100%)',
                      transition: 'background 0.4s ease'
                    }} />

                    {/* High-Contrast White Text Event Type Badge */}
                    <span style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      background: 'rgba(74, 88, 63, 0.90)',
                      color: '#FFFFFF',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: '1.2px solid rgba(228, 200, 137, 0.6)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
                      textTransform: 'uppercase',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}>
                      {evt.type}
                    </span>

                    <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', color: '#FFFFFF' }}>
                      <h3 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.45rem',
                        margin: 0,
                        textShadow: '0 2px 6px rgba(0,0,0,0.7)',
                        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                        transition: 'transform 0.3s ease'
                      }}>
                        {evt.venue}
                      </h3>
                    </div>
                  </div>

                  {/* Venue Info Details */}
                  <div style={{ padding: '1.8rem 1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--burgundy-dark)' }}>
                        <Calendar size={18} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{evt.date}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-dark)' }}>
                        <Clock size={18} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.9rem' }}>{evt.time}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-muted)' }}>
                        <MapPin size={18} style={{ color: 'var(--olive)', flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '0.9rem' }}>{evt.address}</span>
                      </div>

                      <div style={{ marginTop: '0.4rem', borderTop: '1px dashed var(--nude-border)', paddingTop: '0.8rem' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--gold-dark)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          Dress Code:
                        </span>
                        <p style={{ fontSize: '0.88rem', color: 'var(--burgundy)', margin: '0.2rem 0 0', fontWeight: 500 }}>
                          {evt.attire}
                        </p>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="event-actions" style={{ padding: '0 1.5rem 1.8rem', display: 'flex', gap: '0.8rem' }}>
                  <a
                    href={evt.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-burgundy"
                    style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                  >
                    <Navigation size={14} /> Get Directions
                  </a>

                  <button
                    type="button"
                    onClick={() => saveToCalendar(evt)}
                    className="btn btn-burgundy"
                    style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                  >
                    <Calendar size={14} /> Save Calendar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
