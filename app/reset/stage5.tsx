import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Colors } from '../../src/constants/colors';
import { useReset } from '../../src/context/ResetContext';
import { saveCompletedReset } from '../../src/storage/storage';
import { WeeklyReset } from '../../src/types';

function uuid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString();
}

export default function Stage5Complete() {
  const { draft, clearDraft } = useReset();
  const [streak, setStreak] = useState(0);
  const [saving, setSaving] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const save = async () => {
      const reset: WeeklyReset = {
        id: uuid(),
        completedAt: new Date().toISOString(),
        weekStartDate: getWeekStart(),
        brainDump: draft.brainDump,
        reflections: draft.reflections,
        priorities: draft.priorities,
        schedule: draft.schedule,
      };
      const newState = await saveCompletedReset(reset);
      setStreak(newState.streak);
      setSaving(false);
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    };
    save();
  }, []);

  const handleDone = () => {
    clearDraft();
    router.replace('/(tabs)');
  };

  if (saving) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.savingText}>Saving your reset…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.hero, { opacity: fadeAnim }]}>
          <Text style={styles.emoji}>🌿</Text>
          <Text style={styles.title}>Reset Complete</Text>
          <Text style={styles.subtitle}>
            You showed up for yourself. That's what matters.
          </Text>
        </Animated.View>

        {/* Streak */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Card style={styles.streakCard}>
            <Text style={styles.streakLabel}>Current Streak</Text>
            <Text style={styles.streakCount}>{streak} {streak === 1 ? 'week' : 'weeks'}</Text>
            <Text style={styles.streakSub}>
              {streak >= 4
                ? 'Incredible consistency'
                : streak >= 2
                ? 'Building a beautiful habit'
                : 'Your journey begins'}
            </Text>
          </Card>
        </Animated.View>

        {/* Summary */}
        <Animated.View style={[styles.summarySection, { opacity: fadeAnim }]}>
          <Text style={styles.summaryTitle}>This week's priorities</Text>
          {draft.priorities
            .filter(p => p.trim().length > 0)
            .map((p, i) => (
              <View key={i} style={styles.priorityRow}>
                <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[i] }]} />
                <Text style={styles.priorityText}>{p}</Text>
              </View>
            ))}
        </Animated.View>

        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <Button label="Back to Home" onPress={handleDone} style={styles.btn} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const PRIORITY_COLORS = [Colors.sage, '#9B8EC4', '#E8A87C'];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.offWhite },
  scroll: { paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  savingText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: Colors.charcoalMuted,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 72,
    paddingBottom: 32,
    paddingHorizontal: 24,
    gap: 12,
  },
  emoji: { fontSize: 56 },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 34,
    color: Colors.charcoal,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: Colors.charcoalMuted,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  streakCard: {
    marginHorizontal: 24,
    alignItems: 'center',
    paddingVertical: 24,
    gap: 6,
    backgroundColor: Colors.sage,
  },
  streakLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: Colors.offWhite,
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  streakCount: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 48,
    color: Colors.offWhite,
    lineHeight: 54,
  },
  streakSub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: Colors.offWhite,
    opacity: 0.85,
  },
  summarySection: {
    paddingHorizontal: 24,
    paddingTop: 28,
    gap: 12,
  },
  summaryTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: Colors.charcoal,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
  },
  priorityDot: { width: 10, height: 10, borderRadius: 5 },
  priorityText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: Colors.charcoal,
    flex: 1,
  },
  footer: { paddingHorizontal: 24, paddingTop: 28 },
  btn: { width: '100%' },
});
