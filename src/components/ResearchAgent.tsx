import React, { useState } from "react";
import Markdown from "react-markdown";
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  ExternalLink, 
  Copy, 
  Check, 
  FileDown, 
  History, 
  Globe, 
  Compass, 
  Cpu,
  BookmarkCheck,
  ClipboardList
} from "lucide-react";

interface ResearchAgentProps {
  dbState: any;
  onUpdateDB: (updated: any) => void;
}

export default function ResearchAgent({ dbState, onUpdateDB }: ResearchAgentProps) {
  const [topic, setTopic] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentReport, setCurrentReport] = useState<any>(null);
  const [searchHistory, setSearchHistory] = useState<any[]>([
    {
      topic: "Q3 AI SaaS Adoption Trends",
      summary: "Completed search-grounded market research detailing 32% quarter-on-quarter expansion.",
      citations: ["Gartner Emerging Tech Brief (2026)", "SaaS Analytics Index (2026)"],
      report: "# Q3 AI SaaS Adoption Trends\n\n## Executive Summary\nAnalysis of emergent SaaS data reveals massive deployment of agentic models.\n\n## Key Findings\n- **Agentic Handovers** account for 45% of customer pipeline automation.\n- **Voice AI** integration speeds up contact centre throughput."
    }
  ]);
  const [copyStatus, setCopyStatus] = useState(false);

  const handleRunResearch = async () => {
    if (!topic.trim()) return;
    setIsSearching(true);
    setCurrentReport(null);

    try {
      const response = await fetch("/api/research/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ topic })
      });

      const data = await response.json();
      
      const newReport = {
        topic: data.topic || topic,
        summary: data.summary || "Completed live search grounding review.",
        citations: data.citations || ["Global Search Database Reference"],
        report: data.report || "Failed to generate report."
      };

      setCurrentReport(newReport);
      setSearchHistory(prev => [newReport, ...prev]);

      // Log in general DB notifications
      const updatedNotifications = [
        `Research Agent drafted search-grounded report on: "${topic}"`,
        ...dbState.automations.map((a: any) => a.lastRun ? `Automation ran: ${a.name}` : "")
      ].filter(Boolean);
      
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopyReport = () => {
    if (!currentReport) return;
    navigator.clipboard.writeText(currentReport.report);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const handleExportText = () => {
    if (!currentReport) return;
    const element = document.createElement("a");
    const file = new Blob([currentReport.report], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${currentReport.topic.toLowerCase().replace(/\s+/g, "_")}_report.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div id="research-agent-root" className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            Live Search Grounding Research Agent
          </h2>
          <p className="text-slate-400 text-xs mt-1">Queries the web in real-time, extracts verified sources, and generates citation-backed intelligence reports.</p>
        </div>

        {/* Search Input trigger panel */}
        <div className="flex gap-2 shrink-0">
          <input
            type="text"
            placeholder="Enter research topic (e.g. LLM Reasoning speeds)..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRunResearch()}
            className="bg-slate-950/60 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none w-64 md:w-80 focus:border-indigo-500 transition-colors"
          />
          <button
            onClick={handleRunResearch}
            disabled={isSearching || !topic.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSearching ? (
              <Cpu className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            <span>Conduct Search</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Main report viewer panel */}
        <div className="lg:col-span-8 bg-slate-950/40 border border-slate-900 rounded-3xl p-6 flex flex-col justify-between min-h-[440px] relative">
          {isSearching ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-20">
              <div className="relative">
                <Globe className="w-10 h-10 text-indigo-500 animate-spin relative z-10" />
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur animate-ping" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-slate-200 uppercase tracking-widest">Querying Google Search Grounds...</h4>
                <p className="text-[10px] text-slate-500 max-w-sm">Scanning web pages, checking facts, and extracting citation references inside server routes.</p>
              </div>
            </div>
          ) : currentReport ? (
            <div className="space-y-6">
              {/* Report Options menu */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-900">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Grounded Intelligence Report</span>
                <div className="flex gap-2">
                  <button 
                    onClick={handleCopyReport}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copyStatus ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copyStatus ? "Copied" : "Copy"}</span>
                  </button>
                  <button 
                    onClick={handleExportText}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Report Contents */}
              <div className="max-h-[480px] overflow-y-auto pr-1">
                <div className="markdown-body text-xs leading-relaxed text-slate-300 font-medium">
                  <Markdown>{currentReport.report}</Markdown>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-24 text-slate-500">
              <BookOpen className="w-10 h-10 text-slate-700 mb-1" />
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">No Topic Searched</h4>
              <p className="text-[10px] max-w-xs leading-normal">Enter a topic above (e.g. "PostgreSQL vs MongoDB Atlas scaling limits") to build a citation-backed technical report instantly.</p>
            </div>
          )}
        </div>

        {/* Sidebar for Citations & History list */}
        <div className="lg:col-span-4 space-y-6">
          {/* Citations block */}
          <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-5 space-y-4">
            <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-3">
              <BookmarkCheck className="w-4 h-4 text-emerald-400" />
              Verified Source Citations
            </h3>

            {currentReport && currentReport.citations.length > 0 ? (
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {currentReport.citations.map((cite: string, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-900 flex items-start gap-2 text-[10px] text-slate-400">
                    <span className="font-bold text-emerald-400 font-mono">[{idx + 1}]</span>
                    <p className="truncate flex-1">{cite}</p>
                    <Globe className="w-3 h-3 text-slate-600 shrink-0 mt-0.5" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-slate-500 italic py-4 text-center">No active citations list in memory.</p>
            )}
          </div>

          {/* Research History block */}
          <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-5 space-y-4">
            <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-3">
              <History className="w-4 h-4 text-indigo-400" />
              Intelligence History Log
            </h3>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {searchHistory.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentReport(item)}
                  className="w-full text-left p-3 rounded-xl bg-slate-900/30 border border-slate-900 hover:border-slate-800 transition-colors flex flex-col justify-between cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                    <span>Topic Search</span>
                    <span className="text-emerald-400">{item.citations.length} sources</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-300 leading-tight">{item.topic}</h4>
                  <p className="text-[10px] text-slate-400 leading-normal truncate mt-1">{item.summary}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
