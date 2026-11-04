import React from 'react';
import { Clock } from 'lucide-react';

export default function OrderOfDaySection() {
  const schedule = [
    {
      time: '9:30–10:00 AM',
      timeValue: '2026-11-21T09:30:00+01:00',
      title: 'Guest Arrival',
      desc: 'Guests arrive and are welcomed.'
    },
    {
      time: '10:00–11:30 AM',
      timeValue: '2026-11-21T10:00:00+01:00',
      title: 'Holy Matrimony',
      desc: 'Solemnization of Holy Matrimony.'
    },
    {
      time: '12:00–2:00 PM',
      timeValue: '2026-11-21T12:00:00+01:00',
      title: 'Engagement',
      desc: 'Traditional engagement ceremony.'
    },
    {
      time: '2:30–3:00 PM',
      timeValue: '2026-11-21T14:30:00+01:00',
      title: 'Birthday Celebration & Cake Cutting',
      desc: 'Birthday celebration and cutting of the cake.'
    },
    {
      time: '3:00 PM onwards',
      timeValue: '2026-11-21T15:00:00+01:00',
      title: 'Reception & After-Party',
      desc: 'Reception celebration and after-party.'
    }
  ];

  return (
    <section id="order" className="section-padding order-day-section">
      <div className="max-w-narrow text-center">
        <span className="section-eyebrow">
          <Clock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
          Program Schedule
        </span>
        <h2 className="section-title-script">Order of the Day</h2>
        <p className="section-subtitle">
          Saturday, 21 November 2026 · Greenlife Event Center, Oregun, Lagos
        </p>

        <ol className="order-day-timeline">
          {schedule.map((item, index) => (
            <li className="order-day-item" key={item.time}>
              <span className="order-day-marker" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <article className="order-day-card">
                <time className="order-day-time" dateTime={item.timeValue}>{item.time}</time>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
