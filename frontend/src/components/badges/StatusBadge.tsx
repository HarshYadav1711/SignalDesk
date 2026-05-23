import { View, Text, StyleSheet } from 'react-native';
import type { ConversationStatus } from '../../types';
import { statusColors } from '../../theme';
import { statusLabels } from '../../utils/labels';
import { typography } from '../../theme';

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
