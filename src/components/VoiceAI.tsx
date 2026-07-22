import React, { useEffect, useRef } from "react";
import { useVoice } from "../hooks/useVoice";
import { 
  Mic, 
  MicOff, 
  Square, 
  Volume2, 
  VolumeX, 
  Activity, 
  Cpu, 
  Info, 
  KeyRound 
} from "lucide-react";

export default function VoiceAI() {
  const {
    isActive,
    isMuted,
    isConnecting,
    transcript,
    isAgentSpeaking,
    isUserSpeaking,
    hasElevenLabs,
    currentSpeechText,
    startVoiceSession,
    stopVoiceSession,
    toggleMute
  } = useVoice();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Animate fluid wave on Canvas depending on speech activity
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = 140);
    let phase = 0;

    // Handle Resize
    const resizeObserver = new ResizeObserver(() => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 140;
      }
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Determine lines parameters based on state
      const count = 4;
      const amplitude = isAgentSpeaking ? 32 : isUserSpeaking ? 24 : isActive ? 8 : 2;
      const speed = isAgentSpeaking ? 0.08 : isUserSpeaking ? 0.05 : isActive ? 0.02 : 0.005;

      ctx.lineWidth = 1.8;

      for (let i = 0; i < count; i++) {
        ctx.beginPath();
        
        // Multi-colored gradient paths for glowing waveform
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        if (isAgentSpeaking) {
          gradient.addColorStop(0, "rgba(99, 102, 241, 0.1)");
          gradient.addColorStop(0.5, "rgba(168, 85, 247, 0.85)");
          gradient.addColorStop(1, "rgba(236, 72, 153, 0.1)");
        } else if (isUserSpeaking) {
          gradient.addColorStop(0, "rgba(16, 185, 129, 0.1)");
          gradient.addColorStop(0.5, "rgba(20, 184, 166, 0.85)");
          gradient.addColorStop(1, "rgba(99, 102, 241, 0.1)");
        } else {
          gradient.addColorStop(0, "rgba(71, 85, 105, 0.05)");
          gradient.addColorStop(0.5, "rgba(99, 102, 241, 0.3)");
          gradient.addColorStop(1, "rgba(71, 85, 105, 0.05)");
        }

        ctx.strokeStyle = gradient;

        // Mathematical sine wave equations for beautiful curves
        for (let x = 0; x < width; x++) {
          const progress = x / width;
          const sine = Math.sin(progress * Math.PI * 2.5 + phase + i * 0.8);
          // Pinch edges to make it look clean like Apple Siri wave
          const envelope = Math.sin(progress * Math.PI);
          const y = height / 2 + sine * amplitude * envelope * (1 - i * 0.15);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }

      phase += speed;
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [isActive, isAgentSpeaking, isUserSpeaking]);

  return (
    <div id="voice-ai-root" className="max-w-4xl mx-auto space-y-6">
      
      {/* Voice Status Alert Info Banner */}
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-start gap-3 text-xs">
        <Info className="w-4.5 h-4.5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold">Dual Voice Intelligence System Active</h4>
          <p className="text-indigo-400/80 mt-1 leading-relaxed">
            {hasElevenLabs ? (
              "Connected via secure ElevenLabs conversational token. Full streaming audio and voice profiles are active."
            ) : (
              "Secure ElevenLabs key is missing in secrets. The assistant has activated our advanced server-side Gemini Speech Synthesis model (gemini-3.1-flash-tts-preview) + local WebSpeech capture, running perfectly."
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Core ChatGPT Voice Orb Panel */}
        <div className="lg:col-span-7 bg-slate-950/40 border border-slate-900 rounded-3xl p-6 flex flex-col justify-between items-center text-center min-h-[400px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl" />

          {/* Assistant Info */}
          <div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-3">
              <Cpu className="w-3.5 h-3.5" />
              ElevenLabs AI Voice Portal
            </div>
            <h2 className="text-xl font-extrabold text-white">Voice Companion Mode</h2>
            <p className="text-slate-400 text-xs max-w-sm mt-1">Talk to the agent naturally. The system handles interruption, muting, and registers real-time transcripts.</p>
          </div>

          {/* Central Pulsing Visual Orb */}
          <div className="relative my-8">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 blur-2xl transition-all duration-700 opacity-20 ${
              isAgentSpeaking ? "scale-150 animate-pulse opacity-40" : isUserSpeaking ? "scale-125 animate-ping opacity-35" : "scale-100"
            }`} />
            
            <button
              onClick={isActive ? stopVoiceSession : startVoiceSession}
              disabled={isConnecting}
              className={`w-28 h-28 rounded-full flex items-center justify-center border relative z-10 transition-all duration-300 shadow-xl cursor-pointer ${
                isConnecting
                  ? "bg-slate-900 border-indigo-500/50 scale-95"
                  : isActive
                  ? "bg-gradient-to-tr from-rose-600 to-pink-600 border-rose-500 shadow-rose-500/15 text-white"
                  : "bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-600 border-indigo-500 shadow-indigo-500/20 hover:scale-[1.03] text-white"
              }`}
            >
              {isConnecting ? (
                <Activity className="w-10 h-10 text-indigo-400 animate-pulse" />
              ) : isActive ? (
                <Square className="w-8 h-8 fill-white" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          {/* Waveform and Controls */}
          <div className="w-full space-y-4">
            {/* Waveform Visualizer */}
            <div className="bg-slate-950/60 rounded-2xl border border-slate-900/80 p-3 h-20 flex items-center justify-center relative overflow-hidden">
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            </div>

            {/* Subtitle / Live Input Text */}
            <div className="h-6 text-xs text-slate-400 truncate max-w-md mx-auto">
              {isUserSpeaking && currentSpeechText ? (
                <span className="text-emerald-400 italic font-medium">" {currentSpeechText} ... "</span>
              ) : isAgentSpeaking ? (
                <span className="text-indigo-400">Agent is responding vocally...</span>
              ) : isActive ? (
                <span>Listening for speech...</span>
              ) : (
                <span className="text-slate-600">Connect to start voice dialogue</span>
              )}
            </div>

            {/* Buttons Bar */}
            {isActive && (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={toggleMute}
                  className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                    isMuted 
                      ? "bg-rose-950/20 border-rose-900 text-rose-400 hover:bg-rose-900/20" 
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isMuted ? "Unmute Mic" : "Mute Mic"}</span>
                </button>

                <button
                  onClick={stopVoiceSession}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <Square className="w-4 h-4" />
                  <span>End Session</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Conversation Transcripts scroll panel */}
        <div className="lg:col-span-5 bg-slate-950/40 border border-slate-900 rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-200 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              Live Transcript Log
            </h3>

            <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
              {transcript.length === 0 ? (
                <div className="py-20 text-center text-slate-500 text-xs">
                  Voice session transcripts will stream here in real-time.
                </div>
              ) : (
                transcript.map((line, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      line.role === "user" 
                        ? "bg-slate-900/30 border border-slate-900 text-slate-300 max-w-[90%] ml-auto" 
                        : "bg-indigo-950/5 border border-indigo-950/30 text-indigo-300 max-w-[90%] mr-auto"
                    }`}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-wider block mb-1 text-slate-500">
                      {line.role === "user" ? "You (Vocal)" : "NexusAI Agent"}
                    </span>
                    <p className="font-medium">{line.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900/80 text-[10px] text-slate-500 flex items-center gap-2 leading-normal">
            <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Voice mode features streaming speech-to-text with conversational handoffs. Simply speak to trigger the agent loop.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
