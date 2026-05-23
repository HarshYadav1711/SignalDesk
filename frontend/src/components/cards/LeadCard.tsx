import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { Enquiry } from '../../types';
import { ChannelBadge, StatusBadge } from '../badges';
import { colors, spacing, radius, typography } from '../../theme';
import { formatRelativeTime, truncate } from '../../utils/labels';

interface LeadCardProps {
  enquiry: Enquiry;
  onPress: () => void;
}

export function LeadCard({ enquiry, onPress }: LeadCardProps) {
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

      <Text style={styles.subject} numberOfLines={1}>
        {enquiry.subject}
      </Text>
      <Text style={styles.preview} numberOfLines={2}>
        {truncate(enquiry.message, 120)}
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
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.92,
    backgroundColor: colors.surfaceMuted,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  customerName: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    flex: 1,
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
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
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sopTag: {
    ...typography.caption,
    color: colors.success,
    flex: 1,
    textAlign: 'right',
  },
});
