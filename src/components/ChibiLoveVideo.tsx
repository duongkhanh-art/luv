import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Crown, Volume2, VolumeX, Maximize2, Minimize2, Share2, Download, Check } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ChibiLoveVideoProps {
  imageSrc: string;
}

export const ChibiLoveVideo: React.FC<ChibiLoveVideoProps> = ({ imageSrc }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tapHearts, setTapHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const loveMessage = `20/10  ruiiii.... niu oiii...hôm nay là ngày của niu nên được quyền làm nữ hoàng, được quyền đòi quà, được quyền nũng nịu cả ngày lunnnn....cảm ơn niu đã luôn ở bên tớ, nghe tớ kể đủ thứ chuyện lan man, chịu tớ những lúc khó ưa nữaaa.... với tớ thì ở bên niu là mọi thứ đều nhẹ nhõm hẳn lunnn....chúc bé iu cụa tớ luôn xinh, luôn khỏe, luôn vui và luôn được yêu thương thật nhìuuuu...tớ thương niu lắm lắm đóaaaa`;

  const handleShareLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Gửi Niu của tớ 👑💕 20/10',
          text: '20/10 ruiiii.... hôm nay là ngày của niu nè! 💖',
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 3000);
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.3 },
        colors: ['#ff4d6d', '#ff758f', '#ffd166'],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadCard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 720;
      canvas.height = 1280;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
      await new Promise((res) => { img.onload = res; });

      // Draw background
      const grad = ctx.createLinearGradient(0, 0, 0, 1280);
      grad.addColorStop(0, '#ffe5ec');
      grad.addColorStop(0.5, '#ffccd5');
      grad.addColorStop(1, '#fde2e4');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 720, 1280);

      // Draw chibi illustration
      ctx.drawImage(img, 0, 0, 720, 1280);

      // Card overlay for text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.shadowColor = 'rgba(255, 112, 147, 0.3)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.roundRect(30, 840, 660, 400, 30);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Header
      ctx.font = 'bold 26px "Quicksand", sans-serif';
      ctx.fillStyle = '#e11d48';
      ctx.fillText('💖 Gửi bé iu của tớ • 20/10 👑', 50, 885);

      // Text wrap
      ctx.font = '500 21px "Quicksand", sans-serif';
      ctx.fillStyle = '#334155';
      const words = loveMessage.split(' ');
      let line = '';
      let y = 925;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 600 && n > 0) {
          ctx.fillText(line, 50, y);
          line = words[n] + ' ';
          y += 32;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 50, y);

      const link = document.createElement('a');
      link.download = 'thiep-20-10-gui-niu.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Start sweet background melody on mount
  useEffect(() => {
    soundEngine.setMuted(false);
    soundEngine.startBgm();

    // Trigger sweet opening confetti
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ff758f', '#ff85a1', '#f72585', '#b5179e', '#ffd166'],
      });
    }, 600);

    return () => {
      soundEngine.stopBgm();
    };
  }, []);

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.startBgm();
    }
  };

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newHeart = { id: Date.now() + Math.random(), x, y };
    setTapHearts((prev) => [...prev.slice(-8), newHeart]);

    soundEngine.playHeart();

    // mini burst of sparkles
    confetti({
      particleCount: 15,
      spread: 40,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: ['#ff4d6d', '#ff758f', '#ffd166'],
    });

    setTimeout(() => {
      setTapHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full max-w-sm sm:max-w-md mx-auto select-none">
      {/* 9:16 Vertical Video Frame with Kawaii White Sticker Border */}
      <div
        ref={containerRef}
        onClick={handleStageClick}
        className="relative w-full aspect-[9/16] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl p-2.5 sm:p-3 bg-white ring-4 ring-pink-200/90 transition-all duration-300"
        style={{
          boxShadow:
            '0 25px 60px -15px rgba(255, 112, 147, 0.45), 0 0 0 10px rgba(255, 255, 255, 0.95)',
        }}
      >
        {/* Animated Inner Canvas */}
        <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-gradient-to-b from-[#ffe5ec] via-[#ffccd5] to-[#fde2e4]">
          {/* Main Visual Image with Gentle Romantic Breathing Motion */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            animate={{
              scale: [1.0, 1.04, 1.0],
              y: [0, -4, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <img
              src={imageSrc}
              alt="Chibi Couple 20/10"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover pointer-events-none select-none"
            />
          </motion.div>

          {/* Ambient Lighting & Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-pink-200/20 pointer-events-none z-10" />

          {/* DYNAMIC ROMANTIC OVERLAYS */}

          {/* Crown Sparkle & Golden Glow on Niu's Crown */}
          <motion.div
            className="absolute top-[28%] right-[22%] z-20 pointer-events-none"
            animate={{
              scale: [0.9, 1.25, 0.9],
              rotate: [-5, 8, -5],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: 'easeInOut',
            }}
          >
            <div className="relative">
              <Crown className="w-8 h-8 text-amber-300 fill-amber-200 drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]" />
              <motion.div
                className="absolute -top-2 -right-1"
                animate={{ rotate: 360, scale: [0.7, 1.3, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4 text-white fill-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Pulsing Floating Hearts around the couple */}
          <motion.div
            className="absolute top-[18%] left-[24%] z-20 pointer-events-none"
            animate={{
              y: [0, -12, 0],
              scale: [0.95, 1.15, 0.95],
              rotate: [-6, 6, -6],
            }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <Heart className="w-7 h-7 fill-rose-500 text-white drop-shadow-md" />
          </motion.div>

          <motion.div
            className="absolute top-[22%] right-[14%] z-20 pointer-events-none"
            animate={{
              y: [0, -10, 0],
              scale: [0.9, 1.1, 0.9],
              rotate: [4, -4, 4],
            }}
            transition={{ repeat: Infinity, duration: 2.6, delay: 0.5, ease: 'easeInOut' }}
          >
            <Heart className="w-5 h-5 fill-pink-400 text-white drop-shadow-sm" />
          </motion.div>

          <motion.div
            className="absolute top-[42%] left-[8%] z-20 pointer-events-none"
            animate={{
              scale: [0.85, 1.2, 0.85],
              rotate: [-10, 10, -10],
            }}
            transition={{ repeat: Infinity, duration: 2.4, delay: 1 }}
          >
            <Heart className="w-6 h-6 fill-rose-400 text-white drop-shadow-sm" />
          </motion.div>

          {/* Continuous Floating Sakura Petals & Stars */}
          <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${(i * 17 + 5) % 90}%`,
                  top: `${(i * 23 + 10) % 85}%`,
                }}
                animate={{
                  y: [-10, 30, -10],
                  x: [-5, 8, -5],
                  rotate: [0, 180, 360],
                  opacity: [0.4, 0.85, 0.4],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4 + (i % 4),
                  delay: i * 0.35,
                  ease: 'easeInOut',
                }}
              >
                {i % 2 === 0 ? (
                  <svg width="14" height="18" viewBox="0 0 20 26" fill="none" className="drop-shadow-sm">
                    <path d="M10 0 C18 6 20 18 10 26 C0 18 2 6 10 0 Z" fill="#ffb3c1" opacity="0.8" />
                  </svg>
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-amber-100" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Interactive Tap Heart Particles */}
          <AnimatePresence>
            {tapHearts.map((heart) => (
              <motion.div
                key={heart.id}
                className="absolute z-40 pointer-events-none"
                style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
                initial={{ scale: 0.2, y: 0, opacity: 1 }}
                animate={{ scale: [0.2, 1.4, 1.1], y: -50, opacity: [1, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                  <Heart className="w-8 h-8 fill-pink-500 text-white drop-shadow-[0_4px_12px_rgba(244,63,94,0.8)]" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Top Subtle Floating Controls */}
          <div className="absolute top-3.5 inset-x-3.5 z-30 flex items-center justify-between pointer-events-auto">
            {/* 20/10 Queen Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-pink-700 px-3 py-1 rounded-full text-xs font-bold shadow-md border border-pink-200"
            >
              <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>20/10 • Ngày Của Niu 👑</span>
            </motion.div>

            {/* Quick Actions (Share Link, Download Card, Sound, Fullscreen) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShareLink}
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur text-pink-600 flex items-center justify-center shadow-md transition-transform active:scale-90"
                title="Chia sẻ link cho Niu xem trên web"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleDownloadCard}
                disabled={isDownloading}
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur text-pink-600 flex items-center justify-center shadow-md transition-transform active:scale-90 disabled:opacity-50"
                title="Lưu ảnh thiệp về máy"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={handleToggleSound}
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur text-pink-600 flex items-center justify-center shadow-md transition-transform active:scale-90"
                title={isMuted ? 'Bật nhạc ngọt ngào' : 'Tắt âm'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleFullscreen}
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur text-pink-600 flex items-center justify-center shadow-md transition-transform active:scale-90"
                title="Toàn màn hình"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Toast Notification when link is copied */}
          <AnimatePresence>
            {showCopiedToast && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.9 }}
                className="absolute top-14 inset-x-6 z-50 bg-slate-900/90 backdrop-blur-md text-white py-2 px-3.5 rounded-2xl text-xs font-semibold text-center shadow-2xl flex items-center justify-center gap-1.5 border border-white/20"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Đã sao chép link! Dán gửi Niu qua Zalo/Mess nhé 💕</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ROMANTIC 20/10 LOVE LETTER OVERLAY (Focused, Sweet & Beautiful) */}
          <div className="absolute bottom-3 inset-x-3 z-30 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-4.5 shadow-xl border-2 border-pink-200/90 text-slate-800 space-y-2 max-h-[38vh] overflow-y-auto"
              style={{
                fontFamily: "'Quicksand', 'Be Vietnam Pro', sans-serif",
              }}
            >
              {/* Header Title */}
              <div className="flex items-center justify-between border-b border-pink-100 pb-1.5">
                <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  Gửi bé iu của tớ 💕
                </span>
                <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                  Special 20/10
                </span>
              </div>

              {/* The heartfelt message requested by user */}
              <p className="text-[12px] sm:text-[13px] leading-relaxed text-slate-700 font-medium whitespace-pre-line text-justify">
                {loveMessage}
              </p>

              <div className="pt-1 flex items-center justify-between text-[11px] text-pink-500 font-bold border-t border-pink-100/60">
                <span>Chạm vào màn hình để thả tim ✨</span>
                <span>👑 Forever Queen</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
