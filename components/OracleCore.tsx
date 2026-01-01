import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Music, ShieldCheck, Mic, MicOff, RefreshCw, Terminal, ChevronRight, LogIn, Cpu } from 'lucide-react';
import { ChatMessage, Sample, AppView, UserState } from '../types';
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
    { role: 'assistant', content: "Protocol engaged. I am the Ruido Oracle. Describe your sonic parameters, and I will extract the required artifacts from the vault." }
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
      setMessages(prev => [...prev, { role: 'assistant', content: "Signal interference detected. Please re-establish sonic intent." }]);
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
        content: `Identity Synchronized. Welcome back, ${firebaseUser.displayName}.`,
        uiTrigger: 'SUCCESS_STAMP'
      }]);
    }
  };

  const toggleMic = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        const intents = ["I'm looking for high-end textures", "Show me dark drums", "What's new in the registry?"];
        handleCommand(intents[Math.floor(Math.random() * intents.length)]);
      }, 2000);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-200px)] min-h-[600px] flex flex-col glass rounded-[50px] overflow-hidden border border-white/5 shadow-2xl relative">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/5 via-transparent to-black/80 pointer-events-none"></div>
      
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-black/60 backdrop-blur-md flex items-center justify-between relative z-10">
         <div className="flex items-center gap-5">
            <div className="relative group">
               <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20 group-hover:bg-cyan-500 transition-all group-hover:text-black">
                  <Cpu className="animate-spin-slow" size={24} />
               </div>
            </div>
            <div>
               <h3 className="font-display font-black text-xl uppercase tracking-tighter italic text-white">Oracle Core</h3>
               <p className="text-[9px] text-cyan-400/60 font-black uppercase tracking-[0.4em]">Integrated Processor V3.0</p>
            </div>
         </div>

         <div className="flex items-center gap-4">
            {!user ? (
               <button 
                onClick={handleGoogleLogin}
                className="px-6 py-2.5 bg-cyan-500 text-black rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
               >
                 <LogIn size={14} /> Sync Identity
               </button>
            ) : (
               <div className="px-5 py-2 glass rounded-xl border-cyan-500/20 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400 italic">Connected: {user.displayName}</span>
               </div>
            )}
         </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 no-scrollbar relative z-10">
         {messages.map((msg, idx) => (
           <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in`}>
              <div className={`max-w-[80%] p-6 rounded-[32px] text-lg font-medium leading-relaxed transition-all shadow-xl ${
                msg.role === 'user' 
                  ? 'bg-cyan-600 text-white font-bold rounded-tr-none border border-cyan-400/30' 
                  : 'bg-white/[0.02] text-white/80 rounded-tl-none border border-white/5 backdrop-blur-sm'
              }`}>
                {msg.content}
              </div>

              {msg.recommendations?.samples && (
                <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 gap-6 animate-in">
                   {msg.recommendations.samples.map(id => {
                     const s = SAMPLES.find(item => item.id === id);
                     if (!s) return null;
                     return (
                       <div key={id} className="glass p-6 rounded-[36px] border-white/5 hover:border-cyan-500/40 transition-all group flex items-center justify-between relative overflow-hidden">
                          <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="flex items-center gap-5 cursor-pointer flex-1 relative z-10" onClick={() => onSelectSample(s)}>
                             <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all border border-cyan-500/10">
                                <Music size={24} />
                             </div>
                             <div>
                                <p className="font-display font-black text-xl text-white uppercase tracking-tighter italic mb-0.5 group-hover:text-cyan-400 transition-colors">{s.title}</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-black">{s.genre} / {s.bpm} BPM</p>
                                  <span className="w-1 h-1 rounded-full bg-cyan-500/20"></span>
                                  <p className="text-[9px] text-cyan-500/60 uppercase tracking-widest font-black italic">R-{id.toUpperCase()}</p>
                                </div>
                             </div>
                          </div>
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleCommand(`Replace artifact ${id}. Extract alternative unit.`, id); 
                            }}
                            className="p-5 bg-white/5 rounded-2xl text-white/10 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all group-hover:scale-105 relative z-10 border border-transparent hover:border-cyan-500/20"
                          >
                            <RefreshCw size={18} className={isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
                          </button>
                       </div>
                     );
                   })}
                </div>
              )}

              {msg.uiTrigger === 'SUCCESS_STAMP' && (
                 <div className="mt-6 flex items-center gap-3 text-cyan-500 text-[10px] font-black uppercase tracking-[0.4em] bg-cyan-500/5 px-6 py-2.5 rounded-full border border-cyan-500/20 shadow-lg animate-pulse italic">
                    <ShieldCheck size={14} /> Artifact Connection Synchronized
                 </div>
              )}
           </div>
         ))}
         {isLoading && (
           <div className="flex items-center gap-4 text-cyan-500/60 text-[10px] font-black uppercase tracking-[0.4em] p-6 bg-cyan-500/5 rounded-2xl border border-cyan-500/10 w-fit ml-4 animate-in">
              <Loader2 className="animate-spin" size={16} /> Calibrating Frequencies...
           </div>
         )}
      </div>

      {/* Input Console */}
      <div className="p-8 border-t border-white/5 bg-black/80 backdrop-blur-xl relative z-10">
         <div className="flex items-center gap-6">
            <div className="relative flex-1 group">
               <div className="absolute inset-0 bg-cyan-500/5 blur-[40px] group-focus-within:bg-cyan-500/10 transition-all rounded-full"></div>
               <Terminal className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-500/30" size={20} />
               <input 
                 value={input}
                 onChange={e => setInput(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleCommand(input)}
                 placeholder="Input creative intention..."
                 className="w-full bg-white/[0.02] border border-white/10 rounded-full py-7 pl-16 pr-24 text-lg focus:border-cyan-500/40 outline-none font-bold italic transition-all placeholder:text-white/10 shadow-inner"
               />
               <button 
                 onClick={() => handleCommand(input)}
                 disabled={isLoading || !input.trim()}
                 className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-cyan-500 rounded-full text-black hover:scale-110 disabled:opacity-20 transition-all shadow-lg"
               >
                 <Send size={24} />
               </button>
            </div>
            <button 
              onClick={toggleMic}
              className={`p-7 rounded-full transition-all border-2 ${
                isListening ? 'bg-red-500 border-red-400 animate-pulse text-white' : 'bg-white/5 border-white/10 text-white/20 hover:text-cyan-400 hover:border-cyan-500/20'
              }`}
            >
               {isListening ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
         </div>
         <div className="mt-8 flex justify-center gap-10">
            {["I need dark textures", "Registry Status", "Sync Account"].map(suggestion => (
               <button 
                key={suggestion}
                onClick={() => suggestion === "Sync Account" ? handleGoogleLogin() : handleCommand(suggestion)}
                className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-cyan-400 transition-all flex items-center gap-2 group"
               >
                  <ChevronRight size={12} className="text-cyan-500/40 group-hover:translate-x-1 transition-transform" /> {suggestion}
               </button>
            ))}
         </div>
      </div>
    </div>
  );
};

export default OracleCore;