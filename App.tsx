import React, { useState, useEffect, useRef } from 'react';
import { Search, Volume2, LayoutGrid, ShoppingBag, Terminal, ShieldCheck, Cpu, Zap, LogOut, X, Package } from 'lucide-react';
import { SAMPLES as INITIAL_SAMPLES, SOUND_PACKS } from './constants';
import { Sample, AppView, UserState } from './types';
import SampleCard from './components/SampleCard';
import SplashScreen from './components/SplashScreen';
import SoundPackCard from './components/SoundPackCard';
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
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  }, [currentSample]);

  if (showSplash) return <SplashScreen onComplete={() => setShowSplash(false)} />;

  return (
    <div className="min-h-screen bg-[#030303] selection:bg-cyan-500/30 overflow-x-hidden text-white flex flex-col">
      <audio ref={audioRef} crossOrigin="anonymous" onEnded={() => setIsPlaying(false)} />
      <MouseInteractiveBackground />

      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-cyan-500 text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-full shadow-[0_0_30px_rgba(14,165,233,0.5)] flex items-center gap-3 animate-bounce">
          <Terminal size={14} /> {notification}
        </div>
      )}

      {/* Synchronized Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex justify-center">
        <div className="max-w-7xl w-full flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActiveView('LANDING')}>
            <div className="w-10 h-10 accent-gradient rounded-xl flex items-center justify-center font-bold text-xl font-display shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">R</div>
            <h1 className="font-display text-2xl font-black tracking-tighter uppercase italic text-white group-hover:text-cyan-400 transition-colors">Ruido</h1>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <button 
              onClick={() => setActiveView('ORACLE_CORE')}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${
                activeView === 'ORACLE_CORE' ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Cpu size={14} className={activeView === 'ORACLE_CORE' ? 'animate-spin' : ''} /> Enter Oracle
            </button>
            
            <div className="h-6 w-[1px] bg-white/10 hidden sm:block"></div>
            
            <div className="flex items-center gap-4 md:gap-6">
              <button onClick={() => setActiveView('VAULT')} className={`p-2 transition-all relative ${activeView === 'VAULT' ? 'text-cyan-400' : 'text-white/40 hover:text-white'}`}>
                <ShoppingBag size={20} />
                {ownedSampleIds.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-black text-[8px] font-black flex items-center justify-center rounded-full border border-black">{ownedSampleIds.length}</span>}
              </button>

              <button onClick={() => setActiveView('REGISTRY')} className={`p-2 transition-all ${activeView === 'REGISTRY' ? 'text-cyan-400' : 'text-white/40 hover:text-white'}`}>
                 <LayoutGrid size={20} />
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                 <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/80 leading-none">{user.displayName}</span>
                    <button onClick={handleLogout} className="text-[7px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors flex items-center gap-1 mt-1">
                      <LogOut size={8} /> Logout
                    </button>
                 </div>
                 <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-[11px] font-black text-black shadow-lg shadow-cyan-500/20">{user.displayName?.[0]}</div>
              </div>
            ) : (
              <button 
                onClick={() => setActiveView('ORACLE_CORE')} 
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white hover:border-white/20 transition-all whitespace-nowrap"
              >
                Identity Required
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Viewport Container */}
      <main className="flex-1 pt-24 pb-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {activeView === 'LANDING' && (
            <div className="animate-in pt-16 md:pt-32 min-h-[60vh] flex flex-col justify-center items-center">
               <div className="text-center max-w-6xl mx-auto px-4">
                   <div className="mb-12 inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500">
                      <ShieldCheck size={16} /> Secure Registry Active
                   </div>
                  <h2 className="font-display text-6xl sm:text-[6.5rem] md:text-[8rem] font-black leading-[0.9] tracking-tighter mb-12 uppercase max-w-[90vw] mx-auto">
            <div className="animate-in pt-16 md:pt-32">
               <div className="text-center">
                   <div className="mb-12 inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500">
                      <ShieldCheck size={16} /> Secure Registry Active
                   </div>
                  <h2 className="font-display text-7xl sm:text-9xl md:text-[12rem] font-black leading-[0.8] tracking-tighter mb-16 uppercase">
                    BEYOND <br />
                    <span className="text-transparent bg-clip-text accent-gradient italic">RARE.</span>
                  </h2>
                  <div className="flex flex-col sm:flex-row justify-center gap-6 md:gap-10">
                    <button 
                      onClick={() => setActiveView('ORACLE_CORE')}
                      className="px-12 py-6 bg-cyan-500 text-black font-black uppercase tracking-[0.4em] rounded-2xl text-xs shadow-[0_20px_50px_rgba(14,165,233,0.2)] hover:scale-105 transition-all flex items-center justify-center gap-3"
                    >
                      <Cpu size={18} /> Manifest Intent
                    </button>
                    <button 
                      onClick={() => setActiveView('REGISTRY')}
                      className="px-12 py-6 glass border-white/10 text-white font-black uppercase tracking-[0.4em] rounded-2xl text-xs hover:bg-white/5 transition-all"
                    >
                      Browse Ledger
                    </button>
                  </div>
               </div>

               <div className="mt-24 -mx-6 md:-mx-12 overflow-hidden py-12 md:py-24 bg-black/20 border-y border-white/5">
               <div className="mt-40 -mx-6 md:-mx-12 overflow-hidden py-24 bg-black/20 border-y border-white/5">
                  <div className="flex animate-marquee gap-10">
                    {[...SOUND_PACKS, ...SOUND_PACKS].map((pack, i) => (
                      <div key={i} className="w-80 shrink-0">
                         <SoundPackCard pack={pack} onClick={() => { setActiveView('REGISTRY'); }} />
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeView === 'ORACLE_CORE' && (
            <div className="animate-in pb-12">
              <OracleCore 
                user={user} 
                setUser={setUser} 
                onSelectSample={handlePlaySample}
                onViewChange={setActiveView}
              />
            </div>
          )}

          {activeView === 'VAULT' && (
            <div className="animate-in pt-12">
              <div className="flex flex-col md:flex-row md:items-end gap-6 mb-20 border-b border-white/5 pb-10">
                 <div className="w-20 h-20 bg-cyan-500/10 border border-cyan-500/30 rounded-3xl flex items-center justify-center">
                    <ShoppingBag size={36} className="text-cyan-400" />
                 </div>
                 <div>
                   <h2 className="font-display text-6xl font-black text-white tracking-tighter uppercase italic leading-none">The Vault</h2>
                   <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-black mt-4">Ownership Registry // {ownedSampleIds.length} ARTIFACTS</p>
                 </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {samples.filter(s => ownedSampleIds.includes(s.id)).map(s => (
                  <SampleCard key={s.id} sample={s} isOwned={true} onPlay={handlePlaySample} isPlaying={currentSample?.id === s.id && isPlaying} onPurchase={() => {}} />
                ))}
                {ownedSampleIds.length === 0 && (
                  <div className="col-span-full py-40 text-center glass rounded-[60px] border-dashed border-white/10">
                     <Package size={48} className="mx-auto text-white/5 mb-8" />
                     <h4 className="text-white font-black text-2xl mb-2 uppercase italic tracking-tighter">Vault Empty</h4>
                     <p className="text-white/20 uppercase font-black tracking-widest text-[10px] max-w-xs mx-auto mb-10">Secure artifact licenses through the Oracle to populate your registry.</p>
                     <button onClick={() => setActiveView('ORACLE_CORE')} className="px-10 py-4 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-xl text-[10px] hover:scale-105 transition-all">Summon Oracle</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeView === 'REGISTRY' && (
            <div className="animate-in pt-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-20 pb-10 border-b border-white/5">
                 <div>
                   <h2 className="font-display text-6xl font-black uppercase italic tracking-tighter leading-none">Ledger</h2>
                   <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-black mt-4">Scanning {filteredSamples.length} High-Yield Artifacts</p>
                 </div>
                 <div className="relative w-full md:w-[400px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search artifacts..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm focus:border-cyan-500/50 outline-none font-bold placeholder:text-white/10 transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </main>

      {/* Global Symmetrical Player */}
      {currentSample && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl glass p-6 md:p-8 rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex items-center gap-6 md:gap-10 z-[60] border border-white/10 animate-in">
          <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden rounded-[40px]">
            <AudioVisualizer isPlaying={isPlaying} color="#0ea5e9" audioElement={audioRef.current} />
          </div>
          <div className="w-16 h-16 md:w-20 md:h-20 accent-gradient rounded-2xl flex items-center justify-center shrink-0 z-10 shadow-xl relative overflow-hidden group/p">
             <Volume2 className="group-hover/p:scale-110 transition-transform duration-300" size={28} />
          </div>
          <div className="flex-1 z-10 min-w-0">
            <h4 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-tighter truncate italic leading-tight">{currentSample.title}</h4>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.3em]">{currentSample.producerName}</p>
              <span className="w-1 h-1 rounded-full bg-white/10"></span>
              <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">{currentSample.maxLicenses - currentSample.licensesSold} Rarity Units Left</p>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-8 z-10">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              {isPlaying ? <div className="flex gap-1.5"><div className="w-2 h-7 bg-black rounded-full"></div><div className="w-2 h-7 bg-black rounded-full"></div></div> : <Zap size={28} fill="black" className="ml-1" />}
            </button>
            <button onClick={() => setCurrentSample(null)} className="p-4 bg-white/5 rounded-2xl text-white/20 hover:text-white hover:bg-white/10 border border-white/10 transition-all"><X size={20} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;