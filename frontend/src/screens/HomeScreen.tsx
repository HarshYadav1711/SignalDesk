import { ScrollView, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, SectionHeader, EmptyState } from '../components/layout';
import { formatOperationsSubtitle } from '../utils/labels';
import { getSectionQueueHint } from '../utils/operations';
import { MetricCard, LeadCard } from '../components/cards';
import { ActivityFeedItem } from '../components/feed/ActivityFeedItem';
import { getDashboard, getOperationalCounts } from '../data/mockData';
import { colors, layout, spacing } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const counts = getOperationalCounts();
  const { metrics, activity, priorityQueue } = getDashboard();

  const openConversation = (enquiryId: string) => {
    navigation.navigate('ConversationDetail', { enquiryId });
  };

  const priorityHint = getSectionQueueHint('priority', {
    total: priorityQueue.length,
    high: priorityQueue.filter((e) => e.priority === 'high').length,
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Operations"
        subtitle={formatOperationsSubtitle({
          open: counts.open,
          escalations: counts.escalations,
          dueFollowUps: counts.dueFollowUps,
        })}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.metricsGrid}>
          {metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </View>

        <SectionHeader
          isFirst
          title="Priority queue"
          actionLabel={priorityHint}
        />
        {priorityQueue.length === 0 ? (
          <EmptyState
            compact
            icon="flag-outline"
            title="Queue clear"
            message="No high-priority enquiries need attention right now."
            hint="Escalations and urgent leads appear here automatically"
          />
        ) : (
          priorityQueue.map((enquiry, index) => (
            <LeadCard
              key={enquiry.id}
              enquiry={enquiry}
              queueIndex={index}
              onPress={() => openConversation(enquiry.id)}
            />
          ))
        )}

        <SectionHeader
          title="Recent activity"
          actionLabel={`${activity.length} updates today`}
        />
        {activity.length === 0 ? (
          <EmptyState
            compact
            icon="pulse-outline"
            title="No activity yet"
            message="Timeline events from enquiry processing will show here."
          />
        ) : (
          activity.map((item) => (
            <ActivityFeedItem
              key={item.id}
              item={item}
              onPress={() => openConversation(item.enquiryId)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.headerBackground,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: layout.sheetRadius,
    borderTopRightRadius: layout.sheetRadius,
  },
  content: {
    padding: layout.screenPadding,
    paddingBottom: layout.contentBottom,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.cardGap,
    marginBottom: spacing.xs,
  },
});
