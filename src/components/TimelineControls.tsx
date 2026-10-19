import React from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Repeat, MessageSquare, Sparkles, Music, Video, Info } from 'lucide-react';
import { SCENES } from '../data/scenes';

interface TimelineControlsProps {
  currentTime: number;
  isPlaying: boolean;
  playbackSpeed: number;
  loop: boolean;
  showSubtitles: boolean;
  showStickerBorder: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onStepFrame: (direction: 'prev' | 'next') => void;
  onSpeedChange: (speed: number) => void;
  onToggleLoop: () => void;
  onToggleSubtitles: () => void;
  onToggleStickerBorder: () => void;
  onToggleBgm: () => void;
  isBgmActive: boolean;
  onOpenRecorder: () => void;
  onOpenLore: () => void;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  currentTime,
  isPlaying,
  playbackSpeed,
  loop,
  showSubtitles,
  showStickerBorder,
  onPlayPause,
  onSeek,
  onStepFrame,
  onSpeedChange,
  onToggleLoop,
  onToggleSubtitles,
  onToggleStickerBorder,
  onToggleBgm,
  isBgmActive,
  onOpenRecorder,
  onOpenLore,
}) => {
  const TOTAL_DURATION = 10.0;
  const FPS = 24;
  const currentFrame = Math.min(240, Math.max(1, Math.floor(currentTime * FPS) + 1));

  const speeds = [0.5, 1.0, 1.5, 2.0];

  return (
    <div className="w-full max-w-xl mx-auto bg-white/90 backdrop-blur-md border-2 border-pink-100 rounded-3xl p-4 sm:p-5 shadow-xl shadow-pink-100/60 mt-4 space-y-4">
      {/* Scene Quick Switcher Badges */}
      <div className="grid grid-cols-3 gap-2">
        {SCENES.map((scene) => {
          const isActive = currentTime >= scene.startTime && currentTime < scene.endTime;
          return (
            <button
              key={scene.id}
              onClick={() => onSeek(scene.startTime)}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 text-left border ${
                isActive
                  ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white border-pink-400 shadow-md shadow-pink-300/40 scale-[1.02]'
                  : 'bg-pink-50/60 hover:bg-pink-100/80 text-pink-900 border-pink-200/60'
              }`}
            >
              <span className="text-[10px] font-bold tracking-wider uppercase opacity-90">
                Scene {scene.id} ({scene.startTime}s - {scene.endTime}s)
              </span>
              <span className="text-xs font-semibold truncate w-full text-center">
                {scene.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scrubbing Bar & Timeline Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
              {currentTime.toFixed(2)}s
            </span>
            <span className="text-slate-400">/ 10.00s</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              Frame {currentFrame} / 240
            </span>
          </div>
        </div>

        {/* Custom Progress Bar with keyframe markers */}
        <div className="relative flex items-center group">
          <input
            type="range"
            min="0"
            max={TOTAL_DURATION}
            step="0.04166"
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full h-3 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:accent-pink-600 transition-all focus:outline-none"
          />

          {/* Keyframe tick marks */}
          <div
            className="absolute left-[30%] -top-1 w-2 h-5 bg-white border-2 border-pink-400 rounded-full pointer-events-none shadow"
            title="3.0s: Tap & Gift"
          />
          <div
            className="absolute left-[60%] -top-1 w-2 h-5 bg-white border-2 border-pink-400 rounded-full pointer-events-none shadow"
            title="6.0s: Queen Throne"
          />
        </div>
      </div>

      {/* Main Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-pink-100">
        {/* Play / Frame Step Controls */}
        <div className="flex items-center gap-2">
          {/* Rewind to 0 */}
          <button
            onClick={() => onSeek(0)}
            className="w-9 h-9 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 flex items-center justify-center transition-colors active:scale-95"
            title="Rewind to start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Step Back 1 Frame */}
          <button
            onClick={() => onStepFrame('prev')}
            className="w-9 h-9 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 flex items-center justify-center transition-colors active:scale-95"
            title="Step Back 1 Frame (24fps)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={onPlayPause}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white flex items-center justify-center shadow-lg shadow-pink-300/60 transition-transform active:scale-90"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white ml-0.5" />
            )}
          </button>

          {/* Step Forward 1 Frame */}
          <button
            onClick={() => onStepFrame('next')}
            className="w-9 h-9 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 flex items-center justify-center transition-colors active:scale-95"
            title="Step Forward 1 Frame (24fps)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Loop Toggle */}
          <button
            onClick={onToggleLoop}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-95 ${
              loop
                ? 'bg-pink-500 text-white shadow-sm'
                : 'bg-pink-50 text-pink-400 hover:bg-pink-100'
            }`}
            title={loop ? 'Looping Enabled' : 'Looping Disabled'}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-pink-50/80 p-1 rounded-xl border border-pink-100">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                playbackSpeed === s
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'text-pink-700 hover:bg-pink-100/60'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Feature Toggles (Subtitles, Sticker Border, BGM, Export, Lore) */}
        <div className="flex items-center gap-1.5">
          {/* Subtitles */}
          <button
            onClick={onToggleSubtitles}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors ${
              showSubtitles
                ? 'bg-pink-100 text-pink-800 border-pink-300'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle Subtitles"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Text</span>
          </button>

          {/* Sticker Border */}
          <button
            onClick={onToggleStickerBorder}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors ${
              showStickerBorder
                ? 'bg-pink-100 text-pink-800 border-pink-300'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle White Sticker Border"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sticker</span>
          </button>

          {/* Cute Music Toggle */}
          <button
            onClick={onToggleBgm}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors ${
              isBgmActive
                ? 'bg-pink-500 text-white border-pink-500 shadow-sm'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle Kawaii Lo-Fi Music"
          >
            <Music className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Music</span>
          </button>

          {/* Record Video Button */}
          <button
            onClick={onOpenRecorder}
            className="p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 transition-colors"
            title="Export 9:16 Video / Clip"
          >
            <Video className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Lore / Reference inspect */}
          <button
            onClick={onOpenLore}
            className="p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 transition-colors"
            title="View Characters & Scene Lore"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
