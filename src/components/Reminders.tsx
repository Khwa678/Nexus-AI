import React, { useState } from "react";
import { 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Bell, 
  Sparkles, 
  Cpu, 
  AlertCircle,
  AlertTriangle,
  BookmarkCheck
} from "lucide-react";

interface RemindersProps {
  dbState: any;
  onUpdateDB: (updated: any) => void;
}

export default function Reminders({ dbState, onUpdateDB }: RemindersProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [reminderText, setReminderText] = useState("");
  const [agentAssignee, setAgentAssignee] = useState("Planner Agent");
  const [dueTime, setDueTime] = useState("In 1 hour");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  // Load existing reminders or initialize with smart defaults
  const remindersList = dbState.reminders || [
    {
      id: "rem-1",
      text: "Review search grounded Q3 SaaS market analysis report",
      agent: "Research Agent",
      due: "In 30 minutes",
      priority: "high",
      completed: false,
      timestamp: Date.now()
    },
    {
      id: "rem-2",
      text: "Voice conversational script compilation review",
      agent: "Voice Agent",
      due: "In 2 hours",
      priority: "medium",
      completed: false,
      timestamp: Date.now() + 600000
    },
    {
      id: "rem-3",
      text: "Resume keyword scan on newly loaded candidates",
      agent: "Resume Agent",
      due: "Tomorrow, 9:00 AM",
      priority: "low",
      completed: true,
      timestamp: Date.now() - 3600000
    }
  ];

  const handleCreateReminder = () => {
    if (!reminderText.trim()) return;

    const newReminder = {
      id: `rem-${Date.now()}`,
      text: reminderText,
      agent: agentAssignee,
      due: dueTime,
      priority,
      completed: false,
      timestamp: Date.now()
    };

    const updatedReminders = [newReminder, ...remindersList];
    onUpdateDB({
      ...dbState,
      reminders: updatedReminders
    });

    setReminderText("");
    setShowAddForm(false);
  };

  const handleToggleComplete = (id: string) => {
    const updated = remindersList.map((r: any) => {
      if (r.id === id) {
        return { ...r, completed: !r.completed };
      }
      return r;
    });

    onUpdateDB({
      ...dbState,
      reminders: updated
    });
  };

  const handleDeleteReminder = (id: string) => {
    const filtered = remindersList.filter((r: any) => r.id !== id);
    onUpdateDB({
      ...dbState,
      reminders: filtered
    });
  };

  return (
    <div id="reminders-tab-root" className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            Agentic Reminders & Workspace Alerts
          </h2>
          <p className="text-slate-400 text-xs mt-1">Configure automated task alarms. Your assigned AI agents will trigger notifications upon schedule completion.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-center transition-colors shadow-lg shadow-indigo-500/10"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Alert Timer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Main List Panel */}
        <div className="md:col-span-8 space-y-4">
          
          {showAddForm && (
            <div className="p-5 rounded-2xl bg-[#090a10] border border-slate-800 space-y-4 shadow-xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">Configure Action Reminder</span>
              
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase block font-sans">Reminder Text</label>
                <input
                  type="text"
                  placeholder="e.g. Run ground search on LLM reasoning architectures..."
                  value={reminderText}
                  onChange={(e) => setReminderText(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-300 placeholder-slate-500 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">Notify Agent</label>
                  <select
                    value={agentAssignee}
                    onChange={(e) => setAgentAssignee(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500"
                  >
                    <option value="Planner Agent">Planner Agent</option>
                    <option value="Research Agent">Research Agent</option>
                    <option value="Resume Agent">Resume Agent</option>
                    <option value="Code Agent">Code Agent</option>
                    <option value="Voice Agent">Voice Agent</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">Due In</label>
                  <select
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500"
                  >
                    <option value="In 15 minutes">In 15 minutes</option>
                    <option value="In 30 minutes">In 30 minutes</option>
                    <option value="In 1 hour">In 1 hour</option>
                    <option value="In 4 hours">In 4 hours</option>
                    <option value="Tomorrow, 9:00 AM">Tomorrow, 9:00 AM</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">Alarm Priority</label>
                  <div className="flex gap-1 bg-slate-950/40 p-1 rounded-xl border border-slate-900">
                    {(["low", "medium", "high"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-1 text-[9px] font-bold uppercase rounded-lg cursor-pointer transition-all ${
                          priority === p 
                            ? p === "high" 
                              ? "bg-rose-950/40 border border-rose-900/50 text-rose-400" 
                              : p === "medium" 
                              ? "bg-amber-950/40 border border-amber-900/50 text-amber-400" 
                              : "bg-slate-900 border border-slate-800 text-slate-300"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end border-t border-slate-900 pt-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3.5 py-1.5 text-[10px] font-bold uppercase text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateReminder}
                  disabled={!reminderText.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Schedule Timer
                </button>
              </div>
            </div>
          )}

          {/* List Cards */}
          <div className="space-y-2.5">
            {remindersList.map((rem: any) => (
              <div 
                key={rem.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  rem.completed 
                    ? "bg-slate-950/20 border-slate-950/50 text-slate-600 opacity-60" 
                    : "bg-slate-950/40 border-slate-900 hover:border-slate-800"
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button 
                    onClick={() => handleToggleComplete(rem.id)}
                    className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                      rem.completed 
                        ? "bg-emerald-600 border-emerald-500 text-white" 
                        : "border-slate-700 hover:border-indigo-500 text-transparent"
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>

                  <div className="min-w-0 text-left">
                    <p className={`text-xs font-bold leading-relaxed ${rem.completed ? "line-through text-slate-600" : "text-slate-200"}`}>
                      {rem.text}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[9px] font-semibold text-slate-500">
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-indigo-400" />
                        {rem.agent}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Due {rem.due}
                      </span>
                      <span>•</span>
                      <span className={`uppercase text-[8px] px-1 rounded font-extrabold ${
                        rem.priority === "high" 
                          ? "bg-rose-950/40 text-rose-400" 
                          : rem.priority === "medium" 
                          ? "bg-amber-950/40 text-amber-400" 
                          : "bg-slate-900 text-slate-400"
                      }`}>
                        {rem.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteReminder(rem.id)}
                  className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {remindersList.length === 0 && (
              <div className="py-20 text-center text-slate-600 text-xs flex flex-col items-center gap-2">
                <Bell className="w-10 h-10 text-slate-800" />
                <span className="font-bold uppercase tracking-wider">No Reminders Triggered</span>
                <p className="max-w-xs text-[10px] leading-normal text-slate-500">Everything looks clear. You can schedule a new alarm block using the toggle button above.</p>
              </div>
            )}
          </div>

        </div>

        {/* Info Sidebar panel */}
        <div className="md:col-span-4 space-y-5">
          
          <div className="p-4 rounded-2xl bg-indigo-950/15 border border-indigo-950/40 space-y-3">
            <h3 className="font-bold text-xs text-indigo-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              Agent Intelligence
            </h3>
            <p className="text-[10px] text-indigo-400/80 leading-relaxed">
              When a scheduled alarm matures, the corresponding model compiles a custom context (e.g. scraping recent logs or reviewing candidate pools) and delivers a notification directly to your workspace summary log.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 space-y-3.5">
            <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookmarkCheck className="w-4 h-4 text-emerald-400" />
              Automated Alarms Status
            </h3>

            <div className="space-y-2 text-[10px]">
              <div className="flex justify-between items-center py-1 border-b border-slate-900">
                <span className="text-slate-500 font-semibold">Active Alarm Timers</span>
                <span className="font-extrabold text-slate-300">{remindersList.filter((r: any) => !r.completed).length}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-900">
                <span className="text-slate-500 font-semibold">Snoozed or Resolved</span>
                <span className="font-extrabold text-emerald-400">{remindersList.filter((r: any) => r.completed).length}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-semibold">System Routing Load</span>
                <span className="font-extrabold text-slate-300">Normal</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
