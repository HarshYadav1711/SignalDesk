import { View, Text, StyleSheet } from 'react-native';
import type { FollowUpStatus } from '../../types';
import { followUpStatusColors } from '../../theme';
import { followUpStatusLabels } from '../../utils/labels';
import { typography } from '../../theme';

interface FollowUpStatusBadgeProps {
  status: FollowUpStatus;
}

export function FollowUpStatusBadge({ status }: FollowUpStatusBadgeProps) {
  const palette = followUpStatusColors[status];

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <Text style={[styles.label, { color: palette.text }]}>
        {followUpStatusLabels[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  label: {
    ...typography.badge,
    textTransform: 'none',
    fontSize: 11,
  },
});
