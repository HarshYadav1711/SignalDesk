import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ConversationCard } from "../components/ConversationCard";
import { MetricCard } from "../components/MetricCard";
import { ScreenHeader } from "../components/ScreenHeader";
import { dashboard } from "../data/loadMock";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme/colors";
import { spacing, typography } from "../theme/spacing";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={`${dashboard.greeting}, ${dashboard.ownerName}`}
        subtitle={`${dashboard.businessName} · Operations pulse`}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.metrics}>
          {dashboard.metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Priority queue</Text>
        {dashboard.priorityQueue.length === 0 ? (
          <Text style={styles.empty}>No urgent items right now.</Text>
        ) : (
          dashboard.priorityQueue.map((item) => (
            <ConversationCard
              key={item.id}
              item={item}
              onPress={() =>
                navigation.navigate("ConversationDetail", { conversationId: item.id })
              }
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  empty: { ...typography.subtitle },
});
