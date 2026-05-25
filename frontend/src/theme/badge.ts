import { radius, spacing } from './spacing';

/** Shared dimensions for channel, status, and follow-up badges */
export const badgeLayout = {
  gap: spacing.xs,
  radius: radius.sm,
  paddingHorizontal: 8,
  paddingVertical: 4,
  paddingHorizontalCompact: 6,
  paddingVerticalCompact: 3,
  fontSize: 11,
  iconSize: 13,
  iconSizeCompact: 12,
} as const;
