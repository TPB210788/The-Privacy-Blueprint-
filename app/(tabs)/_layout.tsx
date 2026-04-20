import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../src/constants/colors';

function LeafIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.iconDot, focused && styles.iconDotActive]} />
  );
}

function HistoryIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.iconDot, focused && styles.iconDotActive]} />
  );
}

function SettingsIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.iconDot, focused && styles.iconDotActive]} />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.sage,
        tabBarInactiveTintColor: Colors.charcoalMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <LeafIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => <HistoryIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <SettingsIcon focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.offWhite,
    borderTopColor: Colors.offWhiteDark,
    borderTopWidth: 1,
    paddingTop: 6,
    height: 72,
  },
  tabLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    marginTop: 2,
  },
  iconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.charcoalMuted,
  },
  iconDotActive: {
    backgroundColor: Colors.sage,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
