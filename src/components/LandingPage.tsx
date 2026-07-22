import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Terminal, 
  ArrowRight, 
  Sparkles, 
  Mic, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  ChevronRight, 
  Play, 
  Users, 
  Check, 
  MessageSquare, 
  Search, 
  FileSpreadsheet, 
  Menu, 
  X 
} from "lucide-react";

interface LandingPageProps {
  onLaunch: () => void;
}

export default function LandingPage({ onLaunch }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    {
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
      title: "Agentic Workspace",
      description: "A collaborative sandbox where eight specialized AI agents work in sequence to plan, research, write, code, and synthesize solutions."
    },
    {
      icon: <Mic className="w-5 h-5 text-emerald-400" />,
      title: "ElevenLabs Voice AI",
      description: "Hyper-realistic streaming voice interface with ChatGPT-like voice interactions, ambient audio visualizers, and instant voice interruption."
    },
    {
      icon: <Search className="w-5 h-5 text-cyan-400" />,
      title: "Grounded Research Agent",
      description: "Powered by Gemini web grounding. Instantly scan the internet to compile formatted, exhaustive reports backed by live verified citations."
    },
    {
      icon: <FileSpreadsheet className="w-5 h-5 text-pink-400" />,
      title: "ATS Resume Intelligence",
      description: "Upload resumes, generate professional ATS scores, discover critical keyword gaps, and receive target role interview preparations."
    },
    {
      icon: <Terminal className="w-5 h-5 text-purple-400" />,
      title: "Elite Code Assistant",
      description: "Write, explain, optimize, and debug full-stack solutions across React, TypeScript, Python, and SQL with professional code annotations."
    },
    {
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      title: "Workflow Automation",
      description: "Design trigger-action pipelines. Chain specialized AI agents together to execute background summaries, alerts, and report syntheses."
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      description: "For individual builders exploring Agentic AI.",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        "Core Planner Agent Chat",
        "Local Document Intelligence",
        "5 Web Grounded Research queries/mo",
        "Basic Code Assistant",
        "Standard Web Voice fallback"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Professional",
      description: "For power users, researchers, and professional developers.",
      monthlyPrice: 29,
      yearlyPrice: 24,
      features: [
        "Unrestricted access to all 8 AI Agents",
        "Unlimited Web-Grounded Reports",
        "Premium ElevenLabs Voice integration",
        "Advanced ATS Resume Scanner",
        "Custom Workflow Automations (Up to 10)",
        "Durable Multi-Device Sync"
      ],
      cta: "Upgrade to Professional",
      popular: true
    },
    {
      name: "Enterprise",
      description: "For teams needing customized security and intelligence.",
      monthlyPrice: 149,
      yearlyPrice: 119,
      features: [
        "Dedicated isolated database instance",
        "Custom corporate style guides for agents",
        "SLA guaranteed ElevenLabs audio streams",
        "Infinite automated triggered pipelines",
        "Direct API endpoints for systems",
        "24/7 dedicated support team"
      ],
      cta: "Contact Enterprise",
      popular: false
    }
  ];

  const faqs = [
    {
      q: "What makes NexusAI different from standard chat applications?",
      a: "NexusAI is built around a collaborative Multi-Agent Architecture. Instead of talking to a single generic assistant, specialized agents (Planner, Research, Code, Resume, Voice) can communicate and hand over tasks to one another, executing complex automations automatically."
    },
    {
      q: "How does ElevenLabs Voice AI function in the preview?",
      a: "NexusAI is fully pre-integrated with ElevenLabs Conversational agents. By adding your ElevenLabs API Key in the Secrets panel, you unlock a low-latency voice session. Without a key, the app seamlessly falls back to our robust Gemini TTS voice pipeline so you are never left without functionality."
    },
    {
      q: "What is Google Search Grounding?",
      a: "Our Research Agent uses live Gemini Search Grounding. When you request a topic, the model queries Google Search in real-time to find facts and returns a fully formatted report with clickable verified citations, completely eliminating typical AI hallucinations."
    },
    {
      q: "Are my API keys and personal uploads secure?",
      a: "Absolutely. In compliance with enterprise-grade security protocols, your API keys are stored server-side and never exposed to the client browser. All file uploads and resume texts are kept strictly confidential."
    }
  ];

  return (
    <div id="landing-root" className="min-h-screen bg-[#090a0f] text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      {/* Decorative Gradient Background elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-10 w-[400px] h-[400px] bg-emerald-900/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-10 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141622_1px,transparent_1px),linear-gradient(to_bottom,#141622_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Header */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Cpu className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">NexusAI</span>
            <span className="text-xs block text-slate-500 font-medium -mt-1">Workspace</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-slate-200 transition-colors">Features</a>
          <a href="#agents" className="hover:text-slate-200 transition-colors">AI Agents</a>
          <a href="#pricing" className="hover:text-slate-200 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-slate-200 transition-colors">FAQ</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={onLaunch}
            className="relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/30 active:scale-95 group overflow-hidden cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-2">
              Launch Workspace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-pink-500 opacity-0 group-hover:opacity-15 transition-opacity duration-500" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#0a0b12] border-b border-slate-900 px-6 py-8 flex flex-col gap-6 z-20 md:hidden">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg text-slate-300 hover:text-white">Features</a>
          <a href="#agents" onClick={() => setMobileMenuOpen(false)} className="text-lg text-slate-300 hover:text-white">AI Agents</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg text-slate-300 hover:text-white">Pricing</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-lg text-slate-300 hover:text-white">FAQ</a>
          <button 
            onClick={() => { setMobileMenuOpen(false); onLaunch(); }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-center font-semibold text-white"
          >
            Launch Workspace
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-36 flex flex-col items-center text-center">
        {/* Glow pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-xs font-semibold text-indigo-400 mb-8 shadow-inner shadow-indigo-500/5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Next Generation AI Agent Workspace</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none text-white max-w-4xl mb-6">
          Every specialized <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-500">AI Agent</span> working as one team.
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed font-normal">
          NexusAI is a production-grade AI platform combining Agentic AI, streaming ElevenLabs Voice, Grounded Research, and Document intelligence into a singular modern SaaS workspace.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <button 
            onClick={onLaunch}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:brightness-110 shadow-xl shadow-indigo-500/25 transition-all duration-300 cursor-pointer group hover:scale-[1.02]"
          >
            Launch Free Workspace
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={onLaunch}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-2xl text-slate-300 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
          >
            <Play className="mr-2 w-4 h-4 fill-slate-300 text-slate-300" />
            Watch Live Demo
          </button>
        </div>

        {/* Dashboard Visual Mockup */}
        <div className="mt-16 w-full max-w-5xl rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 shadow-2xl shadow-indigo-500/5 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl" />
          
          {/* Header Bar Mockup */}
          <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/60 block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/60 block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/60 block" />
            </div>
            <div className="h-6 w-48 rounded bg-slate-900/80 border border-slate-800/50 flex items-center justify-center text-[10px] text-slate-500 font-medium">
              nexusai.build/workspace/dashboard
            </div>
            <div className="w-6" />
          </div>

          <div className="grid grid-cols-12 gap-4 text-left">
            {/* Mock Sidebar */}
            <div className="col-span-3 border-r border-slate-900 pr-3 hidden md:block space-y-4">
              <div className="h-8 w-full bg-slate-900 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-5/6 bg-slate-900 rounded" />
                <div className="h-4 w-4/6 bg-indigo-900/30 rounded" />
                <div className="h-4 w-5/6 bg-slate-900 rounded" />
                <div className="h-4 w-3/6 bg-slate-900 rounded" />
              </div>
            </div>
            {/* Mock Main Panel */}
            <div className="col-span-12 md:col-span-9 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-indigo-400 font-semibold block uppercase tracking-wider mb-1">Active Agents</span>
                  <div className="text-xl font-bold">5 Specialized</div>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-emerald-400 font-semibold block uppercase tracking-wider mb-1">Voice Assistant</span>
                  <div className="text-xl font-bold flex items-center gap-1.5">
                    Streaming <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-pink-400 font-semibold block uppercase tracking-wider mb-1">Data Storage</span>
                  <div className="text-xl font-bold">Persistent</div>
                </div>
              </div>
              <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/40 h-32 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-1/3 bg-slate-800 rounded" />
                  <div className="h-3.5 w-3/4 bg-slate-800/80 rounded" />
                  <div className="h-3 w-1/2 bg-slate-800/50 rounded" />
                </div>
                <div className="flex justify-end">
                  <div className="h-6 w-20 rounded bg-indigo-600 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-slate-900/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">UNMATCHED UTILITY</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 text-white">
            Everything your workflow needs, engineered natively.
          </h2>
          <p className="text-slate-400 mt-4 leading-relaxed text-sm sm:text-base">
            No mock layers or broken redirects. Every capability runs against real APIs with modern server-side security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900 hover:border-slate-800 hover:bg-slate-950/80 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{feat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-Agent Section */}
      <section id="agents" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-slate-900/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">ORCHESTRATED INTELLIGENCE</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              A pipeline of specialized agents working in unison.
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
              Traditional AI models run in silos. NexusAI establishes an internal message-passing broker. A single user query can activate the Planner, trigger a Search Research, handoff to the Writing agent, and deliver results vocally.
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded bg-emerald-950 border border-emerald-900/60 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Automated handovers</h4>
                  <p className="text-slate-400 text-xs">Agents self-delegate based on their defined workspace metadata.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded bg-emerald-950 border border-emerald-900/60 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Persistent shared memory</h4>
                  <p className="text-slate-400 text-xs">Context, document index arrays, and history states survive between handovers.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-950/70 border border-slate-900 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
              Agent Handover Visualizer
            </h3>

            {/* Handover Flow Simulation */}
            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">1. User Prompt Entered</span>
                <span className="text-indigo-400 font-semibold">"Search Q3 AI Tech market and summary report"</span>
              </div>
              <div className="text-center text-slate-700">↓</div>
              <div className="p-3 bg-indigo-950/20 rounded-xl border border-indigo-900/30 flex items-center justify-between">
                <span className="text-indigo-300 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
                  Planner Agent Active
                </span>
                <span className="text-slate-400">Routes: Topic → Research Agent</span>
              </div>
              <div className="text-center text-slate-700">↓</div>
              <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-900/30 flex items-center justify-between">
                <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  Research Agent Active
                </span>
                <span className="text-slate-400">Queries Google Search, extracts citations</span>
              </div>
              <div className="text-center text-slate-700">↓</div>
              <div className="p-3 bg-pink-950/20 rounded-xl border border-pink-900/30 flex items-center justify-between">
                <span className="text-pink-300 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" />
                  Voice Agent Active
                </span>
                <span className="text-slate-400">Formulates concise audio summary via TTS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-slate-900/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-400">SIMPLE BILLING</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 text-white">SaaS Plans for Every Tier</h2>
          <p className="text-slate-400 mt-3 leading-relaxed text-sm">
            Unlock maximum speed, unlimited research grounding, and dedicated ElevenLabs speech streaming.
          </p>

          {/* Toggle Monthly/Yearly */}
          <div className="inline-flex items-center gap-1 bg-slate-900/80 border border-slate-800 p-1 rounded-full mt-8">
            <button 
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${billingCycle === "monthly" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${billingCycle === "yearly" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, idx) => (
            <div 
              key={idx}
              className={`rounded-3xl p-8 bg-slate-950/40 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                plan.popular 
                  ? "border-indigo-500 shadow-xl shadow-indigo-500/5 bg-slate-950/80 scale-105" 
                  : "border-slate-900 hover:border-slate-800"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-indigo-500 text-[10px] font-bold uppercase tracking-wider text-white">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="font-extrabold text-xl text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6 h-10">{plan.description}</p>
                
                <div className="flex items-baseline gap-1.5 mb-8">
                  <span className="text-4xl font-black text-white">
                    ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className="text-slate-500 text-xs font-medium">/ month</span>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex gap-2.5 text-xs text-slate-300 font-medium">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={onLaunch}
                className={`w-full py-3.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  plan.popular 
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 text-white shadow-lg shadow-indigo-500/20" 
                    : "bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 max-w-5xl mx-auto px-6 py-24 border-t border-slate-900/80">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">GOT QUESTIONS?</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="rounded-2xl border border-slate-900 bg-slate-950/20 overflow-hidden transition-all duration-300"
            >
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-6 text-left flex justify-between items-center text-sm sm:text-base font-semibold text-white hover:text-indigo-400 transition-colors focus:outline-none cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform ${activeFaq === idx ? "rotate-90 text-indigo-400" : ""}`} />
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out px-6 overflow-hidden ${
                  activeFaq === idx ? "max-h-[300px] pb-6 border-t border-slate-950 pt-4" : "max-h-0"
                }`}
              >
                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-[#06070a] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-200 tracking-tight">NexusAI Workspace</span>
          </div>

          <div className="flex gap-8 text-xs font-medium">
            <a href="#features" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#agents" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#pricing" className="hover:text-slate-300 transition-colors">Security Details</a>
          </div>

          <p className="text-xs text-slate-600">
            &copy; 2026 NexusAI Technologies Inc. All rights reserved. Built server-side with Gemini API.
          </p>
        </div>
      </footer>
    </div>
  );
}
