import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface ShatterAnimationProps {
  onComplete: () => void;
  reducedMotion?: boolean;
}

interface Shard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  size: number;
  points: [number, number][];
  color: string;
  opacity: number;
}

export const ShatterAnimation: React.FC<ShatterAnimationProps> = ({
  onComplete,
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<'shattering' | 'settled'>('shattering');

  useEffect(() => {
    soundFx.playShatter();
    triggerHaptic('shatter');

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const centerX = width / 2;
    const centerY = height / 2 - 40;

    const colors = [
      '#FFE3D1', '#F7D0BA', '#3A3335', '#252122', 
      '#3D4A59', '#2A333D', '#E07A5F', '#F4A261', '#E8E2D9'
    ];

    // Generate 42 shattered polygonal shards
    const shards: Shard[] = [];
    const shardCount = reducedMotion ? 12 : 45;

    for (let i = 0; i < shardCount; i++) {
      const angle = (Math.PI * 2 * i) / shardCount + (Math.random() - 0.5) * 0.4;
      const speed = 4 + Math.random() * 9;
      const size = 16 + Math.random() * 26;

      // Create irregular triangle/quad polygon points
      const points: [number, number][] = [
        [-size * 0.5 + (Math.random() - 0.5) * 8, -size * 0.5 + (Math.random() - 0.5) * 8],
        [size * 0.6 + (Math.random() - 0.5) * 8, -size * 0.2 + (Math.random() - 0.5) * 8],
        [size * 0.4 + (Math.random() - 0.5) * 8, size * 0.6 + (Math.random() - 0.5) * 8],
        [-size * 0.4 + (Math.random() - 0.5) * 8, size * 0.4 + (Math.random() - 0.5) * 8],
      ];

      shards.push({
        x: centerX + (Math.random() - 0.5) * 40,
        y: centerY + (Math.random() - 0.5) * 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3.5, // slight upward burst
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.25,
        size,
        points,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
      });
    }

    let animationFrameId: number;
    let startTime = performance.now();

    const render = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      let allSettled = true;

      shards.forEach((shard) => {
        // Physics update
        shard.x += shard.vx;
        shard.y += shard.vy;
        shard.vy += 0.22; // gravity
        shard.vx *= 0.985; // air friction
        shard.rotation += shard.vRot;

        if (elapsed > 1.2) {
          shard.opacity = Math.max(0, shard.opacity - 0.02);
        }

        if (shard.opacity > 0) {
          allSettled = false;
          ctx.save();
          ctx.translate(shard.x, shard.y);
          ctx.rotate(shard.rotation);
          ctx.globalAlpha = shard.opacity;
          ctx.fillStyle = shard.color;
          ctx.strokeStyle = '#1E1E24';
          ctx.lineWidth = 1;

          ctx.beginPath();
          shard.points.forEach(([px, py], pIdx) => {
            if (pIdx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.restore();
        }
      });

      if (!allSettled && elapsed < 3) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        setPhase('settled');
      }
    };

    animationFrameId = requestAnimationFrame(render);

    const timer = setTimeout(() => {
      setPhase('settled');
    }, 2200);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
    };
  }, [reducedMotion]);

  return (
    <div className="relative w-full min-h-[75vh] flex flex-col items-center justify-center text-center px-6">
      {/* Fullscreen Canvas for Shard Explosion */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-20 w-full h-full"
      />

      {/* Settled Calm Transition Screen */}
      {phase === 'settled' && (
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30 max-w-md w-full flex flex-col items-center gap-6"
        >
          {/* Subtle icon */}
          <div className="w-12 h-12 rounded-full bg-[#F3EFEA] border border-[#E6E0D8] flex items-center justify-center text-[#E07A5F] shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>

          <div className="space-y-3">
            <p className="text-xl md:text-2xl font-serif text-[#1E1E24] leading-relaxed">
              &ldquo;...okay, I think you&rsquo;ve made your point.&rdquo;
            </p>
            <p className="text-sm md:text-base text-[#7A736E] font-normal">
              Now let me actually apologize.
            </p>
          </div>

          <motion.button
            whileHover={reducedMotion ? {} : { scale: 1.02 }}
            whileTap={reducedMotion ? {} : { scale: 0.98 }}
            onClick={() => {
              soundFx.playWhoosh();
              onComplete();
            }}
            className="mt-4 flex items-center gap-3 py-3.5 px-8 rounded-full bg-[#1E1E24] text-[#FAF7F2] font-medium text-sm shadow-md hover:bg-[#2D2D35] transition-all cursor-pointer group"
          >
            <span>Read my apology</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
