import React, { useState, useEffect } from "react";
import { 
  Cpu, 
  MessageSquare, 
  Mic, 
  Search, 
  FileSpreadsheet, 
  CodeXml, 
  FolderClosed, 
  CalendarRange, 
  Zap, 
  Settings, 
  LogOut, 
  Bell, 
  User, 
  SearchIcon,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  HelpCircle,
  KeyRound
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from "recharts";
import AIChat from "./AIChat";
import VoiceAI from "./VoiceAI";
import ResearchAgent from "./ResearchAgent";
import ResumeAnalyzer from "./ResumeAnalyzer";
import CodeAssistant from "./CodeAssistant";
import Documents from "./Documents";
import Tasks from "./Tasks";
import Automation from "./Automation";
import Reminders from "./Reminders";
import SettingsPanel from "./SettingsPanel";

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [dbState, setDbState] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<string[]>([
    "Planner Agent assigned 'Integrate ElevenLabs Voice' to Voice Agent.",
    "Automated Topic Research workflow completed successfully.",
    "System loaded Gemini 3.6-flash server-side configuration."
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<"missing" | "active">("missing");

  // Profile data
  const [profile, setProfile] = useState({
    name: "AI Workspace Developer",
    email: "developer@nexusai.build",
    org: "NexusAI Founders"
  });

  // Load database state from the server on mount
  const refreshState = async () => {
    try {
      const res = await fetch("/api/db");
      const data = await res.json();
      setDbState(data);
      if (data && data.profile) {
        setProfile(data.profile);
      }
    } catch (e) {
      console.error("Failed to load local database state", e);
    }
  };

  useEffect(() => {
    refreshState();
    
    // Check if Gemini API Key is available on backend
    fetch("/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "test", history: [], agentId: "agent-planner" })
    }).then(res => res.json())
      .then(data => {
        if (data.error && data.error.includes("GEMINI_API_KEY")) {
          setApiKeyStatus("missing");
        } else {
          setApiKeyStatus("active");
        }
      }).catch(() => setApiKeyStatus("missing"));
  }, []);

  if (!dbState) {
    return (
      <div className="min-h-screen bg-[#07080c] text-slate-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <Cpu className="w-12 h-12 text-indigo-500 animate-spin" />
          <span className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Syncing Workspace Environment...</span>
        </div>
      </div>
    );
  }

  const handleUpdateDB = async (updatedDB: any) => {
    setDbState(updatedDB);
    try {
      await fetch("/api/db/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDB)
      });
    } catch (e) {
      console.error("Failed to persist database updates", e);
    }
  };

  // Mock analytics data for charts
  const queryLoadData = [
    { name: "Mon", Planner: 24, Research: 15, Code: 35, Voice: 8 },
    { name: "Tue", Planner: 30, Research: 22, Code: 40, Voice: 14 },
    { name: "Wed", Planner: 28, Research: 35, Code: 32, Voice: 25 },
    { name: "Thu", Planner: 45, Research: 48, Code: 55, Voice: 30 },
    { name: "Fri", Planner: 35, Research: 40, Code: 48, Voice: 28 },
    { name: "Sat", Planner: 12, Research: 10, Code: 15, Voice: 42 },
    { name: "Sun", Planner: 18, Research: 12, Code: 18, Voice: 50 },
  ];

  const agentSuccessRate = [
    { name: "Planner", Success: 98, TokenUse: 75 },
    { name: "Research", Success: 94, TokenUse: 90 },
    { name: "Resume", Success: 92, TokenUse: 45 },
    { name: "Code", Success: 96, TokenUse: 85 },
    { name: "Voice", Success: 99, TokenUse: 60 }
  ];

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Cpu className="w-4 h-4" /> },
    { id: "chat", label: "AI Chat Room", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "voice", label: "ElevenLabs Voice", icon: <Mic className="w-4 h-4" /> },
    { id: "research", label: "Research Agent", icon: <Search className="w-4 h-4" /> },
    { id: "resume", label: "Resume Analyzer", icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: "code", label: "Code Assistant", icon: <CodeXml className="w-4 h-4" /> },
    { id: "documents", label: "Documents", icon: <FolderClosed className="w-4 h-4" /> },
    { id: "tasks", label: "Task Planner", icon: <CalendarRange className="w-4 h-4" /> },
    { id: "automation", label: "Automations", icon: <Zap className="w-4 h-4" /> },
    { id: "reminders", label: "Reminders & Alerts", icon: <Clock className="w-4 h-4" /> },
    { id: "settings", label: "Workspace Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div id="dashboard-root" className="min-h-screen bg-[#07080c] text-slate-100 font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-900 bg-[#090a10] flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          {/* Brand Logo */}
          <div className="p-6 border-b border-slate-900/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Cpu className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block">NexusAI</span>
              <span className="text-[10px] block text-slate-500 font-medium -mt-1">Workspace v1.0</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all uppercase cursor-pointer ${
                  activeTab === item.id 
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-inner shadow-indigo-500/5" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-900">
          <div className="flex items-center gap-3 p-2 bg-slate-950/40 rounded-xl border border-slate-900/80 mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold text-indigo-400 border border-slate-700">
              U
            </div>
            <div className="truncate">
              <span className="text-xs font-semibold text-slate-300 block leading-none">{profile.name}</span>
              <span className="text-[9px] text-slate-500 block truncate mt-0.5">{profile.email}</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Workspace</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-900/80 bg-[#090a10] px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            {/* Mobile Nav Toggle */}
            <div className="md:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-200 outline-none"
              >
                {menuItems.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </div>
            
            {/* Search Input Bar */}
            <div className="relative max-w-xs hidden sm:block">
              <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search queries, reports, or tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950/60 border border-slate-800/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-300 placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors w-64"
              />
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-3">
            {/* API Key Status Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-900 text-[10px] font-semibold">
              <KeyRound className="w-3 h-3 text-slate-400" />
              <span>Gemini:</span>
              {apiKeyStatus === "active" ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  Active <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block animate-pulse" />
                </span>
              ) : (
                <span className="text-rose-400">Add Key</span>
              )}
            </div>

            {/* Notification Dropdown */}
            <div className="relative">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                className="p-2 text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-850 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-[#090a10] border border-slate-800 rounded-2xl shadow-xl p-4 z-50 text-xs">
                  <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-900">
                    <span className="font-bold text-slate-200 uppercase tracking-wider">Workspace Feed</span>
                    <button 
                      onClick={() => setNotifications([])}
                      className="text-[10px] text-slate-500 hover:text-slate-300"
                    >
                      Clear All
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">No recent activity.</p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {notifications.map((notif, idx) => (
                        <div key={idx} className="flex gap-2 text-slate-400 leading-relaxed">
                          <CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{notif}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                className="w-9 h-9 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-xs font-semibold"
              >
                <User className="w-4 h-4" />
              </button>
              
              {showProfile && (
                <div className="absolute right-0 top-12 w-64 bg-[#090a10] border border-slate-800 rounded-2xl shadow-xl p-4 z-50 text-xs space-y-4">
                  <div className="pb-2 border-b border-slate-900">
                    <h4 className="font-bold text-slate-200 leading-none mb-1">{profile.name}</h4>
                    <span className="text-[10px] text-slate-500">{profile.email}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-bold uppercase block">Personal Organization</label>
                    <input 
                      type="text" 
                      value={profile.org}
                      onChange={(e) => {
                        const updated = { ...profile, org: e.target.value };
                        setProfile(updated);
                        handleUpdateDB({ ...dbState, profile: updated });
                      }}
                      className="bg-slate-950 border border-slate-800/85 rounded-lg px-2 py-1 w-full text-slate-300 focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={onLogout}
                      className="w-full py-2 bg-rose-950/20 hover:bg-rose-900/20 text-rose-400 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-colors"
                    >
                      Sign Out Workspace
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Box */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6 max-w-6xl mx-auto">
              
              {/* API Alert Banner if key missing */}
              {apiKeyStatus === "missing" && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-3">
                    <KeyRound className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold">Gemini API Key Required for Live Capabilities</h4>
                      <p className="text-amber-400/80 mt-1">To execute live queries across the multi-agent system, paste your GEMINI_API_KEY into the Secrets / Secrets panel in the AI Studio UI.</p>
                    </div>
                  </div>
                  <a href="#settings" onClick={() => setActiveTab("chat")} className="underline font-bold hover:text-amber-200 shrink-0 self-end sm:self-center">Configure Secrets</a>
                </div>
              )}

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-900 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Active Workspace Agents</span>
                    <Cpu className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">{dbState.agents.length} Trained</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Running collaborative pipelines</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-900 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Stored Knowledge Assets</span>
                    <FolderClosed className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">{dbState.documents.length} Files</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Available to local memory scopes</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-900 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Scheduled Workspace Tasks</span>
                    <CalendarRange className="w-4 h-4 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">
                      {dbState.tasks.filter((t: any) => t.status !== "done").length} Incomplete
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1">{dbState.tasks.filter((t: any) => t.status === "done").length} finished successfully</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-900 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Active Automations</span>
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">
                      {dbState.automations.filter((a: any) => a.active).length} Pipelines
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1">Triggers listening in background</p>
                  </div>
                </div>
              </div>

              {/* Analytical Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-slate-950/40 border border-slate-900 p-5 rounded-2xl">
                  <h3 className="font-bold text-sm text-slate-200 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    Agent Request Loads (7-Day Period)
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={queryLoadData}>
                        <defs>
                          <linearGradient id="colorPlanner" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorResearch" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorCode" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                        <YAxis stroke="#64748b" fontSize={11} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <Tooltip contentStyle={{ backgroundColor: "#090a10", borderColor: "#1e293b", color: "#f8fafc" }} />
                        <Area type="monotone" dataKey="Planner" stroke="#6366f1" fillOpacity={1} fill="url(#colorPlanner)" />
                        <Area type="monotone" dataKey="Research" stroke="#14b8a6" fillOpacity={1} fill="url(#colorResearch)" />
                        <Area type="monotone" dataKey="Code" stroke="#a855f7" fillOpacity={1} fill="url(#colorCode)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-slate-950/40 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-200 mb-4">Agent Success Rates</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={agentSuccessRate}>
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                          <YAxis stroke="#64748b" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: "#090a10", borderColor: "#1e293b" }} />
                          <Bar dataKey="Success" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-900">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block mb-2">Quick Actions</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setActiveTab("research")}
                        className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-[10px] font-bold tracking-wide uppercase transition-all cursor-pointer text-slate-300"
                      >
                        Deep Research
                      </button>
                      <button 
                        onClick={() => setActiveTab("voice")}
                        className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-[10px] font-bold tracking-wide uppercase transition-all cursor-pointer text-slate-300"
                      >
                        Launch Voice
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column Layout for Tasks & Agents */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Agent Profiles list */}
                <div className="bg-slate-950/40 border border-slate-900 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      NexusAI Specialist Directory
                    </h3>
                    <button onClick={() => setActiveTab("chat")} className="text-xs text-indigo-400 font-semibold hover:underline">Chat Room</button>
                  </div>

                  <div className="space-y-3.5">
                    {dbState.agents.map((agent: any) => (
                      <div key={agent.id} className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/30 border border-slate-900">
                        <div className="w-9 h-9 rounded-xl bg-indigo-950/40 border border-indigo-900 flex items-center justify-center shrink-0">
                          <Cpu className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-slate-200">{agent.name}</h4>
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-900 text-indigo-400 font-semibold uppercase">{agent.memoryCount} memories</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{agent.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {agent.capabilities.map((cap: string, cIdx: number) => (
                              <span key={cIdx} className="text-[8px] px-1.5 py-0.5 bg-slate-950 text-slate-400 rounded-md border border-slate-900">{cap}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks & Activity */}
                <div className="bg-slate-950/40 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-pink-400" />
                        Critical Work Board
                      </h3>
                      <button onClick={() => setActiveTab("tasks")} className="text-xs text-pink-400 font-semibold hover:underline">Planner View</button>
                    </div>

                    <div className="space-y-3">
                      {dbState.tasks.slice(0, 3).map((task: any) => (
                        <div key={task.id} className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-900 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-pink-400 mb-0.5 block">{task.assignee}</span>
                            <h4 className="text-xs font-bold text-slate-300 leading-tight">{task.title}</h4>
                            <span className="text-[10px] text-slate-500 mt-1 block">Due: {task.dueDate}</span>
                          </div>

                          <span className={`text-[9px] px-2 py-0.5 rounded-full border uppercase font-bold tracking-wider ${
                            task.status === "done" 
                              ? "bg-emerald-950/30 border-emerald-900 text-emerald-400" 
                              : task.status === "in_progress" 
                              ? "bg-indigo-950/30 border-indigo-900 text-indigo-400" 
                              : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}>
                            {task.status.replace("_", " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-900">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block mb-3">Workspace Onboarding Guide</span>
                    <div className="p-3.5 rounded-2xl bg-indigo-950/15 border border-indigo-950 flex items-start gap-3">
                      <HelpCircle className="w-4.5 h-4.5 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-white text-xs leading-none">How do I run research automation?</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Head to the <strong>Research Agent</strong> tab, type a topic name, and run. The system handles grounding and builds printable reports instantly.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === "chat" && (
            <AIChat dbState={dbState} onUpdateDB={handleUpdateDB} />
          )}

          {activeTab === "voice" && (
            <VoiceAI />
          )}

          {activeTab === "research" && (
            <ResearchAgent dbState={dbState} onUpdateDB={handleUpdateDB} />
          )}

          {activeTab === "resume" && (
            <ResumeAnalyzer />
          )}

          {activeTab === "code" && (
            <CodeAssistant />
          )}

          {activeTab === "documents" && (
            <Documents dbState={dbState} onUpdateDB={handleUpdateDB} />
          )}

          {activeTab === "tasks" && (
            <Tasks dbState={dbState} onUpdateDB={handleUpdateDB} />
          )}

          {activeTab === "automation" && (
            <Automation dbState={dbState} onUpdateDB={handleUpdateDB} />
          )}

          {activeTab === "reminders" && (
            <Reminders dbState={dbState} onUpdateDB={handleUpdateDB} />
          )}

          {activeTab === "settings" && (
            <SettingsPanel 
              profile={profile} 
              onUpdateProfile={(updated) => {
                setProfile(updated);
                handleUpdateDB({ ...dbState, profile: updated });
              }} 
              apiKeyStatus={apiKeyStatus}
              dbState={dbState}
              onUpdateDB={handleUpdateDB}
            />
          )}
        </main>
      </div>
    </div>
  );
}
