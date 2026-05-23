import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ChannelBadge } from "../components/ChannelBadge";
import { EmptyState } from "../components/EmptyState";
import { MessageBubble } from "../components/MessageBubble";
import { StatusPill } from "../components/StatusPill";
import { getConversation } from "../data/loadMock";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme/colors";
import { spacing, typography } from "../theme/spacing";

type Props = NativeStackScreenProps<RootStackParamList, "ConversationDetail">;

export function ConversationDetailScreen({ route }: Props) {
  const conversation = getConversation(route.params.conversationId);

  if (!conversation) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="chatbubbles-outline"
          title="Conversation not found"
          message="This thread is not in the mock dataset yet."
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.customer}>{conversation.customerName}</Text>
        <Text style={styles.subject}>{conversation.subject}</Text>
        <View style={styles.metaRow}>
          <ChannelBadge channel={conversation.channel} />
          <StatusPill status={conversation.status} />
        </View>
        {conversation.sopTitle ? (
          <Text style={styles.sop}>Playbook: {conversation.sopTitle}</Text>
        ) : null}
      </View>

      {conversation.suggestedResponse ? (
        <View style={styles.suggestedCard}>
          <Text style={styles.suggestedLabel}>Suggested response</Text>
          <Text style={styles.suggestedBody}>{conversation.suggestedResponse}</Text>
        </View>
      ) : null}

      <Text style={styles.timelineTitle}>Timeline</Text>
      {conversation.timeline.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  customer: { ...typography.title, fontSize: 22 },
  subject: { ...typography.subtitle, marginTop: spacing.xs, marginBottom: spacing.md },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sop: {
    ...typography.caption,
    color: colors.success,
    marginTop: spacing.md,
  },
  suggestedCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  suggestedLabel: { ...typography.label, color: colors.success, marginBottom: spacing.sm },
  suggestedBody: { ...typography.body, lineHeight: 22 },
  timelineTitle: {
    ...typography.body,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
});
