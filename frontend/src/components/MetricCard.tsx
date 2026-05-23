import { StyleSheet, Text, View } from "react-native";

import type { DashboardMetric } from "../types";
import { colors, statusColors } from "../theme/colors";
import { spacing, typography } from "../theme/spacing";

interface MetricCardProps {
  metric: DashboardMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const accent = statusColors[metric.tone] ?? colors.primary;
  return (
    <View style={[styles.card, { borderLeftColor: accent }]}>
      <Text style={styles.label}>{metric.label}</Text>
      <Text style={styles.value}>{metric.value}</Text>
      <Text style={[styles.delta, { color: accent }]}>{metric.delta}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "46%",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    borderLeftWidth: 4,
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: { ...typography.caption, marginBottom: spacing.sm },
  value: { fontSize: 28, fontWeight: "700", color: colors.text },
  delta: { ...typography.caption, marginTop: spacing.xs },
});
