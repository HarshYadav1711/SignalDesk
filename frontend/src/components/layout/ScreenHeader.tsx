import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, layout, spacing, radius, typography } from '../../theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function ScreenHeader({ title, subtitle, badge }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.brandMark}>
          <Ionicons name="pulse" size={18} color={colors.textInverse} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.eyebrow}>SignalDesk</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.headerBackground,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
  },
  eyebrow: {
    ...typography.captionMedium,
    color: colors.headerSubtitle,
    marginBottom: 2,
  },
  title: {
    ...typography.screenTitle,
    color: colors.textInverse,
    fontSize: 20,
  },
  subtitle: {
    ...typography.body,
    color: colors.headerSubtitle,
    marginTop: spacing.sm,
    marginLeft: 48,
    lineHeight: 20,
  },
  badge: {
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: layout.headerBadgeRadius,
  },
  badgeText: {
    ...typography.captionMedium,
    color: colors.textInverse,
    fontSize: 11,
  },
});
