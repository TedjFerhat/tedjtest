import React from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { soundFx } from '../utils/audio';
import type { ScreenStage } from '../types';

interface AudioControllerProps {
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  currentStage: ScreenStage;
  onRestart: () => void;
}

export const AudioController: React.FC<AudioControllerProps> = ({
  isMuted,
  setIsMuted,
  currentStage,
  onRestart,
}) => {
  const toggleAudio = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
    if (!next) {
      soundFx.playPop();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 pointer-events-none max-w-4xl mx-auto">
      {/* Brand / Context Title */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-[#7A736E] bg-[#F3EFEA]/80 px-2.5 py-1 rounded-full border border-[#E6E0D8]/60 backdrop-blur-xs">
          Aya &amp; Tedj
        </span>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Restart Button (Visible after Intro) */}
        {currentStage !== 'intro' && (
          <button
            onClick={onRestart}
            aria-label="Restart"
            title="Restart"
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#7A736E] hover:text-[#1E1E24] hover:bg-[#F3EFEA] active:scale-95 transition-all border border-[#E6E0D8]/60 bg-[#FAF7F2]/80 backdrop-blur-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Sound Toggle */}
        <button
          onClick={toggleAudio}
          aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
          title={isMuted ? "Unmute sounds" : "Mute sounds"}
          className={`w-9 h-9 flex items-center justify-center rounded-full active:scale-95 transition-all border ${
            !isMuted 
              ? 'bg-[#1E1E24] text-[#FAF7F2] border-[#1E1E24]' 
              : 'text-[#7A736E] hover:text-[#1E1E24] hover:bg-[#F3EFEA] bg-[#FAF7F2]/80 border-[#E6E0D8]/60'
          }`}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};


