import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Enquiry } from '../../types';
import { ChannelBadge, StatusBadge } from '../badges';
import {
  colors,
  spacing,
  radius,
  badgeLayout,
  cardBase,
  cardPressed,
  priorityColors,
  typography,
} from '../../theme';
import { formatRelativeTime } from '../../utils/labels';
import {
  getOperationalLabel,
  getEscalationUrgency,
} from '../../utils/operations';

interface EscalationCardProps {
  enquiry: Enquiry;
  onPress: () => void;
}

export function EscalationCard({ enquiry, onPress }: EscalationCardProps) {
  const priorityStyle = priorityColors[enquiry.priority];
  const operational = getOperationalLabel(enquiry);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.alertRow}>
        <Ionicons name="alert-circle" size={16} color={colors.danger} />
        <View style={[styles.priorityPill, { backgroundColor: priorityStyle.bg }]}>
          <Text style={[styles.priorityText, { color: priorityStyle.text }]}>
            {enquiry.priority} priority
          </Text>
        </View>
      </View>

      <Text style={styles.operational} numberOfLines={1}>
        {operational}
      </Text>
      <Text style={styles.urgency} numberOfLines={1}>
        {getEscalationUrgency(enquiry)}
      </Text>

      <Text style={styles.customerName}>{enquiry.customerName}</Text>
      <Text style={styles.subject} numberOfLines={1}>
        {enquiry.subject}
      </Text>

      {enquiry.escalationReason ? (
        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>On file</Text>
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
    ...cardBase,
    borderColor: colors.dangerMuted,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
  },
  pressed: {
    ...cardPressed,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  priorityPill: {
    paddingHorizontal: badgeLayout.paddingHorizontal,
    paddingVertical: badgeLayout.paddingVerticalCompact,
    borderRadius: badgeLayout.radius,
  },
  priorityText: {
    ...typography.captionMedium,
    textTransform: 'capitalize',
    fontSize: badgeLayout.fontSize,
  },
  operational: {
    ...typography.captionMedium,
    color: colors.danger,
    marginBottom: 2,
  },
  urgency: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  customerName: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subject: {
    ...typography.body,
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
    marginBottom: spacing.xs,
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
    rowGap: spacing.xs,
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
    marginLeft: 'auto',
  },
});
