import React, { useState } from "react";
import { 
  Zap, 
  Plus, 
  Trash2, 
  Cpu, 
  Play, 
  Check, 
  Settings, 
  ListRestart, 
  Terminal, 
  ArrowRight,
  Info
} from "lucide-react";

interface AutomationProps {
  dbState: any;
  onUpdateDB: (updated: any) => void;
}

export default function Automation({ dbState, onUpdateDB }: AutomationProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [selectedTrigger, setSelectedTrigger] = useState("When Topic Research Triggered");
  const [selectedAction, setSelectedAction] = useState("Research Agent -> Writing Agent summary writeup -> Voice Agent audio synthesis");
  const [isRunning, setIsRunning] = useState<string | null>(null);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);

  const handleCreateWorkflow = () => {
    if (!workflowName.trim()) return;

    const newWorkflow = {
      id: `auto-${Date.now()}`,
      name: workflowName,
      trigger: selectedTrigger,
      action: selectedAction,
      active: true
    };

    onUpdateDB({
      ...dbState,
      automations: [...dbState.automations, newWorkflow]
    });

    setWorkflowName("");
    setShowAddForm(false);
  };

  const handleToggleActive = (id: string) => {
    const updated = dbState.automations.map((a: any) => {
      if (a.id === id) {
        return { ...a, active: !a.active };
      }
      return a;
    });
    onUpdateDB({ ...dbState, automations: updated });
  };

  const handleDeleteWorkflow = (id: string) => {
    const filtered = dbState.automations.filter((a: any) => a.id !== id);
    onUpdateDB({ ...dbState, automations: filtered });
  };

  const handleRunTest = (workflow: any) => {
    setIsRunning(workflow.id);
    setExecutionLogs([]);

    const steps = [
      `[Trigger fired] ${workflow.trigger}`,
      "Initializing Shared Memory Vector scopes...",
      "Activating primary Broker dispatch loop...",
      `[Stage 1] Dispatching tasks to agent pipeline: "${workflow.action.split(" -> ")[0]}"`,
      "Querying server-side model nodes...",
      `[Stage 2] Handoff output arrays to: "${workflow.action.split(" -> ")[1]}"`,
      "Synthesizing markdown payloads...",
      `[Stage 3] Completing automation with: "${workflow.action.split(" -> ")[2] || "Logging Service"}"`,
      "Writing transaction log metrics to data-store.json...",
      "[Workflow Complete] System synced successfully."
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setExecutionLogs(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsRunning(null);
        }
      }, (idx + 1) * 800);
    });
  };

  const triggerOptions = [
    "When Topic Research Triggered",
    "When New Resume Uploaded",
    "When Voice Session Ends",
    "When Code Assist Request Fails"
  ];

  const actionOptions = [
    "Research Agent -> Writing Agent summary writeup -> Voice Agent audio synthesis",
    "Planner -> Resume Agent scanner -> Memory Agent vector store indexing",
    "Planner -> Code Agent debugger -> Email Writer dispatcher report",
    "Voice Agent -> Transcription Archiver -> Memory Agent context caching"
  ];

  return (
    <div id="automation-workflow-root" className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
            Workspace Automation Pipelines
          </h2>
          <p className="text-slate-400 text-xs mt-1">Design background triggers and agent-chains. Automate report gathers, code scans, and voice logs.</p>
        </div>

        {/* Action triggers */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? "View Workflows" : "Build Pipeline"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Create form or List of automations */}
        <div className="lg:col-span-7 space-y-4">
          {showAddForm ? (
            /* Create Form */
            <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 space-y-4 text-xs">
              <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider border-b border-slate-900 pb-3">Build Custom Automation trigger</h3>
              
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">Pipeline Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Q3 Competitive Search Report Gatherer"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-900 rounded-xl px-4 py-2.5 text-slate-300 placeholder-slate-500 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">Trigger Condition</label>
                  <select
                    value={selectedTrigger}
                    onChange={(e) => setSelectedTrigger(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 text-slate-300 outline-none font-semibold"
                  >
                    {triggerOptions.map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">Action Chain Handoff Sequence</label>
                  <select
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 text-slate-300 outline-none font-semibold"
                  >
                    {actionOptions.map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end border-t border-slate-900 pt-4 font-bold">
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl hover:border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateWorkflow}
                  disabled={!workflowName.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer disabled:opacity-50"
                >
                  Save Trigger Pipeline
                </button>
              </div>
            </div>
          ) : (
            /* Automations list view */
            <div className="space-y-3">
              {dbState.automations.map((workflow: any) => (
                <div 
                  key={workflow.id}
                  className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 flex flex-col justify-between gap-4 group hover:border-slate-850 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-xl bg-yellow-950/20 border border-yellow-900/60 flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 leading-tight">{workflow.name}</h4>
                        <span className="text-[9px] text-slate-500 block mt-0.5 font-mono">Trigger: {workflow.trigger}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Active switch */}
                      <button 
                        onClick={() => handleToggleActive(workflow.id)}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                          workflow.active ? "bg-indigo-600" : "bg-slate-800"
                        }`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform ${
                          workflow.active ? "translate-x-4.5" : "translate-x-0"
                        }`} />
                      </button>

                      <button
                        onClick={() => handleDeleteWorkflow(workflow.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Delete Workflow"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Flow Action Sequence details */}
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-900/80 flex items-center gap-1.5 flex-wrap text-[9px] font-mono text-slate-400">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Sequence:</span>
                    {workflow.action.split(" -> ").map((step: string, sIdx: number, arr: any[]) => (
                      <React.Fragment key={sIdx}>
                        <span className="font-semibold text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded">{step}</span>
                        {sIdx < arr.length - 1 && <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Trigger test runner action */}
                  <div className="flex justify-between items-center text-[10px] border-t border-slate-900/60 pt-2.5 mt-1">
                    <span className="text-slate-500">Last ran: {workflow.lastRun ? "Recently" : "Never"}</span>
                    <button
                      onClick={() => handleRunTest(workflow)}
                      disabled={isRunning !== null || !workflow.active}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Play className="w-2.5 h-2.5 fill-slate-300" />
                      <span>Test Pipeline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Mock console simulator log output */}
        <div className="lg:col-span-5 bg-slate-950/40 border border-slate-900 rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-3">
              <Terminal className="w-4 h-4 text-yellow-400" />
              Live Pipeline Transaction Log
            </h3>

            {/* Simulated terminal logs */}
            <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 h-80 font-mono text-[9px] text-indigo-400 leading-normal overflow-y-auto space-y-2 mt-4 select-none shadow-inner shadow-indigo-500/1">
              {executionLogs.length === 0 ? (
                <p className="text-slate-600 text-center py-24 italic">Awaiting pipeline trigger execution...</p>
              ) : (
                executionLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                    <span className={
                      log.startsWith("[Trigger") 
                        ? "text-emerald-400" 
                        : log.startsWith("[Workflow") 
                        ? "text-emerald-300 font-bold" 
                        : log.startsWith("[Stage") 
                        ? "text-yellow-400" 
                        : "text-indigo-400"
                    }>
                      {log}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900/85 text-[10px] text-slate-500 flex items-center gap-2 leading-normal">
            <Info className="w-4.5 h-4.5 text-yellow-400 shrink-0" />
            <span>Workflow automations pass shared vector context states across adjacent agent blocks. Turn on pipelines to listen.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
