export type ScreenStage = 
  | 'intro'
  | 'doll'
  | 'shattering'
  | 'shattered-dialogue'
  | 'apology'
  | 'secret'
  | 'final';

export type DollExpression = 
  | 'calm'
  | 'nervous'
  | 'oof'
  | 'dizzy'
  | 'crying'
  | 'bandage'
  | 'holding-sign'
  | 'waving';

export interface HitParticle {
  id: number;
  x: number;
  y: number;
  text?: string;
  emoji?: string;
  vx: number;
  vy: number;
  rotation: number;
  scale: number;
  color: string;
}
