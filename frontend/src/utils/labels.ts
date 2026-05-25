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

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function dayOffsetFromToday(date: Date, now = new Date()): number {
  const msPerDay = 86400000;
  return Math.round((startOfDay(now).getTime() - startOfDay(date).getTime()) / msPerDay);
}

const timeStyle: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: '2-digit',
};

const dateStyle: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
};

export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const dayOffset = dayOffsetFromToday(date, now);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return 'Just now';
  if (dayOffset === 0) {
    if (diffMins < 60) return `${diffMins} min ago`;
    return `${diffHours} hr ago`;
  }
  if (dayOffset === 1) return 'Yesterday';
  if (dayOffset > 1 && dayOffset < 7) return `${dayOffset} days ago`;

  const includeYear = date.getFullYear() !== now.getFullYear();
  return date.toLocaleDateString(undefined, {
    ...dateStyle,
    ...(includeYear ? { year: 'numeric' as const } : {}),
  });
}

export function formatDueTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const dayOffset = dayOffsetFromToday(date, now);
  const time = date.toLocaleTimeString(undefined, timeStyle);

  if (dayOffset === 0) return `Today, ${time}`;
  if (dayOffset === 1) return `Yesterday, ${time}`;
  if (dayOffset === -1) return `Tomorrow, ${time}`;

  return date.toLocaleString(undefined, {
    ...dateStyle,
    ...timeStyle,
  });
}

export function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const dayOffset = dayOffsetFromToday(date, now);
  const time = date.toLocaleTimeString(undefined, timeStyle);

  if (dayOffset === 0) return `Today, ${time}`;
  if (dayOffset === 1) return `Yesterday, ${time}`;

  const includeYear = date.getFullYear() !== now.getFullYear();
  return date.toLocaleString(undefined, {
    ...dateStyle,
    ...(includeYear ? { year: 'numeric' as const } : {}),
    ...timeStyle,
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
    month: 'short',
    day: 'numeric',
  });
  return `${day} · Operations overview`;
}
