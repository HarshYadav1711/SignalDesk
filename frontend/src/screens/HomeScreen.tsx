import { ScrollView, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, SectionHeader, EmptyState } from '../components/layout';
import { formatOperationsSubtitle } from '../utils/labels';
import { MetricCard, LeadCard } from '../components/cards';
import { ActivityFeedItem } from '../components/feed/ActivityFeedItem';
import { getDashboard } from '../data/mockData';
import { colors, layout, spacing } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { metrics, activity, priorityQueue } = getDashboard();

  const openConversation = (enquiryId: string) => {
    navigation.navigate('ConversationDetail', { enquiryId });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Operations"
        subtitle={formatOperationsSubtitle()}
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

        <SectionHeader title="Priority queue" actionLabel={`${priorityQueue.length} items`} />
        {priorityQueue.length === 0 ? (
          <EmptyState
            icon="flag-outline"
            title="Priority queue clear"
            message="No high-priority enquiries need attention right now."
            hint="New escalations and urgent leads will surface here"
          />
        ) : (
          priorityQueue.map((enquiry) => (
            <LeadCard
              key={enquiry.id}
              enquiry={enquiry}
              onPress={() => openConversation(enquiry.id)}
            />
          ))
        )}

        <SectionHeader title="Recent activity" />
        {activity.length === 0 ? (
          <EmptyState
            icon="pulse-outline"
            title="No recent activity"
            message="Operational events will appear here as enquiries are processed."
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  content: {
    padding: layout.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
});
