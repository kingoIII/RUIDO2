import React, { useState, useRef } from 'react';
import { Producer } from '../types';
import { Star, Music, Award } from 'lucide-react';

interface ProducerCardProps {
  producer: Producer;
  onClick?: () => void;
}

const ProducerCard: React.FC<ProducerCardProps> = ({ producer, onClick }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
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
      onClick={onClick}
      className="glass p-6 rounded-[32px] flex flex-col items-center gap-6 hover:bg-white/5 transition-all card-3d preserve-3d group cursor-pointer border border-white/5 hover:border-cyan-500/30"
      style={{
        transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
    >
      <div className="layer-z-40 preserve-3d relative">
        <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <img 
          src={producer.avatar} 
          alt={producer.name} 
          className="w-24 h-24 rounded-[32px] object-cover border-2 border-white/10 shadow-2xl group-hover:border-cyan-500/50 transition-all duration-500 group-hover:scale-105"
        />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black border border-white/10 rounded-xl flex items-center justify-center text-cyan-400 shadow-xl layer-z-50">
           <Award size={14} />
        </div>
      </div>
      
      <div className="flex-1 min-w-0 text-center layer-z-20 preserve-3d w-full">
        <h4 className="font-display font-black text-xl text-white group-hover:text-cyan-400 transition-colors uppercase italic tracking-tighter truncate">{producer.name}</h4>
        
        <div className="flex items-center justify-center gap-2 mt-2">
           <div className="flex items-center gap-1 text-cyan-500 text-[10px] font-black uppercase tracking-widest bg-cyan-500/5 px-3 py-1 rounded-full border border-cyan-500/10">
              <Star size={10} fill="currentColor" />
              <span>{producer.rating} SCOPE</span>
           </div>
        </div>

        <p className="text-white/30 text-[10px] mt-4 uppercase tracking-[0.2em] font-bold line-clamp-1 border-t border-white/5 pt-4">
          {producer.specialization.join(' // ')}
        </p>
        
        <div className="flex items-center justify-center gap-3 mt-4 text-[11px] text-white/60 group-hover:text-white transition-colors">
          <Music size={14} className="text-cyan-500/50" />
          <span className="font-black tracking-tighter uppercase">{producer.sampleCount} Artifacts in Registry</span>
        </div>
      </div>
    </div>
  );
};

export default ProducerCard;
