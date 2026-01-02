import React from 'react';
import { SoundPack } from '../types';
import { Package, Crown, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface SoundPackCardProps {
  pack: SoundPack;
  onClick: (pack: SoundPack) => void;
}

const SoundPackCard: React.FC<SoundPackCardProps> = ({ pack, onClick }) => {
  return (
    <div 
      onClick={() => onClick(pack)}
      className="group relative w-72 sm:w-80 h-[360px] sm:h-[420px] shrink-0 glass rounded-[48px] overflow-hidden card-3d preserve-3d mx-6 cursor-pointer border border-white/5 hover:border-cyan-500/30 transition-all duration-700"
    >
      <img 
        src={pack.coverImage} 
        alt={pack.title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-50 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      
      <div className="absolute top-10 right-10">
        <div className="w-14 h-14 bg-cyan-500 rounded-[24px] flex items-center justify-center text-black shadow-2xl group-hover:scale-110 group-hover:rotate-45 transition-all duration-500">
          <ArrowUpRight size={28} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-10 translate-z-20">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-4 py-1.5 rounded-full bg-cyan-500/20 text-[9px] font-black uppercase tracking-[0.4em] text-cyan-400 border border-cyan-400/30 flex items-center gap-2">
            <ShieldCheck size={12} />
            Exclusive Artifact
          </span>
        </div>
        
        <h3 className="font-display font-black text-4xl text-white mb-2 group-hover:text-cyan-400 transition-colors uppercase italic tracking-tighter leading-none">
          {pack.title}
        </h3>
        <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em] mb-6">
          By Artisans of {pack.producerName}
        </p>
        
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 text-white/50 group-hover:text-white transition-colors">
            <Package size={18} className="text-cyan-500/50" />
            <span className="text-xs font-black uppercase tracking-widest">{pack.sampleCount} Limited Relics</span>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};

export default SoundPackCard;
