import { Pressable, StyleSheet, Text, View } from "react-native";

import type { ConversationListItem } from "../types";
import { colors } from "../theme/colors";
import { spacing, typography } from "../theme/spacing";
import { ChannelBadge } from "./ChannelBadge";
import { StatusPill } from "./StatusPill";

interface ConversationCardProps {
  item: ConversationListItem;
  onPress: () => void;
  meta?: string;
}

function formatTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ConversationCard({ item, onPress, meta }: ConversationCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.row}>
        <Text style={styles.name}>{item.customerName}</Text>
        <Text style={styles.time}>{formatTime(item.lastMessageAt)}</Text>
      </View>
      <Text style={styles.subject}>{item.subject}</Text>
      <Text style={styles.preview} numberOfLines={2}>
        {item.preview}
      </Text>
      <View style={styles.footer}>
        <ChannelBadge channel={item.channel} />
        <StatusPill status={item.status} />
      </View>
      {meta ? <Text style={styles.meta}>{meta}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.92 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  name: { ...typography.body, fontWeight: "600" },
  time: { ...typography.caption },
  subject: { ...typography.body, fontWeight: "600", marginBottom: spacing.xs },
  preview: { ...typography.subtitle, lineHeight: 20 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
  },
  meta: {
    ...typography.caption,
    marginTop: spacing.sm,
    color: colors.primary,
  },
});
