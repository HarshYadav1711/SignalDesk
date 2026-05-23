import { StyleSheet, Text, View } from "react-native";

import type { TimelineMessage } from "../types";
import { colors } from "../theme/colors";
import { spacing, typography } from "../theme/spacing";

interface MessageBubbleProps {
  message: TimelineMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isInbound = message.type === "inbound";
  const isSystem = message.type === "system";
  const isSuggested = message.type === "suggested";

  if (isSystem) {
    return (
      <View style={styles.systemWrap}>
        <Text style={styles.systemText}>{message.body}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.row,
        isInbound ? styles.inboundRow : styles.outboundRow,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isInbound && styles.inbound,
          !isInbound && styles.outbound,
          isSuggested && styles.suggested,
        ]}
      >
        <Text
          style={[
            styles.author,
            !isInbound && !isSuggested && styles.onPrimary,
          ]}
        >
          {message.author}
        </Text>
        <Text
          style={[
            styles.body,
            !isInbound && !isSuggested && styles.onPrimary,
          ]}
        >
          {message.body}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: spacing.md },
  inboundRow: { alignItems: "flex-start" },
  outboundRow: { alignItems: "flex-end" },
  bubble: {
    maxWidth: "88%",
    borderRadius: 14,
    padding: spacing.md,
  },
  inbound: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  outbound: { backgroundColor: colors.primary },
  suggested: { backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#A7F3D0" },
  author: { ...typography.caption, marginBottom: spacing.xs },
  body: { ...typography.body, lineHeight: 21 },
  onPrimary: { color: "#FFFFFF" },
  systemWrap: {
    alignItems: "center",
    marginVertical: spacing.sm,
  },
  systemText: {
    ...typography.caption,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    overflow: "hidden",
  },
});
