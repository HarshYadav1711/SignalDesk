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

function formatClock(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Compact relative time for list cards: `2m ago`, `Yesterday, 4:32 PM`. */
export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const dayOffset = dayOffsetFromToday(date, now);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return 'Just now';
  if (dayOffset === 0) {
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${diffHours}h ago`;
  }
  if (dayOffset === 1) return `Yesterday, ${formatClock(date)}`;
  if (dayOffset > 1 && dayOffset < 7) return `${dayOffset}d ago`;

  const includeYear = date.getFullYear() !== now.getFullYear();
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' as const } : {}),
  });
}

/** Follow-up due line: `Due in 18 mins`, `Overdue by 2h`, `Tomorrow, 10:00 AM`. */
export function formatFollowUpDue(isoDate: string, status: FollowUpStatus): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(Math.abs(diffMs) / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const dayOffset = dayOffsetFromToday(date, now);
  const clock = formatClock(date);

  if (status === 'overdue' || diffMs < 0) {
    if (diffMins < 60) return `Overdue by ${diffMins}m`;
    if (diffHours < 24 && dayOffset === 0) return `Overdue by ${diffHours}h`;
    if (dayOffset === 1) return `Overdue since yesterday, ${clock}`;
    return `Overdue · ${formatRelativeTime(isoDate)}`;
  }

  if (dayOffset === 0) {
    if (diffMins < 60) return `Due in ${diffMins} mins`;
    return `Today, ${clock}`;
  }
  if (dayOffset === -1) return `Tomorrow, ${clock}`;
  if (dayOffset === 1) return `Yesterday, ${clock}`;

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Legacy alias used in conversation follow-up banner. */
export function formatDueTime(isoDate: string): string {
  return formatFollowUpDue(isoDate, 'due_today');
}

export function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const dayOffset = dayOffsetFromToday(date, now);
  const clock = formatClock(date);

  if (dayOffset === 0) return `Today, ${clock}`;
  if (dayOffset === 1) return `Yesterday, ${clock}`;

  const includeYear = date.getFullYear() !== now.getFullYear();
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' as const } : {}),
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatLastActivity(isoDate: string): string {
  return `Last activity ${formatRelativeTime(isoDate)}`;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

export function formatOperationsSubtitle(
  counts?: { open: number; escalations: number; dueFollowUps: number }
): string {
  const now = new Date();
  const day = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  const clock = formatClock(now);
  if (!counts) return `${day} · ${clock}`;
  const parts = [`${day} · ${clock}`];
  if (counts.escalations > 0) parts.push(`${counts.escalations} escalated`);
  if (counts.dueFollowUps > 0) parts.push(`${counts.dueFollowUps} follow-ups due`);
  return parts.join(' · ');
}
