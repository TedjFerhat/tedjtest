import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkle } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface ApologyProps {
  onMaybe: () => void;
  reducedMotion?: boolean;
}

export const Apology: React.FC<ApologyProps> = ({ onMaybe, reducedMotion = false }) => {
  const [revealedLines, setRevealedLines] = useState<number>(0);

  const apologyLines = [
    "I know I made you mad, and I know saying \"sorry\" doesn't magically fix it.",
    "I just wanted to make something that could at least make you smile for a second.",
    "So yes...",
    "You were given permission to beat up a tiny version of me.",
    "But behind the stupid little doll is a very real apology.",
    "I'm sorry for upsetting you.",
    "I care about you, and I really don't like being the reason you're mad at me."
  ];

  useEffect(() => {
    soundFx.playChime();

    // Line-by-line staggered reveal
    const interval = setInterval(() => {
      setRevealedLines((prev) => {
        if (prev < apologyLines.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, reducedMotion ? 200 : 750);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  const allRevealed = revealedLines >= apologyLines.length;

  return (
    <div className="relative min-h-[75dvh] sm:min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-16 max-w-xl mx-auto text-left">
      {/* Editorial Header */}
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full mb-6 sm:mb-10 text-center"
      >
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#E07A5F] font-semibold mb-2 sm:mb-3 inline-block">
          Sincere Apology
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1E1E24] tracking-tight">
          I&rsquo;m sorry, Aya.
        </h2>
      </motion.div>

      {/* Apology Body - Line by line card with refined typography */}
      <div className="w-full space-y-3.5 sm:space-y-5 mb-8 sm:mb-12">
        {apologyLines.map((line, index) => {
          const isRevealed = index < revealedLines;
          const isSpecial = index === 2; // "So yes..."
          const isHighlight = index === 5 || index === 6; // "I'm sorry for upsetting you."

          return (
            <AnimatePresence key={index}>
              {isRevealed && (
                <motion.div
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`leading-relaxed ${
                    isSpecial
                      ? 'font-serif italic text-base sm:text-lg text-[#7A736E] pt-1 sm:pt-2'
                      : isHighlight
                        ? 'text-sm sm:text-base md:text-lg font-medium text-[#1E1E24]'
                        : 'text-xs sm:text-sm md:text-base text-[#4A4541] font-light'
                  }`}
                >
                  <p>{line}</p>
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      {/* Conclusion & Interactive Response Button */}
      <AnimatePresence>
        {allRevealed && (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full flex flex-col items-center text-center pt-4 border-t border-[#EAE3D8]"
          >
            <p className="font-serif text-lg sm:text-xl text-[#1E1E24] mb-4 sm:mb-6 italic">
              &ldquo;I hope you&rsquo;ll forgive me.&rdquo;
            </p>

            <motion.button
              whileHover={reducedMotion ? {} : { scale: 1.04, y: -2 }}
              whileTap={reducedMotion ? {} : { scale: 0.96 }}
              onClick={() => {
                soundFx.playPop();
                onMaybe();
              }}
              className="px-7 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#FAF7F2] text-[#1E1E24] font-medium text-sm border-2 border-[#1E1E24] hover:bg-[#1E1E24] hover:text-[#FAF7F2] active:bg-[#1E1E24] active:text-[#FAF7F2] transition-all shadow-xs flex items-center gap-2 cursor-pointer group min-h-[46px]"
            >
              <span>Maybe...</span>
              <Sparkle className="w-3.5 h-3.5 text-[#E07A5F] group-hover:text-[#FAF7F2] transition-colors" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

};
