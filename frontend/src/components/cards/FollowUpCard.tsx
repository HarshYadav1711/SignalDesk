import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { FollowUp } from '../../types';
import { ChannelBadge, FollowUpStatusBadge } from '../badges';
import { colors, spacing, cardBase, cardPressed, typography } from '../../theme';
import { formatDueTime } from '../../utils/labels';

interface FollowUpCardProps {
  followUp: FollowUp;
  onPress?: () => void;
}

export function FollowUpCard({ followUp, onPress }: FollowUpCardProps) {
  const content = (
    <>
      <View style={styles.header}>
        <Text style={styles.customerName} numberOfLines={1}>
          {followUp.customerName}
        </Text>
        <FollowUpStatusBadge status={followUp.status} />
      </View>

      <Text style={styles.subject} numberOfLines={1}>
        {followUp.subject}
      </Text>

      <View style={styles.dueRow}>
        <Text style={styles.dueLabel}>Due</Text>
        <Text style={styles.dueTime}>{formatDueTime(followUp.dueAt)}</Text>
      </View>

      <Text style={styles.note} numberOfLines={2}>
        {followUp.note}
      </Text>

      <View style={styles.footer}>
        <ChannelBadge channel={followUp.channel} compact />
      </View>
    </>
  );

  if (!onPress) {
    return <View style={styles.card}>{content}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {content}
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
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  customerName: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    flex: 1,
    minWidth: 0,
  },
  subject: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  dueLabel: {
    ...typography.captionMedium,
    color: colors.textMuted,
  },
  dueTime: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  note: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
