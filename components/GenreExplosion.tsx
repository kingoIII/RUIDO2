import React from 'react';
import { X, Radio } from 'lucide-react';

interface GenreExplosionProps {
  onClose: () => void;
  onSelect: (genre: string) => void;
}

const GENRES = ['Techno', 'Neo-Soul', 'D&B', 'Lo-Fi', 'Industrial', 'Ambient', 'House', 'Phonk', 'Trap', 'Jazz'];

const GenreExplosion: React.FC<GenreExplosionProps> = ({ onClose, onSelect }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-[60px] flex items-center justify-center p-8 animate-in">
      <button 
        onClick={onClose}
        className="absolute top-12 right-12 w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:rotate-90 transition-all duration-500"
      >
        <X size={32} />
      </button>

      <div className="max-w-6xl w-full">
        <div className="flex flex-col items-center mb-20">
           <Radio size={48} className="text-cyan-500 mb-6 animate-pulse" />
           <h2 className="text-center font-display font-black text-5xl md:text-8xl text-white mb-4 tracking-tighter uppercase italic leading-none">
            Tune Frequency
          </h2>
          <p className="text-[12px] font-black uppercase tracking-[1em] text-white/20">Select Transmission Channel</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {GENRES.map((genre, idx) => (
            <button
              key={genre}
              onClick={() => onSelect(genre)}
              className="genre-explode px-10 py-5 md:px-14 md:py-8 glass rounded-[40px] font-display font-black text-2xl md:text-4xl text-white hover:bg-cyan-500 hover:text-black hover:scale-110 transition-all duration-300 shadow-2xl border border-white/10"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {genre}
            </button>
          ))}
          <button
              onClick={() => onSelect('All')}
              className="genre-explode px-10 py-5 md:px-14 md:py-8 bg-white text-black rounded-[40px] font-display font-black text-2xl md:text-4xl hover:bg-cyan-500 hover:scale-110 transition-all duration-300 shadow-2xl border-none"
              style={{ animationDelay: `${GENRES.length * 0.05}s` }}
            >
              Full Registry
            </button>
        </div>
      </div>
    </div>
  );
};

export default GenreExplosion;
