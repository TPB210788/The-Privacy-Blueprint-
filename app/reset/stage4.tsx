import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StageHeader } from '../../src/components/StageHeader';
import { Button } from '../../src/components/Button';
import { Colors } from '../../src/constants/colors';
import { useReset } from '../../src/context/ResetContext';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;
type Day = typeof DAYS[number];

const DAY_LABELS: Record<Day, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
};

export default function Stage4Schedule() {
  const { draft, updateSchedule } = useReset();
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const activePriorities = draft.priorities.filter(p => p.trim().length > 0);

  const togglePriorityOnDay = (day: Day, priority: string) => {
    const current = draft.schedule[day];
    if (current.includes(priority)) {
      updateSchedule(day, current.filter(p => p !== priority));
    } else {
      updateSchedule(day, [...current, priority]);
    }
  };

  const handleDayPress = (day: Day) => {
    if (!selectedPriority) return;
    togglePriorityOnDay(day, selectedPriority);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <StageHeader
          stage={4}
          title="Schedule"
          subtitle="Tap a priority, then tap the days to assign it."
        />

        {/* Priority selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Select a priority</Text>
          <View style={styles.priorityChips}>
            {activePriorities.map((p, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.chip, selectedPriority === p && styles.chipSelected]}
                onPress={() => setSelectedPriority(prev => prev === p ? null : p)}
                activeOpacity={0.7}
              >
                <View style={[styles.chipDot, { backgroundColor: PRIORITY_COLORS[i] }]} />
                <Text
                  style={[styles.chipLabel, selectedPriority === p && styles.chipLabelSelected]}
                  numberOfLines={1}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 5-day grid */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Assign to days</Text>
          <View style={styles.dayGrid}>
            {DAYS.map(day => (
              <TouchableOpacity
                key={day}
                style={[styles.dayColumn, selectedPriority && styles.dayColumnActive]}
                onPress={() => handleDayPress(day)}
                activeOpacity={selectedPriority ? 0.7 : 1}
              >
                <Text style={styles.dayLabel}>{DAY_LABELS[day]}</Text>
                <View style={styles.dayItems}>
                  {draft.schedule[day].map((p, i) => {
                    const colorIdx = activePriorities.indexOf(p);
                    return (
                      <TouchableOpacity
                        key={i}
                        style={[styles.dayChip, { backgroundColor: PRIORITY_COLORS[colorIdx] + '22' }]}
                        onPress={() => togglePriorityOnDay(day, p)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.dayChipDot, { backgroundColor: PRIORITY_COLORS[colorIdx] }]} />
                        <Text style={[styles.dayChipText, { color: PRIORITY_COLORS[colorIdx] }]} numberOfLines={2}>
                          {p}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  {draft.schedule[day].length === 0 && (
                    <View style={styles.emptySlot}>
                      <Text style={styles.emptySlotText}>—</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedPriority && (
          <Text style={styles.tip}>Tap any day to assign "{selectedPriority}"</Text>
        )}

        <View style={styles.footer}>
          <Button
            label="Finish — See Summary →"
            onPress={() => router.push('/reset/stage5')}
            style={styles.btn}
          />
          <Button
            label="Skip scheduling"
            onPress={() => router.push('/reset/stage5')}
            variant="ghost"
            style={styles.btn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const PRIORITY_COLORS = [Colors.sage, '#9B8EC4', '#E8A87C'];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.offWhite },
  scroll: { paddingBottom: 40 },
  section: { paddingHorizontal: 24, paddingTop: 20, gap: 12 },
  sectionLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: Colors.charcoalMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  priorityChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: Colors.offWhiteDark,
    maxWidth: '100%',
  },
  chipSelected: {
    borderColor: Colors.sage,
    backgroundColor: Colors.sage + '15',
  },
  chipDot: { width: 8, height: 8, borderRadius: 4 },
  chipLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: Colors.charcoal,
    flexShrink: 1,
  },
  chipLabelSelected: { color: Colors.sageDark },
  dayGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 8,
    minHeight: 120,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  dayColumnActive: {
    borderWidth: 1,
    borderColor: Colors.sageLight,
  },
  dayLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: Colors.charcoal,
  },
  dayItems: { gap: 4, width: '100%' },
  dayChip: {
    borderRadius: 8,
    padding: 4,
    alignItems: 'center',
    gap: 2,
  },
  dayChipDot: { width: 6, height: 6, borderRadius: 3 },
  dayChipText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 9,
    textAlign: 'center',
  },
  emptySlot: { alignItems: 'center', paddingTop: 8 },
  emptySlotText: { color: Colors.offWhiteDark, fontSize: 18 },
  tip: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: Colors.sage,
    textAlign: 'center',
    paddingTop: 12,
    paddingHorizontal: 24,
  },
  footer: { paddingHorizontal: 24, paddingTop: 20, gap: 8 },
  btn: { width: '100%' },
});
