import React, { useState, useRef, useEffect } from 'react';
import { X, Video, Download, Play, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { SCENES } from '../data/scenes';
import confetti from 'canvas-confetti';

interface VideoRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoRecorderModal: React.FC<VideoRecorderModalProps> = ({ isOpen, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Ready to render 9:16 24fps animation');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  const startRender = async () => {
    setIsRecording(true);
    setRecordProgress(0);
    setRecordedVideoUrl(null);
    setStatusMessage('Loading high-res chibi scene assets...');

    try {
      // Preload images
      const images: HTMLImageElement[] = [];
      for (const scene of SCENES) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = scene.imageSrc;
        await new Promise((res) => {
          img.onload = res;
        });
        images.push(img);
      }

      const canvas = document.createElement('canvas');
      canvas.width = 540; // 9:16 high quality export
      canvas.height = 960;
      canvasRef.current = canvas;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not create 2D canvas context');

      const stream = canvas.captureStream(24);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3000000 });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setIsRecording(false);
        setStatusMessage('Render complete! 10-second 24fps vertical video ready.');
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff758f', '#ffb3c1', '#fcd34d', '#38bdf8'],
        });
      };

      mediaRecorder.start();

      const TOTAL_FRAMES = 240; // 10 seconds * 24 fps
      let currentFrame = 0;

      const drawFrame = () => {
        if (currentFrame >= TOTAL_FRAMES) {
          mediaRecorder.stop();
          return;
        }

        const t = currentFrame / 24; // time in seconds
        setRecordProgress(Math.round((currentFrame / TOTAL_FRAMES) * 100));
        setStatusMessage(`Rendering 24fps frames: ${currentFrame + 1} / ${TOTAL_FRAMES} (${t.toFixed(1)}s)`);

        // Camera zoom push-in: 1.0 -> 1.12
        const zoom = 1.0 + (t / 10) * 0.12;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background pastel gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGrad.addColorStop(0, '#ffe5ec');
        bgGrad.addColorStop(0.5, '#ffccd5');
        bgGrad.addColorStop(1, '#fde2e4');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Apply camera zoom centered
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        // Draw active scene
        if (t < 3) {
          ctx.drawImage(images[0], 0, 0, canvas.width, canvas.height);

          // Pulsing anger mark
          const angerPulse = 1 + Math.sin(t * 12) * 0.15;
          ctx.save();
          ctx.translate(canvas.width * 0.8, canvas.height * 0.28);
          ctx.scale(angerPulse, angerPulse);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(-15, -10); ctx.lineTo(-15, 10);
          ctx.moveTo(15, -10); ctx.lineTo(15, 10);
          ctx.moveTo(-10, -15); ctx.lineTo(10, -15);
          ctx.moveTo(-10, 15); ctx.lineTo(10, 15);
          ctx.stroke();
          ctx.restore();

          // Dripping sweat drop
          const sweatY = (t * 60) % 25;
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(canvas.width * 0.23, canvas.height * 0.38 + sweatY, 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (t < 6) {
          ctx.drawImage(images[1], 0, 0, canvas.width, canvas.height);

          // Tap impact star (3.0s - 3.8s)
          if (t >= 3.0 && t <= 3.8) {
            ctx.save();
            ctx.translate(canvas.width * 0.48, canvas.height * 0.48);
            ctx.fillStyle = '#ffd166';
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // Floating heart transformed
          const heartY = canvas.height * 0.28 - Math.sin((t - 3) * 3) * 12;
          ctx.fillStyle = '#f43f5e';
          ctx.font = '24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('💖', canvas.width * 0.35, heartY);
        } else {
          ctx.drawImage(images[2], 0, 0, canvas.width, canvas.height);

          // Golden crown sparkles
          ctx.font = '22px sans-serif';
          ctx.fillText('✨', canvas.width * 0.36, canvas.height * 0.17);

          // Floating petals
          for (let i = 0; i < 8; i++) {
            const py = ((t * 40 + i * 90) % (canvas.height + 50)) - 25;
            const px = (i * 70 + Math.sin(t * 2 + i) * 20) % canvas.width;
            ctx.fillStyle = '#ffb3c1';
            ctx.beginPath();
            ctx.ellipse(px, py, 6, 10, t + i, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();

        // White sticker border simulation
        ctx.lineWidth = 12;
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

        currentFrame++;
        requestAnimationFrame(drawFrame);
      };

      drawFrame();
    } catch (err: unknown) {
      console.error(err);
      setIsRecording(false);
      setStatusMessage('Rendering error. Please retry.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-4 border-pink-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight">
                Export 9:16 Video Clip
              </h3>
              <p className="text-xs text-rose-500 font-medium">
                10-second 24 FPS Chibi Animation
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

        {/* Content */}
        <div className="py-5 space-y-4 text-center">
          {recordedVideoUrl ? (
            <div className="space-y-3">
              <div className="w-44 aspect-[9/16] mx-auto rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-black">
                <video
                  src={recordedVideoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Animation clip successfully rendered!</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-20 h-20 mx-auto rounded-full bg-pink-50 border-2 border-pink-200 flex items-center justify-center text-pink-500">
                <Sparkles className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">
                  Render 10s Video Animation
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  Exports the full 0-10s chibi animation (Pout ➔ Apology Gift ➔ Queen Throne) in 9:16 vertical format at 24fps.
                </p>
              </div>

              {isRecording && (
                <div className="space-y-1.5 pt-2">
                  <div className="w-full bg-pink-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-rose-400 h-full transition-all duration-100 rounded-full"
                      style={{ width: `${recordProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-pink-600 font-semibold">{statusMessage}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-pink-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          {recordedVideoUrl ? (
            <a
              href={recordedVideoUrl}
              download="chibi-sweetheart-animation-9x16.webm"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-200 flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download .webm Video</span>
            </a>
          ) : (
            <button
              onClick={startRender}
              disabled={isRecording}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-md shadow-rose-300/50 flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isRecording ? 'Rendering Video...' : 'Start Render (10s)'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
