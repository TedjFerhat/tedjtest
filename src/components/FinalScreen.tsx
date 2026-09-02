import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RefreshCw, Sparkles } from 'lucide-react';
import { TedjDoll } from './TedjDoll';
import { soundFx } from '../utils/audio';

interface FinalScreenProps {
  onRestart: () => void;
  onFreeplay: () => void;
  reducedMotion?: boolean;
}

export const FinalScreen: React.FC<FinalScreenProps> = ({
  onRestart,
  onFreeplay,
  reducedMotion = false,
}) => {
  const [showForNow, setShowForNow] = useState(false);
  const [showSignature, setShowSignature] = useState(false);

  useEffect(() => {
    soundFx.playChime();

    const t1 = setTimeout(() => {
      setShowForNow(true);
    }, 1400);

    const t2 = setTimeout(() => {
      setShowSignature(true);
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="relative min-h-[75dvh] sm:min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 py-4 sm:py-12 max-w-xl mx-auto text-center">
      {/* Subtle celebratory ambient particles */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#E07A5F]/8 blur-3xl" />
        <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-[#F4A261]/10 blur-2xl translate-y-12" />
      </div>

      {/* Main Thank You Message */}
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-2 sm:mb-4"
      >
        <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-normal text-[#1E1E24] tracking-tight leading-tight">
          Thank you for making it this far.
        </h2>
      </motion.div>

      {/* Playful Ceasefire Subtext with Pause */}
      <div className="min-h-[48px] sm:min-h-[56px] flex flex-col items-center justify-center mb-3 sm:mb-6">
        <motion.p
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-sm sm:text-base text-[#5A5551] font-light"
        >
          No more hitting the doll.
        </motion.p>

        <AnimatePresence>
          {showForNow && (
            <motion.p
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#E07A5F] mt-1 font-semibold"
            >
              ...for now.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Waving Tedj Character */}
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="my-1 sm:my-3"
      >
        <TedjDoll
          expression="calm"
          isHit={false}
          hitCount={0}
          onHit={() => {
            soundFx.playPop();
          }}
          reducedMotion={reducedMotion}
          isWaving={true}
        />
      </motion.div>

      {/* Sincere Final Message & Handcrafted Signature */}
      <AnimatePresence>
        {showSignature && (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full mt-2 sm:mt-4 flex flex-col items-center"
          >
            <p className="font-serif text-lg sm:text-2xl text-[#1E1E24] mb-2 italic">
              &ldquo;I&rsquo;m really sorry, Aya.&rdquo;
            </p>

            <div className="flex items-center gap-2 text-[#7A736E] font-medium tracking-wide text-sm sm:text-base">
              <span>— Tedj</span>
              <Heart className="w-3.5 h-3.5 text-[#E07A5F] fill-[#E07A5F]" />
            </div>

            {/* Replay & Freeplay actions */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onRestart}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#1E1E24] text-[#FAF7F2] hover:bg-[#2D2D35] active:bg-[#0E0E12] transition-all text-xs font-medium cursor-pointer shadow-xs min-h-[44px]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replay from Beginning</span>
              </button>
              <button
                onClick={onFreeplay}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-transparent text-[#5A5551] border border-[#E6E0D8] hover:bg-[#F3EFEA] hover:text-[#1E1E24] active:scale-95 transition-all text-xs font-medium cursor-pointer min-h-[44px]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Free Play Mode</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );

};
