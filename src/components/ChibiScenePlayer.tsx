import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Crown, Volume2, VolumeX, Maximize2, Camera } from 'lucide-react';
import { SCENES } from '../data/scenes';
import { FloatingParticle, InteractiveTapEffect } from '../types';
import { soundEngine } from '../utils/audio';

interface ChibiScenePlayerProps {
  currentTime: number;
  isPlaying: boolean;
  onTimeUpdate: (time: number) => void;
  showSubtitles: boolean;
  showStickerBorder: boolean;
  onOpenStickerMaker: () => void;
}

export const ChibiScenePlayer: React.FC<ChibiScenePlayerProps> = ({
  currentTime,
  isPlaying,
  showSubtitles,
  showStickerBorder,
  onOpenStickerMaker,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tapEffects, setTapEffects] = useState<InteractiveTapEffect[]>([]);
  const [isMuted, setIsMuted] = useState(soundEngine.isMute());
  const [lastTriggeredScene, setLastTriggeredScene] = useState<number | null>(null);

  // Active scene calculation
  const currentScene = useMemo(() => {
    if (currentTime < 3) return SCENES[0];
    if (currentTime < 6) return SCENES[1];
    return SCENES[2];
  }, [currentTime]);

  // Audio cues triggered on key timestamps
  useEffect(() => {
    const sceneId = currentScene.id;
    if (sceneId !== lastTriggeredScene) {
      setLastTriggeredScene(sceneId);
      if (sceneId === 1) {
        soundEngine.playPout();
      } else if (sceneId === 2) {
        soundEngine.playTap();
        setTimeout(() => soundEngine.playSparkle(), 300);
      } else if (sceneId === 3) {
        soundEngine.playQueenFanfare();
      }
    }
  }, [currentScene.id, lastTriggeredScene]);

  // Camera Zoom calculation (Gentle push-in across the 10s timeline)
  // 0-3s: 1.00 -> 1.03
  // 3-6s: 1.03 -> 1.08
  // 6-10s: 1.08 -> 1.15
  const cameraScale = useMemo(() => {
    if (currentTime <= 3) {
      return 1.0 + (currentTime / 3) * 0.03;
    } else if (currentTime <= 6) {
      return 1.03 + ((currentTime - 3) / 3) * 0.05;
    } else {
      return 1.08 + ((currentTime - 6) / 4) * 0.07;
    }
  }, [currentTime]);

  // Floating background particles (hearts, stars, petals)
  const particles = useMemo<FloatingParticle[]>(() => {
    const items: FloatingParticle[] = [];
    const count = currentScene.id === 3 ? 24 : 14;
    for (let i = 0; i < count; i++) {
      const typeOptions: ('heart' | 'star' | 'petal' | 'sparkle')[] =
        currentScene.id === 3
          ? ['heart', 'petal', 'petal', 'sparkle', 'star']
          : ['sparkle', 'star', 'heart'];
      const chosenType = typeOptions[i % typeOptions.length];
      items.push({
        id: i,
        x: (i * 19 + 7) % 92 + 4,
        y: (i * 29 + 13) % 90 + 5,
        size: 14 + (i % 5) * 4,
        speed: 2 + (i % 3) * 1.5,
        type: chosenType,
        color:
          chosenType === 'heart'
            ? '#ff6b8b'
            : chosenType === 'petal'
            ? '#ffb3c1'
            : chosenType === 'star'
            ? '#ffd166'
            : '#ffffff',
        opacity: 0.4 + (i % 4) * 0.15,
        rotation: (i * 35) % 360,
        rotSpeed: ((i % 2 === 0 ? 1 : -1) * (15 + (i % 20))),
      });
    }
    return items;
  }, [currentScene.id]);

  // Handle interactive clicks on the animation stage
  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const effectTypes: ('heart' | 'star' | 'kiss' | 'bonk')[] = ['heart', 'star', 'heart', 'kiss'];
    const chosen = effectTypes[Math.floor(Math.random() * effectTypes.length)];

    const newEffect: InteractiveTapEffect = {
      id: Date.now() + Math.random(),
      x,
      y,
      type: chosen,
    };

    setTapEffects((prev) => [...prev.slice(-10), newEffect]);
    soundEngine.playHeart();

    setTimeout(() => {
      setTapEffects((prev) => prev.filter((item) => item.id !== newEffect.id));
    }, 1200);
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundEngine.setMuted(newMuted);
    if (!newMuted) {
      soundEngine.startBgm();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-sm sm:max-w-md mx-auto">
      {/* Outer 9:16 Frame Container */}
      <div
        ref={containerRef}
        onClick={handleStageClick}
        className={`relative w-full aspect-[9/16] rounded-3xl overflow-hidden cursor-pointer select-none transition-all duration-300 shadow-2xl ${
          showStickerBorder
            ? 'p-2 sm:p-3 bg-white ring-4 ring-pink-200/80 shadow-pink-200/50'
            : 'bg-stone-900 ring-1 ring-white/10'
        }`}
        style={{
          boxShadow: showStickerBorder
            ? '0 20px 40px -10px rgba(255, 133, 161, 0.35), 0 0 0 10px rgba(255, 255, 255, 0.95)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Inner Canvas with Camera Scale & Push-in */}
        <motion.div
          className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#ffe5ec] via-[#ffccd5] to-[#fde2e4]"
          animate={{
            scale: cameraScale,
          }}
          transition={{ duration: 0.1, ease: 'linear' }}
        >
          {/* Ambient Lighting & Pastel Gradient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 via-transparent to-pink-300/30 pointer-events-none z-10" />

          {/* Layer 1: Scene 1 (0 - 3.2s) */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 1 }}
            animate={{
              opacity: currentTime < 3 ? 1 : currentTime < 3.4 ? 1 - (currentTime - 3) / 0.4 : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={SCENES[0].imageSrc}
              alt={SCENES[0].name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </motion.div>

          {/* Layer 2: Scene 2 (2.8s - 6.2s) */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{
              opacity:
                currentTime >= 3 && currentTime < 6
                  ? 1
                  : currentTime >= 2.8 && currentTime < 3
                  ? (currentTime - 2.8) / 0.2
                  : currentTime >= 6 && currentTime < 6.4
                  ? 1 - (currentTime - 6) / 0.4
                  : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={SCENES[1].imageSrc}
              alt={SCENES[1].name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </motion.div>

          {/* Layer 3: Scene 3 (5.8s - 10s) */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{
              opacity:
                currentTime >= 6
                  ? 1
                  : currentTime >= 5.8 && currentTime < 6
                  ? (currentTime - 5.8) / 0.2
                  : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={SCENES[2].imageSrc}
              alt={SCENES[2].name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </motion.div>

          {/* DYNAMIC 2D OVERLAYS & KAWAII STICKER ANIMATIONS */}

          {/* Scene 1 Elements (0s - 3s): Pulsing Anger Mark & Dripping Sweat Drops */}
          {currentTime < 3.2 && (
            <div className="absolute inset-0 pointer-events-none z-20">
              {/* Pulsing Comic Anger Mark (💢) above girl's head */}
              <motion.div
                className="absolute top-[28%] right-[18%] flex items-center justify-center"
                animate={{
                  scale: [1, 1.25, 0.95, 1.15, 1],
                  rotate: [0, 8, -6, 4, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  ease: 'easeInOut',
                }}
              >
                <div className="relative">
                  <svg
                    width="42"
                    height="42"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-[0_2px_8px_rgba(239,68,68,0.7)]"
                  >
                    <path
                      d="M25 15 L25 85 M75 15 L75 85 M15 25 L85 25 M15 75 L85 75"
                      stroke="#ef4444"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />
                    <path
                      d="M25 15 L25 85 M75 15 L75 85 M15 25 L85 25 M15 75 L85 75"
                      stroke="#ffffff"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Comic Steam puffs */}
                  <motion.div
                    className="absolute -top-3 -right-3 w-4 h-4 rounded-full bg-white/80 border border-slate-300 shadow-sm"
                    animate={{
                      y: [-2, -10],
                      opacity: [0.8, 0],
                      scale: [0.5, 1.3],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      ease: 'easeOut',
                    }}
                  />
                </div>
              </motion.div>

              {/* Dripping Nervous Blue Sweat Drops on boy */}
              <motion.div
                className="absolute top-[37%] left-[23%]"
                animate={{
                  y: [0, 16],
                  opacity: [0.9, 0],
                  scale: [0.8, 1.2],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.9,
                  ease: 'easeIn',
                }}
              >
                <svg width="24" height="30" viewBox="0 0 24 30" fill="none">
                  <path
                    d="M12 0 C12 0 0 14 0 21 C0 26 5.4 30 12 30 C18.6 30 24 26 24 21 C24 14 12 0 12 0 Z"
                    fill="#38bdf8"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                  />
                  <ellipse cx="8" cy="18" rx="2" ry="4" fill="#ffffff" opacity="0.8" />
                </svg>
              </motion.div>

              {/* Second sweat drop */}
              <motion.div
                className="absolute top-[41%] left-[17%]"
                animate={{
                  y: [0, 14],
                  opacity: [0.9, 0],
                  scale: [0.7, 1.1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.1,
                  delay: 0.4,
                  ease: 'easeIn',
                }}
              >
                <svg width="20" height="26" viewBox="0 0 24 30" fill="none">
                  <path
                    d="M12 0 C12 0 0 14 0 21 C0 26 5.4 30 12 30 C18.6 30 24 26 24 21 C24 14 12 0 12 0 Z"
                    fill="#60a5fa"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </svg>
              </motion.div>
            </div>
          )}

          {/* Scene 2 Elements (3s - 6s): Shoulder Tap Star Burst & Anger to Heart Transformation */}
          {currentTime >= 2.8 && currentTime < 6.2 && (
            <div className="absolute inset-0 pointer-events-none z-20">
              {/* Shoulder Tap Impact Star Burst at 3.0s - 3.8s */}
              {currentTime >= 3.0 && currentTime <= 4.2 && (
                <motion.div
                  className="absolute top-[48%] left-[48%] -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{
                    scale: [0.2, 1.35, 1],
                    rotate: [0, 45, 90],
                    opacity: [1, 1, 0.7],
                  }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <div className="relative flex items-center justify-center">
                    <svg
                      width="54"
                      height="54"
                      viewBox="0 0 100 100"
                      fill="#ffd166"
                      stroke="#ffffff"
                      strokeWidth="5"
                      className="drop-shadow-md"
                    >
                      <polygon points="50,5 64,36 98,38 72,60 80,95 50,75 20,95 28,60 2,38 36,36" />
                    </svg>
                    <span className="absolute text-[11px] font-black text-rose-600 bg-white/95 px-1.5 py-0.5 rounded-full border border-rose-300 shadow">
                      TAP!
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Anger Mark transforming into a floating Glowing Heart */}
              <motion.div
                className="absolute top-[26%] left-[34%]"
                initial={{ scale: 0.6, y: 10 }}
                animate={{
                  scale: [0.8, 1.25, 1.1],
                  y: [-2, -18],
                  rotate: [-5, 8, -3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <div className="relative">
                  <Heart
                    className="w-10 h-10 fill-pink-500 text-white drop-shadow-[0_4px_12px_rgba(244,63,94,0.6)]"
                    strokeWidth={2.5}
                  />
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ scale: [0, 1.2, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  >
                    <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Girl's Sparkling Eye Glints */}
              <motion.div
                className="absolute top-[43%] left-[32%]"
                animate={{
                  scale: [0.8, 1.4, 0.9],
                  opacity: [0.7, 1, 0.8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.7,
                }}
              >
                <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
              </motion.div>

              <motion.div
                className="absolute top-[43%] left-[43%]"
                animate={{
                  scale: [0.8, 1.4, 0.9],
                  opacity: [0.7, 1, 0.8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.7,
                  delay: 0.15,
                }}
              >
                <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
              </motion.div>

              {/* Gift Ribbon Shimmer */}
              <motion.div
                className="absolute top-[57%] right-[32%]"
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [-3, 3, -3],
                }}
                transition={{ repeat: Infinity, duration: 0.9 }}
              >
                <Sparkles className="w-6 h-6 text-pink-400 fill-pink-300 drop-shadow" />
              </motion.div>
            </div>
          )}

          {/* Scene 3 Elements (6s - 10s): Queen Golden Crown Sparkle & Floating Sakura & Hearts */}
          {currentTime >= 5.8 && (
            <div className="absolute inset-0 pointer-events-none z-20">
              {/* Queen Crown Shimmer Glints */}
              <motion.div
                className="absolute top-[18%] left-[32%]"
                animate={{
                  scale: [1, 1.18, 1],
                  rotate: [-4, 4, -4],
                }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              >
                <div className="relative">
                  <Crown className="w-8 h-8 text-amber-400 fill-amber-300 drop-shadow-[0_4px_10px_rgba(251,191,36,0.7)]" />
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: 360, scale: [0.8, 1.3, 0.8] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  >
                    <Sparkles className="w-5 h-5 text-white fill-white" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Boy's Loving Heart Eyes & Blushing Glow */}
              <motion.div
                className="absolute top-[56%] right-[22%]"
                animate={{
                  scale: [1, 1.2, 1],
                  y: [-1, -4, -1],
                }}
                transition={{ repeat: Infinity, duration: 1.1 }}
              >
                <Heart className="w-6 h-6 fill-rose-500 text-white drop-shadow-md" />
              </motion.div>

              <motion.div
                className="absolute top-[59%] right-[34%]"
                animate={{
                  scale: [0.9, 1.15, 0.9],
                  y: [-2, -6, -2],
                }}
                transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }}
              >
                <Heart className="w-4 h-4 fill-pink-400 text-white drop-shadow-sm" />
              </motion.div>
            </div>
          )}

          {/* Floating Atmospheric Particles (Hearts, Sakura Petals, Sparkles) */}
          <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden">
            {particles.map((p) => {
              const yOffset = ((currentTime * p.speed * 8 + p.y * 3) % 110) - 10;
              const xOffset = p.x + Math.sin((currentTime + p.id) * 1.5) * 4;
              return (
                <div
                  key={p.id}
                  className="absolute transition-transform duration-75"
                  style={{
                    left: `${xOffset}%`,
                    top: `${yOffset}%`,
                    opacity: p.opacity,
                    transform: `rotate(${p.rotation + currentTime * p.rotSpeed}deg)`,
                  }}
                >
                  {p.type === 'heart' && (
                    <Heart
                      className="fill-rose-400 text-white drop-shadow-sm"
                      style={{ width: p.size, height: p.size }}
                    />
                  )}
                  {p.type === 'petal' && (
                    <svg
                      width={p.size}
                      height={p.size * 1.3}
                      viewBox="0 0 20 26"
                      fill="none"
                      className="drop-shadow-sm"
                    >
                      <path
                        d="M10 0 C18 6 20 18 10 26 C0 18 2 6 10 0 Z"
                        fill="#ffb3c1"
                        opacity="0.85"
                      />
                    </svg>
                  )}
                  {p.type === 'star' && (
                    <Sparkles
                      className="text-amber-300 fill-amber-200 drop-shadow-sm"
                      style={{ width: p.size * 0.9, height: p.size * 0.9 }}
                    />
                  )}
                  {p.type === 'sparkle' && (
                    <div
                      className="rounded-full bg-white shadow-[0_0_6px_#ffffff]"
                      style={{ width: p.size * 0.4, height: p.size * 0.4 }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Interactive Tap Click Feedback Particles */}
          <AnimatePresence>
            {tapEffects.map((effect) => (
              <motion.div
                key={effect.id}
                className="absolute z-40 pointer-events-none"
                style={{ left: `${effect.x}%`, top: `${effect.y}%` }}
                initial={{ scale: 0.3, y: 0, opacity: 1 }}
                animate={{
                  scale: [0.3, 1.4, 1.1],
                  y: -40,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              >
                <div className="relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  {effect.type === 'heart' && (
                    <Heart className="w-8 h-8 fill-pink-500 text-white drop-shadow-[0_4px_10px_rgba(236,72,153,0.7)]" />
                  )}
                  {effect.type === 'star' && (
                    <Sparkles className="w-8 h-8 fill-amber-300 text-white drop-shadow-[0_4px_10px_rgba(245,158,11,0.7)]" />
                  )}
                  {effect.type === 'kiss' && (
                    <span className="text-2xl drop-shadow-md">💋</span>
                  )}
                  {effect.type === 'bonk' && (
                    <span className="text-xl font-bold bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full border border-white">
                      BOOP!
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Subtitles & Manga Speech Bubble (Playful & Kawaii) */}
          {showSubtitles && (
            <div className="absolute bottom-5 inset-x-3 z-30 pointer-events-none flex flex-col items-center">
              <motion.div
                key={currentScene.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="max-w-[95%] bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-lg border-2 border-pink-200/90 text-center"
              >
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      currentScene.dialogue.speaker === 'girl'
                        ? 'bg-pink-100 text-pink-700'
                        : 'bg-slate-800 text-white'
                    }`}
                  >
                    {currentScene.dialogue.speaker === 'girl' ? 'Chibi Princess' : 'Hoodie Boy'}
                  </span>
                  <span className="text-[11px] text-pink-400 font-semibold">
                    {currentTime < 3 ? '0:00 - 0:03' : currentTime < 6 ? '0:03 - 0:06' : '0:06 - 0:10'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                  {currentScene.dialogue.text}
                </p>
              </motion.div>
            </div>
          )}

          {/* Top Floating Controls Bar inside the 9:16 frame */}
          <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between pointer-events-auto">
            {/* FPS & Time badge */}
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-medium border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>24 FPS</span>
              <span className="text-white/50">|</span>
              <span className="font-mono">{currentTime.toFixed(1)}s / 10.0s</span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Snapshot Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenStickerMaker();
                }}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur text-pink-600 flex items-center justify-center shadow-md transition-transform active:scale-90"
                title="Create Sticker Card"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Mute/Sound Toggle */}
              <button
                onClick={toggleSound}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur text-pink-600 flex items-center justify-center shadow-md transition-transform active:scale-90"
                title={isMuted ? 'Unmute BGM & SFX' : 'Mute Sound'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Die-cut white border caption indicator */}
      {showStickerBorder && (
        <div className="mt-2 text-center text-xs font-medium text-pink-500/80 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Die-Cut Kawaii White Sticker Border Enabled</span>
        </div>
      )}
    </div>
  );
};
