import type { Channel, ConversationStatus, EventType, FollowUpStatus } from '../types';

export const channelLabels: Record<Channel, string> = {
  email: 'Email',
  whatsapp: 'WhatsApp',
  web_chat: 'Web chat',
  phone: 'Phone',
};

export const statusLabels: Record<ConversationStatus, string> = {
  new: 'New',
  matched: 'Matched',
  escalated: 'Escalated',
  awaiting_reply: 'Awaiting reply',
  scheduled: 'Scheduled',
  closed: 'Closed',
};

export const followUpStatusLabels: Record<FollowUpStatus, string> = {
  overdue: 'Overdue',
  due_today: 'Due today',
  upcoming: 'Upcoming',
};

export const eventTypeLabels: Record<EventType, string> = {
  enquiry_created: 'Received',
  task_started: 'Processing',
  sop_matched: 'SOP matched',
  auto_escalated: 'Auto-escalated',
  manual_escalated: 'Escalated',
  follow_up: 'Follow-up',
  response_suggested: 'Response ready',
};

export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDueTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

export function formatOperationsSubtitle(): string {
  const now = new Date();
  const day = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  return `${day} — triage queue overview`;
}
