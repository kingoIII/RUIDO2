import React, { useState, useEffect } from 'react';

const WORDS = [
  { text: 'ήχος', lang: 'Greek' },
  { text: 'צליλ', lang: 'Hebrew' },
  { text: 'קלא', lang: 'Aramaic' },
  { text: 'Sonus', lang: 'Latin' },
  { text: 'صوت', lang: 'Arabic' },
  { text: 'Klang', lang: 'German' },
  { text: 'Sonido', lang: 'Spanish' },
  { text: 'RUIDO', lang: 'Final' }
];

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (index < WORDS.length - 1) {
      const timer = setTimeout(() => {
        setIndex(prev => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onComplete, 1000);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [index, onComplete]);

  return (
    <div
      onClick={() => { setIsExiting(true); setTimeout(onComplete, 300); }}
      className={`fixed inset-0 z-[1000 bg-[#030303] flex items-center justify-center transition-opacity duration-500 p-4 sm:p-6 overflow-hidden ${isExiting ? 'opacity-0' : 'opacity-100'}`}
      role="button"
      aria-label="Skip splash"
    >
      <div className="relative preserve-3d w-full flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[140vw] h-[140vh] md:w-[200vw] md:h-[200vh] -translate-y-8 rounded-full blur-[160px] bg-cyan-500/14 transform scale-105 animate-pulse" />
        </div>

        <div key={index} className="animate-splash text-center w-full max-w-[99vw] max-h-[96vh] flex flex-col items-center justify-center overflow-hidden px-4">
          <h1 className="font-display font-black tracking-tighter transition-all duration-300 text-white leading-tight whitespace-normal break-words text-center"
            style={{ fontSize: WORDS[index].lang === 'Final' ? 'clamp(5rem, 20vw, 18rem)' : 'clamp(4rem, 14vw, 12rem)' }}
          >
            {WORDS[index].text}
          </h1>
          <p className="mt-8 text-cyan-400/90 font-black tracking-[0.3em] uppercase text-lg">
            {WORDS[index].lang !== 'Final' ? WORDS[index].lang : 'Automated Artifact Registry'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
