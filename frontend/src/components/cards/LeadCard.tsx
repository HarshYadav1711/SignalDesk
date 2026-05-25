import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { Enquiry } from '../../types';
import { ChannelBadge, StatusBadge } from '../badges';
import { colors, spacing, cardBase, cardPressed, typography } from '../../theme';
import { formatRelativeTime, truncate } from '../../utils/labels';
import { getOperationalLabel, getLeadMetaLine } from '../../utils/operations';

interface LeadCardProps {
  enquiry: Enquiry;
  onPress: () => void;
  queueIndex?: number;
}

export function LeadCard({ enquiry, onPress, queueIndex }: LeadCardProps) {
  const operational = getOperationalLabel(enquiry);
  const metaLine =
    queueIndex !== undefined
      ? getLeadMetaLine(enquiry, queueIndex)
      : operational;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          {enquiry.unread ? <View style={styles.unreadDot} /> : null}
          <Text style={styles.customerName} numberOfLines={1}>
            {enquiry.customerName}
          </Text>
        </View>
        <Text style={styles.time}>{formatRelativeTime(enquiry.updatedAt)}</Text>
      </View>

      <Text style={styles.operational} numberOfLines={1}>
        {metaLine}
      </Text>

      <Text style={styles.subject} numberOfLines={1}>
        {enquiry.subject}
      </Text>
      <Text style={styles.preview} numberOfLines={2}>
        {truncate(enquiry.message.split('--- follow-up ---')[0].trim(), 120)}
      </Text>

      <View style={styles.footer}>
        <ChannelBadge channel={enquiry.channel} compact />
        <StatusBadge status={enquiry.conversationStatus} />
        {enquiry.matchedSopTitle ? (
          <Text style={styles.sopTag} numberOfLines={1}>
            {enquiry.matchedSopTitle}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardBase,
  },
  pressed: {
    ...cardPressed,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
    gap: spacing.sm,
  },
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
    minWidth: 0,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    flexShrink: 0,
  },
  customerName: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    flex: 1,
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
    flexShrink: 0,
  },
  operational: {
    ...typography.captionMedium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  subject: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  preview: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    rowGap: spacing.xs,
  },
  sopTag: {
    ...typography.captionMedium,
    color: colors.success,
    flex: 1,
    minWidth: 80,
    textAlign: 'right',
  },
});
