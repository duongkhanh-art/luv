import React from 'react';
import { X, Heart, Sparkles, Crown } from 'lucide-react';

interface CharacterLoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CharacterLoreModal: React.FC<CharacterLoreModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border-4 border-pink-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-pink-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight">
                Chibi Couple Profile & Lore
              </h3>
              <p className="text-xs text-pink-500 font-medium">
                Kawaii 2D Sticker Story
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
        <div className="overflow-y-auto py-4 space-y-4 pr-1 text-slate-700">
          {/* Couple Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* The Girl */}
            <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🐰</span>
                <div>
                  <h4 className="font-bold text-pink-900 text-sm">Chibi Princess</h4>
                  <span className="text-[10px] text-pink-600 font-semibold uppercase tracking-wider">
                    The Drama Queen
                  </span>
                </div>
              </div>
              <ul className="text-xs space-y-1 text-slate-600">
                <li>• <strong>Hair:</strong> Long wavy dark brown with white bunny clip</li>
                <li>• <strong>Outfit:</strong> Cozy cream oversized sweater & soft pink pants</li>
                <li>• <strong>Mood:</strong> Playful pouter, cheeks puffed, loves surprises</li>
                <li>• <strong>Special Move:</strong> Comical shoulder tap & royal throne smile</li>
              </ul>
            </div>

            {/* The Boy */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧸</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Hoodie Boy</h4>
                  <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">
                    The Sweetheart
                  </span>
                </div>
              </div>
              <ul className="text-xs space-y-1 text-slate-600">
                <li>• <strong>Hair:</strong> Messy dark brown hair</li>
                <li>• <strong>Outfit:</strong> Oversized black hoodie & black sweatpants</li>
                <li>• <strong>Mood:</strong> Nervous, sweaty, adoring, quick with apology gifts</li>
                <li>• <strong>Special Move:</strong> Pink ribbon surprise box & starry-eyed gaze</li>
              </ul>
            </div>
          </div>

          {/* Animation Timeline Breakdown */}
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>Storyboard Sequence (10s @ 24fps)</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex gap-2">
                <span className="font-mono font-bold text-rose-500 w-14 shrink-0">0s - 3s:</span>
                <span>The girl stands arms crossed, cheeks puffed, playful anger mark pulsing. The boy sits curled on the floor sweating nervously.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-mono font-bold text-pink-500 w-14 shrink-0">3s - 6s:</span>
                <span>Gentle comical tap on his shoulder! He squints sheepishly and presents a gift with pink ribbon. Her anger mark blossoms into a heart.</span>
              </div>
              <div className="flex gap-2">
                <span className="font-mono font-bold text-purple-500 w-14 shrink-0">6s - 10s:</span>
                <span>Girl crowned on her miniature throne like a proud queen. Boy sits beside her gazing lovingly with floating sakura petals and hearts.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-pink-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
