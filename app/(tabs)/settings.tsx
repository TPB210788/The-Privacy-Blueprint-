import React, { useCallback, useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { Colors } from '../../src/constants/colors';
import { Card } from '../../src/components/Card';
import { loadAppState, updateNotificationSettings, saveAppState } from '../../src/storage/storage';
import { AppState } from '../../src/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function scheduleWeeklyReminder(hour: number, minute: number) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time for your Sunday Reset 🌿',
      body: 'Take 15 minutes to close out the week and step into the next one with clarity.',
    },
    trigger: {
      weekday: 1, // Sunday = 1 in Expo
      hour,
      minute,
      repeats: true,
    } as Notifications.WeeklyTriggerInput,
  });
}

async function requestPermissionsAndSchedule(hour: number, minute: number): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return false;
  await scheduleWeeklyReminder(hour, minute);
  return true;
}

const HOUR_OPTIONS = [16, 17, 18, 19, 20, 21];

function formatHour(h: number): string {
  const suffix = h >= 12 ? 'pm' : 'am';
  const display = h > 12 ? h - 12 : h;
  return `${display}:00 ${suffix}`;
}

export default function SettingsScreen() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [toggling, setToggling] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadAppState().then(setAppState);
    }, [])
  );

  const handleToggle = async (value: boolean) => {
    if (toggling || !appState) return;
    setToggling(true);

    if (value) {
      const granted = await requestPermissionsAndSchedule(
        appState.notificationTime.hour,
        appState.notificationTime.minute
      );
      if (!granted) {
        Alert.alert(
          'Permission needed',
          'Please allow notifications in your device settings to receive Sunday reminders.',
          [{ text: 'OK' }]
        );
        setToggling(false);
        return;
      }
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }

    await updateNotificationSettings(value, appState.notificationTime);
    setAppState(s => s ? { ...s, notificationsEnabled: value } : s);
    setToggling(false);
  };

  const handleTimeChange = async (hour: number) => {
    if (!appState) return;
    const newTime = { hour, minute: 0 };
    await updateNotificationSettings(appState.notificationsEnabled, newTime);
    if (appState.notificationsEnabled) {
      await scheduleWeeklyReminder(hour, 0);
    }
    setAppState(s => s ? { ...s, notificationTime: newTime } : s);
  };

  const handleResetStreak = () => {
    Alert.alert(
      'Reset streak?',
      'This will set your streak back to zero. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            if (!appState) return;
            const updated = { ...appState, streak: 0 };
            await saveAppState(updated);
            setAppState(updated);
          },
        },
      ]
    );
  };

  const notificationsEnabled = appState?.notificationsEnabled ?? false;
  const notificationHour = appState?.notificationTime.hour ?? 18;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.content}>
        {/* Notifications */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Sunday Reminder</Text>
        </View>
        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Weekly reminder</Text>
              <Text style={styles.rowSub}>Get a nudge every Sunday evening</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggle}
              trackColor={{ false: Colors.offWhiteDark, true: Colors.sageLight }}
              thumbColor={notificationsEnabled ? Colors.sage : Colors.charcoalMuted}
              disabled={toggling}
            />
          </View>

          {notificationsEnabled && (
            <View style={styles.timeSection}>
              <Text style={styles.timeSectionLabel}>Reminder time</Text>
              <View style={styles.timeOptions}>
                {HOUR_OPTIONS.map(h => (
                  <TouchableOpacity
                    key={h}
                    style={[styles.timeChip, notificationHour === h && styles.timeChipSelected]}
                    onPress={() => handleTimeChange(h)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[styles.timeChipText, notificationHour === h && styles.timeChipTextSelected]}
                    >
                      {formatHour(h)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </Card>

        {/* Data */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Data</Text>
        </View>
        <Card style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={handleResetStreak} activeOpacity={0.7}>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: Colors.error }]}>Reset streak</Text>
              <Text style={styles.rowSub}>Set your streak counter back to zero</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </Card>

        {/* About */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>About</Text>
        </View>
        <Card style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>Ritual: Sunday Reset</Text>
            <Text style={styles.rowSub}>Version 1.0.0</Text>
          </View>
          <Text style={styles.aboutText}>
            A calm weekly reset app for busy people who want to close out one week and step into the next with intention.
          </Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.offWhite },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 12 },
  title: { fontFamily: 'Nunito_700Bold', fontSize: 32, color: Colors.charcoal },
  content: { paddingHorizontal: 24, gap: 8, paddingBottom: 40 },
  sectionHeader: { paddingTop: 16, paddingBottom: 4 },
  sectionLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: Colors.charcoalMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: { gap: 0 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: Colors.charcoal },
  rowSub: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: Colors.charcoalMuted },
  chevron: { fontSize: 20, color: Colors.charcoalMuted, marginLeft: 8 },
  timeSection: { borderTopWidth: 1, borderTopColor: Colors.offWhiteDark, paddingTop: 14, gap: 10, marginTop: 10 },
  timeSectionLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: Colors.charcoal,
  },
  timeOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.offWhiteDark,
  },
  timeChipSelected: { backgroundColor: Colors.sage },
  timeChipText: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: Colors.charcoal },
  timeChipTextSelected: { color: Colors.white },
  aboutText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: Colors.charcoalMuted,
    lineHeight: 20,
    marginTop: 8,
  },
  error: { color: Colors.error },
});
