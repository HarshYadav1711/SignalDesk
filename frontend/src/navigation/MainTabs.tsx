import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { EscalationsScreen } from "../screens/EscalationsScreen";
import { FollowUpsScreen } from "../screens/FollowUpsScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { LeadsScreen } from "../screens/LeadsScreen";
import { colors } from "../theme/colors";
import type { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: "#1E293B",
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: "home",
            Leads: "people",
            Escalations: "warning",
            FollowUps: "calendar",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
      <Tab.Screen name="Leads" component={LeadsScreen} />
      <Tab.Screen
        name="Escalations"
        component={EscalationsScreen}
        options={{ title: "Escalations" }}
      />
      <Tab.Screen
        name="FollowUps"
        component={FollowUpsScreen}
        options={{ title: "Follow-ups" }}
      />
    </Tab.Navigator>
  );
}
