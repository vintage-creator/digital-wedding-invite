import React from 'react';

export default function OurStorySection() {
  return (
    <section id="our-story" className="section-padding our-story-section">
      <div className="max-w-content our-story-layout">
        <div className="our-story-photo-gallery" role="group" aria-label="Portraits of Opeyemi and Temilayojesu">
          <figure className="our-story-photo-frame our-story-photo-main">
            <img
              src="/assets/opeyemi-temilayojesu-story.jpeg"
              alt="Opeyemi and Temilayojesu standing together in their portrait"
              className="our-story-photo"
              loading="lazy"
            />
            <figcaption>Opeyemi &amp; Temilayojesu</figcaption>
          </figure>
          <figure className="our-story-photo-card our-story-photo-card-couple">
            <img
              src="/assets/opeyemi-temilayojesu-white-portrait.jpeg"
              alt="Opeyemi and Temilayojesu sharing a joyful moment together"
              loading="lazy"
            />
            <figcaption>Together</figcaption>
          </figure>
          <figure className="our-story-photo-card our-story-photo-card-celebration">
            <img
              src="/assets/opeyemi-temilayojesu-arch.jpeg"
              alt="Opeyemi and Temilayojesu in celebratory white attire before a floral arch"
              loading="lazy"
            />
            <figcaption>Forever &amp; Always</figcaption>
          </figure>
        </div>

        <article className="our-story-copy">
          <span className="section-eyebrow">Our Story</span>
          <h2 className="section-title-script">A birthday wish became forever</h2>
          <p className="our-story-lead">One birthday. One unexpected call. Our forever.</p>

          <div className="our-story-paragraphs">
            <p>
              We met in 2021 and discovered something neither of us expected: we share the same birthday, November 21! Temilayojesu was so surprised that he asked me to send my birth certificate to prove I wasn’t joking. 😂
            </p>
            <p>
              We became friends, mostly catching up once a year to wish each other a happy birthday. Then, in 2023, he called out of the blue. He hadn’t been seeing my posts and wanted to know if I’d blocked him! What started as a funny misunderstanding became the conversation that changed everything.
            </p>
            <p>
              That call turned into more calls, our friendship grew into love, and now we’re getting married on the very date that first brought us together: November 21, 2026.
            </p>
          </div>

          <div className="our-story-date" aria-label="Wedding date: November 21, 2026">
            <span>And now, forever begins</span>
            <strong>21 · 11 · 2026</strong>
          </div>
        </article>
      </div>
    </section>
  );
}
