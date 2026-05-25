import { useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, EmptyState } from '../components/layout';
import { LeadCard } from '../components/cards';
import { getLeads } from '../data/mockData';
import { colors, layout } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function LeadsScreen() {
  const navigation = useNavigation<Nav>();
  const leads = useMemo(() => getLeads(), []);
  const unreadCount = useMemo(() => leads.filter((l) => l.unread).length, [leads]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Leads"
        subtitle="Inbound enquiries awaiting triage or reply"
        badge={unreadCount > 0 ? `${unreadCount} unread` : undefined}
      />
      <FlatList
        data={leads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        style={styles.listWrap}
        ListEmptyComponent={
          <EmptyState
            icon="checkmark-circle-outline"
            title="Inbox clear"
            message="No open leads in the queue. New inbound enquiries will appear here."
            hint="See Home for the latest operational activity"
          />
        }
        renderItem={({ item }) => (
          <LeadCard
            enquiry={item}
            onPress={() =>
              navigation.navigate('ConversationDetail', { enquiryId: item.id })
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
});
