import { FlatList, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ConversationCard } from "../components/ConversationCard";
import { EmptyState } from "../components/EmptyState";
import { ScreenHeader } from "../components/ScreenHeader";
import { followUps } from "../data/loadMock";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type Nav = NativeStackNavigationProp<RootStackParamList>;

function formatDue(iso?: string) {
  if (!iso) return undefined;
  return `Due ${new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function FollowUpsScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Follow-ups"
        subtitle="Promises and callbacks that need action"
      />
      <FlatList
        data={followUps}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title="Nothing scheduled"
            message="Follow-up commitments will show here with due times."
          />
        }
        renderItem={({ item }) => (
          <ConversationCard
            item={item}
            meta={[formatDue(item.dueAt), item.note].filter(Boolean).join(" · ")}
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
