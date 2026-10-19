import React from 'react';
import { ChibiLoveVideo } from './components/ChibiLoveVideo';

export default function App() {
  const normalCoupleImage = '/src/assets/images/chibi_couple_normal_1792423303126.jpg';

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#ffe5ec] via-[#ffccd5]/50 to-[#fff0f3] flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden relative font-['Quicksand','Be_Vietnam_Pro',sans-serif]">
      {/* Subtle Dreamy Background Lights */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Focus: Pure 9:16 Vertical Animated Video Card */}
      <main className="w-full flex items-center justify-center relative z-10">
        <ChibiLoveVideo imageSrc={normalCoupleImage} />
      </main>
    </div>
  );
}
