import { colors } from './colors';
import { layout, radius, spacing } from './spacing';

/** Base card chrome shared across list and feed surfaces */
export const cardBase = {
  backgroundColor: colors.surface,
  borderRadius: radius.md,
  padding: spacing.lg,
  borderWidth: 1,
  borderColor: colors.border,
  marginBottom: layout.cardGap,
} as const;

export const cardPressed = {
  backgroundColor: colors.surfaceMuted,
  opacity: 0.96,
} as const;
