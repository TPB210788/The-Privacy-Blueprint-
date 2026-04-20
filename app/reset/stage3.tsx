import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StageHeader } from '../../src/components/StageHeader';
import { Button } from '../../src/components/Button';
import { Colors } from '../../src/constants/colors';
import { useReset } from '../../src/context/ResetContext';

const PRIORITY_LABELS = ['Priority 1', 'Priority 2', 'Priority 3'];
const PRIORITY_HINTS = [
  'Your most important focus this week',
  'Second most important',
  'Third most important',
];

export default function Stage3Priorities() {
  const { draft, updatePriorities } = useReset();

  const setPriority = (index: number, value: string) => {
    const updated = [...draft.priorities] as [string, string, string];
    updated[index] = value;
    updatePriorities(updated);
  };

  const hasAtLeastOne = draft.priorities[0].trim().length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <StageHeader
            stage={3}
            title="Priorities"
            subtitle="Set three intentions for the week ahead. These will anchor your schedule."
          />

          <View style={styles.inputs}>
            {PRIORITY_LABELS.map((label, i) => (
              <View key={i} style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{i + 1}</Text>
                  </View>
                  <View style={styles.labelText}>
                    <Text style={styles.label}>{label}</Text>
                    <Text style={styles.hint}>{PRIORITY_HINTS[i]}</Text>
                  </View>
                </View>
                <TextInput
                  style={[styles.input, i === 0 && styles.inputPrimary]}
                  value={draft.priorities[i]}
                  onChangeText={val => setPriority(i, val)}
                  placeholder={i === 0 ? 'e.g. Finish project proposal' : 'Optional'}
                  placeholderTextColor={Colors.charcoalMuted}
                  returnKeyType="next"
                />
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <Button
              label="Continue to Schedule →"
              onPress={() => router.push('/reset/stage4')}
              disabled={!hasAtLeastOne}
              style={styles.btn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.offWhite },
  flex: { flex: 1 },
  scroll: { paddingBottom: 24 },
  inputs: { paddingHorizontal: 24, paddingTop: 24, gap: 20 },
  inputGroup: { gap: 10 },
  labelRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: Colors.white,
  },
  labelText: { flex: 1, gap: 2 },
  label: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: Colors.charcoal },
  hint: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: Colors.charcoalMuted },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: Colors.charcoal,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  inputPrimary: {
    borderWidth: 1.5,
    borderColor: Colors.sageLight,
  },
  footer: { paddingHorizontal: 24, paddingTop: 20 },
  btn: { width: '100%' },
});
