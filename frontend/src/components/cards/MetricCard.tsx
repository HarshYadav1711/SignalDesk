import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { DashboardMetric } from '../../types';
import { colors, spacing, cardBase, metricAccentColors, typography } from '../../theme';

interface MetricCardProps {
  metric: DashboardMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const accent = metricAccentColors[metric.accentKey];
  const trendIcon =
    metric.trend.direction === 'up'
      ? 'trending-up'
      : metric.trend.direction === 'down'
        ? 'trending-down'
        : 'remove-outline';

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{metric.label}</Text>
      <Text style={[styles.value, { color: accent.text }]}>{metric.value}</Text>
      <View style={styles.trendRow}>
        <Ionicons name={trendIcon} size={13} color={colors.textMuted} />
        <Text style={styles.trend} numberOfLines={1}>
          {metric.trend.label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardBase,
    marginBottom: 0,
    flex: 1,
    minWidth: '46%',
    minHeight: 108,
    justifyContent: 'space-between',
  },
  label: {
    ...typography.captionMedium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.metricValue,
    marginBottom: spacing.sm,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  trend: {
    ...typography.caption,
    color: colors.textMuted,
    flex: 1,
  },
});
