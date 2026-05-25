import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { SectionHeader, EmptyState } from '../components/layout';
import { ConversationHeader } from '../components/conversation/ConversationHeader';
import { SuggestedResponseBlock } from '../components/conversation/SuggestedResponseBlock';
import { TimelineItem } from '../components/timeline/TimelineItem';
import { getEnquiryHistory, getFollowUpByEnquiryId } from '../data/mockData';
import { formatFollowUpDue } from '../utils/labels';
import { getFollowUpOperationalLabel } from '../utils/operations';
import { colors, layout, spacing, radius, typography } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type DetailRoute = RouteProp<RootStackParamList, 'ConversationDetail'>;

export function ConversationDetailScreen() {
  const { params } = useRoute<DetailRoute>();
  const history = getEnquiryHistory(params.enquiryId);
  const followUp = getFollowUpByEnquiryId(params.enquiryId);

  if (!history) {
    return (
      <View style={styles.missing}>
        <EmptyState
          icon="search-outline"
          title="Conversation not found"
          message="This enquiry is not in the current dataset. Return to a list view to pick another thread."
          hint="Use Back to return to Leads or Escalations"
        />
      </View>
    );
  }

  const { enquiry, events } = history;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ConversationHeader enquiry={enquiry} />

      {enquiry.suggestedResponse ? (
        <SuggestedResponseBlock
          sopTitle={enquiry.matchedSopTitle ?? 'Playbook'}
          response={enquiry.suggestedResponse}
        />
      ) : null}

      {followUp ? (
        <View style={styles.followUpBanner}>
          <Text style={styles.followUpLabel}>
            {getFollowUpOperationalLabel(followUp)}
          </Text>
          <Text style={styles.followUpDue}>
            {formatFollowUpDue(followUp.dueAt, followUp.status)}
          </Text>
          <Text style={styles.followUpNote}>{followUp.note}</Text>
        </View>
      ) : null}

      <SectionHeader
        isFirst
        title="Timeline"
        actionLabel={`${events.length} events`}
      />
      {events.length === 0 ? (
        <EmptyState
          compact
          icon="time-outline"
          title="No events yet"
          message="Processing and operator actions for this enquiry will appear here."
        />
      ) : (
        events.map((event, index) => (
          <TimelineItem
            key={event.id}
            event={event}
            isLast={index === events.length - 1}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: layout.screenPadding,
    paddingBottom: layout.contentBottom,
  },
  missing: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: layout.screenPadding,
  },
  followUpBanner: {
    backgroundColor: colors.warningMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.warningBorder,
  },
  followUpLabel: {
    ...typography.captionMedium,
    color: colors.warning,
    marginBottom: spacing.xs,
  },
  followUpDue: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  followUpNote: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
