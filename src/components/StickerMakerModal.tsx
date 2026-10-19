import React, { useState, useRef } from 'react';
import { X, Download, Sparkles, Heart, Check, Type, Stamp } from 'lucide-react';
import { SCENES } from '../data/scenes';
import confetti from 'canvas-confetti';

interface StickerMakerModalProps {
  currentTime: number;
  isOpen: boolean;
  onClose: () => void;
}

export const StickerMakerModal: React.FC<StickerMakerModalProps> = ({
  currentTime,
  isOpen,
  onClose,
}) => {
  const currentScene = currentTime < 3 ? SCENES[0] : currentTime < 6 ? SCENES[1] : SCENES[2];
  const [caption, setCaption] = useState('Queen of my heart! 👑💕');
  const [frameStyle, setFrameStyle] = useState<'sticker' | 'polaroid' | 'sparkle' | 'clean'>('sticker');
  const [selectedSticker, setSelectedSticker] = useState<string>('💖');
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      // Draw to a real canvas and download
      const canvas = document.createElement('canvas');
      const width = 720;
      const height = 1280;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#ffe5ec');
      grad.addColorStop(0.5, '#ffccd5');
      grad.addColorStop(1, '#fde2e4');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Load active scene image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = currentScene.imageSrc;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      if (frameStyle === 'sticker') {
        // Draw white sticker contour
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(255, 133, 161, 0.45)';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.roundRect(40, 40, width - 80, height - 80, 40);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Clip and draw image
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(55, 55, width - 110, height - 170, 32);
        ctx.clip();
        ctx.drawImage(img, 55, 55, width - 110, height - 170);
        ctx.restore();

        // Sticker banner text
        ctx.font = 'bold 36px "Fredoka", sans-serif';
        ctx.fillStyle = '#ff4d6d';
        ctx.textAlign = 'center';
        ctx.fillText(caption, width / 2, height - 75);
      } else if (frameStyle === 'polaroid') {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 25;
        ctx.fillRect(50, 60, width - 100, height - 140);
        ctx.shadowBlur = 0;

        ctx.drawImage(img, 75, 85, width - 150, height - 320);

        ctx.font = '34px "Comfortaa", cursive';
        ctx.fillStyle = '#4a044e';
        ctx.textAlign = 'center';
        ctx.fillText(caption, width / 2, height - 130);
      } else {
        ctx.drawImage(img, 0, 0, width, height);

        // Watermark badge
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.roundRect(width / 2 - 250, height - 130, 500, 70, 35);
        ctx.fill();

        ctx.font = 'bold 32px "Fredoka", sans-serif';
        ctx.fillStyle = '#d90429';
        ctx.textAlign = 'center';
        ctx.fillText(caption, width / 2, height - 82);
      }

      // Convert to blob and download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `chibi-sticker-${Date.now()}.png`;
      a.click();

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ff70a6', '#ff9770', '#ffd670', '#e9ff70', '#70d6ff'],
      });
    } catch (err) {
      console.error('Failed to export sticker card:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const presetCaptions = [
    'Queen of my heart! 👑💕',
    'Hmph! You are forgiven~ 💢➡️💖',
    'Best Chibi Couple Forever! ✨',
    'A sweet apology surprise 🎁🥰',
    'I love you 3000! 🌸',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border-4 border-pink-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight">
                Chibi Sticker Card Studio
              </h3>
              <p className="text-xs text-pink-500 font-medium">
                Captured at {currentTime.toFixed(1)}s ({currentScene.name})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto py-4 space-y-4 pr-1">
          {/* Card Preview */}
          <div className="flex justify-center">
            <div
              ref={cardRef}
              className={`relative w-48 aspect-[9/16] rounded-2xl overflow-hidden transition-all duration-300 shadow-lg ${
                frameStyle === 'sticker'
                  ? 'p-2 bg-white ring-4 ring-pink-200 shadow-pink-200/50'
                  : frameStyle === 'polaroid'
                  ? 'p-2.5 pb-8 bg-white shadow-xl'
                  : 'bg-stone-900 ring-1 ring-white/10'
              }`}
            >
              <img
                src={currentScene.imageSrc}
                alt="Chibi scene frame"
                className="w-full h-full object-cover rounded-xl"
              />
              {/* Overlay sticker / text in preview */}
              <div className="absolute bottom-2 inset-x-2 text-center pointer-events-none">
                <span className="bg-white/90 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm truncate max-w-full inline-block">
                  {caption}
                </span>
              </div>
            </div>
          </div>

          {/* Border Frame Styles */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Select Frame Style:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFrameStyle('sticker')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  frameStyle === 'sticker'
                    ? 'bg-pink-500 text-white border-pink-500 shadow-sm'
                    : 'bg-pink-50 text-pink-800 border-pink-200 hover:bg-pink-100'
                }`}
              >
                Die-Cut Sticker
              </button>
              <button
                onClick={() => setFrameStyle('polaroid')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  frameStyle === 'polaroid'
                    ? 'bg-pink-500 text-white border-pink-500 shadow-sm'
                    : 'bg-pink-50 text-pink-800 border-pink-200 hover:bg-pink-100'
                }`}
              >
                Polaroid Love
              </button>
              <button
                onClick={() => setFrameStyle('clean')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  frameStyle === 'clean'
                    ? 'bg-pink-500 text-white border-pink-500 shadow-sm'
                    : 'bg-pink-50 text-pink-800 border-pink-200 hover:bg-pink-100'
                }`}
              >
                Full Poster
              </button>
            </div>
          </div>

          {/* Custom Caption input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-pink-500" />
              Custom Caption:
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={40}
              className="w-full px-3 py-2 text-sm rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/30"
              placeholder="Write your sweet caption..."
            />

            {/* Quick Caption Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {presetCaptions.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setCaption(p)}
                  className="text-[11px] font-medium bg-pink-50 text-pink-700 hover:bg-pink-100 px-2 py-0.5 rounded-full border border-pink-200 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-pink-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white shadow-md shadow-pink-300/50 flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating PNG...' : 'Download Sticker Card'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
