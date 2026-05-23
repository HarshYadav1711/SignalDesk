import { StyleSheet, Text, View } from "react-native";

import type { ConversationStatus } from "../types";
import { statusColors } from "../theme/colors";
import { spacing, typography } from "../theme/spacing";

const labels: Record<ConversationStatus, string> = {
  new: "New",
  matched: "SOP matched",
  escalated: "Escalated",
  awaiting_reply: "Awaiting reply",
  scheduled: "Scheduled",
  closed: "Closed",
};

interface StatusPillProps {
  status: ConversationStatus;
}

export function StatusPill({ status }: StatusPillProps) {
  const color = statusColors[status] ?? statusColors.new;
  return (
    <View style={[styles.pill, { backgroundColor: `${color}18` }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{labels[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { ...typography.label, textTransform: "uppercase" },
});
