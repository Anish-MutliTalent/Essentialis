import { useEffect, useRef } from 'react';
import { lenisScrollY } from '../hooks/useLenis';

const COLORS = [
  '#ffffff',
  '#e8f0ff',
  '#c8d8ff',
  '#b0c4ff',
  '#d8c8ff',
  '#f0e8ff',
  '#c0e8ff',
];

interface Star {
  x: number;
  baseY: number;
  radius: number;
  opacity: number;
  color: string;
  // 0 = back (barely moves), 1 = front (moves most)
  layer: number;
}

// Dots per million pixels at the reference resolution
const DOTS_PER_MPIX = 260;

const TIERS = [
  { weight: 0.50, layerMin: 0.00, layerMax: 0.15, radiusMin: 0.2, radiusMax: 0.7,  opacityMin: 0.10, opacityMax: 0.40 },
  { weight: 0.35, layerMin: 0.35, layerMax: 0.60, radiusMin: 0.5, radiusMax: 1.1,  opacityMin: 0.30, opacityMax: 0.60 },
  { weight: 0.15, layerMin: 0.75, layerMax: 1.00, radiusMin: 0.7, radiusMax: 1.5,  opacityMin: 0.50, opacityMax: 0.80 },
];

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let animId: number;

    // How many pixels each layer shifts per 1px of scroll — large difference = visible depth
    const LAYER_SCROLL_SPEED = [0.05, 0.25, 0.65];

    let idleOffset = 0;

    function buildStars() {
      const totalDots = Math.round((W * H / 1_000_000) * DOTS_PER_MPIX);
      return TIERS.flatMap((t, i) =>
        Array.from({ length: Math.round(totalDots * t.weight) }, () => ({
          x: Math.random() * W,
          baseY: Math.random() * H,
          radius: t.radiusMin + Math.random() * (t.radiusMax - t.radiusMin),
          opacity: t.opacityMin + Math.random() * (t.opacityMax - t.opacityMin),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          layer: i,
        }))
      );
    }

    let stars: Star[] = buildStars();

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      stars = buildStars();
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      idleOffset += 0.5;

      const scrollY = lenisScrollY;

      ctx.clearRect(0, 0, W, H);

      for (const s of stars) {
        const parallax = scrollY * LAYER_SCROLL_SPEED[s.layer];
        const idle = idleOffset * (0.08 + s.layer * 0.05);
        const y = ((s.baseY - parallax - idle) % H + H) % H;

        ctx.globalAlpha = s.opacity;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
