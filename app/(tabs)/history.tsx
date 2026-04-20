import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { Card } from '../../src/components/Card';
import { loadAppState } from '../../src/storage/storage';
import { WeeklyReset } from '../../src/types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function ResetCard({ item }: { item: WeeklyReset }) {
  const [expanded, setExpanded] = useState(false);
  const priorities = item.priorities.filter(p => p.trim().length > 0);

  return (
    <Card style={styles.resetCard}>
      <TouchableOpacity onPress={() => setExpanded(e => !e)} activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardDate}>Week of {formatDate(item.weekStartDate)}</Text>
            <Text style={styles.cardSub}>Completed {formatDate(item.completedAt)}</Text>
          </View>
          <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
        </View>

        <View style={styles.priorityPills}>
          {priorities.map((p, i) => (
            <View key={i} style={[styles.pill, { backgroundColor: PRIORITY_COLORS[i] + '22' }]}>
              <View style={[styles.pillDot, { backgroundColor: PRIORITY_COLORS[i] }]} />
              <Text style={[styles.pillText, { color: PRIORITY_COLORS[i] }]} numberOfLines={1}>
                {p}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedSection}>
          {item.brainDump.trim().length > 0 && (
            <View style={styles.expandedBlock}>
              <Text style={styles.expandedLabel}>Brain dump</Text>
              <Text style={styles.expandedBody} numberOfLines={4}>
                {item.brainDump}
              </Text>
            </View>
          )}
          <View style={styles.expandedBlock}>
            <Text style={styles.expandedLabel}>Reflections</Text>
            {Object.values(item.reflections)
              .filter(r => r.trim().length > 0)
              .map((r, i) => (
                <Text key={i} style={styles.expandedReflection}>• {r}</Text>
              ))}
          </View>
        </View>
      )}
    </Card>
  );
}

const PRIORITY_COLORS = [Colors.sage, '#9B8EC4', '#E8A87C'];

export default function HistoryScreen() {
  const [resets, setResets] = useState<WeeklyReset[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadAppState().then(state => setResets(state.resets));
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>{resets.length} reset{resets.length !== 1 ? 's' : ''} completed</Text>
      </View>

      {resets.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📖</Text>
          <Text style={styles.emptyTitle}>No resets yet</Text>
          <Text style={styles.emptyText}>
            Complete your first weekly reset and it will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={resets}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ResetCard item={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.offWhite },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 12, gap: 4 },
  title: { fontFamily: 'Nunito_700Bold', fontSize: 32, color: Colors.charcoal },
  subtitle: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.charcoalMuted },
  list: { paddingHorizontal: 24, paddingBottom: 40, gap: 12 },
  resetCard: { gap: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardDate: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: Colors.charcoal },
  cardSub: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: Colors.charcoalMuted, marginTop: 2 },
  chevron: { color: Colors.charcoalMuted, fontSize: 12, paddingTop: 2 },
  priorityPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillDot: { width: 6, height: 6, borderRadius: 3 },
  pillText: { fontFamily: 'Nunito_600SemiBold', fontSize: 11, flexShrink: 1 },
  expandedSection: { borderTopWidth: 1, borderTopColor: Colors.offWhiteDark, paddingTop: 12, gap: 12 },
  expandedBlock: { gap: 6 },
  expandedLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: Colors.sage,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  expandedBody: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.charcoal, lineHeight: 20 },
  expandedReflection: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: Colors.charcoal, lineHeight: 20 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontFamily: 'Nunito_700Bold', fontSize: 20, color: Colors.charcoal },
  emptyText: { fontFamily: 'Nunito_400Regular', fontSize: 15, color: Colors.charcoalMuted, textAlign: 'center', lineHeight: 22 },
});
