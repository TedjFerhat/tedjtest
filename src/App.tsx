import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ScreenStage, HitParticle } from './types';
import { Intro } from './components/Intro';
import { TedjDoll } from './components/TedjDoll';
import { HitCounter } from './components/HitCounter';
import { ShatterAnimation } from './components/ShatterAnimation';
import { Apology } from './components/Apology';
import { SecretInteraction } from './components/SecretInteraction';
import { FinalScreen } from './components/FinalScreen';
import { AudioController } from './components/AudioController';
import { soundFx } from './utils/audio';
import { triggerHaptic } from './utils/haptics';

export function App() {
  const [stage, setStage] = useState<ScreenStage>('intro');
  const [hitCount, setHitCount] = useState<number>(0);
  const [isHit, setIsHit] = useState<boolean>(false);
  const [particles, setParticles] = useState<HitParticle[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Check system preferences for reduced motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setReducedMotion(true);
      }
    }
  }, []);

  const handleHit = (_e?: React.MouseEvent | React.TouchEvent) => {
    const nextCount = hitCount + 1;

    setHitCount(nextCount);
    setIsHit(true);

    // Audio & Haptic feedback
    soundFx.playHit(nextCount);
    triggerHaptic(nextCount % 4 === 0 ? 'medium' : 'light');

    // Generate floating comic hit particles
    const popPhrases = ['OOF!', 'POW!', 'BONK!', 'SORRY!', 'OUCH!', 'AAAH!', 'MY BAD!'];
    const phrase = popPhrases[Math.floor(Math.random() * popPhrases.length)];
    const colors = ['#E07A5F', '#E76F51', '#F4A261', '#3D4A59', '#DDA15E'];

    const newParticle: HitParticle = {
      id: Date.now() + Math.random(),
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 40,
      text: phrase,
      vx: (Math.random() - 0.5) * 2,
      vy: -1.5 - Math.random() * 1.5,
      rotation: (Math.random() - 0.5) * 25,
      scale: 0.9 + Math.random() * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    setParticles((prev) => [...prev.slice(-8), newParticle]);

    setTimeout(() => {
      setIsHit(false);
    }, 180);
  };

  const handleStartShatter = () => {
    setStage('shattering');
  };

  const handleShatterComplete = () => {
    setStage('apology');
  };

  const handleRestart = () => {
    setHitCount(0);
    setParticles([]);
    setStage('intro');
    soundFx.playWhoosh();
  };

  const handleFreeplay = () => {
    setHitCount(0);
    setParticles([]);
    setStage('doll');
    soundFx.playWhoosh();
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#FAF7F2] text-[#1E1E24] overflow-x-hidden flex flex-col justify-between selection:bg-[#E07A5F]/20">
      {/* Floating Audio & Motion Navigation */}
      <AudioController
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        currentStage={stage}
        onRestart={handleRestart}
      />

      {/* Main Interactive Stage Container */}
      <main className="flex-1 flex flex-col items-center justify-center pt-[max(4rem,calc(env(safe-area-inset-top)+3rem))] pb-[max(1rem,env(safe-area-inset-bottom))] px-3 sm:px-6 w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {/* 1. INTRO SCREEN */}
          {stage === 'intro' && (
            <motion.div
              key="intro"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <Intro
                onStart={() => setStage('doll')}
                reducedMotion={reducedMotion}
              />
            </motion.div>
          )}

          {/* 2. TEDJ DOLL ARENA */}
          {stage === 'doll' && (
            <motion.div
              key="doll-arena"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center justify-center"
            >
              {/* Context Header */}
              <div className="text-center mb-3 sm:mb-5 max-w-md px-2">
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#1E1E24]">
                  Here&rsquo;s the problem.
                </h2>
                <p className="text-xs sm:text-sm text-[#5A5551] mt-1 font-light">
                  You can take your anger out on him.
                </p>
              </div>


              {/* Central Doll */}
              <div className="my-1 sm:my-2">
                <TedjDoll
                  expression="calm"
                  isHit={isHit}
                  hitCount={hitCount}
                  onHit={handleHit}
                  reducedMotion={reducedMotion}
                  particles={particles}
                />
              </div>

              {/* Primary HIT TEDJ Button */}
              <motion.button
                whileHover={reducedMotion ? {} : { scale: 1.04 }}
                whileTap={reducedMotion ? {} : { scale: 0.94 }}
                onClick={() => handleHit()}
                className="mt-2 mb-3 px-8 sm:px-9 py-3 sm:py-3.5 rounded-full bg-[#1E1E24] text-[#FAF7F2] font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-md hover:bg-[#2D2D35] active:bg-[#0E0E12] transition-all cursor-pointer min-h-[44px] flex items-center justify-center"
              >
                HIT TEDJ
              </motion.button>

              {/* Hit Counter & Shatter Unlock */}
              <HitCounter
                hitCount={hitCount}
                onShatter={handleStartShatter}
                reducedMotion={reducedMotion}
              />
            </motion.div>
          )}


          {/* 3. SHATTER ANIMATION & AFTERMATH */}
          {stage === 'shattering' && (
            <motion.div
              key="shattering"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <ShatterAnimation
                onComplete={handleShatterComplete}
                reducedMotion={reducedMotion}
              />
            </motion.div>
          )}

          {/* 4. SINCERE APOLOGY EXPERIENCE */}
          {stage === 'apology' && (
            <motion.div
              key="apology"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Apology
                onMaybe={() => setStage('secret')}
                reducedMotion={reducedMotion}
              />
            </motion.div>
          )}

          {/* 5. SECRET INTERACTION */}
          {stage === 'secret' && (
            <motion.div
              key="secret"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <SecretInteraction
                onOpenFinal={() => setStage('final')}
                reducedMotion={reducedMotion}
              />
            </motion.div>
          )}

          {/* 6. FINAL SCREEN */}
          {stage === 'final' && (
            <motion.div
              key="final"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <FinalScreen
                onRestart={handleRestart}
                onFreeplay={handleFreeplay}
                reducedMotion={reducedMotion}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Subtle Footer */}
      <footer className="py-4 text-center text-xs text-[#A8A199] font-light">
        Handcrafted for Aya
      </footer>
    </div>
  );
}

export default App;
