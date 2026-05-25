import { useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, EmptyState } from '../components/layout';
import { EscalationCard } from '../components/cards';
import { getEscalations, getOperationalCounts } from '../data/mockData';
import { getSectionQueueHint } from '../utils/operations';
import { colors, layout } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function EscalationsScreen() {
  const navigation = useNavigation<Nav>();
  const escalations = getEscalations();
  const counts = useMemo(() => getOperationalCounts(), []);
  const queueHint = getSectionQueueHint('escalations', {
    total: escalations.length,
    manager: counts.manager,
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Escalations"
        subtitle={queueHint}
        badge={
          escalations.length > 0
            ? `${escalations.length} unresolved`
            : undefined
        }
      />
      <FlatList
        data={escalations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        style={styles.listWrap}
        ListEmptyComponent={
          <EmptyState
            icon="shield-checkmark-outline"
            title="No escalations"
            message="All enquiries are within normal handling. Escalated cases appear here with the reason on file."
            hint="Auto-escalation runs when no SOP keyword match is found"
          />
        }
        renderItem={({ item }) => (
          <EscalationCard
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
