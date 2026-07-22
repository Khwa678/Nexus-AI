export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  files?: { name: string; type: string; size: number; data?: string }[];
  thinking?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  isPinned: boolean;
  timestamp: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
}

export interface ResearchReport {
  id: string;
  topic: string;
  summary: string;
  citations: string[];
  report: string;
  timestamp: number;
}

export interface ResumeAnalysis {
  id: string;
  name: string;
  score: number;
  matches: string[];
  suggestions: string[];
  questions: string[];
  role: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  size: string;
  content: string;
  timestamp: number;
}

export interface VoiceSession {
  id: string;
  timestamp: number;
  transcript: { role: 'user' | 'agent'; text: string; audioUrl?: string }[];
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  trigger: string;
  action: string;
  active: boolean;
  lastRun?: number;
}

export interface AgentInfo {
  id: string;
  name: string;
  description: string;
  avatar: string;
  capabilities: string[];
  memoryCount: number;
}
