import { StyleSheet, Text, View } from "react-native";

import type { Channel } from "../types";
import { colors } from "../theme/colors";
import { spacing, typography } from "../theme/spacing";

const labels: Record<Channel, string> = {
  email: "Email",
  whatsapp: "WhatsApp",
  web_chat: "Web chat",
  phone: "Phone",
};

interface ChannelBadgeProps {
  channel: Channel;
}

export function ChannelBadge({ channel }: ChannelBadgeProps) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{labels[channel]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  text: {
    ...typography.label,
    color: colors.primary,
    textTransform: "uppercase",
  },
});
