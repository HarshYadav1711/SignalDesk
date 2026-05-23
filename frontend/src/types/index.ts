export type Channel = "email" | "whatsapp" | "web_chat" | "phone";
export type ConversationStatus =
  | "new"
  | "matched"
  | "escalated"
  | "awaiting_reply"
  | "scheduled"
  | "closed";

export interface ConversationListItem {
  id: string;
  customerName: string;
  channel: Channel;
  subject: string;
  status: ConversationStatus;
  lastMessageAt: string;
  preview: string;
  assignedTo?: string;
  priority?: "low" | "medium" | "high";
  reason?: string;
  dueAt?: string;
  note?: string;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  delta: string;
  tone: "info" | "danger" | "warning" | "success";
}

export interface TimelineMessage {
  id: string;
  type: "inbound" | "outbound" | "system" | "suggested";
  author: string;
  body: string;
  at: string;
}

export interface ConversationDetail {
  id: string;
  customerName: string;
  channel: Channel;
  subject: string;
  status: ConversationStatus;
  sopTitle?: string;
  suggestedResponse?: string;
  timeline: TimelineMessage[];
}
