import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface IntroProps {
  onStart: () => void;
  reducedMotion?: boolean;
}

export const Intro: React.FC<IntroProps> = ({ onStart, reducedMotion = false }) => {
  const handleClick = () => {
    soundFx.playWhoosh();
    onStart();
  };

  return (
    <div className="relative min-h-[75dvh] sm:min-h-[85vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-6 sm:py-12 max-w-xl mx-auto">
      {/* Background warm aura */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-[#F4A261]/10 blur-3xl" />
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-[#E07A5F]/10 blur-2xl -translate-y-8" />
      </div>

      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center"
      >
        {/* Editorial Subtitle Badge */}
        <div className="mb-4 sm:mb-6">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-medium text-[#7A736E] bg-[#F2EDE4]/90 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-[#E3DCCF]">
            A tiny interactive note
          </span>
        </div>

        {/* Large Name Typography */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-[#1E1E24] tracking-tight mb-2 sm:mb-4">
          Aya...
        </h1>

        {/* Small sincere text */}
        <p className="text-sm sm:text-base md:text-lg text-[#5A5551] font-light leading-relaxed max-w-xs sm:max-w-sm mb-7 sm:mb-10">
          I think I owe you an apology.
        </p>

        {/* Primary Call to Action */}
        <motion.button
          whileHover={reducedMotion ? {} : { scale: 1.03, y: -2 }}
          whileTap={reducedMotion ? {} : { scale: 0.97 }}
          onClick={handleClick}
          className="btn-primary group flex items-center gap-3 py-3 px-7 sm:py-3.5 sm:px-8 rounded-full text-sm sm:text-base font-medium cursor-pointer shadow-md min-h-[46px]"
        >
          <span>Come here.</span>
          <ArrowDown className="w-4 h-4 text-[#E8E2D9] transition-transform duration-300 group-hover:translate-y-1" />
        </motion.button>
      </motion.div>


      {/* Gentle Floating Footnote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 text-xs text-[#8D8680] font-light tracking-wide"
      >
        Turn sound on for the full experience
      </motion.div>
    </div>
  );
};
