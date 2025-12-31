import React, { useState, useRef } from 'react';
import { Sample } from '../types';
// Added missing Activity import from lucide-react to fix compilation error on line 61
import { Play, Pause, ShoppingCart, User, Crown, ShieldCheck, Hash, Download, Activity } from 'lucide-react';

interface SampleCardProps {
  sample: Sample;
  onPlay: (sample: Sample) => void;
  isPlaying: boolean;
  onPurchase: (sampleId: string) => void;
  isOwned?: boolean;
}

const SampleCard: React.FC<SampleCardProps> = ({ sample, onPlay, isPlaying, onPurchase, isOwned }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  const licensesLeft = sample.maxLicenses - sample.licensesSold;
  const isSoldOut = licensesLeft === 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`glass group relative p-8 rounded-[48px] card-3d preserve-3d transition-all duration-500 border border-white/5 ${isSoldOut && !isOwned ? 'opacity-40 grayscale' : 'opacity-100 hover:border-cyan-500/40 hover:bg-white/[0.04]'}`}
      style={{
        transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
    >
      {/* Unit Serial */}
      <div className="absolute top-8 right-8 text-white/10 group-hover:text-cyan-500/30 transition-colors font-black text-[10px] uppercase tracking-widest flex items-center gap-1">
         <Hash size={10} /> UNIT-R{sample.id.toUpperCase()}
      </div>

      <div className={`absolute -top-4 left-8 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl z-10 border layer-z-50 transition-all duration-500 ${
        isOwned 
          ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_20px_rgba(14,165,233,0.5)]'
          : isSoldOut 
            ? 'bg-zinc-900 border-zinc-700 text-zinc-500' 
            : 'bg-white/10 border-white/20 text-white/80 group-hover:bg-cyan-500 group-hover:text-black group-hover:border-cyan-400'
      }`}>
        <div className="flex items-center gap-2">
          {isOwned ? <ShieldCheck size={12} /> : isSoldOut ? <Crown size={12} /> : <Activity size={12} className="text-cyan-500 group-hover:text-black" />}
          {isOwned ? 'Artifact Secured' : isSoldOut ? 'Archive Sealed' : `${licensesLeft} Editions Remain`}
        </div>
      </div>

      <div className="flex flex-col gap-8 preserve-3d">
        <div className="flex items-center gap-6 preserve-3d">
          <button 
            onClick={() => onPlay(sample)}
            className={`w-20 h-20 rounded-[32px] flex items-center justify-center shadow-2xl transition-all duration-500 layer-z-40 relative overflow-hidden group/btn ${
              isPlaying 
                ? 'bg-white scale-110 shadow-white/20' 
                : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50'
            }`}
          >
            {isPlaying 
              ? <Pause className="w-8 h-8 fill-black text-black" /> 
              : <Play className="w-8 h-8 fill-white text-white ml-1 group-hover/btn:scale-125 transition-transform" />
            }
            <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>

          <div className="flex-1 min-w-0 layer-z-30 preserve-3d">
            <h3 className="font-display font-bold text-2xl tracking-tighter text-white group-hover:text-cyan-400 transition-colors truncate mb-1">
              {sample.title}
            </h3>
            <div className="flex items-center gap-3 text-white/40 text-[11px] mt-1 uppercase font-black tracking-widest">
              <User size={14} className="text-cyan-500/50" />
              <span className="truncate hover:text-white transition-colors cursor-pointer">
                {sample.producerName}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Ownership Tracker */}
        <div className="flex gap-1.5 items-center layer-z-20 preserve-3d">
           {[...Array(sample.maxLicenses)].map((_, i) => (
             <div key={i} className={`flex-1 h-2 rounded-full transition-all duration-700 ${
               i < sample.licensesSold 
                 ? (isOwned && i === sample.licensesSold - 1 ? 'bg-cyan-500 animate-pulse' : 'bg-white/10') 
                 : 'bg-cyan-500/40 border border-cyan-500/30'
             }`}></div>
           ))}
        </div>

        <div className="flex flex-wrap gap-3 layer-z-20 preserve-3d">
          <span className="px-3 py-1.5 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-white/50 border border-white/5">{sample.genre}</span>
          <span className="px-3 py-1.5 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-white/50 border border-white/5">{sample.bpm} BPM</span>
          <span className="px-3 py-1.5 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-white/50 border border-white/5">{sample.key}</span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-8 border-t border-white/5 layer-z-10 preserve-3d">
          <div className="preserve-3d">
            <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.4em] mb-2">Acquisition Unit</p>
            <p className="text-3xl font-display font-black text-white italic tracking-tighter">${sample.price}</p>
          </div>
          
          <button 
            disabled={isSoldOut && !isOwned}
            onClick={() => onPurchase(sample.id)}
            className={`flex items-center gap-4 px-8 py-4 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] transition-all layer-z-30 relative overflow-hidden group/buy shadow-2xl ${
              isOwned
                ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black'
                : isSoldOut 
                  ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800' 
                  : 'bg-white text-black hover:scale-105 active:scale-95 shadow-white/10'
            }`}
          >
            {isOwned ? <Download size={18} /> : <ShoppingCart size={18} />}
            {isOwned ? 'Download' : isSoldOut ? 'Archived' : 'Secure'}
            {!isOwned && !isSoldOut && <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover/buy:opacity-100 transition-opacity"></div>}
          </button>
        </div>
      </div>
      
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity layer-z-10 pointer-events-none"></div>
    </div>
  );
};

export default SampleCard;