import { FlatList, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ConversationCard } from "../components/ConversationCard";
import { EmptyState } from "../components/EmptyState";
import { ScreenHeader } from "../components/ScreenHeader";
import { leads } from "../data/loadMock";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function LeadsScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Leads"
        subtitle="Inbound conversations across channels"
      />
      <FlatList
        data={leads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="No leads yet"
            message="New inbound enquiries will appear here for triage."
          />
        }
        renderItem={({ item }) => (
          <ConversationCard
            item={item}
            meta={item.assignedTo ? `Owner: ${item.assignedTo}` : undefined}
            onPress={() =>
              navigation.navigate("ConversationDetail", { conversationId: item.id })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, paddingBottom: spacing.xxl },
});
