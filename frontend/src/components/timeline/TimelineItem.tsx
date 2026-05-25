import { View, Text, StyleSheet } from 'react-native';
import type { EnquiryEvent } from '../../types';
import { colors, spacing, typography } from '../../theme';
import { eventTypeLabels, formatDateTime } from '../../utils/labels';
import { getTimelineOperationalHint } from '../../utils/operations';

interface TimelineItemProps {
  event: EnquiryEvent;
  isLast: boolean;
}

const eventAccent: Record<string, string> = {
  enquiry_created: colors.primary,
  task_started: colors.info,
  sop_matched: colors.success,
  response_suggested: colors.success,
  auto_escalated: colors.danger,
  manual_escalated: colors.danger,
  follow_up: colors.warning,
};

export function TimelineItem({ event, isLast }: TimelineItemProps) {
  const accent = eventAccent[event.eventType] ?? colors.textMuted;
  const hint = getTimelineOperationalHint(event);

  return (
    <View style={styles.row}>
      <View style={styles.lineCol}>
        <View style={[styles.dot, { borderColor: accent, backgroundColor: accent }]} />
        {!isLast ? <View style={styles.line} /> : null}
      </View>
      <View style={[styles.content, !isLast && styles.contentSpaced]}>
        <View style={styles.header}>
          <Text style={styles.eventLabel}>{eventTypeLabels[event.eventType]}</Text>
          <Text style={styles.time}>{formatDateTime(event.createdAt)}</Text>
        </View>
        {hint ? (
          <Text style={styles.hint} numberOfLines={1}>
            {hint}
          </Text>
        ) : null}
        <Text style={styles.summary}>{event.summary}</Text>
        {event.detail ? <Text style={styles.detail}>{event.detail}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  lineCol: {
    width: 20,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginTop: 4,
    marginBottom: 4,
  },
  content: {
    flex: 1,
    paddingLeft: spacing.md,
  },
  contentSpaced: {
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: 2,
  },
  eventLabel: {
    ...typography.captionMedium,
    color: colors.textPrimary,
    flex: 1,
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summary: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  detail: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
});
