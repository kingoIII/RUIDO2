import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, X, Music, UserCheck, Upload, UserPlus, CheckCircle2, Mic, MicOff, Volume2, ShieldCheck } from 'lucide-react';
import { ChatMessage, Sample, Producer } from '../types';
import { getCreativeRecommendations } from '../services/geminiService';
import { SAMPLES, PRODUCERS } from '../constants';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string, role: string } | null;
  setUser: (user: { name: string, role: string } | null) => void;
  onSelectSample: (sample: Sample) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isOpen, onClose, user, setUser, onSelectSample }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: "Frequency established. I am the Ruido Oracle. Describe your sonic vision, or declare your intent to upload artifacts." 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (overrideText?: string) => {
    const userMsg = overrideText || input;
    if (!userMsg.trim() || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const result = await getCreativeRecommendations(userMsg, !!user);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.content,
        uiTrigger: result.uiTrigger,
        recommendations: {
          samples: result.recommendedSampleIds,
          producers: result.recommendedProducerIds
        }
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Channel instability detected. Re-initialize your request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMic = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        const intents = ["I want to upload", "Show me some futuristic techno", "Give me some dusty hip hop loops"];
        handleSend(intents[Math.floor(Math.random() * intents.length)]);
      }, 2500);
    }
  };

  const simulateAuth = (name: string) => {
    setUser({ name, role: 'Verified Producer' });
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: `Authentication successful. Artist '${name}' manifested. Your secure vault is now open for artifact staging.`,
      uiTrigger: 'SUCCESS_STAMP'
    }]);
  };

  const simulateUpload = (title: string) => {
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: `Transmission complete. '${title}' is now locked into the registry with a 5-unit hard cap.`,
      uiTrigger: 'SUCCESS_STAMP'
    }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-full md:w-[500px] glass border-l border-white/10 z-50 flex flex-col shadow-2xl animate-in">
      <div className="p-8 border-b border-white/10 flex items-center justify-between bg-black/60 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
             <Sparkles className="w-8 h-8 text-cyan-500 animate-pulse" />
             <div className="absolute inset-0 bg-cyan-500/30 blur-2xl rounded-full"></div>
          </div>
          <div>
            <h2 className="font-display font-black uppercase tracking-[0.3em] text-base text-white">Ruido Oracle</h2>
            <p className="text-[10px] text-cyan-500/60 font-black uppercase tracking-[0.2em]">Collective Consciousness V3.1</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          {user && (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
               <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Authenticated</span>
            </div>
          )}
          <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-white/40 hover:text-white border border-white/10 group">
            <X size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar pb-16">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} group animate-in`}>
            <div className={`max-w-[88%] p-6 rounded-[32px] text-sm leading-relaxed font-medium transition-all ${
              msg.role === 'user' 
                ? 'bg-cyan-600 text-white font-bold rounded-tr-none shadow-2xl shadow-cyan-900/40 border border-cyan-400/30' 
                : 'bg-white/5 text-white/90 rounded-tl-none border border-white/10 group-hover:bg-white/[0.08]'
            }`}>
              {msg.content}
            </div>

            {msg.uiTrigger === 'SIGN_ON' && (
              <div className="mt-6 w-full p-10 glass rounded-[50px] border-cyan-500/20 animate-in">
                <div className="flex items-center gap-5 mb-8">
                   <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center text-black shadow-[0_0_40px_rgba(14,165,233,0.4)]">
                     <UserPlus size={28} />
                   </div>
                   <div>
                     <h3 className="font-display font-black text-white uppercase tracking-tighter text-2xl italic">Initialize Alias</h3>
                     <p className="text-[11px] text-white/40 uppercase font-black tracking-widest">Entry into the Collective</p>
                   </div>
                </div>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Manifest Name..." 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-lg focus:border-cyan-500 outline-none mb-6 font-bold transition-all placeholder:text-white/10 shadow-inner"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') simulateAuth((e.target as HTMLInputElement).value);
                  }}
                />
                <button 
                  onClick={() => simulateAuth((document.querySelector('input') as HTMLInputElement).value || "Anon")}
                  className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] rounded-2xl text-[12px] hover:scale-[1.03] active:scale-95 transition-all shadow-2xl"
                >
                  Confirm Identity
                </button>
              </div>
            )}

            {msg.uiTrigger === 'UPLOAD_FORM' && (
              <div className="mt-6 w-full p-10 glass rounded-[50px] border-blue-500/20 animate-in">
                <div className="flex items-center gap-5 mb-8">
                   <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_40px_rgba(37,99,235,0.4)]">
                     <Upload size={28} />
                   </div>
                   <div>
                     <h3 className="font-display font-black text-white uppercase tracking-tighter text-2xl italic">Stage Artifact</h3>
                     <p className="text-[11px] text-white/40 uppercase font-black tracking-widest">Secure Ledger Entry</p>
                   </div>
                </div>
                <div className="space-y-5">
                  <input type="text" placeholder="Artifact Designation..." className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-base focus:border-blue-500 outline-none font-bold placeholder:text-white/10" />
                  <div className="grid grid-cols-2 gap-5">
                    <input type="text" placeholder="BPM" className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-base focus:border-blue-500 outline-none font-bold placeholder:text-white/10" />
                    <input type="text" placeholder="KEY" className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-base focus:border-blue-500 outline-none font-bold placeholder:text-white/10" />
                  </div>
                  <div className="p-8 border border-dashed border-white/10 rounded-3xl text-center hover:bg-white/5 transition-colors cursor-pointer group">
                    <Music className="mx-auto text-white/20 mb-3 group-hover:text-blue-500 transition-colors" />
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest group-hover:text-white transition-colors">Transcode Frequency (WAV/AIFF)</p>
                  </div>
                  <button 
                    onClick={() => simulateUpload("Exclusive Unit-7")}
                    className="w-full py-6 bg-blue-600 text-white font-black uppercase tracking-[0.3em] rounded-2xl text-[12px] hover:scale-[1.03] active:scale-95 transition-all shadow-2xl shadow-blue-900/50"
                  >
                    Lock into Registry
                  </button>
                </div>
              </div>
            )}

            {msg.uiTrigger === 'SUCCESS_STAMP' && (
               <div className="mt-4 flex items-center gap-3 text-cyan-400 text-[12px] font-black uppercase tracking-[0.4em] bg-cyan-400/10 px-6 py-3 rounded-full border border-cyan-400/30 animate-pulse shadow-lg shadow-cyan-900/20">
                 <ShieldCheck size={16} />
                 Oracle Synchronized
               </div>
            )}

            {msg.recommendations && (
              <div className="mt-8 w-full space-y-4">
                {msg.recommendations.samples?.map(id => {
                  const s = SAMPLES.find(item => item.id === id);
                  if (!s) return null;
                  return (
                    <button 
                      key={id} 
                      onClick={() => onSelectSample(s)}
                      className="w-full flex items-center gap-6 p-6 bg-white/[0.03] rounded-[36px] hover:bg-white/[0.1] text-xs text-left transition-all border border-white/5 hover:border-cyan-500/50 group animate-in"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-all shadow-inner">
                        <Music size={24} />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-black text-white truncate uppercase tracking-tighter text-lg mb-1">{s.title}</p>
                        <div className="flex items-center gap-3">
                           <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">{s.genre}</p>
                           <span className="w-1.5 h-1.5 rounded-full bg-white/10"></span>
                           <p className="text-[10px] text-cyan-500/80 uppercase tracking-widest font-black italic">{s.maxLicenses - s.licensesSold} Editions Left</p>
                        </div>
                      </div>
                      <span className="text-white font-display font-black text-xl">${s.price}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-5 text-cyan-400 text-[11px] font-black uppercase tracking-[0.4em] p-6 bg-cyan-400/5 rounded-3xl border border-cyan-400/20 w-fit">
            <div className="flex gap-1.5 items-end h-4">
              <div className="w-1 h-2 bg-cyan-400 animate-[bounce_1s_infinite_0s]"></div>
              <div className="w-1 h-4 bg-cyan-400 animate-[bounce_1s_infinite_0.2s]"></div>
              <div className="w-1 h-3 bg-cyan-400 animate-[bounce_1s_infinite_0.4s]"></div>
            </div>
            Oracle is scanning the void...
          </div>
        )}
      </div>

      <div className="p-8 border-t border-white/10 bg-black/60 backdrop-blur-3xl">
        <div className="flex items-end gap-5">
          <div className="relative flex-1 group">
            <div className="absolute inset-0 bg-cyan-500/5 blur-3xl group-focus-within:bg-cyan-500/10 transition-all"></div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Communicate your vision..."
              className="relative w-full bg-white/5 border border-white/10 rounded-[32px] p-6 pr-16 text-base focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] resize-none h-36 no-scrollbar font-bold text-white placeholder:text-white/10 shadow-inner transition-all"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute right-5 bottom-5 p-4 bg-cyan-500 rounded-2xl disabled:opacity-20 hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(14,165,233,0.4)] text-black"
            >
              <Send size={24} />
            </button>
          </div>
          
          <button 
            onClick={toggleMic}
            className={`p-7 rounded-[32px] transition-all shadow-2xl relative overflow-hidden group ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse scale-105 shadow-[0_0_40px_rgba(239,68,68,0.5)]' 
                : 'bg-white/5 text-white/40 hover:text-cyan-400 hover:bg-white/10 border border-white/10'
            }`}
          >
            {isListening ? <Mic size={28} /> : <MicOff size={28} />}
            {isListening && <div className="absolute inset-0 bg-white/20 animate-ping"></div>}
          </button>
        </div>
        <p className="mt-6 text-center text-[10px] text-white/10 uppercase font-black tracking-[0.6em]">Registry Automation V3.1 // AI ACTIVE</p>
      </div>
    </div>
  );
};

export default ChatSidebar;
