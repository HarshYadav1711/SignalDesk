export const colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  primary: '#2563EB',
  primaryMuted: '#DBEAFE',
  success: '#059669',
  successMuted: '#D1FAE5',
  warning: '#D97706',
  warningMuted: '#FEF3C7',
  danger: '#DC2626',
  dangerMuted: '#FEE2E2',
  info: '#0891B2',
  infoMuted: '#CFFAFE',

  tabInactive: '#64748B',
  tabActive: '#2563EB',
  headerBackground: '#0F172A',
} as const;

export const channelColors: Record<
  import('../types').Channel,
  { bg: string; text: string; icon: string }
> = {
  email: { bg: '#EEF2FF', text: '#4338CA', icon: '#6366F1' },
  whatsapp: { bg: '#DCFCE7', text: '#166534', icon: '#22C55E' },
  web_chat: { bg: '#FCE7F3', text: '#9D174D', icon: '#EC4899' },
  phone: { bg: '#FFEDD5', text: '#9A3412', icon: '#F97316' },
};

export const statusColors: Record<
  import('../types').ConversationStatus,
  { bg: string; text: string }
> = {
  new: { bg: '#DBEAFE', text: '#1D4ED8' },
  matched: { bg: '#D1FAE5', text: '#047857' },
  escalated: { bg: '#FEE2E2', text: '#B91C1C' },
  awaiting_reply: { bg: '#FEF3C7', text: '#B45309' },
  scheduled: { bg: '#E0E7FF', text: '#4338CA' },
  closed: { bg: '#F1F5F9', text: '#475569' },
};

export const followUpStatusColors: Record<
  import('../types').FollowUpStatus,
  { bg: string; text: string }
> = {
  overdue: { bg: '#FEE2E2', text: '#B91C1C' },
  due_today: { bg: '#FEF3C7', text: '#B45309' },
  upcoming: { bg: '#E0E7FF', text: '#4338CA' },
};

export const metricAccentColors: Record<
  import('../types').DashboardMetric['accentKey'],
  { bg: string; text: string }
> = {
  primary: { bg: '#DBEAFE', text: '#1D4ED8' },
  warning: { bg: '#FEF3C7', text: '#B45309' },
  success: { bg: '#D1FAE5', text: '#047857' },
  danger: { bg: '#FEE2E2', text: '#B91C1C' },
};

export const priorityColors: Record<
  import('../types').Priority,
  { bg: string; text: string }
> = {
  high: { bg: '#FEE2E2', text: '#B91C1C' },
  medium: { bg: '#FEF3C7', text: '#B45309' },
  low: { bg: '#F1F5F9', text: '#64748B' },
};
