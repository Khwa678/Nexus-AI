import React, { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import { 
  Send, 
  Paperclip, 
  Trash2, 
  Pin, 
  Edit3, 
  Check, 
  Plus, 
  Copy, 
  MessageSquare, 
  Cpu, 
  FileText, 
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface AIChatProps {
  dbState: any;
  onUpdateDB: (updated: any) => void;
}

export default function AIChat({ dbState, onUpdateDB }: AIChatProps) {
  const [activeChatId, setActiveChatId] = useState<string>("chat-1");
  const [selectedAgentId, setSelectedAgentId] = useState<string>("agent-planner");
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; type: string; size: number }[]>([]);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dbState.chats, activeChatId, isGenerating]);

  const activeChat = dbState.chats.find((c: any) => c.id === activeChatId) || dbState.chats[0];

  const handleCreateChat = () => {
    const newChatId = `chat-${Date.now()}`;
    const agent = dbState.agents.find((a: any) => a.id === selectedAgentId) || dbState.agents[0];
    const newChat = {
      id: newChatId,
      title: `Session with ${agent.name}`,
      isPinned: false,
      timestamp: Date.now(),
      messages: [
        {
          id: `msg-${Date.now()}-1`,
          role: "system",
          content: `You are ${agent.name}, ready to work inside the workspace.`,
          timestamp: Date.now()
        },
        {
          id: `msg-${Date.now()}-2`,
          role: "model",
          content: `Hello! I am initialized as your **${agent.name}** in this chat session. ${agent.description} How can I assist you?`,
          timestamp: Date.now() + 100
        }
      ]
    };

    const updatedChats = [newChat, ...dbState.chats];
    onUpdateDB({ ...dbState, chats: updatedChats });
    setActiveChatId(newChatId);
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = dbState.chats.filter((c: any) => c.id !== id);
    if (filtered.length === 0) return;
    
    onUpdateDB({ ...dbState, chats: filtered });
    if (activeChatId === id) {
      setActiveChatId(filtered[0].id);
    }
  };

  const handleTogglePinChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = dbState.chats.map((c: any) => {
      if (c.id === id) {
        return { ...c, isPinned: !c.isPinned };
      }
      return c;
    });
    onUpdateDB({ ...dbState, chats: updated });
  };

  const handleRenameChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(id);
    const chat = dbState.chats.find((c: any) => c.id === id);
    if (chat) {
      setEditingTitle(chat.title);
    }
  };

  const handleSaveRename = (id: string) => {
    if (!editingTitle.trim()) return;
    const updated = dbState.chats.map((c: any) => {
      if (c.id === id) {
        return { ...c, title: editingTitle };
      }
      return c;
    });
    onUpdateDB({ ...dbState, chats: updated });
    setEditingChatId(null);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;
    if (isGenerating) return;

    const userMsgId = `msg-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      role: "user" as const,
      content: inputMessage,
      timestamp: Date.now(),
      files: uploadedFiles.map(f => ({ name: f.name, type: f.type, size: f.size }))
    };

    // Append to local state immediately
    const updatedMessages = [...activeChat.messages, userMsg];
    const updatedChats = dbState.chats.map((c: any) => {
      if (c.id === activeChat.id) {
        return { ...c, messages: updatedMessages, timestamp: Date.now() };
      }
      return c;
    });

    onUpdateDB({ ...dbState, chats: updatedChats });
    setInputMessage("");
    setUploadedFiles([]);
    setIsGenerating(true);

    try {
      // Call backend route
      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMsg.content,
          history: updatedMessages.filter(m => m.role !== "system"),
          agentId: selectedAgentId
        })
      });

      const data = await response.json();
      const modelReply = data.reply || data.error || "Model communication timed out.";

      const modelMsg = {
        id: `msg-${Date.now()}-model`,
        role: "model" as const,
        content: modelReply,
        timestamp: Date.now()
      };

      const finalMessages = [...updatedMessages, modelMsg];
      const finalChats = dbState.chats.map((c: any) => {
        if (c.id === activeChat.id) {
          return { ...c, messages: finalMessages, timestamp: Date.now() };
        }
        return c;
      });

      onUpdateDB({ ...dbState, chats: finalChats });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({
        name: f.name,
        type: f.type,
        size: f.size
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  return (
    <div id="ai-chat-root" className="h-[calc(100vh-8rem)] flex gap-6 relative">
      {/* Chats List Drawer */}
      <div className="w-64 border-r border-slate-900 pr-4 flex flex-col justify-between shrink-0 hidden lg:flex">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Chat Sessions</span>
            <button 
              onClick={handleCreateChat}
              className="p-1 rounded bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 cursor-pointer"
              title="New Session"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
            {dbState.chats.map((chat: any) => (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`group p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs font-semibold cursor-pointer transition-all ${
                  activeChatId === chat.id 
                    ? "bg-slate-900 border-slate-800 text-slate-200" 
                    : "bg-transparent border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 truncate flex-1">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  {editingChatId === chat.id ? (
                    <input 
                      type="text" 
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={() => handleSaveRename(chat.id)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveRename(chat.id)}
                      className="bg-slate-950 border border-indigo-500 rounded px-1.5 py-0.5 text-[11px] w-full text-slate-200 outline-none"
                      autoFocus
                    />
                  ) : (
                    <span className="truncate">{chat.title}</span>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button 
                    onClick={(e) => handleTogglePinChat(chat.id, e)}
                    className={`p-0.5 rounded text-slate-500 hover:text-slate-300 ${chat.isPinned ? "text-indigo-400" : ""}`}
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={(e) => handleRenameChat(chat.id, e)}
                    className="p-0.5 rounded text-slate-500 hover:text-slate-300"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="p-0.5 rounded text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-900">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2.5">Workspace Agent</span>
            <div className="space-y-1">
              {dbState.agents.map((agent: any) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    selectedAgentId === agent.id 
                      ? "bg-indigo-600/10 border-indigo-500/20 text-indigo-400 shadow-sm" 
                      : "bg-transparent border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 shrink-0" />
                  <div className="truncate">
                    <span className="text-[11px] font-bold block leading-none">{agent.name}</span>
                    <span className="text-[9px] text-slate-500 block truncate mt-0.5">{agent.capabilities[0]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900 text-[10px] text-slate-500 leading-normal">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400 mb-1" />
          Select specific workspace agents to delegate code reviews, ATS resume analysis, or grounding search reports.
        </div>
      </div>

      {/* Chat Conversation Area */}
      <div className="flex-1 flex flex-col justify-between bg-slate-950/20 border border-slate-900 rounded-3xl p-4 relative overflow-hidden">
        {/* Chat Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-900 mb-4 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Active Session:</span>
            <span className="text-slate-200">{activeChat.title}</span>
          </div>

          {/* Mini Agent Badge */}
          <div className="flex items-center gap-1 bg-indigo-950/30 border border-indigo-900/60 px-2 py-1 rounded-full text-[10px] font-bold text-indigo-400 uppercase tracking-wide">
            <Cpu className="w-3 h-3" />
            {dbState.agents.find((a: any) => a.id === selectedAgentId)?.name || "Planner"}
          </div>
        </div>

        {/* Message Scroll list */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
          {activeChat.messages.map((msg: any) => (
            <div 
              key={msg.id}
              className={`flex items-start gap-3.5 p-4 rounded-2xl border ${
                msg.role === "user" 
                  ? "bg-slate-900/20 border-slate-900 max-w-2xl ml-auto flex-row-reverse" 
                  : "bg-slate-950/40 border-slate-900 max-w-2xl mr-auto"
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === "user" ? "bg-indigo-600/10 text-indigo-400" : "bg-slate-900 border border-slate-800 text-slate-300"
              }`}>
                {msg.role === "user" ? "U" : <Cpu className="w-4 h-4 text-indigo-400" />}
              </div>

              <div className="space-y-2 flex-1 overflow-hidden">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <span>{msg.role === "user" ? "Candidate Workspace" : "Workspace Agent Response"}</span>
                  
                  {msg.role !== "user" && (
                    <button 
                      onClick={() => handleCopyText(msg.content, msg.id)}
                      className="p-1 rounded hover:bg-slate-900 hover:text-slate-300"
                      title="Copy Answer"
                    >
                      {copyStatus === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>

                <div className="markdown-body text-xs leading-relaxed text-slate-300 font-medium">
                  <Markdown>{msg.content}</Markdown>
                </div>

                {/* Uploaded Files attachments view */}
                {msg.files && msg.files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-900/40">
                    {msg.files.map((f: any, fIdx: number) => (
                      <div key={fIdx} className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                        <FileText className="w-3 h-3 text-indigo-400" />
                        <span>{f.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing/Generation loading indicator */}
          {isGenerating && (
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-950/40 border border-slate-900 max-w-xl mr-auto animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="space-y-2 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">Agent is reasoning...</span>
                <div className="flex items-center gap-1 pt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Uploaded attachments preview bar */}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 px-2 py-1.5 border border-slate-900 bg-slate-950/40 rounded-xl mb-2 text-xs">
            {uploadedFiles.map((f, idx) => (
              <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 border border-slate-850 rounded text-slate-300">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span className="max-w-[120px] truncate">{f.name}</span>
                <button 
                  onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                  className="text-slate-500 hover:text-rose-400 shrink-0 ml-1 font-bold text-[10px]"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Text Box Form */}
        <div className="relative">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute left-4 top-3.5 p-1 text-slate-500 hover:text-slate-300 bg-slate-900/60 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder={`Ask ${dbState.agents.find((a: any) => a.id === selectedAgentId)?.name}...`}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="w-full bg-slate-950/60 border border-slate-900 rounded-2xl pl-12 pr-12 py-3.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500/80 transition-colors shadow-inner shadow-indigo-500/2"
          />

          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() && uploadedFiles.length === 0}
            className="absolute right-4 top-3 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:bg-slate-900 disabled:text-slate-600 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
