import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Enquiry } from '../../types';
import { ChannelBadge, StatusBadge } from '../badges';
import { colors, spacing, radius, priorityColors, typography } from '../../theme';
import { formatRelativeTime } from '../../utils/labels';

interface EscalationCardProps {
  enquiry: Enquiry;
  onPress: () => void;
}

export function EscalationCard({ enquiry, onPress }: EscalationCardProps) {
  const priorityStyle = priorityColors[enquiry.priority];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.alertRow}>
        <Ionicons name="alert-circle" size={18} color={colors.danger} />
        <View style={[styles.priorityPill, { backgroundColor: priorityStyle.bg }]}>
          <Text style={[styles.priorityText, { color: priorityStyle.text }]}>
            {enquiry.priority} priority
          </Text>
        </View>
      </View>

      <Text style={styles.customerName}>{enquiry.customerName}</Text>
      <Text style={styles.subject} numberOfLines={1}>
        {enquiry.subject}
      </Text>

      {enquiry.escalationReason ? (
        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>Escalation reason</Text>
          <Text style={styles.reasonText}>{enquiry.escalationReason}</Text>
        </View>
      ) : null}

      <View style={styles.footer}>
        <ChannelBadge channel={enquiry.channel} compact />
        <StatusBadge status={enquiry.conversationStatus} />
        <Text style={styles.time}>{formatRelativeTime(enquiry.updatedAt)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dangerMuted,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.92,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  priorityPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityText: {
    ...typography.captionMedium,
    textTransform: 'capitalize',
  },
  customerName: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  subject: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  reasonBox: {
    backgroundColor: colors.dangerMuted,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  reasonLabel: {
    ...typography.captionMedium,
    color: colors.danger,
    marginBottom: 4,
  },
  reasonText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
    marginLeft: 'auto',
  },
});
