import React, { useEffect, useState } from 'react';

export default function EnvelopeCover({ onOpen }) {
  const [isOpening, setIsOpening] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return undefined;

    const html = document.documentElement;
    const body = document.body;
    const previous = {
      htmlOverflow: html.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyOverscroll: body.style.overscrollBehavior
    };

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = '0';
    body.style.width = '100%';
    body.style.overscrollBehavior = 'none';
    body.classList.add('envelope-locked');

    return () => {
      html.style.overflow = previous.htmlOverflow;
      html.style.overscrollBehavior = previous.htmlOverscroll;
      body.style.overflow = previous.bodyOverflow;
      body.style.position = previous.bodyPosition;
      body.style.top = previous.bodyTop;
      body.style.width = previous.bodyWidth;
      body.style.overscrollBehavior = previous.bodyOverscroll;
      body.classList.remove('envelope-locked');
    };
  }, [isDismissed]);

  const handleSealClick = () => {
    if (isOpening) return;
    setIsOpening(true);

    if (window.location.hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }

    // Guarantee window is scrolled to top when seal is tapped
    try {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    } catch (e) {}

    // Transition timing: 3D rotate seal, unfold flap, slide card, reveal site
    setTimeout(() => {
      setIsDismissed(true);
      if (onOpen) onOpen();

      // Reset again after React removes the fixed cover and the page reflows.
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const previousBehavior = document.documentElement.style.scrollBehavior;
          document.documentElement.style.scrollBehavior = 'auto';
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
          document.documentElement.style.scrollBehavior = previousBehavior;
        });
      });
    }, 1250);
  };

  if (isDismissed) return null;

  return (
    <div
      id="cover"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 10000,
        background: '#8f8d5f', // Sage / Olive Green Ambient Background matching reference sample
        transition: 'opacity 1s ease',
        opacity: isOpening ? 0 : 1,
        pointerEvents: isOpening ? 'none' : 'all',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overscrollBehavior: 'none',
        touchAction: 'none'
      }}
    >
      <div className={`invitation-arrival-copy ${isOpening ? 'invitation-arrival-copy-opening' : ''}`}>
        <span>Your invitation has arrived</span>
        <strong>Deborah &amp; Tom invite you</strong>
        <small>Tap the wax seal to open</small>
      </div>

      {/* Full-Screen Real Stage Container matching exact reference ratio */}
      <div
        className={`env-art env-art-3d ${isOpening ? 'env-art-opening' : ''}`}
        style={{
          position: 'relative',
          width: 'min(100vw, 1280px)',
          height: 'min(100vh, 720px)',
          aspectRatio: '16 / 9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 1.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isOpening
            ? 'perspective(1400px) translateY(-3%) rotateX(-7deg) scale(1.08)'
            : undefined
        }}
      >
        {/* Reference Sage Green Paper Envelope Image */}
        <img
          src="/assets/sage_envelope.jpg"
          alt="Deborah & Tom Wedding Envelope"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '16px',
            boxShadow: '0 35px 90px rgba(0,0,0,0.6)',
            display: 'block'
          }}
        />

        {/* Ambient Glowing Light Disc behind Seal */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '72%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(150px, 24vw, 280px)',
            height: 'clamp(150px, 24vw, 280px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 242, 178, 0.75) 0%, rgba(197, 160, 89, 0.3) 50%, transparent 75%)',
            zIndex: 9,
            pointerEvents: 'none',
            animation: isOpening ? 'fadeOut 0.5s forwards' : 'glowingAuraPulse 2.8s ease-in-out infinite'
          }}
        />

        {/* 3D Rotating Burgundy Wax Seal Button with D & T Monogram */}
        <button
          id="sealBtn"
          onClick={handleSealClick}
          style={{
            position: 'absolute',
            left: '50%',
            top: '72%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(115px, 18.5vw, 220px)',
            aspectRatio: '1 / 1',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            zIndex: 10,
            filter: 'drop-shadow(0 0 25px rgba(255, 242, 178, 0.9)) drop-shadow(0 14px 28px rgba(35, 10, 20, 0.65))',
            animation: isOpening
              ? 'sealRotateOpen 1.1s cubic-bezier(0.5, -0.3, 0.4, 1) forwards'
              : 'glowingSealPulse 2.8s ease-in-out infinite',
            transition: 'opacity 0.55s ease, transform 0.3s ease'
          }}
          title="Tap Seal to Open Invitation"
          aria-label="Open Invitation"
        >
          <img
            src="/assets/dt-script-wax-seal.png"
            alt="D and T burgundy wax seal"
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        </button>
      </div>

      <style>{`
        .env-art-3d {
          transform-style: preserve-3d;
          transform: perspective(1400px) rotateX(2deg) rotateY(-1deg) translateY(8px) scale(1);
          animation: envelopeArrives 2.2s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both,
                     envelopeBreathe 6.5s ease-in-out 2.45s infinite;
          filter: drop-shadow(0 42px 45px rgba(25, 26, 12, 0.35));
        }

        .env-art-opening {
          animation: none;
        }

        .invitation-arrival-copy {
          position: absolute;
          z-index: 100;
          top: clamp(24px, 7vh, 74px);
          left: 50%;
          width: min(88vw, 620px);
          transform: translate(-50%, -18px);
          text-align: center;
          color: #3b081b;
          pointer-events: none;
          opacity: 0;
          animation: arrivalCopyIn 0.9s ease 0.65s forwards;
          text-shadow: 0 1px 18px rgba(250, 246, 240, 0.8);
        }

        .invitation-arrival-copy span,
        .invitation-arrival-copy small {
          display: block;
          font-family: var(--font-sans);
          text-transform: uppercase;
          letter-spacing: 0.24em;
        }

        .invitation-arrival-copy span {
          font-size: clamp(0.66rem, 1.5vw, 0.82rem);
          font-weight: 600;
          color: #6b5b38;
        }

        .invitation-arrival-copy strong {
          display: block;
          margin: 0.2rem 0 0.25rem;
          font: 400 clamp(2rem, 5vw, 3.3rem) var(--font-script);
          line-height: 1.1;
          color: #5b0e2d;
        }

        .invitation-arrival-copy small {
          font-size: clamp(0.56rem, 1.2vw, 0.68rem);
          color: #4a583f;
        }

        .invitation-arrival-copy-opening {
          animation: arrivalCopyOut 0.45s ease forwards;
        }

        @keyframes envelopeArrives {
          0% {
            opacity: 0;
            transform: perspective(1400px) translateY(42vh) rotateX(18deg) rotateZ(-2deg) scale(0.78);
          }
          72% {
            opacity: 1;
            transform: perspective(1400px) translateY(-7px) rotateX(-1.5deg) rotateZ(0.35deg) scale(1.025);
          }
          100% {
            opacity: 1;
            transform: perspective(1400px) translateY(8px) rotateX(2deg) rotateY(-1deg) scale(1);
          }
        }

        @keyframes envelopeBreathe {
          0%, 100% { transform: perspective(1400px) translateY(8px) rotateX(2deg) rotateY(-1deg) scale(1); }
          50% { transform: perspective(1400px) translateY(2px) rotateX(1deg) rotateY(1deg) scale(1.005); }
        }

        @keyframes arrivalCopyIn {
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        @keyframes arrivalCopyOut {
          to { opacity: 0; transform: translate(-50%, -14px); }
        }

        @keyframes glowingAuraPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.14);
            opacity: 0.95;
          }
        }
        @keyframes glowingSealPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            filter: drop-shadow(0 0 22px rgba(255, 242, 178, 0.85)) drop-shadow(0 14px 28px rgba(35, 10, 20, 0.65));
          }
          50% {
            transform: translate(-50%, -50%) scale(1.045);
            filter: drop-shadow(0 0 35px rgba(255, 255, 255, 0.95)) drop-shadow(0 18px 34px rgba(35, 10, 20, 0.75));
          }
        }
        @keyframes sealRotateOpen {
          0% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
          }
          25% {
            transform: translate(-50%, -50%) scale(0.9) rotate(-15deg);
          }
          65% {
            transform: translate(-50%, -50%) scale(1.35) rotate(240deg);
            opacity: 0.85;
          }
          100% {
            transform: translate(-50%, -55%) scale(1.75) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes fadeOut {
          to { opacity: 0; }
        }

        @media (max-width: 700px) {
          .invitation-arrival-copy {
            top: max(18px, 3.5svh);
            width: 92vw;
          }
          .invitation-arrival-copy strong { font-size: clamp(1.8rem, 10vw, 2.75rem); }
          .env-art-3d {
            width: 122vw !important;
            height: min(68svh, 580px) !important;
            max-height: 580px;
          }
          #sealBtn {
            width: clamp(104px, 31vw, 150px) !important;
          }
        }

        @media (min-width: 701px) and (max-width: 1024px) {
          .env-art-3d {
            width: 108vw !important;
            height: min(72svh, 700px) !important;
          }
          .invitation-arrival-copy { top: 5svh; }
        }

        @media (max-height: 520px) and (orientation: landscape) {
          .invitation-arrival-copy {
            top: 10px;
            transform: translate(-50%, 0);
          }
          .invitation-arrival-copy span,
          .invitation-arrival-copy small { display: none; }
          .invitation-arrival-copy strong { font-size: 1.8rem; }
          .env-art-3d {
            width: min(88vw, 920px) !important;
            height: 90svh !important;
          }
          #sealBtn { width: clamp(82px, 15vw, 126px) !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .env-art-3d,
          .invitation-arrival-copy {
            animation: none;
            opacity: 1;
            transform: translate(-50%, 0);
          }

          .env-art-3d {
            transform: perspective(1400px) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
