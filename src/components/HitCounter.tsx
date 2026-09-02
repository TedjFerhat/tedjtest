import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartCrack } from 'lucide-react';

interface HitCounterProps {
  hitCount: number;
  onShatter: () => void;
  reducedMotion?: boolean;
}

export const HitCounter: React.FC<HitCounterProps> = ({
  hitCount,
  onShatter,
  reducedMotion = false,
}) => {
  // Dialogue mapping according to prompt specifications
  const getDialogue = (hits: number): { text: string; sub?: string } => {
    if (hits === 0) return { text: "I'm ready. Hit me as much as you need." };
    if (hits === 1) return { text: "Okay..." };
    if (hits === 2) return { text: "I deserved that." };
    if (hits === 3 || hits === 4) return { text: "Aya please 😭" };
    if (hits >= 5 && hits < 8) return { text: "Okay okay, I'm sorry." };
    if (hits >= 8 && hits < 10) return { text: "My soul is leaving my plush body..." };
    if (hits >= 10 && hits < 15) return { text: "I GET IT." };
    return { text: "Can we talk now?", sub: "Or shatter me if you really need to..." };
  };

  const dialogue = getDialogue(hitCount);
  const shatterUnlocked = hitCount >= 8;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm px-4">
      {/* Speech Bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={dialogue.text}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative px-4 py-2.5 rounded-2xl bg-white border border-[#E6E0D8] shadow-xs text-center max-w-[280px]"
        >
          {/* Arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-[#E6E0D8] rotate-45" />
          
          <p className="text-sm font-medium text-[#1E1E24] leading-snug">
            "{dialogue.text}"
          </p>
          {dialogue.sub && (
            <p className="text-xs text-[#7A736E] mt-0.5 font-normal">
              {dialogue.sub}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Hit Counter Badge */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2EDE4] border border-[#E0D7CB] text-[#1E1E24]">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#7A736E]">Hits</span>
        <span className="text-xs text-[#C5BDB2]">|</span>
        <motion.span
          key={hitCount}
          initial={reducedMotion ? {} : { scale: 1.4, color: '#E07A5F' }}
          animate={{ scale: 1, color: '#1E1E24' }}
          transition={{ duration: 0.2 }}
          className="font-mono text-sm font-bold min-w-[20px] text-center"
        >
          {hitCount}
        </motion.span>
      </div>

      {/* Shatter Button (unlocked after 8 hits) */}
      <div className="w-full mt-1 flex flex-col items-center">
        {shatterUnlocked ? (
          <motion.button
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={reducedMotion ? {} : { scale: 1.03 }}
            whileTap={reducedMotion ? {} : { scale: 0.97 }}
            onClick={onShatter}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl bg-gradient-to-r from-[#E07A5F] to-[#E76F51] text-[#FAF7F2] font-semibold text-sm shadow-md shadow-[#E07A5F]/20 hover:shadow-lg transition-all cursor-pointer border border-[#D96B4F]"
          >
            <HeartCrack className="w-4 h-4" />
            <span>Shatter Tedj</span>
          </motion.button>
        ) : (
          <p className="text-[11px] text-[#8D8680] text-center font-light">
            Keep tapping if you're still mad...
          </p>
        )}
      </div>
    </div>
  );

};
