import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  /** Tighter top spacing when this is the first block on a screen */
  isFirst?: boolean;
}

export function SectionHeader({ title, actionLabel, isFirst }: SectionHeaderProps) {
  return (
    <View style={[styles.container, isFirst && styles.containerFirst]}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel ? <Text style={styles.action}>{actionLabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.xl,
  },
  containerFirst: {
    marginTop: spacing.md,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.textSecondary,
  },
  action: {
    ...typography.captionMedium,
    color: colors.textMuted,
  },
});
