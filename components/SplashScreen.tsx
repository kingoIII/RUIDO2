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
    <div className={`fixed inset-0 z-[100] bg-[#030303] flex items-center justify-center perspective-1000 transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative preserve-3d">
        <div className="absolute inset-0 bg-cyan-500/20 blur-[150px] rounded-full scale-150 animate-pulse"></div>
        
        <div key={index} className="animate-splash text-center">
          <h1 className={`font-display font-black tracking-tighter transition-all duration-500 ${
            WORDS[index].lang === 'Final' 
              ? 'text-8xl md:text-[12rem] text-white italic' 
              : 'text-7xl md:text-9xl text-white/90'
          }`}>
            {WORDS[index].text}
          </h1>
          <p className="mt-8 text-cyan-500/50 font-black tracking-[0.5em] uppercase text-sm">
            {WORDS[index].lang !== 'Final' ? WORDS[index].lang : 'Automated Artifact Registry'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
