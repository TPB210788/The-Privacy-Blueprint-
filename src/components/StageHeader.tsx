import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ProgressBar } from './ProgressBar';
import { Colors } from '../constants/colors';

interface StageHeaderProps {
  stage: number;
  title: string;
  subtitle?: string;
}

export function StageHeader({ stage, title, subtitle }: StageHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.stageLabel}>Stage {stage} of 5</Text>
      </View>
      <ProgressBar current={stage} total={5} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 8,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    padding: 4,
  },
  backText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: Colors.charcoalMuted,
  },
  stageLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: Colors.charcoalMuted,
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 28,
    color: Colors.charcoal,
    lineHeight: 34,
  },
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: Colors.charcoalMuted,
    lineHeight: 22,
  },
});
