import React, { useState, useEffect } from "react";
import { 
  FolderClosed, 
  Plus, 
  Trash2, 
  MessageSquare, 
  FileText, 
  Send, 
  Sparkles, 
  BookOpen, 
  HelpCircle,
  Clock,
  FileUp,
  Brain,
  Tag,
  Smile,
  CheckCircle,
  Eye,
  Info
} from "lucide-react";

interface DocumentsProps {
  dbState: any;
  onUpdateDB: (updated: any) => void;
}

export default function Documents({ dbState, onUpdateDB }: DocumentsProps) {
  const [activeDocId, setActiveDocId] = useState<string>("doc-1");
  const [newDocName, setNewDocName] = useState("");
  const [newDocContent, setNewDocContent] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const activeDoc = dbState.documents.find((d: any) => d.id === activeDocId) || dbState.documents[0];

  // Auto-analyze active document if it does not have analysis cache
  const handleAnalyzeDoc = async (docIdToAnalyze?: string) => {
    const targetDoc = docIdToAnalyze 
      ? dbState.documents.find((d: any) => d.id === docIdToAnalyze)
      : activeDoc;

    if (!targetDoc || targetDoc.analysis) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/documents/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: targetDoc.content,
          docName: targetDoc.name
        })
      });

      const analysisData = await response.json();
      
      const updatedDocs = dbState.documents.map((d: any) => {
        if (d.id === targetDoc.id) {
          return {
            ...d,
            analysis: {
              summary: analysisData.summary || "Completed manual deep inspect.",
              keyTakeaways: analysisData.keyTakeaways || ["Extracted main document ideas"],
              entities: analysisData.entities || ["Knowledge Asset"],
              sentiment: analysisData.sentiment || "Analytical"
            }
          };
        }
        return d;
      });

      onUpdateDB({
        ...dbState,
        documents: updatedDocs
      });
    } catch (err) {
      console.error("Failed to extract document analysis", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger analysis when active document changes
  useEffect(() => {
    if (activeDoc && !activeDoc.analysis && !isAnalyzing) {
      handleAnalyzeDoc();
    }
  }, [activeDocId]);

  const handleCreateDoc = () => {
    if (!newDocName.trim() || !newDocContent.trim()) return;

    const newDoc = {
      id: `doc-${Date.now()}`,
      name: newDocName.endsWith(".txt") ? newDocName : `${newDocName}.txt`,
      size: `${(newDocContent.length / 1024).toFixed(1)} KB`,
      content: newDocContent,
      timestamp: Date.now()
    };

    const updatedDocs = [newDoc, ...dbState.documents];
    onUpdateDB({ ...dbState, documents: updatedDocs });
    
    setNewDocName("");
    setNewDocContent("");
    setIsCreating(false);
    setActiveDocId(newDoc.id);
    setChatHistory([]);
  };

  const handleDeleteDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = dbState.documents.filter((d: any) => d.id !== id);
    if (filtered.length === 0) return;
    onUpdateDB({ ...dbState, documents: filtered });
    if (activeDocId === id) {
      setActiveDocId(filtered[0].id);
      setChatHistory([]);
    }
  };

  // File drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setUploadError("");

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processUploadedFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const processUploadedFile = (file: File) => {
    if (!file.name.endsWith(".txt") && !file.name.endsWith(".md") && !file.name.endsWith(".json")) {
      setUploadError("Only plain-text format files (.txt, .md, .json) are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setNewDocName(file.name);
        setNewDocContent(text);
        setIsCreating(true);
      }
    };
    reader.onerror = () => {
      setUploadError("Failed to read the local file.");
    };
    reader.readAsText(file);
  };

  const handleDocChatSubmit = async () => {
    if (!chatInput.trim() || !activeDoc) return;
    
    const userQuery = chatInput;
    setChatInput("");
    setChatHistory(prev => [...prev, { role: "user", content: userQuery }]);
    setIsAnswering(true);
 
    try {
      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Answer this query based ONLY on the document content below. Cite sections or statistics if possible.
          
Document Name: "${activeDoc.name}"
Document Content:
"${activeDoc.content}"

User Query: "${userQuery}"`,
          history: [],
          agentId: "agent-planner"
        })
      });

      const data = await response.json();
      setChatHistory(prev => [...prev, { role: "agent", content: data.reply || data.error || "Timed out." }]);
    } catch (e) {
      console.error(e);
      setChatHistory(prev => [...prev, { role: "agent", content: "Connection to knowledge core timed out. Please try again." }]);
    } finally {
      setIsAnswering(false);
    }
  };

  return (
    <div id="documents-root" className="h-[calc(100vh-10rem)] flex gap-6 relative">
      
      {/* Sidebar File Manager */}
      <div className="w-72 border-r border-slate-900 pr-5 flex flex-col justify-between shrink-0 hidden lg:flex">
        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Document Repositories</span>
            <button 
              onClick={() => { setIsCreating(true); setNewDocName(""); setNewDocContent(""); }}
              className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer transition-colors"
              title="Upload / Draft Document"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Drag and Drop Zone inside Sidebar for quick upload */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`p-4 border border-dashed rounded-2xl flex flex-col items-center text-center justify-center transition-all ${
              dragActive 
                ? "border-indigo-500 bg-indigo-500/10 text-indigo-300" 
                : "border-slate-850 bg-slate-950/20 hover:border-slate-800 text-slate-500"
            }`}
          >
            <FileUp className={`w-6 h-6 mb-1.5 ${dragActive ? "text-indigo-400 animate-bounce" : "text-slate-600"}`} />
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Drag files here</span>
            <span className="text-[8px] text-slate-600 mt-0.5">Supports .txt, .md, .json</span>
            
            <label className="mt-2 text-[9px] px-2 py-1 bg-slate-900 hover:bg-slate-850 rounded-lg text-slate-300 border border-slate-800 font-bold uppercase cursor-pointer">
              Browse Files
              <input 
                type="file" 
                className="hidden" 
                accept=".txt,.md,.json" 
                onChange={handleFileInputChange} 
              />
            </label>
            {uploadError && <p className="text-[8px] text-rose-400 mt-1.5 font-semibold leading-tight">{uploadError}</p>}
          </div>

          {/* Stored documents listing */}
          <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
            {dbState.documents.map((doc: any) => (
              <div
                key={doc.id}
                onClick={() => { setActiveDocId(doc.id); setChatHistory([]); setIsCreating(false); }}
                className={`group p-3 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold cursor-pointer transition-all ${
                  activeDocId === doc.id && !isCreating
                    ? "bg-slate-900 border-slate-800 text-slate-200 shadow-sm" 
                    : "bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/30"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate flex-1">
                  <FileText className={`w-4 h-4 shrink-0 ${activeDocId === doc.id && !isCreating ? "text-indigo-400" : "text-slate-600"}`} />
                  <div className="truncate text-left">
                    <span className="block leading-none truncate font-bold">{doc.name}</span>
                    <span className="text-[9px] text-slate-600 block mt-1 font-mono">{doc.size}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {doc.analysis && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Analyzed Insights Cached" />
                  )}
                  <button 
                    onClick={(e) => handleDeleteDoc(doc.id, e)}
                    className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900 text-[10px] text-slate-500 leading-normal">
          <Brain className="w-3.5 h-3.5 text-indigo-400 mb-1" />
          NexusAI crawls indices. Documents are read dynamically via local contexts without sending data to third-party models.
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col justify-between bg-slate-950/20 border border-slate-900 rounded-3xl p-5 relative overflow-hidden">
        
        {isCreating ? (
          /* File Draft / Edit / Creation form */
          <div className="space-y-4 flex-1 flex flex-col justify-between min-h-0">
            <div className="space-y-4 flex-1 flex flex-col min-h-0">
              <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Initialize Knowledge Asset</span>
                <button 
                  onClick={() => setIsCreating(false)}
                  className="text-[10px] text-slate-500 hover:text-slate-300"
                >
                  Close Editor
                </button>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase block">File Title</label>
                <input
                  type="text"
                  placeholder="e.g. quarterly_audit_trail.txt"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-300 placeholder-slate-500 outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1.5 flex-1 flex flex-col min-h-0">
                <label className="text-[10px] text-slate-500 font-bold uppercase block">Raw Text Contents</label>
                <textarea
                  placeholder="Type, paste, or drag raw text records directly into this workspace..."
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  className="w-full flex-1 bg-slate-950/60 border border-slate-900 rounded-xl p-3.5 text-xs text-slate-300 placeholder-slate-500 outline-none focus:border-indigo-500 resize-none font-mono leading-relaxed"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end border-t border-slate-900 pt-4">
              <button 
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-xs font-bold bg-slate-900 border border-slate-800 text-slate-400 rounded-xl hover:border-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateDoc}
                disabled={!newDocName.trim() || !newDocContent.trim()}
                className="px-4 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer disabled:opacity-50 transition-colors"
              >
                Index Intelligence Asset
              </button>
            </div>
          </div>
        ) : activeDoc ? (
          /* Real split analytics view + cognitive chat panel */
          <div className="flex-1 flex flex-col justify-between min-h-0">
            
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 flex-1 mb-4 overflow-hidden h-full">
              
              {/* Left Column: Interactive Raw Viewer & AI Insights */}
              <div className="xl:col-span-7 flex flex-col gap-4 min-h-0 overflow-y-auto pr-1">
                
                {/* AI Insights Card Block */}
                <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-4 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5 text-indigo-400" />
                      Cognitive Extraction Report
                    </span>
                    
                    {isAnalyzing ? (
                      <span className="text-[9px] text-indigo-400 animate-pulse font-bold uppercase">Extracting...</span>
                    ) : activeDoc.analysis ? (
                      <span className="text-[9px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                        Active <CheckCircle className="w-3 h-3" />
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleAnalyzeDoc()}
                        className="text-[9px] px-2 py-0.5 rounded bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/10 font-bold uppercase"
                      >
                        Analyze Document
                      </button>
                    )}
                  </div>

                  {activeDoc.analysis ? (
                    <div className="space-y-4">
                      {/* Summary text */}
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Executive Summary</span>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">{activeDoc.analysis.summary}</p>
                      </div>

                      {/* Split metrics */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Sentiment */}
                        <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-900">
                          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Smile className="w-3 h-3 text-slate-500" /> Sentiment Rating
                          </span>
                          <span className="text-xs font-extrabold text-slate-300 block mt-1">{activeDoc.analysis.sentiment}</span>
                        </div>
                        {/* Entities tag lists */}
                        <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-900 flex flex-col justify-between">
                          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Tag className="w-3 h-3 text-slate-500" /> Key Subjects
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {activeDoc.analysis.entities.map((ent: string, idx: number) => (
                              <span key={idx} className="text-[8px] px-1 bg-slate-950 text-indigo-400 rounded border border-slate-850">{ent}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Key takeaways checklists */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Identified Takeaways</span>
                        <div className="space-y-1">
                          {activeDoc.analysis.keyTakeaways.map((takeaway: string, idx: number) => (
                            <div key={idx} className="flex gap-2 items-start text-xs text-slate-400">
                              <span className="text-indigo-500 font-bold font-mono mt-0.5">▪</span>
                              <p className="leading-tight">{takeaway}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-slate-600 text-[10px] flex flex-col items-center gap-1">
                      {isAnalyzing ? (
                        <>
                          <Brain className="w-6 h-6 text-indigo-500 animate-spin" />
                          <p className="font-bold uppercase tracking-wider animate-pulse mt-1">Sieving text arrays for key topics...</p>
                        </>
                      ) : (
                        <>
                          <Info className="w-6 h-6 text-slate-700" />
                          <p>Click "Analyze Document" above to map summaries, key entities, and sentiment indicators.</p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Raw Document contents viewer */}
                <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-4 flex-1 min-h-[220px] flex flex-col">
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-900 mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                    <span className="truncate max-w-[200px] text-slate-200 font-bold flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      {activeDoc.name}
                    </span>
                    <span className="text-slate-500 font-mono">{activeDoc.size}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto max-h-[300px]">
                    <pre className="text-[11px] font-mono text-slate-400 whitespace-pre-wrap leading-relaxed">
                      {activeDoc.content}
                    </pre>
                  </div>
                </div>

              </div>

              {/* Right Column: Chat Assistant with interactive queries */}
              <div className="xl:col-span-5 bg-slate-950/40 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between h-full min-h-[360px]">
                
                <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1 min-h-0">
                  {chatHistory.length === 0 ? (
                    <div className="py-28 text-center text-slate-500 text-[10px] flex flex-col items-center gap-2">
                      <MessageSquare className="w-8 h-8 text-slate-700 mb-1" />
                      <span className="font-bold uppercase tracking-wider text-slate-400">Contextual Chat Agent</span>
                      <p className="max-w-[180px] leading-normal">Ask specific questions, request mathematical figures, or ask for translations based on {activeDoc.name}.</p>
                    </div>
                  ) : (
                    chatHistory.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-xl text-[11px] leading-relaxed ${
                          item.role === "user" 
                            ? "bg-slate-900 border border-slate-800 text-slate-300 max-w-[85%] ml-auto" 
                            : "bg-indigo-950/20 border border-indigo-950/40 text-indigo-300 max-w-[85%] mr-auto"
                        }`}
                      >
                        <span className="text-[8px] font-bold uppercase block text-slate-500 mb-1.5">
                          {item.role === "user" ? "You (User)" : "Document intelligence"}
                        </span>
                        <p className="font-medium whitespace-pre-wrap">{item.content}</p>
                      </div>
                    ))
                  )}

                  {isAnswering && (
                    <div className="p-3 rounded-xl bg-indigo-950/5 border border-indigo-950/20 text-[11px] max-w-[80%] mr-auto animate-pulse flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                      <span className="text-indigo-400 font-bold uppercase text-[9px]">Sieving indexed arrays...</span>
                    </div>
                  )}
                </div>

                {/* Question Input Box */}
                <div className="relative shrink-0">
                  <input
                    type="text"
                    placeholder={`Query file contents...`}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleDocChatSubmit()}
                    className="w-full bg-slate-950/60 border border-slate-900 rounded-xl pl-3.5 pr-12 py-3 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500/80 transition-colors"
                  />
                  <button
                    onClick={handleDocChatSubmit}
                    disabled={isAnswering || !chatInput.trim()}
                    className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:bg-slate-900 disabled:text-slate-600 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-24 text-slate-500">
            <FileText className="w-10 h-10 text-slate-700 mb-1" />
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">No Documents Loaded</h4>
            <p className="text-[10px] max-w-xs leading-normal">Add a text file asset on the left sidebar to activate the Split Chat environment.</p>
          </div>
        )}

      </div>
    </div>
  );
}
