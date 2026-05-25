import { View, Text, StyleSheet } from 'react-native';
import type { Enquiry } from '../../types';
import { ChannelBadge, StatusBadge } from '../badges';
import { colors, spacing, radius, typography } from '../../theme';
import { formatDateTime } from '../../utils/labels';

interface ConversationHeaderProps {
  enquiry: Enquiry;
}

export function ConversationHeader({ enquiry }: ConversationHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.customerName}>{enquiry.customerName}</Text>
      <Text style={styles.subject}>{enquiry.subject}</Text>
      <View style={styles.badges}>
        <ChannelBadge channel={enquiry.channel} />
        <StatusBadge status={enquiry.conversationStatus} />
      </View>
      <View style={styles.messageBox}>
        <Text style={styles.messageLabel}>Latest message</Text>
        <Text style={styles.message}>{enquiry.message}</Text>
        <Text style={styles.meta}>Received {formatDateTime(enquiry.createdAt)}</Text>
      </View>
      {enquiry.escalationReason ? (
        <View style={styles.escalationBox}>
          <Text style={styles.escalationLabel}>Escalation</Text>
          <Text style={styles.escalationText}>{enquiry.escalationReason}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  customerName: {
    ...typography.screenTitle,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subject: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  messageBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageLabel: {
    ...typography.captionMedium,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  escalationBox: {
    marginTop: spacing.md,
    backgroundColor: colors.dangerMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dangerMuted,
  },
  escalationLabel: {
    ...typography.captionMedium,
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  escalationText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});
