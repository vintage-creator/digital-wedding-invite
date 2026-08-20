import React, { useEffect, useRef } from 'react';

export default function PetalsCanvas({ active = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let flourishTimer;
    let restTimer;
    let isFlourishing = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Petal & Sparkle particles
    const particleCount = window.innerWidth < 768 ? 8 : 14;
    const particles = [];

    const colors = [
      'rgba(122, 28, 62, 0.45)',  // Burgundy
      'rgba(91, 14, 45, 0.4)',    // Dark Burgundy
      'rgba(139, 158, 123, 0.38)', // Sage Green
      'rgba(197, 160, 89, 0.5)',  // Gold Sparkle
      'rgba(244, 236, 225, 0.6)'  // Champagne / Nude
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 8 + 4,
        speedY: Math.random() * 0.8 + 0.3,
        speedX: Math.sin(Math.random() * Math.PI) * 0.4,
        angle: Math.random() * 360,
        spin: (Math.random() - 0.5) * 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        isSparkle: Math.random() > 0.7
      });
    }

    const render = () => {
      if (!isFlourishing) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.01) * 0.5 + p.speedX;
        p.angle += p.spin;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);

        if (p.isSparkle) {
          // Draw small star/sparkle
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Draw petal shape
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(p.size, -p.size, p.size * 1.5, p.size, 0, p.size * 1.5);
          ctx.bezierCurveTo(-p.size * 1.5, p.size, -p.size, -p.size, 0, 0);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const startFlourish = () => {
      isFlourishing = true;
      particles.forEach((particle) => {
        particle.y = -20 - Math.random() * canvas.height * 0.35;
        particle.x = Math.random() * canvas.width;
      });
      render();

      flourishTimer = window.setTimeout(() => {
        isFlourishing = false;
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        restTimer = window.setTimeout(startFlourish, 28000);
      }, 5500);
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (active && !prefersReducedMotion) {
      restTimer = window.setTimeout(startFlourish, 2200);
    }

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      window.clearTimeout(flourishTimer);
      window.clearTimeout(restTimer);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
}
