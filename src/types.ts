export interface SceneInfo {
  id: number;
  name: string;
  subtitle: string;
  caption: string;
  startTime: number;
  endTime: number;
  imageSrc: string;
  themeColor: string;
  dialogue: {
    speaker: 'girl' | 'boy' | 'narrator';
    text: string;
  };
}

export interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  type: 'heart' | 'star' | 'petal' | 'sparkle';
  color: string;
  opacity: number;
  rotation: number;
  rotSpeed: number;
}

export interface InteractiveTapEffect {
  id: number;
  x: number;
  y: number;
  type: 'heart' | 'star' | 'kiss' | 'sweat' | 'bonk';
  text?: string;
}
