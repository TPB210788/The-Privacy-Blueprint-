import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { loadAppState } from '../../src/storage/storage';
import { AppState } from '../../src/types';

function formatLastReset(dateStr: string | null): string {
  if (!dateStr) return 'No resets yet';
  const date = new Date(dateStr);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) return 'Today';
  if (daysDiff === 1) return 'Yesterday';
  if (daysDiff < 7) return `${daysDiff} days ago`;

  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function StreakFlame({ count }: { count: number }) {
  return (
    <View style={streakStyles.container}>
      <View style={streakStyles.circle}>
        <Text style={streakStyles.emoji}>🌿</Text>
        <Text style={streakStyles.count}>{count}</Text>
      </View>
      <Text style={streakStyles.label}>
        {count === 1 ? 'week streak' : 'week streak'}
      </Text>
    </View>
  );
}

const streakStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.sageLight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  emoji: {
    fontSize: 28,
  },
  count: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 26,
    color: Colors.white,
    lineHeight: 30,
  },
  label: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: Colors.charcoalMuted,
  },
});

export default function HomeScreen() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const state = await loadAppState();
    setAppState(state);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const streak = appState?.streak ?? 0;
  const lastReset = appState?.lastResetDate ?? null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.sage}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>Ritual: Weekly Reset</Text>
          <Text style={styles.greeting}>{getGreeting()}</Text>
        </View>

        {/* Streak card */}
        <Card style={styles.streakCard}>
          <StreakFlame count={streak} />
          {streak === 0 && (
            <Text style={styles.streakZeroText}>
              Complete your first reset to start your streak.
            </Text>
          )}
          {streak > 0 && (
            <Text style={styles.streakMessage}>
              {streak >= 4
                ? "You're building a beautiful habit."
                : streak >= 2
                ? 'Keep the momentum going!'
                : 'Great start — come back next Sunday.'}
            </Text>
          )}
        </Card>

        {/* Last reset info */}
        <Card style={styles.lastResetCard}>
          <View style={styles.lastResetRow}>
            <View>
              <Text style={styles.lastResetLabel}>Last reset</Text>
              <Text style={styles.lastResetValue}>{formatLastReset(lastReset)}</Text>
            </View>
            <View style={styles.divider} />
            <View>
              <Text style={styles.lastResetLabel}>Resets completed</Text>
              <Text style={styles.lastResetValue}>{appState?.resets.length ?? 0}</Text>
            </View>
          </View>
        </Card>

        {/* Sunday reset prompt */}
        <View style={styles.promptSection}>
          <Text style={styles.promptTitle}>Ready to reset?</Text>
          <Text style={styles.promptSubtitle}>
            Take 15 minutes to close out the week and step into the next one with clarity.
          </Text>
          <Button
            label="Begin This Week's Reset"
            onPress={() => router.push('/reset/stage1')}
            style={styles.beginButton}
          />
        </View>

        {/* Week label */}
        <Text style={styles.weekLabel}>
          Week of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 8,
    gap: 4,
  },
  appName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 32,
    color: Colors.charcoal,
    letterSpacing: -0.5,
  },
  greeting: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: Colors.charcoalMuted,
  },
  streakCard: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 12,
  },
  streakZeroText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: Colors.charcoalMuted,
    textAlign: 'center',
    maxWidth: 220,
    lineHeight: 20,
  },
  streakMessage: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: Colors.sageDark,
    textAlign: 'center',
  },
  lastResetCard: {
    paddingVertical: 20,
  },
  lastResetRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.offWhiteDark,
  },
  lastResetLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: Colors.charcoalMuted,
    textAlign: 'center',
    marginBottom: 4,
  },
  lastResetValue: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: Colors.charcoal,
    textAlign: 'center',
  },
  promptSection: {
    gap: 10,
    paddingTop: 8,
  },
  promptTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 22,
    color: Colors.charcoal,
  },
  promptSubtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: Colors.charcoalMuted,
    lineHeight: 22,
  },
  beginButton: {
    marginTop: 6,
  },
  weekLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: Colors.charcoalMuted,
    textAlign: 'center',
    paddingTop: 8,
  },
});
