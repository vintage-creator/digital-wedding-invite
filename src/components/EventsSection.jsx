import React from 'react';
import { Calendar, MapPin, Clock, Navigation } from 'lucide-react';

export default function EventsSection() {
  const events = [
    {
      id: 'wedding',
      type: 'Solemnization of Holy Matrimony & Reception',
      date: 'Saturday, 21st November 2026',
      time: '10:00 AM WAT',
      venue: 'Greenlife Event Center, Oregun',
      address: 'Plot 2 Kudirat Abiola Way, Oregun, Ikeja, Lagos, Nigeria',
      attire: 'Color of the Day: Mint Green and Plum',
      mapUrl: 'https://maps.google.com/?q=Greenlife+Event+Center+Oregun+Ikeja+Lagos',
      mapEmbedUrl: 'https://maps.google.com/maps?q=Greenlife+Event+Center+Oregun+Ikeja+Lagos&output=embed',
      calendarTitle: 'Opeyemi & Temilayojesu — Wedding & Reception (#ever_after_21)',
      calendarDescription: 'Wedding Ceremony and Reception for Opeyemi & Temilayojesu at Greenlife Event Center, Oregun, Ikeja, Lagos. Access Card Admits One.',
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

        <div className="venue-card-pair">
          {events.map((evt) => (
            <React.Fragment key={evt.id}>
              <article className="venue-feature-card glass-card">
                <img
                  className="venue-feature-photo"
                  src="/assets/greenlife-event-center.jpg"
                  alt="Exterior of Greenlife Event Center in Oregun, Lagos"
                />
                <div className="venue-feature-copy">
                  <span className="venue-event-type">{evt.type}</span>
                  <h3>{evt.venue}</h3>
                  <div className="venue-event-meta">
                    <span><Calendar size={16} aria-hidden="true" /> {evt.date}</span>
                    <span><Clock size={16} aria-hidden="true" /> {evt.time}</span>
                  </div>
                  <p className="venue-attire">{evt.attire}</p>
                </div>
              </article>

              <article className="venue-map-card glass-card">
                <header className="venue-map-card-heading">
                  <span>Find the Venue</span>
                  <h3>Greenlife Event Center</h3>
                </header>
                <div className="venue-map-frame">
                  <iframe
                    title={`${evt.venue} map`}
                    src={evt.mapEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <div className="venue-map-card-footer">
                  <p><MapPin size={17} aria-hidden="true" /> {evt.address}</p>
                  <div className="venue-map-actions">
                    <a href={evt.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-burgundy">
                      <Navigation size={15} /> Get Directions
                    </a>
                    <button type="button" onClick={() => saveToCalendar(evt)} className="btn btn-nude">
                      <Calendar size={15} /> Save Calendar
                    </button>
                  </div>
                </div>
              </article>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
