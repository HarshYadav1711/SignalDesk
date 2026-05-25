import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { ActivityItem } from '../../types';
import { ChannelBadge } from '../badges';
import { colors, spacing, cardBase, cardPressed, typography } from '../../theme';
import { formatRelativeTime } from '../../utils/labels';
import { getActivityContextLabel } from '../../utils/operations';

interface ActivityFeedItemProps {
  item: ActivityItem;
  onPress?: () => void;
}

export function ActivityFeedItem({ item, onPress }: ActivityFeedItemProps) {
  const context = getActivityContextLabel(item);

  const inner = (
    <>
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.time}>{formatRelativeTime(item.timestamp)}</Text>
      </View>
      <Text style={styles.subtitle} numberOfLines={2}>
        {item.subtitle}
      </Text>
      <View style={styles.badgeRow}>
        <ChannelBadge channel={item.channel} compact />
        <Text style={styles.context}>{context}</Text>
      </View>
    </>
  );

  if (!onPress) {
    return <View style={styles.card}>{inner}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {inner}
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    flex: 1,
    minWidth: 0,
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
    flexShrink: 0,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  context: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
