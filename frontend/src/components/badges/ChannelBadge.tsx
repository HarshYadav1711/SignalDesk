import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Channel } from '../../types';
import { channelColors, badgeLayout, typography } from '../../theme';
import { channelLabels } from '../../utils/labels';

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
      <Ionicons
        name={channelIcons[channel]}
        size={compact ? badgeLayout.iconSizeCompact : badgeLayout.iconSize}
        color={palette.icon}
      />
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
    gap: badgeLayout.gap,
    paddingHorizontal: badgeLayout.paddingHorizontal,
    paddingVertical: badgeLayout.paddingVertical,
    borderRadius: badgeLayout.radius,
  },
  compact: {
    paddingHorizontal: badgeLayout.paddingHorizontalCompact,
    paddingVertical: badgeLayout.paddingVerticalCompact,
  },
  label: {
    ...typography.badge,
    textTransform: 'none',
    fontSize: badgeLayout.fontSize,
  },
  labelCompact: {
    fontSize: badgeLayout.fontSize,
  },
});
