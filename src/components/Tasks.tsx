import React, { useState } from "react";
import { 
  CalendarRange, 
  Plus, 
  Trash2, 
  Cpu, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Sparkles,
  ArrowRight,
  ListTodo
} from "lucide-react";

interface TasksProps {
  dbState: any;
  onUpdateDB: (updated: any) => void;
}

export default function Tasks({ dbState, onUpdateDB }: TasksProps) {
  const [activeColumn, setActiveColumn] = useState<"todo" | "in_progress" | "done">("todo");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [newTaskAssignee, setNewTaskAssignee] = useState("Planner Agent");
  const [newTaskDueDate, setNewTaskDueDate] = useState("2026-07-28");
  
  // Prompt for Agentic scheduler
  const [schedulePrompt, setSchedulePrompt] = useState("");
  const [isPlanning, setIsPlanning] = useState(false);

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDesc,
      status: "todo" as const,
      priority: newTaskPriority,
      assignee: newTaskAssignee,
      dueDate: newTaskDueDate
    };

    onUpdateDB({
      ...dbState,
      tasks: [...dbState.tasks, newTask]
    });

    setNewTaskTitle("");
    setNewTaskDesc("");
    setShowAddForm(false);
  };

  const handleUpdateStatus = (id: string, newStatus: "todo" | "in_progress" | "done") => {
    const updated = dbState.tasks.map((t: any) => {
      if (t.id === id) {
        return { ...t, status: newStatus };
      }
      return t;
    });
    onUpdateDB({ ...dbState, tasks: updated });
  };

  const handleDeleteTask = (id: string) => {
    const filtered = dbState.tasks.filter((t: any) => t.id !== id);
    onUpdateDB({ ...dbState, tasks: filtered });
  };

  // Agentic automated scheduler simulation:
  // Converts any project goal prompt into actual segmented subtasks!
  const handleAgenticPlan = async () => {
    if (!schedulePrompt.trim()) return;
    setIsPlanning(true);

    try {
      // Query Planner Agent to decompose the goal into 3 sequential subtasks
      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Decompose this project goal into exactly 3 sequential subtasks. Return a clean JSON array of objects. 
          Each object must contain:
          - "title": concise task title
          - "description": concise details of execution steps
          - "priority": "high", "medium", or "low"
          - "assignee": choose from "Planner Agent", "Research Agent", "Code Agent", "Resume Agent", "Voice Agent"
          - "dueDate": in YYYY-MM-DD format (e.g., "2026-07-28")
          
          Project Goal: "${schedulePrompt}"
          
          Provide raw JSON. Do not write markdown tags around the JSON.`,
          history: [],
          agentId: "agent-planner"
        })
      });

      const data = await response.json();
      
      let newTasks: any[] = [];
      try {
        const parsed = JSON.parse(data.reply);
        if (Array.isArray(parsed)) {
          newTasks = parsed.map((item, idx) => ({
            id: `task-auto-${Date.now()}-${idx}`,
            title: item.title || "Automated Subtask",
            description: item.description || "Segmented step details.",
            status: "todo",
            priority: item.priority || "medium",
            assignee: item.assignee || "Planner Agent",
            dueDate: item.dueDate || "2026-08-01"
          }));
        }
      } catch (e) {
        // Fallback static segmented decomposition if parse fails
        newTasks = [
          {
            id: `task-auto-${Date.now()}-1`,
            title: `Intel Gather: ${schedulePrompt}`,
            description: "Research Agent performs google grounded search and drafts reports.",
            status: "todo",
            priority: "high",
            assignee: "Research Agent",
            dueDate: "2026-07-26"
          },
          {
            id: `task-auto-${Date.now()}-2`,
            title: `Prototype Development: ${schedulePrompt}`,
            description: "Code Agent refactors script configurations and builds routes.",
            status: "todo",
            priority: "medium",
            assignee: "Code Agent",
            dueDate: "2026-07-30"
          }
        ];
      }

      if (newTasks.length > 0) {
        onUpdateDB({
          ...dbState,
          tasks: [...dbState.tasks, ...newTasks]
        });
        setSchedulePrompt("");
      }

    } catch (err) {
      console.error(err);
    } finally {
      setIsPlanning(false);
    }
  };

  const columns = [
    { id: "todo" as const, name: "Todo Pipeline", border: "border-slate-800" },
    { id: "in_progress" as const, name: "Active Progress", border: "border-indigo-900/40" },
    { id: "done" as const, name: "Completed Tasks", border: "border-emerald-900/40" }
  ];

  return (
    <div id="tasks-planner-root" className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <CalendarRange className="w-5 h-5 text-pink-400" />
            Agentic Project Planner Board
          </h2>
          <p className="text-slate-400 text-xs mt-1">Design timelines, assign specialist agents, and monitor tasks on our interactive Kanban work board.</p>
        </div>

        {/* Floating task button */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? "View Kanban" : "Add Task"}</span>
          </button>
        </div>
      </div>

      {showAddForm ? (
        /* Create Task Form panel */
        <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 max-w-xl mx-auto space-y-4">
          <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider border-b border-slate-900 pb-3">Create New Workspace Task</h3>
          
          <div className="space-y-3 text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase block">Task Title</label>
              <input
                type="text"
                placeholder="e.g. Code database index migrations"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-900 rounded-xl px-4 py-2.5 text-slate-300 placeholder-slate-500 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase block">Description</label>
              <textarea
                placeholder="Enter details of task requirements..."
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                rows={3}
                className="w-full bg-slate-950/60 border border-slate-900 rounded-xl p-3 text-slate-300 placeholder-slate-500 outline-none focus:border-indigo-500 resize-none h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase block">Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 text-slate-300 outline-none font-semibold"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase block">Assignee Agent</label>
                <select
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 text-slate-300 outline-none font-semibold"
                >
                  {dbState.agents.map((agent: any) => (
                    <option key={agent.id} value={agent.name}>{agent.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase block">Due Date</label>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-2.5 text-slate-300 outline-none font-semibold"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end border-t border-slate-900 pt-4 text-xs font-bold">
            <button 
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl hover:border-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreateTask}
              disabled={!newTaskTitle.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer disabled:opacity-50"
            >
              Add to Board
            </button>
          </div>
        </div>
      ) : (
        /* Kanban columns and Agentic planner block */
        <div className="space-y-6">
          
          {/* Agentic Scheduler Prompt Bar */}
          <div className="p-4 rounded-3xl bg-indigo-950/20 border border-indigo-950 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-900 flex items-center justify-center text-indigo-400 shrink-0">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">Planner Agentic Decomposition Scheduler</h4>
                <p className="text-[10px] text-slate-400 mt-1">Describe a complex workspace objective (e.g., "Build a full pipeline summary"). The Planner agent will programmatically decompose it into 3 sequential tasks.</p>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="e.g. Audit legacy billing system security..."
                value={schedulePrompt}
                onChange={(e) => setSchedulePrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAgenticPlan()}
                className="bg-slate-950/60 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 outline-none w-full md:w-64 focus:border-indigo-500 transition-colors"
              />
              <button
                onClick={handleAgenticPlan}
                disabled={isPlanning || !schedulePrompt.trim()}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1"
              >
                {isPlanning ? (
                  <Cpu className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
                <span>Segment Plan</span>
              </button>
            </div>
          </div>

          {/* Kanban Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {columns.map((col) => {
              const colTasks = dbState.tasks.filter((t: any) => t.status === col.id);
              return (
                <div 
                  key={col.id} 
                  className="bg-slate-950/40 border border-slate-900 rounded-3xl p-4 flex flex-col justify-between min-h-[400px]"
                >
                  <div>
                    {/* Column Header */}
                    <div className="flex justify-between items-center pb-3 border-b border-slate-900 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{col.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 font-bold">{colTasks.length}</span>
                    </div>

                    {/* Cards block */}
                    <div className="space-y-3.5">
                      {colTasks.length === 0 ? (
                        <div className="py-16 text-center text-slate-600 text-[10px] flex flex-col items-center gap-1.5">
                          <ListTodo className="w-6 h-6 text-slate-800" />
                          <span>No tasks in this pipeline.</span>
                        </div>
                      ) : (
                        colTasks.map((task: any) => (
                          <div 
                            key={task.id}
                            className="p-4 rounded-2xl bg-slate-900/30 border border-slate-900 hover:border-slate-800/80 transition-all flex flex-col justify-between gap-3 group relative"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                  <User className="w-2.5 h-2.5 text-indigo-400" />
                                  {task.assignee}
                                </span>
                                
                                <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide border ${
                                  task.priority === "high" 
                                    ? "bg-rose-950/20 border-rose-900 text-rose-400" 
                                    : task.priority === "medium" 
                                    ? "bg-amber-950/10 border-amber-900/40 text-amber-400" 
                                    : "bg-slate-950 border-slate-900 text-slate-500"
                                }`}>
                                  {task.priority}
                                </span>
                              </div>

                              <h4 className="text-xs font-bold text-slate-200 leading-tight">{task.title}</h4>
                              <p className="text-[10px] text-slate-400 mt-1 leading-normal">{task.description}</p>
                            </div>

                            <div className="flex justify-between items-center pt-2.5 border-t border-slate-900/50 mt-1 text-[9px]">
                              <span className="text-slate-500 font-semibold flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-600" />
                                {task.dueDate}
                              </span>

                              {/* Controls to move columns */}
                              <div className="flex gap-1.5">
                                {col.id !== "todo" && (
                                  <button 
                                    onClick={() => handleUpdateStatus(task.id, col.id === "done" ? "in_progress" : "todo")}
                                    className="p-1 rounded bg-slate-950 text-slate-500 hover:text-slate-300 font-bold"
                                    title="Move Back"
                                  >
                                    ←
                                  </button>
                                )}
                                {col.id !== "done" && (
                                  <button 
                                    onClick={() => handleUpdateStatus(task.id, col.id === "todo" ? "in_progress" : "done")}
                                    className="p-1 rounded bg-slate-950 text-slate-500 hover:text-slate-300 font-bold"
                                    title="Advance Status"
                                  >
                                    →
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="p-1 rounded bg-slate-950 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Delete Task"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
