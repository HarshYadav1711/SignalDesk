import { useMemo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, EmptyState } from '../components/layout';
import { FollowUpCard } from '../components/cards';
import { getFollowUps, getOperationalCounts } from '../data/mockData';
import type { FollowUp, FollowUpStatus } from '../types';
import { colors, layout, spacing, typography } from '../theme';
import { followUpStatusLabels } from '../utils/labels';
import { getSectionQueueHint } from '../utils/operations';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const sectionOrder: FollowUpStatus[] = ['overdue', 'due_today', 'upcoming'];

const sectionHints: Record<FollowUpStatus, string> = {
  overdue: 'Past due — contact customer',
  due_today: 'Due before end of shift',
  upcoming: 'Scheduled callbacks',
};

export function FollowUpsScreen() {
  const navigation = useNavigation<Nav>();
  const followUps = getFollowUps();
  const counts = useMemo(() => getOperationalCounts(), []);

  const sections = useMemo(() => {
    return sectionOrder
      .map((status) => ({
        title: followUpStatusLabels[status],
        status,
        hint: sectionHints[status],
        data: followUps.filter((f) => f.status === status),
      }))
      .filter((s) => s.data.length > 0);
  }, [followUps]);

  const queueHint = getSectionQueueHint('followups', {
    total: followUps.length,
    due: followUps.filter((f) => f.status === 'due_today').length,
    overdue: counts.overdueFollowUps,
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Follow-ups"
        subtitle={queueHint}
        badge={counts.dueFollowUps > 0 ? `${counts.dueFollowUps} due` : undefined}
      />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        style={styles.listWrap}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title="No follow-ups scheduled"
            message="Callbacks and reminders on enquiries are grouped here by due date when scheduled."
            hint="Overdue items are listed first"
          />
        }
        renderSectionHeader={({ section }) => (
          <View
            style={[
              styles.sectionHeader,
              section.status === sectionOrder[0] && styles.sectionHeaderFirst,
            ]}
          >
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionCount}>{section.data.length}</Text>
            </View>
            <Text style={styles.sectionHint}>{section.hint}</Text>
          </View>
        )}
        renderItem={({ item }: { item: FollowUp }) => (
          <FollowUpCard
            followUp={item}
            onPress={() =>
              navigation.navigate('ConversationDetail', { enquiryId: item.enquiryId })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.headerBackground,
  },
  listWrap: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: layout.sheetRadius,
    borderTopRightRadius: layout.sheetRadius,
  },
  list: {
    padding: layout.screenPadding,
    paddingBottom: layout.contentBottom,
    flexGrow: 1,
  },
  sectionHeader: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionHeaderFirst: {
    marginTop: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textSecondary,
  },
  sectionCount: {
    ...typography.captionMedium,
    color: colors.textMuted,
  },
  sectionHint: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
