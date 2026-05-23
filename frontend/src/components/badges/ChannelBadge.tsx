import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Channel } from '../../types';
import { channelColors } from '../../theme';
import { channelLabels } from '../../utils/labels';
import { typography } from '../../theme';

const channelIcons: Record<Channel, keyof typeof Ionicons.glyphMap> = {
  email: 'mail-outline',
  whatsapp: 'logo-whatsapp',
  web_chat: 'chatbubble-ellipses-outline',
  phone: 'call-outline',
};

interface ChannelBadgeProps {
  channel: Channel;
  compact?: boolean;
}

export function ChannelBadge({ channel, compact }: ChannelBadgeProps) {
  const palette = channelColors[channel];

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }, compact && styles.compact]}>
      <Ionicons name={channelIcons[channel]} size={compact ? 12 : 13} color={palette.icon} />
      <Text style={[styles.label, { color: palette.text }, compact && styles.labelCompact]}>
        {channelLabels[channel]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  compact: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  label: {
    ...typography.badge,
    textTransform: 'none',
    fontSize: 12,
  },
  labelCompact: {
    fontSize: 11,
  },
});
