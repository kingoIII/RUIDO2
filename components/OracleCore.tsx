import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, Music, UserPlus, Upload, ShieldCheck, Mic, MicOff, RefreshCw, Terminal, Zap, ChevronRight, Activity, LogIn, Cpu } from 'lucide-react';
import { ChatMessage, Sample, Producer, AppView, UserState } from '../types';
import { getCreativeRecommendations } from '../services/geminiService';
import { SAMPLES } from '../constants';
import { signInWithGoogle } from '../firebase';

interface OracleCoreProps {
  user: UserState | null;
  setUser: (user: UserState | null) => void;
  onSelectSample: (sample: Sample) => void;
  onViewChange: (view: AppView) => void;
}

const OracleCore: React.FC<OracleCoreProps> = ({ user, setUser, onSelectSample, onViewChange }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Systems Synchronized. This is the Ruido Control Room. Tell me the frequency of your next production, and I'll extract the artifacts." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCommand = async (command: string, refreshId?: string) => {
    if (isLoading || (!command.trim() && !refreshId)) return;
    
    // Track what samples are currently visible to avoid duplicates during refresh
    let currentSampleIds: string[] = [];
    const lastAssistantMsgWithRecs = [...messages].reverse().find(m => m.role === 'assistant' && m.recommendations?.samples);
    if (lastAssistantMsgWithRecs?.recommendations?.samples) {
      currentSampleIds = lastAssistantMsgWithRecs.recommendations.samples;
    }

    if (!refreshId) {
      setMessages(prev => [...prev, { role: 'user', content: command }]);
    }
    
    setIsLoading(true);
    setInput('');

    try {
      const result = await getCreativeRecommendations(command || "Same project vibe", !!user, { 
        refreshId, 
        currentSamples: currentSampleIds 
      });
      
      if (result.uiTrigger === 'GOTO_VAULT') onViewChange('VAULT');
      if (result.uiTrigger === 'GOTO_REGISTRY') onViewChange('REGISTRY');
      if (result.uiTrigger === 'GOTO_AUTH') handleGoogleLogin();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.content,
        uiTrigger: result.uiTrigger,
        recommendations: {
          samples: result.recommendedSampleIds,
          producers: result.recommendedProducerIds
        }
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "The Oracle is experiencing interference. Please re-state your intent." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const firebaseUser = await signInWithGoogle();
    if (firebaseUser) {
      const userState: UserState = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        role: 'Artist'
      };
      setUser(userState);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Synchronization Complete. Welcome back, ${firebaseUser.displayName}. Your artifacts are accessible.`,
        uiTrigger: 'SUCCESS_STAMP'
      }]);
    }
  };

  const toggleMic = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice capture
      setTimeout(() => {
        setIsListening(false);
        const intents = ["I'm looking for high-end textures", "Show me dark drums", "What's new in the registry?"];
        handleCommand(intents[Math.floor(Math.random() * intents.length)]);
      }, 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[85vh] flex flex-col glass rounded-[60px] overflow-hidden border border-cyan-500/20 shadow-2xl relative animate-in">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-transparent to-black/60 pointer-events-none"></div>
      
      {/* Dynamic Header */}
      <div className="p-8 border-b border-white/5 bg-black/80 backdrop-blur-md flex items-center justify-between relative z-10">
         <div className="flex items-center gap-6">
            <div className="relative group">
               <div className="w-16 h-16 bg-cyan-500/10 rounded-3xl flex items-center justify-center border border-cyan-500/30 group-hover:bg-cyan-500 transition-all group-hover:text-black shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                  <Cpu className="animate-spin-slow" size={32} />
               </div>
               <div className="absolute inset-0 bg-cyan-400/20 blur-2xl group-hover:blur-3xl opacity-0 group-hover:opacity-100 transition-all"></div>
            </div>
            <div>
               <h3 className="font-display font-black text-3xl uppercase tracking-tighter italic text-white">Control Core</h3>
               <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.4em]">Integrated Intelligence Engine</p>
            </div>
         </div>

         <div className="flex items-center gap-4">
            {!user ? (
               <button 
                onClick={handleGoogleLogin}
                className="px-8 py-3.5 bg-cyan-500 text-black rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 hover:bg-white transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)]"
               >
                 <LogIn size={18} /> Sync Account
               </button>
            ) : (
               <div className="px-6 py-2.5 glass rounded-2xl border-cyan-500/30 flex items-center gap-3 shadow-lg">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400 italic">{user.displayName} Connected</span>
               </div>
            )}
         </div>
      </div>

      {/* Control Room Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar relative z-10">
         {messages.map((msg, idx) => (
           <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in`}>
              <div className={`max-w-[85%] p-8 rounded-[40px] text-xl font-medium leading-relaxed transition-all shadow-2xl ${
                msg.role === 'user' 
                  ? 'bg-cyan-600 text-white font-bold rounded-tr-none border border-cyan-400/50 shadow-cyan-900/40' 
                  : 'bg-white/[0.03] text-white/90 rounded-tl-none border border-white/10 backdrop-blur-sm'
              }`}>
                {msg.content}
              </div>

              {msg.recommendations?.samples && (
                <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 gap-8 animate-in">
                   {msg.recommendations.samples.map(id => {
                     const s = SAMPLES.find(item => item.id === id);
                     if (!s) return null;
                     return (
                       <div key={id} className="glass p-8 rounded-[48px] border-white/10 hover:border-cyan-500/50 transition-all group flex items-center justify-between relative overflow-hidden">
                          <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="flex items-center gap-6 cursor-pointer flex-1 relative z-10" onClick={() => onSelectSample(s)}>
                             <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all shadow-inner border border-cyan-500/20">
                                <Music size={32} />
                             </div>
                             <div>
                                <p className="font-display font-black text-2xl text-white uppercase tracking-tighter italic mb-1 group-hover:text-cyan-400 transition-colors">{s.title}</p>
                                <div className="flex items-center gap-3">
                                  <p className="text-[11px] text-white/40 uppercase tracking-[0.3em] font-black">{s.genre} / {s.bpm} BPM</p>
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/30"></span>
                                  <p className="text-[11px] text-cyan-500/80 uppercase tracking-widest font-black italic">Ref: UNIT-{id.toUpperCase()}</p>
                                </div>
                             </div>
                          </div>
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleCommand(`Replace specific sample ID: ${id}. Find a new artifact with a similar but distinct frequency profile.`, id); 
                            }}
                            className="p-6 bg-white/5 rounded-3xl text-white/20 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all group-hover:scale-105 relative z-10 border border-transparent hover:border-cyan-500/30"
                            title="Replace Recommendation"
                          >
                            <RefreshCw size={26} className={isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'} />
                          </button>
                       </div>
                     );
                   })}
                </div>
              )}

              {msg.uiTrigger === 'SUCCESS_STAMP' && (
                 <div className="mt-6 flex items-center gap-3 text-cyan-400 text-[12px] font-black uppercase tracking-[0.5em] bg-cyan-500/10 px-8 py-3.5 rounded-full border border-cyan-500/30 shadow-lg animate-pulse italic">
                    <ShieldCheck size={18} /> Identity Verified // Ledger Synced
                 </div>
              )}
           </div>
         ))}
         {isLoading && (
           <div className="flex items-center gap-6 text-cyan-400 text-[12px] font-black uppercase tracking-[0.6em] p-8 bg-cyan-500/5 rounded-3xl border border-cyan-500/20 w-fit ml-6 animate-in">
              <Loader2 className="animate-spin" size={20} /> ORACLE IS CALIBRATING...
           </div>
         )}
      </div>

      {/* System Input Area */}
      <div className="p-10 border-t border-white/5 bg-black/90 backdrop-blur-3xl relative z-10">
         <div className="flex items-center gap-8">
            <div className="relative flex-1 group">
               <div className="absolute inset-0 bg-cyan-500/5 blur-[50px] group-focus-within:bg-cyan-500/10 transition-all"></div>
               <Terminal className="absolute left-8 top-1/2 -translate-y-1/2 text-cyan-500/40" size={28} />
               <input 
                 value={input}
                 onChange={e => setInput(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleCommand(input)}
                 placeholder="Input sonic parameters..."
                 className="w-full bg-white/[0.02] border border-white/10 rounded-[40px] py-10 pl-20 pr-28 text-2xl focus:border-cyan-500/60 outline-none font-bold italic transition-all placeholder:text-white/10 shadow-inner group-focus-within:bg-white/[0.04]"
               />
               <button 
                 onClick={() => handleCommand(input)}
                 disabled={isLoading || !input.trim()}
                 className="absolute right-6 top-1/2 -translate-y-1/2 p-6 bg-cyan-500 rounded-3xl text-black hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 transition-all shadow-[0_0_40px_rgba(6,182,212,0.4)]"
               >
                 <Send size={32} />
               </button>
            </div>
            <button 
              onClick={toggleMic}
              className={`p-10 rounded-[40px] transition-all shadow-2xl border-2 ${
                isListening ? 'bg-red-500 border-red-400 animate-pulse text-white shadow-red-500/40' : 'bg-white/5 border-white/10 text-white/20 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-white/10'
              }`}
            >
               {isListening ? <Mic size={36} /> : <MicOff size={36} />}
            </button>
         </div>
         <div className="mt-10 flex justify-center gap-12">
            {["I need cinematic atmospheres", "Registry Scanner", "Firebase Login"].map(suggestion => (
               <button 
                key={suggestion}
                onClick={() => suggestion === "Firebase Login" ? handleGoogleLogin() : handleCommand(suggestion)}
                className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-cyan-400 transition-all flex items-center gap-3 group"
               >
                  <ChevronRight size={16} className="text-cyan-500/40 group-hover:translate-x-1 transition-transform" /> {suggestion}
               </button>
            ))}
         </div>
      </div>
    </div>
  );
};

export default OracleCore;