import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { ActivityItem } from '../../types';
import { ChannelBadge } from '../badges';
import { colors, spacing, radius, typography } from '../../theme';
import { formatRelativeTime } from '../../utils/labels';

interface ActivityFeedItemProps {
  item: ActivityItem;
  onPress?: () => void;
}

export function ActivityFeedItem({ item, onPress }: ActivityFeedItemProps) {
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
      <ChannelBadge channel={item.channel} compact />
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
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    flex: 1,
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
