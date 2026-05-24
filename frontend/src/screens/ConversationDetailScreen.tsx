import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { SectionHeader, EmptyState } from '../components/layout';
import { ConversationHeader } from '../components/conversation/ConversationHeader';
import { SuggestedResponseBlock } from '../components/conversation/SuggestedResponseBlock';
import { TimelineItem } from '../components/timeline/TimelineItem';
import { getEnquiryHistory, getFollowUpByEnquiryId } from '../data/mockData';
import { colors, layout, spacing } from '../theme';
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
          message="This enquiry is not in the current dataset. Check the ID or return to the list."
          hint="Use the back button to return to Leads or Escalations"
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
          <Text style={styles.followUpLabel}>Scheduled follow-up</Text>
          <Text style={styles.followUpNote}>{followUp.note}</Text>
        </View>
      ) : null}

      <SectionHeader title="Timeline" />
      {events.length === 0 ? (
        <EmptyState
          icon="time-outline"
          title="No events yet"
          message="Activity for this enquiry will appear here as it is processed."
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
    paddingBottom: spacing.xxxl,
  },
  missing: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  followUpBanner: {
    backgroundColor: colors.warningMuted,
    borderRadius: 10,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.warningBorder,
  },
  followUpLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.warning,
    marginBottom: 4,
  },
  followUpNote: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});
