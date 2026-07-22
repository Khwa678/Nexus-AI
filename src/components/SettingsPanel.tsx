import React, { useState } from "react";
import { 
  User, 
  Settings, 
  KeyRound, 
  ShieldCheck, 
  Save, 
  HelpCircle, 
  Cpu, 
  Flame, 
  Volume2,
  Sliders,
  CheckCircle2
} from "lucide-react";

interface SettingsPanelProps {
  profile: {
    name: string;
    email: string;
    org: string;
    role?: string;
  };
  onUpdateProfile: (updated: any) => void;
  apiKeyStatus: "missing" | "active";
  dbState: any;
  onUpdateDB: (updated: any) => void;
}

export default function SettingsPanel({ 
  profile, 
  onUpdateProfile, 
  apiKeyStatus,
  dbState,
  onUpdateDB 
}: SettingsPanelProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [org, setOrg] = useState(profile.org);
  const [role, setRole] = useState(profile.role || "Lead AI Systems Engineer");
  
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [primaryModel, setPrimaryModel] = useState(dbState.preferences?.primaryModel || "gemini-3.6-flash");
  const [voiceSpeed, setVoiceSpeed] = useState(dbState.preferences?.voiceSpeed || "1.0");
  const [autoListen, setAutoListen] = useState(dbState.preferences?.autoListen ?? true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      email,
      org,
      role
    });

    // Save developer settings preferences inside dbState
    onUpdateDB({
      ...dbState,
      preferences: {
        primaryModel,
        voiceSpeed,
        autoListen
      }
    });

    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div id="settings-tab-root" className="max-w-4xl mx-auto space-y-6 text-left">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          Workspace Profile & Preferences
        </h2>
        <p className="text-slate-400 text-xs mt-1">Manage your developer identity, fine-tune the core LLM orchestration settings, and confirm security certificates.</p>
      </div>

      {showSavedToast && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Workspace profile & developer preferences saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Identity Block */}
          <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-900 space-y-4">
            <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-3">
              <User className="w-4 h-4 text-indigo-400" />
              Developer Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase block">Workspace Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase block">Organization</label>
                <input
                  type="text"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Model Tuning block */}
          <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-900 space-y-4">
            <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-3">
              <Sliders className="w-4 h-4 text-indigo-400" />
              AI Model & Orchestration Tuning
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase block">Core Model Orchestrator</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPrimaryModel("gemini-3.6-flash")}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      primaryModel === "gemini-3.6-flash" 
                        ? "bg-indigo-950/20 border-indigo-500/40 text-indigo-300" 
                        : "bg-transparent border-slate-900 text-slate-500 hover:border-slate-800"
                    }`}
                  >
                    <span className="font-extrabold text-xs block mb-0.5">Gemini 3.6 Flash</span>
                    <span className="text-[9px] leading-tight block text-slate-400/85">Superior reasoning, live search tool support, optimal report summaries.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrimaryModel("gemini-3.1-flash-lite")}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      primaryModel === "gemini-3.1-flash-lite" 
                        ? "bg-indigo-950/20 border-indigo-500/40 text-indigo-300" 
                        : "bg-transparent border-slate-900 text-slate-500 hover:border-slate-800"
                    }`}
                  >
                    <span className="font-extrabold text-xs block mb-0.5">Gemini 3.1 Flash Lite</span>
                    <span className="text-[9px] leading-tight block text-slate-400/85">Ultra low latency, lower memory requirements, fast conversational reply.</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">Vocal Reading Speed</label>
                  <select
                    value={voiceSpeed}
                    onChange={(e) => setVoiceSpeed(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
                  >
                    <option value="0.8">0.8x (Deliberate pace)</option>
                    <option value="1.0">1.0x (Standard conversational)</option>
                    <option value="1.2">1.2x (Fast briefing)</option>
                    <option value="1.5">1.5x (Accelerated summary)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">Voice Loop Auto-Listen</label>
                  <div className="flex items-center gap-3 h-9">
                    <button
                      type="button"
                      onClick={() => setAutoListen(true)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase cursor-pointer ${
                        autoListen ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400"
                      }`}
                    >
                      Continuous On
                    </button>
                    <button
                      type="button"
                      onClick={() => setAutoListen(false)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase cursor-pointer ${
                        !autoListen ? "bg-rose-900 text-white" : "bg-slate-900 text-slate-400"
                      }`}
                    >
                      Manual Capture Only
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Configurations</span>
          </button>

        </div>

        {/* Right Column: Credentials Verification */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Security Status */}
          <div className="p-5 rounded-2xl bg-[#090a10] border border-slate-800 space-y-4">
            <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Credentials Monitor
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 font-semibold">Gemini Key</span>
                {apiKeyStatus === "active" ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    VERIFIED <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block animate-pulse" />
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold">REQUIRED</span>
                )}
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 font-semibold">ElevenLabs API</span>
                {dbState.preferences?.hasElevenLabs || apiKeyStatus === "active" ? (
                  <span className="text-emerald-400/80 font-bold">ACTIVE</span>
                ) : (
                  <span className="text-slate-500 font-mono text-[9px]">FALLBACK VOICE ACTIVE</span>
                )}
              </div>
            </div>
          </div>

          {/* Guidelines info */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 space-y-3">
            <h4 className="font-bold text-xs text-slate-300 flex items-center gap-1">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              Secrets Setup Guide
            </h4>
            <p className="text-[10px] text-slate-500 leading-normal">
              To keep your private API credentials secure and hidden from client-side inspectors, follow our native integration protocols:
            </p>
            <ol className="text-[10px] text-slate-400 space-y-1.5 list-decimal pl-4 leading-normal">
              <li>In the AI Studio interface, navigate to the **Settings** or **Secrets** sub-menu on your control strip.</li>
              <li>Add a secret named <code className="text-indigo-400 font-mono font-bold">GEMINI_API_KEY</code> containing your official Google AI Studio developer key.</li>
              <li>Optionally, add <code className="text-indigo-400 font-mono font-bold">ELEVENLABS_API_KEY</code> for customized ultra-low latency voice rendering.</li>
              <li>Restart or refresh the preview container to inherit the credentials safely!</li>
            </ol>
          </div>

        </div>

      </form>
    </div>
  );
}
