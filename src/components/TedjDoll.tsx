import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DollExpression, HitParticle } from '../types';


interface TedjDollProps {
  expression: DollExpression;
  isHit: boolean;
  hitCount: number;
  onHit: (e: React.MouseEvent | React.TouchEvent) => void;
  reducedMotion?: boolean;
  particles?: HitParticle[];
  scale?: number;
  showSign?: boolean;
  signText?: string;
  isWaving?: boolean;
}

export const TedjDoll: React.FC<TedjDollProps> = ({
  expression,
  isHit,
  hitCount,
  onHit,
  reducedMotion = false,
  particles = [],
  scale = 1,
  showSign = false,
  signText = "I'll behave. Probably.",
  isWaving = false,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Determine dynamic expression based on hit count if not overridden
  const activeExpression: DollExpression = expression !== 'calm' 
    ? expression 
    : hitCount === 0 
      ? 'calm'
      : hitCount < 3
        ? 'nervous'
        : hitCount < 7
          ? 'oof'
          : hitCount < 12
            ? 'crying'
            : 'dizzy';

  return (
    <div 
      className="relative flex items-center justify-center select-none cursor-pointer group touch-manipulation"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onHit}
      onTouchStart={(e) => {
        // Prevent zoom/context delays on mobile touches
        onHit(e);
      }}
      role="button"
      tabIndex={0}
      aria-label="Interactive Tedj Doll - click or tap to interact"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onHit(e as unknown as React.MouseEvent);
        }
      }}
      style={{ touchAction: 'manipulation' }}
    >

      {/* Hit Particles and Floating Comic Effects */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
            animate={{ 
              opacity: 0, 
              scale: p.scale * 1.3, 
              x: p.vx * 35, 
              y: p.vy * 45 - 20,
              rotate: p.rotation
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute pointer-events-none z-30 font-bold text-xs md:text-sm tracking-wider px-2 py-1 rounded-full shadow-sm"
            style={{
              backgroundColor: p.color,
              color: '#FAF7F2',
              left: `calc(50% + ${p.x}px)`,
              top: `calc(40% + ${p.y}px)`,
            }}
          >
            {p.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Comic Impact Stars when Hit */}
      <AnimatePresence>
        {isHit && !reducedMotion && (
          <motion.div
            initial={{ scale: 0, opacity: 1, rotate: -20 }}
            animate={{ scale: [0, 1.4, 1.2], opacity: [1, 1, 0], rotate: 15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute z-20 pointer-events-none -top-4 -right-4"
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path
                d="M24 0L29.5 16.5L47 18L33.5 28.5L37.5 46L24 36L10.5 46L14.5 28.5L1 18L18.5 16.5L24 0Z"
                fill="#E07A5F"
                fillOpacity="0.85"
              />
              <circle cx="24" cy="24" r="5" fill="#FAF7F2" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chibi Doll Body Container with Physics */}
      <motion.div
        animate={
          reducedMotion
            ? {}
            : isHit
              ? {
                  scaleX: [1, 1.28, 0.85, 1.08, 1],
                  scaleY: [1, 0.72, 1.18, 0.94, 1],
                  rotate: [0, -12, 10, -4, 0],
                  y: [0, 14, -10, 4, 0],
                }
              : {
                  y: [0, -6, 0],
                  rotate: [0, 0.8, -0.8, 0],
                }
        }
        transition={
          isHit
            ? { duration: 0.45, ease: "easeOut" }
            : { repeat: Infinity, duration: 4.2, ease: "easeInOut" }
        }
        style={{ scale }}
        className="relative flex flex-col items-center justify-center p-4 transition-transform duration-150 group-active:scale-95"
      >
        {/* Shadow */}
        <motion.div
          animate={
            reducedMotion
              ? {}
              : isHit
                ? { scale: [1, 1.4, 0.9, 1], opacity: [0.35, 0.55, 0.25, 0.35] }
                : { scale: [1, 0.92, 1], opacity: [0.35, 0.25, 0.35] }
          }
          transition={{ repeat: isHit ? 0 : Infinity, duration: 4.2, ease: "easeInOut" }}
          className="absolute -bottom-2 w-36 h-6 bg-[#2B2B36]/15 rounded-full blur-sm -z-10"
        />

        {/* Illustrated SVG Doll */}
        <svg
          viewBox="0 0 210 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[170px] h-[195px] sm:w-[210px] sm:h-[240px] filter drop-shadow-md overflow-visible max-w-full"
        >

          <defs>
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFE3D1" />
              <stop offset="100%" stopColor="#F7D0BA" />
            </linearGradient>
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3A3335" />
              <stop offset="100%" stopColor="#252122" />
            </linearGradient>
            <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3D4A59" />
              <stop offset="100%" stopColor="#2A333D" />
            </linearGradient>
            <linearGradient id="blushGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F28482" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#E07A5F" stopOpacity="0.2" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1E1E24" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* DOLL LEGS */}
          <rect x="78" y="195" width="22" height="32" rx="11" fill="#2A333D" />
          <rect x="110" y="195" width="22" height="32" rx="11" fill="#2A333D" />
          {/* Shoes */}
          <rect x="75" y="218" width="28" height="15" rx="7.5" fill="#E8E2D9" />
          <rect x="107" y="218" width="28" height="15" rx="7.5" fill="#E8E2D9" />

          {/* DOLL BODY (Hoodie) */}
          <g filter="url(#softGlow)">
            {/* Torso */}
            <path
              d="M62 135 C62 125, 78 120, 105 120 C132 120, 148 125, 148 135 L152 195 C152 202, 146 206, 138 206 L72 206 C64 206, 58 202, 58 195 Z"
              fill="url(#hoodieGrad)"
            />
            {/* Hoodie Pocket */}
            <path
              d="M75 168 C75 162, 85 160, 105 160 C125 160, 135 162, 135 168 L138 192 C138 195, 134 197, 130 197 L80 197 C76 197, 72 195, 72 192 Z"
              fill="#262F38"
              stroke="#4E5D6E"
              strokeWidth="1.5"
            />
            {/* Hoodie Drawstrings */}
            <path d="M96 135 L94 156" stroke="#FAF7F2" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M114 135 L116 156" stroke="#FAF7F2" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="94" cy="157" r="2" fill="#FAF7F2" />
            <circle cx="116" cy="157" r="2" fill="#FAF7F2" />

            {/* Little "TEDJ" or Heart Badge */}
            <rect x="76" y="140" width="18" height="9" rx="4.5" fill="#E07A5F" />
            <text x="85" y="146.5" fill="#FAF7F2" fontSize="5.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              TEDJ
            </text>
          </g>

          {/* DOLL ARMS */}
          {showSign ? (
            /* Holding Sign Arms */
            <g>
              <path d="M58 142 C50 148, 48 165, 72 170" stroke="#2A333D" strokeWidth="14" strokeLinecap="round" fill="none" />
              <path d="M152 142 C160 148, 162 165, 138 170" stroke="#2A333D" strokeWidth="14" strokeLinecap="round" fill="none" />
              <circle cx="72" cy="170" r="7" fill="url(#skinGrad)" />
              <circle cx="138" cy="170" r="7" fill="url(#skinGrad)" />
            </g>
          ) : isWaving ? (
            /* Waving Animation Arm */
            <g>
              {/* Left arm resting */}
              <path d="M60 142 C50 155, 52 175, 58 185" stroke="#2A333D" strokeWidth="14" strokeLinecap="round" fill="none" />
              <circle cx="58" cy="185" r="7" fill="url(#skinGrad)" />
              
              {/* Right arm waving */}
              <motion.g
                animate={reducedMotion ? {} : { rotate: [0, 20, -10, 20, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                style={{ originX: "150px", originY: "140px" }}
              >
                <path d="M150 140 C162 130, 172 110, 175 92" stroke="#2A333D" strokeWidth="14" strokeLinecap="round" fill="none" />
                <circle cx="175" cy="92" r="8" fill="url(#skinGrad)" />
              </motion.g>
            </g>
          ) : (
            /* Normal Interactive Arms */
            <g>
              <path d="M60 142 C48 152, 46 170, 56 182" stroke="#2A333D" strokeWidth="14" strokeLinecap="round" fill="none" />
              <circle cx="56" cy="182" r="7" fill="url(#skinGrad)" />

              <path d="M150 142 C162 152, 164 170, 154 182" stroke="#2A333D" strokeWidth="14" strokeLinecap="round" fill="none" />
              <circle cx="154" cy="182" r="7" fill="url(#skinGrad)" />
            </g>
          )}

          {/* DOLL HEAD */}
          <g id="head" filter="url(#softGlow)">
            {/* Neck */}
            <rect x="94" y="112" width="22" height="15" rx="6" fill="url(#skinGrad)" />

            {/* Chibi Face Base */}
            <rect x="52" y="38" width="106" height="88" rx="44" fill="url(#skinGrad)" />
            {/* Cute Rounded Cheeks */}
            <ellipse cx="66" cy="90" rx="16" ry="12" fill="url(#skinGrad)" />
            <ellipse cx="144" cy="90" rx="16" ry="12" fill="url(#skinGrad)" />

            {/* Blushing Cheeks */}
            <ellipse cx="72" cy="92" rx="9" ry="5.5" fill="url(#blushGrad)" />
            <ellipse cx="138" cy="92" rx="9" ry="5.5" fill="url(#blushGrad)" />

            {/* EARS */}
            <ellipse cx="49" cy="82" rx="7" ry="9" fill="url(#skinGrad)" />
            <ellipse cx="161" cy="82" rx="7" ry="9" fill="url(#skinGrad)" />

            {/* HAIR - Handcrafted Messy Modern Cut */}
            <path
              d="M52 64 C48 35, 75 14, 105 14 C138 14, 162 34, 158 64 C158 72, 162 76, 162 82 C162 85, 156 86, 154 80 C154 62, 150 48, 142 42 C134 36, 120 44, 105 44 C88 44, 76 36, 68 42 C60 48, 56 62, 56 80 C54 86, 48 85, 48 82 C48 76, 52 72, 52 64 Z"
              fill="url(#hairGrad)"
            />
            {/* Front Hair Bangs & Texture */}
            <path
              d="M58 48 C68 40, 82 52, 92 46 C102 40, 118 48, 132 42 C142 38, 150 45, 154 52 C146 50, 138 52, 130 56 C120 60, 108 50, 98 54 C88 58, 76 52, 66 58 C62 55, 59 52, 58 48 Z"
              fill="url(#hairGrad)"
            />
            {/* Stray Cute Hair Tuft */}
            <path
              d="M102 15 C104 6, 115 8, 112 16"
              stroke="#252122"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />

            {/* BAND-AID on forehead if hit >= 5 or expression is bandage */}
            {(hitCount >= 5 || activeExpression === 'bandage' || activeExpression === 'dizzy') && (
              <g transform="translate(116, 52) rotate(22)">
                <rect x="-14" y="-7" width="28" height="14" rx="4" fill="#F4A261" />
                <rect x="-5" y="-5" width="10" height="10" rx="2" fill="#FAF7F2" opacity="0.6" />
                <circle cx="-1" cy="0" r="0.8" fill="#E76F51" />
                <circle cx="1" cy="0" r="0.8" fill="#E76F51" />
              </g>
            )}

            {/* EYEBROWS */}
            {activeExpression === 'calm' && (
              <g stroke="#3A3335" strokeWidth="2.5" strokeLinecap="round">
                <path d="M74 68 C80 66, 86 68, 90 71" />
                <path d="M120 71 C124 68, 130 66, 136 68" />
              </g>
            )}
            {(activeExpression === 'nervous' || activeExpression === 'crying') && (
              <g stroke="#3A3335" strokeWidth="2.5" strokeLinecap="round">
                <path d="M74 69 C80 72, 86 70, 90 67" />
                <path d="M120 67 C124 70, 130 72, 136 69" />
              </g>
            )}
            {(activeExpression === 'oof' || activeExpression === 'dizzy' || activeExpression === 'bandage') && (
              <g stroke="#3A3335" strokeWidth="2.5" strokeLinecap="round">
                <path d="M74 72 L90 66" />
                <path d="M120 66 L136 72" />
              </g>
            )}

            {/* EYES & EXPRESSIONS */}
            {activeExpression === 'calm' && (
              <g>
                {/* Left Eye */}
                <ellipse cx="82" cy="80" rx="7.5" ry="9" fill="#1E1E24" />
                <circle cx={80 + mousePos.x * 0.15} cy={78 + mousePos.y * 0.15} r="3" fill="#FFFFFF" />
                <circle cx={84} cy={83} r="1.2" fill="#FFFFFF" />

                {/* Right Eye */}
                <ellipse cx="128" cy="80" rx="7.5" ry="9" fill="#1E1E24" />
                <circle cx={126 + mousePos.x * 0.15} cy={78 + mousePos.y * 0.15} r="3" fill="#FFFFFF" />
                <circle cx={130} cy={83} r="1.2" fill="#FFFFFF" />

                {/* Cute Smile */}
                <path d="M99 92 C102 96, 108 96, 111 92" stroke="#3A3335" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            )}

            {activeExpression === 'nervous' && (
              <g>
                {/* Big worried eyes */}
                <ellipse cx="82" cy="80" rx="7.5" ry="8" fill="#1E1E24" />
                <circle cx="80" cy="78" r="2.5" fill="#FFFFFF" />

                <ellipse cx="128" cy="80" rx="7.5" ry="8" fill="#1E1E24" />
                <circle cx="126" cy="78" r="2.5" fill="#FFFFFF" />

                {/* Wobbly nervous mouth */}
                <path d="M98 94 C101 92, 104 96, 107 92 C110 96, 112 94, 114 94" stroke="#3A3335" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                {/* Single Sweat Drop */}
                <path d="M142 66 C144 62, 148 62, 148 68 C148 72, 144 74, 142 74 C140 74, 138 72, 138 68 Z" fill="#64B5F6" />
              </g>
            )}

            {activeExpression === 'oof' && (
              <g>
                {/* Squeezed "> <" eyes */}
                <path d="M74 76 L85 82 L74 88" stroke="#1E1E24" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M136 76 L125 82 L136 88" stroke="#1E1E24" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                {/* Open "O" mouth */}
                <ellipse cx="105" cy="94" rx="6" ry="7" fill="#E07A5F" stroke="#3A3335" strokeWidth="2" />
              </g>
            )}

            {activeExpression === 'crying' && (
              <g>
                {/* Pleading closed eyes */}
                <path d="M74 82 C78 75, 88 75, 92 82" stroke="#1E1E24" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M118 82 C122 75, 132 75, 136 82" stroke="#1E1E24" strokeWidth="3.5" strokeLinecap="round" fill="none" />

                {/* Waterfall comic tears */}
                <path d="M78 84 C76 96, 74 108, 76 118" stroke="#42A5F5" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8" />
                <path d="M132 84 C134 96, 136 108, 134 118" stroke="#42A5F5" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8" />

                {/* Open crying mouth */}
                <path d="M99 92 C99 99, 111 99, 111 92 Z" fill="#E07A5F" stroke="#3A3335" strokeWidth="2" />
              </g>
            )}

            {activeExpression === 'dizzy' && (
              <g>
                {/* Spiral dizzy eyes */}
                <path
                  d="M82 80 m -6, 0 a 6,6 0 1,0 12,0 a 4.5,4.5 0 1,0 -9,0 a 3,3 0 1,0 6,0 a 1.5,1.5 0 1,0 -3,0"
                  stroke="#1E1E24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M128 80 m -6, 0 a 6,6 0 1,0 12,0 a 4.5,4.5 0 1,0 -9,0 a 3,3 0 1,0 6,0 a 1.5,1.5 0 1,0 -3,0"
                  stroke="#1E1E24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Dazed wavy mouth */}
                <path d="M98 94 Q105 98 112 94" stroke="#3A3335" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                {/* Orbiting comic stars */}
                <motion.g
                  animate={reducedMotion ? {} : { rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  style={{ originX: "105px", originY: "40px" }}
                >
                  <polygon points="105,25 107,31 113,31 108,34 110,40 105,36 100,40 102,34 97,31 103,31" fill="#F4A261" />
                  <polygon points="65,35 66,39 70,39 67,41 68,45 65,42 62,45 63,41 60,39 64,39" fill="#E07A5F" />
                  <polygon points="145,35 146,39 150,39 147,41 148,45 145,42 142,45 143,41 140,39 144,39" fill="#F4A261" />
                </motion.g>
              </g>
            )}
          </g>

          {/* SIGN PLACARD (Secret stage) */}
          {showSign && (
            <g id="sign" filter="url(#softGlow)">
              <rect x="35" y="145" width="140" height="60" rx="8" fill="#FFFBF5" stroke="#D1C7BD" strokeWidth="2" />
              <rect x="40" y="150" width="130" height="50" rx="6" fill="#FAF5ED" stroke="#EADDCF" strokeWidth="1" />
              {/* Wooden Stick */}
              <rect x="101" y="205" width="8" height="25" rx="2" fill="#B38A65" />
              
              <text x="105" y="174" fill="#1E1E24" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="var(--font-sans), sans-serif">
                {signText.split('.')[0] + '.'}
              </text>
              {signText.split('.')[1] && (
                <text x="105" y="189" fill="#E07A5F" fontSize="10" fontWeight="500" textAnchor="middle" fontFamily="var(--font-sans), sans-serif" fontStyle="italic">
                  {signText.split('.')[1].trim()}
                </text>
              )}
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
};
