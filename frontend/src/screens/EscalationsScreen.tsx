import { FlatList, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ConversationCard } from "../components/ConversationCard";
import { EmptyState } from "../components/EmptyState";
import { ScreenHeader } from "../components/ScreenHeader";
import { escalations } from "../data/loadMock";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function EscalationsScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Escalations"
        subtitle="Human queue — auto and manual escalations"
      />
      <FlatList
        data={escalations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="alert-circle-outline"
            title="Queue is clear"
            message="Escalated enquiries will surface here for supervisor handling."
          />
        }
        renderItem={({ item }) => (
          <ConversationCard
            item={item}
            meta={item.reason ? `Reason: ${item.reason}` : undefined}
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
