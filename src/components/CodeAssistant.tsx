import React, { useState } from "react";
import Markdown from "react-markdown";
import { 
  CodeXml, 
  Sparkles, 
  Terminal, 
  Check, 
  Copy, 
  Cpu, 
  Play, 
  RotateCcw, 
  Compass, 
  Flame 
} from "lucide-react";

export default function CodeAssistant() {
  const [prompt, setPrompt] = useState("");
  const [action, setAction] = useState<"generate" | "explain" | "optimize" | "debug">("generate");
  const [language, setLanguage] = useState("TypeScript");
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState("");
  const [copyStatus, setCopyStatus] = useState(false);

  const handleProcessCode = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    setOutput("");

    try {
      const response = await fetch("/api/code/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, action, language })
      });

      const data = await response.json();
      setOutput(data.output || "Failed to generate code help.");
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(output);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <div id="code-assistant-root" className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <CodeXml className="w-5 h-5 text-purple-400" />
            Elite Developer Code Assistant
          </h2>
          <p className="text-slate-400 text-xs mt-1">Generate, explain, optimize, or debug complex blocks of full-stack code across various languages.</p>
        </div>

        {/* Action and Language pickers */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 outline-none"
          >
            <option>TypeScript</option>
            <option>React JSX</option>
            <option>Node.js</option>
            <option>Python</option>
            <option>SQL</option>
            <option>Go</option>
            <option>Rust</option>
          </select>

          <select
            value={action}
            onChange={(e) => setAction(e.target.value as any)}
            className="bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 outline-none"
          >
            <option value="generate">Generate Code</option>
            <option value="explain">Explain Line-by-Line</option>
            <option value="optimize">Optimize Speeds</option>
            <option value="debug">Trace & Fix Bugs</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left pane: Input prompt/code */}
        <div className="lg:col-span-6 bg-slate-950/40 border border-slate-900 rounded-3xl p-5 flex flex-col justify-between min-h-[440px]">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              <span>Developer Input Code / Prompt</span>
              <span className="text-indigo-400 font-mono text-[9px]">{language} Editor</span>
            </div>

            <textarea
              placeholder={
                action === "generate" 
                  ? "Describe what code or function you want to build (e.g. Express rate limiter schema)..." 
                  : "Paste the code block you want evaluated here..."
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-900 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-600 font-mono leading-relaxed outline-none focus:border-indigo-500/80 resize-none h-[300px]"
            />
          </div>

          <div className="pt-4 border-t border-slate-900 flex justify-end">
            <button
              onClick={handleProcessCode}
              disabled={isProcessing || !prompt.trim()}
              className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Terminal className="w-4 h-4 animate-pulse" />
              <span>{isProcessing ? "Processing Code..." : "Compile & Process"}</span>
            </button>
          </div>
        </div>

        {/* Right pane: Markdown generated outputs */}
        <div className="lg:col-span-6 bg-slate-950/40 border border-slate-900 rounded-3xl p-6 flex flex-col justify-between">
          {isProcessing ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-20">
              <div className="relative">
                <Cpu className="w-10 h-10 text-purple-500 animate-spin relative z-10" />
                <div className="absolute inset-0 bg-purple-500/15 rounded-full blur animate-ping" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-slate-200 uppercase tracking-widest">Evaluating Code Blocks...</h4>
                <p className="text-[10px] text-slate-500 max-w-sm">Generating explanation metrics, tracing memory speeds, and optimization guidelines inside server routes.</p>
              </div>
            </div>
          ) : output ? (
            <div className="space-y-4">
              
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Analysis Output</span>
                <button 
                  onClick={handleCopyResult}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  {copyStatus ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copyStatus ? "Copied" : "Copy Solution"}</span>
                </button>
              </div>

              {/* Scroll markdown body output */}
              <div className="max-h-[380px] overflow-y-auto pr-1">
                <div className="markdown-body text-xs leading-relaxed text-slate-300 font-medium">
                  <Markdown>{output}</Markdown>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-24 text-slate-500">
              <Terminal className="w-10 h-10 text-slate-700 mb-1" />
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Awaiting Execution</h4>
              <p className="text-[10px] max-w-xs leading-normal">Paste or write developer descriptions on the left, choose language and operations, and compile.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
