export type Channel = 'email' | 'whatsapp' | 'web_chat' | 'phone';

export type EnquiryStatus =
  | 'received'
  | 'processing'
  | 'matched'
  | 'escalated'
  | 'closed';

export type ConversationStatus =
  | 'new'
  | 'matched'
  | 'escalated'
  | 'awaiting_reply'
  | 'scheduled'
  | 'closed';

export type EventType =
  | 'enquiry_created'
  | 'task_started'
  | 'sop_matched'
  | 'auto_escalated'
  | 'manual_escalated'
  | 'follow_up'
  | 'response_suggested';

export type FollowUpStatus = 'overdue' | 'due_today' | 'upcoming';

export type Priority = 'high' | 'medium' | 'low';

export interface Enquiry {
  id: string;
  customerName: string;
  channel: Channel;
  subject: string;
  message: string;
  status: EnquiryStatus;
  conversationStatus: ConversationStatus;
  matchedSopId: string | null;
  matchedSopTitle: string | null;
  suggestedResponse: string | null;
  createdAt: string;
  updatedAt: string;
  priority: Priority;
  unread: boolean;
  escalationReason?: string | null;
}

export interface EnquiryEvent {
  id: number;
  enquiryId: string;
  eventType: EventType;
  summary: string;
  detail: string | null;
  createdAt: string;
}

export interface FollowUp {
  id: string;
  enquiryId: string;
  customerName: string;
  channel: Channel;
  subject: string;
  dueAt: string;
  note: string;
  status: FollowUpStatus;
  conversationStatus: ConversationStatus;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  trend: {
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  accentKey: 'primary' | 'warning' | 'success' | 'danger';
}

export interface ActivityItem {
  id: string;
  enquiryId: string;
  eventType: EventType | 'follow_up_due';
  title: string;
  subtitle: string;
  timestamp: string;
  channel: Channel;
}

export interface EnquiryHistoryResponse {
  enquiry: Enquiry;
  events: EnquiryEvent[];
}

export interface DashboardResponse {
  metrics: DashboardMetric[];
  activity: ActivityItem[];
  priorityQueue: Enquiry[];
}

export interface EnquiriesListResponse {
  items: Enquiry[];
  total: number;
}

export interface FollowUpsListResponse {
  items: FollowUp[];
  total: number;
}
