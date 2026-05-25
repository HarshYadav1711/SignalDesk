import { View, Text, StyleSheet } from 'react-native';
import type { FollowUpStatus } from '../../types';
import { followUpStatusColors, badgeLayout, typography } from '../../theme';
import { followUpStatusLabels } from '../../utils/labels';

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
    paddingHorizontal: badgeLayout.paddingHorizontal,
    paddingVertical: badgeLayout.paddingVertical,
    borderRadius: badgeLayout.radius,
  },
  label: {
    ...typography.badge,
    textTransform: 'none',
    fontSize: badgeLayout.fontSize,
  },
});
