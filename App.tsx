
import React, { useState, useEffect, useRef } from 'react';
import { Search, Volume2, Sparkles, LayoutGrid, User, Package, ChevronDown, X, ArrowLeft, Crown, ShoppingBag, Terminal, Activity, ShieldCheck, Cpu, Zap, LogOut } from 'lucide-react';
import { SAMPLES as INITIAL_SAMPLES, PRODUCERS, SOUND_PACKS } from './constants';
import { Sample, SoundPack, Producer, AppView, UserState } from './types';
import SampleCard from './components/SampleCard';
import ProducerCard from './components/ProducerCard';
import ChatSidebar from './components/ChatSidebar';
import SplashScreen from './components/SplashScreen';
import SoundPackCard from './components/SoundPackCard';
import GenreExplosion from './components/GenreExplosion';
import MouseInteractiveBackground from './components/MouseInteractiveBackground';
import AudioVisualizer from './components/AudioVisualizer';
import OracleCore from './components/OracleCore';
import { auth, logout } from './firebase';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeView, setActiveView] = useState<AppView>('LANDING');
  const [samples, setSamples] = useState(INITIAL_SAMPLES);
  const [ownedSampleIds, setOwnedSampleIds] = useState<string[]>([]);
  const [currentSample, setCurrentSample] = useState<Sample | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<UserState | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role: 'Artist'
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const filteredSamples = samples.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.producerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handlePurchase = (sampleId: string) => {
    if (ownedSampleIds.includes(sampleId)) {
      setNotification("Artifact already secured.");
      return;
    }
    setSamples(prev => prev.map(s => {
      if (s.id === sampleId && s.licensesSold < s.maxLicenses) {
        setOwnedSampleIds(curr => [...curr, sampleId]);
        setNotification(`Registry Updated: Artifact ${sampleId} Secured.`);
        return { ...s, licensesSold: s.licensesSold + 1 };
      }
      return s;
    }));
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePlaySample = (sample: Sample) => {
    if (currentSample?.id === sample.id) {
      if (isPlaying) { 
        audioRef.current?.pause(); 
        setIsPlaying(false); 
      } else { 
        audioRef.current?.play(); 
        setIsPlaying(true); 
      }
    } else {
      setCurrentSample(sample);
      setIsPlaying(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setNotification("Disconnected from Registry.");
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    if (currentSample && audioRef.current) {
      audioRef.current.src = currentSample.audioUrl;
      // Handle the initial play call with user interaction
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  }, [currentSample]);

  if (showSplash) return <SplashScreen onComplete={() => setShowSplash(false)} />;

  return (
    <div className="min-h-screen pb-40 bg-[#030303] selection:bg-cyan-500/30 overflow-x-hidden text-white">
      <audio ref={audioRef} crossOrigin="anonymous" onEnded={() => setIsPlaying(false)} />
      <MouseInteractiveBackground />

      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-cyan-500 text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-full shadow-[0_0_30px_rgba(14,165,233,0.5)] flex items-center gap-3 animate-bounce">
          <Terminal size={14} /> {notification}
        </div>
      )}

      {/* Persistent Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActiveView('LANDING')}>
          <div className="w-11 h-11 accent-gradient rounded-xl flex items-center justify-center font-bold text-xl font-display shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">R</div>
          <h1 className="font-display text-2xl font-black tracking-tighter uppercase italic text-cyan-400">Ruido</h1>
        </div>

        <div className="flex items-center gap-8">
          <button 
            onClick={() => setActiveView('ORACLE_CORE')}
            className={`flex items-center gap-3 px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${
              activeView === 'ORACLE_CORE' ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20'
            }`}
          >
            <Cpu size={16} className={activeView === 'ORACLE_CORE' ? 'animate-spin' : ''} /> Enter Oracle
          </button>
          
          <div className="h-6 w-[1px] bg-white/10"></div>
          
          <button onClick={() => setActiveView('VAULT')} className={`p-2 transition-all relative ${activeView === 'VAULT' ? 'text-cyan-400' : 'text-white/40 hover:text-white'}`}>
            <ShoppingBag size={22} />
            {ownedSampleIds.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-black text-[8px] font-black flex items-center justify-center rounded-full border-2 border-black">{ownedSampleIds.length}</span>}
          </button>

          <button onClick={() => setActiveView('REGISTRY')} className={`p-2 transition-all ${activeView === 'REGISTRY' ? 'text-cyan-400' : 'text-white/40 hover:text-white'}`}>
             <LayoutGrid size={22} />
          </button>

          {user ? (
            <div className="flex items-center gap-4 px-4 py-1.5 glass rounded-full border-cyan-500/20">
               <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/80">{user.displayName}</span>
                  <button onClick={handleLogout} className="text-[7px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors flex items-center gap-1">
                    <LogOut size={8} /> Logout
                  </button>
               </div>
               <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-[12px] font-black text-black shadow-lg shadow-cyan-500/20">{user.displayName?.[0]}</div>
            </div>
          ) : (
            <button onClick={() => setActiveView('ORACLE_CORE')} className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Identity Not Sync'd</button>
          )}
        </div>
      </nav>

      {/* Dynamic View Engine */}
      <div className="pt-24 min-h-screen">
        {activeView === 'LANDING' && (
          <div className="animate-in">
             <header className="px-6 pt-32 pb-24 max-w-7xl mx-auto text-center">
                <div className="max-w-5xl mx-auto">
                   <div className="mb-10 inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.5em] text-white/30">
                      <ShieldCheck size={16} className="text-cyan-500" /> Secure Registry Active
                   </div>
                  <h2 className="font-display text-9xl md:text-[14rem] font-black leading-[0.7] tracking-tighter mb-20">
                    BEYOND <br />
                    <span className="text-transparent bg-clip-text accent-gradient italic">RARE.</span>
                  </h2>
                  <div className="flex flex-col md:flex-row justify-center gap-8">
                    <button 
                      onClick={() => setActiveView('ORACLE_CORE')}
                      className="px-14 py-7 bg-cyan-500 text-black font-black uppercase tracking-[0.5em] rounded-3xl text-sm shadow-[0_30px_70px_rgba(14,165,233,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-4"
                    >
                      <Cpu size={20} /> Manifest Intent
                    </button>
                    <button 
                      onClick={() => setActiveView('REGISTRY')}
                      className="px-14 py-7 glass border-white/10 text-white font-black uppercase tracking-[0.5em] rounded-3xl text-sm hover:bg-white/5 transition-all"
                    >
                      Browse Ledger
                    </button>
                  </div>
                </div>
             </header>

             <div className="mt-32 overflow-hidden py-24 bg-black/40 border-y border-white/5">
                <div className="flex animate-marquee gap-12">
                  {[...SOUND_PACKS, ...SOUND_PACKS].map((pack, i) => (
                    <div key={i} className="w-80 shrink-0 cursor-pointer" onClick={() => { setActiveView('REGISTRY'); }}>
                       <SoundPackCard pack={pack} onClick={() => {}} />
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}

        {activeView === 'ORACLE_CORE' && (
          <OracleCore 
            user={user} 
            setUser={setUser} 
            onSelectSample={(s) => {
              handlePlaySample(s);
            }}
            onViewChange={(v) => setActiveView(v)}
          />
        )}

        {activeView === 'VAULT' && (
          <div className="px-10 max-w-7xl mx-auto animate-in py-24">
            <div className="flex items-center gap-6 mb-16">
               <div className="w-20 h-20 bg-cyan-500/10 border border-cyan-500/30 rounded-[32px] flex items-center justify-center shadow-xl shadow-cyan-500/5">
                  <ShoppingBag size={36} className="text-cyan-400" />
               </div>
               <div>
                 <h2 className="font-display text-7xl font-black text-white tracking-tighter uppercase italic">Secure Vault</h2>
                 <p className="text-[11px] uppercase tracking-[0.5em] text-white/30 font-black mt-2">Ownership Registry: {ownedSampleIds.length} ARTIFACTS</p>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {samples.filter(s => ownedSampleIds.includes(s.id)).map(s => (
                <SampleCard key={s.id} sample={s} isOwned={true} onPlay={handlePlaySample} isPlaying={currentSample?.id === s.id && isPlaying} onPurchase={() => {}} />
              ))}
              {ownedSampleIds.length === 0 && (
                <div className="col-span-full py-56 text-center glass rounded-[80px] border-dashed border-white/10">
                   <Package size={64} className="mx-auto text-white/5 mb-8" />
                   <h4 className="text-white font-black text-3xl mb-4 uppercase italic tracking-tighter">Vault Empty</h4>
                   <p className="text-white/20 uppercase font-black tracking-widest text-sm max-w-xs mx-auto mb-12 leading-relaxed">Describe your project to the Oracle to begin acquisition.</p>
                   <button onClick={() => setActiveView('ORACLE_CORE')} className="px-12 py-5 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-2xl text-xs hover:scale-105 transition-all">Summon Oracle</button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'REGISTRY' && (
          <div className="px-10 max-w-7xl mx-auto animate-in py-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-24 pb-12 border-b border-white/5">
               <div>
                 <h2 className="font-display text-7xl font-black uppercase italic tracking-tighter">Market Ledger</h2>
                 <p className="text-[11px] uppercase tracking-[0.5em] text-white/30 font-black mt-3">Scanning {filteredSamples.length} High-Liquidity Artifacts</p>
               </div>
               <div className="relative w-full md:w-[450px]">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search artifacts by frequency..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-6 pl-16 pr-6 text-base focus:border-cyan-500/50 outline-none font-bold placeholder:text-white/10 transition-all shadow-inner"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {filteredSamples.map(s => (
                <SampleCard 
                  key={s.id} 
                  sample={s} 
                  isOwned={ownedSampleIds.includes(s.id)} 
                  onPlay={handlePlaySample} 
                  isPlaying={currentSample?.id === s.id && isPlaying} 
                  onPurchase={handlePurchase} 
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Global Player Overlay */}
      {currentSample && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl glass p-8 rounded-[50px] shadow-[0_80px_160px_rgba(0,0,0,0.95)] flex items-center gap-10 z-[60] border border-white/10 animate-in hover:border-cyan-500/30 transition-all duration-700">
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <AudioVisualizer isPlaying={isPlaying} color="#0ea5e9" audioElement={audioRef.current} />
          </div>
          <div className="w-20 h-20 accent-gradient rounded-3xl flex items-center justify-center shrink-0 z-10 shadow-2xl relative overflow-hidden group/p">
             <Volume2 className="group-hover/p:scale-125 transition-transform duration-500" />
             <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
          <div className="flex-1 z-10 min-w-0">
            <h4 className="font-display font-bold text-3xl uppercase tracking-tighter truncate italic">{currentSample.title}</h4>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-[11px] text-cyan-500 font-black uppercase tracking-[0.4em]">{currentSample.producerName}</p>
              <span className="w-1.5 h-1.5 rounded-full bg-white/10"></span>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">{currentSample.maxLicenses - currentSample.licensesSold} Rarity Units Left</p>
            </div>
          </div>
          <div className="flex items-center gap-8 z-10">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-90 transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              {isPlaying ? <div className="flex gap-2.5"><div className="w-2.5 h-8 bg-black rounded-full"></div><div className="w-2.5 h-8 bg-black rounded-full"></div></div> : <Zap size={32} fill="black" className="ml-1" />}
            </button>
            <button onClick={() => setCurrentSample(null)} className="p-4 bg-white/5 rounded-2xl text-white/20 hover:text-white hover:bg-white/10 border border-white/10 transition-all"><X size={24} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
