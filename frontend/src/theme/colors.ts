export const colors = {
  background: "#F4F6F9",
  surface: "#FFFFFF",
  primary: "#0F4C81",
  primaryDark: "#0B3A61",
  accent: "#0EA5A4",
  text: "#0F172A",
  textMuted: "#64748B",
  border: "#E2E8F0",
  danger: "#DC2626",
  warning: "#D97706",
  success: "#059669",
  info: "#2563EB",
  tabBar: "#0F172A",
  tabInactive: "#94A3B8",
};

export const statusColors: Record<string, string> = {
  new: colors.info,
  matched: colors.success,
  escalated: colors.danger,
  awaiting_reply: colors.warning,
  scheduled: colors.accent,
  closed: colors.textMuted,
};
