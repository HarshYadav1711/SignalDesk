import { View, Text, StyleSheet } from 'react-native';
import type { ConversationStatus } from '../../types';
import { statusColors, badgeLayout, typography } from '../../theme';
import { statusLabels } from '../../utils/labels';

interface StatusBadgeProps {
  status: ConversationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const palette = statusColors[status];

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <Text style={[styles.label, { color: palette.text }]}>{statusLabels[status]}</Text>
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
