import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Navigation } from 'lucide-react';

export default function EventsSection() {
  const [hoveredVenue, setHoveredVenue] = useState(null);

  const events = [
    {
      id: 'wedding',
      type: 'Solemnization of Holy Matrimony & Reception',
      date: 'Saturday, 21st November 2026',
      time: '10:00 AM WAT',
      venue: 'Green Life Event Center, Oregun',
      address: 'Plot 2 Kudirat Abiola Way, Oregun, Ikeja, Lagos, Nigeria',
      attire: 'Color of the Day: Mint Green and Plum',
      image: '/assets/ot_access_card_page_1.png',
      mapUrl: 'https://maps.google.com/?q=Green+Life+Event+Center+Oregun+Ikeja+Lagos',
      calendarTitle: 'Opeyemi & Temilayojesu — Wedding & Reception (#EVERAFTER21\')',
      calendarDescription: 'Wedding Ceremony and Reception for Opeyemi & Temilayojesu at Green Life Event Center, Oregun, Ikeja, Lagos. Access Card Admits One.',
      calendarStart: '20261121T100000',
      calendarEnd: '20261121T180000'
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
      'PRODID:-//Opeyemi and Temilayojesu Wedding//Invitation//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}-wedding-2026@everafter21`,
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
    link.setAttribute('download', `${event.id}-opeyemi-temilayojesu-2026.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="events" className="section-padding" style={{ background: 'var(--section-bright)' }}>
      <div className="max-w-content text-center">
        
        {/* Section Header */}
        <span className="section-eyebrow">
          <Calendar size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Wedding Schedule &amp; Venue
        </span>
        <h2 className="section-title-script">
          Event &amp; Venue
        </h2>
        <p className="section-subtitle">
          Join us as we celebrate our union in Lagos, Nigeria. Access Card Admits One.
        </p>

        {/* Event Cards Grid */}
        <div style={{
          maxWidth: '720px',
          margin: '3rem auto 0',
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
                  background: 'var(--nude-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isHovered
                    ? '0 25px 55px rgba(50, 12, 48, 0.16), 0 0 20px rgba(114, 199, 142, 0.32)'
                    : '0 15px 40px rgba(0,0,0,0.06)',
                  transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                  transition: 'transform 0.4s ease, boxShadow 0.4s ease, border 0.4s ease'
                }}
              >
                <div>
                  {/* Venue Location Photograph Header with Hover Zoom */}
                  <div style={{ position: 'relative', height: '260px', overflow: 'hidden', cursor: 'pointer', background: 'var(--burgundy)' }}>
                    <img
                      src={evt.image}
                      alt={evt.venue}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                        transition: 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: isHovered
                        ? 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(50, 12, 48, 0.88) 100%)'
                        : 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(50, 12, 48, 0.78) 100%)',
                      transition: 'background 0.4s ease'
                    }} />

                    {/* Badge */}
                    <span style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      background: 'rgba(92, 32, 89, 0.90)',
                      color: '#FFFFFF',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: '1.2px solid rgba(114, 199, 142, 0.6)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
                      textTransform: 'uppercase'
                    }}>
                      {evt.type}
                    </span>

                    <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', color: '#FFFFFF' }}>
                      <h3 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.55rem',
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
                  <div style={{ padding: '2rem 1.8rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--burgundy-dark)' }}>
                        <Calendar size={18} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                        <span style={{ fontWeight: 600, fontSize: '1rem' }}>{evt.date}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-dark)' }}>
                        <Clock size={18} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.92rem' }}>{evt.time}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-muted)' }}>
                        <MapPin size={18} style={{ color: 'var(--gold-dark)', flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '0.92rem' }}>{evt.address}</span>
                      </div>

                      <div style={{ marginTop: '0.4rem', borderTop: '1px dashed var(--nude-border)', paddingTop: '0.8rem' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--gold-dark)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          Dress Code / Color of the Day:
                        </span>
                        <p style={{ fontSize: '0.95rem', color: 'var(--burgundy)', margin: '0.2rem 0 0', fontWeight: 600 }}>
                          {evt.attire}
                        </p>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                  padding: '1.2rem 1.8rem 1.8rem',
                  display: 'flex',
                  gap: '12px',
                  borderTop: '1px solid var(--nude-border)',
                  background: 'rgba(250, 246, 250, 0.65)'
                }}>
                  <a
                    href={evt.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-burgundy"
                    style={{ flex: 1, textDecoration: 'none', textAlign: 'center', fontSize: '0.84rem', padding: '0.65rem 0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Navigation size={15} />
                    Get Directions
                  </a>

                  <button
                    onClick={() => saveToCalendar(evt)}
                    className="btn btn-nude"
                    style={{ flex: 1, fontSize: '0.84rem', padding: '0.65rem 0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Calendar size={15} />
                    Save Calendar
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
