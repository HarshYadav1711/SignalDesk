import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ConversationDetailScreen } from "../screens/ConversationDetailScreen";
import { colors } from "../theme/colors";
import { MainTabs } from "./MainTabs";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConversationDetail"
        component={ConversationDetailScreen}
        options={{
          title: "Conversation",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "600" },
        }}
      />
    </Stack.Navigator>
  );
}
