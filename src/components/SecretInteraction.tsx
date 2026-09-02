import React from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { TedjDoll } from './TedjDoll';
import { soundFx } from '../utils/audio';

interface SecretInteractionProps {
  onOpenFinal: () => void;
  reducedMotion?: boolean;
}

export const SecretInteraction: React.FC<SecretInteractionProps> = ({
  onOpenFinal,
  reducedMotion = false,
}) => {
  return (
    <div className="relative min-h-[75dvh] sm:min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 py-4 sm:py-12 max-w-lg mx-auto text-center">
      {/* Subtle Progress Message */}
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4 sm:mb-8"
      >
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#7A736E] font-medium block mb-1.5">
          Status update
        </span>
        <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-normal text-[#1E1E24]">
          &ldquo;I&rsquo;ll take that as progress.&rdquo;
        </h3>
      </motion.div>

      {/* Tiny Animated Tedj Doll holding sign popping up */}
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { y: 60, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 0.9 }}
        transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 120, damping: 14 }}
        className="my-1 sm:my-2"
      >
        <TedjDoll
          expression="holding-sign"
          isHit={false}
          hitCount={0}
          onHit={() => {
            soundFx.playPop();
          }}
          reducedMotion={reducedMotion}
          showSign={true}
          signText="I'll behave. Probably."
        />
      </motion.div>

      {/* One last thing & Button */}
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.1 }}
        className="mt-4 sm:mt-6 flex flex-col items-center gap-3 sm:gap-4"
      >
        <p className="text-xs sm:text-sm font-medium text-[#7A736E]">
          One last thing...
        </p>

        <motion.button
          whileHover={reducedMotion ? {} : { scale: 1.04, y: -2 }}
          whileTap={reducedMotion ? {} : { scale: 0.96 }}
          onClick={() => {
            soundFx.playChime();
            onOpenFinal();
          }}
          className="btn-primary flex items-center gap-2.5 py-3 sm:py-3.5 px-7 sm:px-8 rounded-full text-xs sm:text-sm font-medium cursor-pointer shadow-md min-h-[46px]"
        >
          <Gift className="w-4 h-4 text-[#F4A261]" />
          <span>Open it</span>
        </motion.button>
      </motion.div>
    </div>
  );

};
