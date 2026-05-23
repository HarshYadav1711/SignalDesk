import { FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, EmptyState } from '../components/layout';
import { EscalationCard } from '../components/cards';
import { getEscalations } from '../data/mockData';
import { colors, layout } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function EscalationsScreen() {
  const navigation = useNavigation<Nav>();
  const escalations = getEscalations();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Escalations"
        subtitle="Cases requiring manager or senior tech action"
        badge={escalations.length > 0 ? String(escalations.length) : undefined}
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
            message="All enquiries are within normal handling. Escalated cases will show here with the reason attached."
            hint="Auto-escalations trigger when SOP matching fails or rules fire"
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  list: {
    padding: layout.screenPadding,
    paddingBottom: 32,
    flexGrow: 1,
  },
});
