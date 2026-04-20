import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StageHeader } from '../../src/components/StageHeader';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { useReset } from '../../src/context/ResetContext';
import { Colors } from '../../src/constants/colors';

const QUESTIONS = [
  { key: 'question1' as const, prompt: 'What went well this week that I want to carry forward?' },
  { key: 'question2' as const, prompt: 'What drained me, and how can I protect my energy next week?' },
  { key: 'question3' as const, prompt: 'What is one thing I am grateful for right now?' },
];

export default function Stage2Reflect() {
  const { draft, updateReflection } = useReset();

  const allAnswered = QUESTIONS.every(q => draft.reflections[q.key].trim().length > 0);

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
            stage={2}
            title="Reflect"
            subtitle="Answer three short questions to close out the week with intention."
          />

          <View style={styles.questions}>
            {QUESTIONS.map((q, i) => (
              <Card key={q.key} style={styles.questionCard}>
                <Text style={styles.questionNumber}>Question {i + 1}</Text>
                <Text style={styles.questionText}>{q.prompt}</Text>
                <TextInput
                  style={styles.answer}
                  value={draft.reflections[q.key]}
                  onChangeText={val => updateReflection(q.key, val)}
                  placeholder="Your answer…"
                  placeholderTextColor={Colors.charcoalMuted}
                  multiline
                  textAlignVertical="top"
                />
              </Card>
            ))}
          </View>

          <View style={styles.footer}>
            <Button
              label="Continue to Priorities →"
              onPress={() => router.push('/reset/stage3')}
              disabled={!allAnswered}
              style={styles.btn}
            />
            {!allAnswered && (
              <Text style={styles.hint}>Answer all three questions to continue</Text>
            )}
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
  questions: { paddingHorizontal: 24, paddingTop: 20, gap: 16 },
  questionCard: { gap: 10 },
  questionNumber: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: Colors.sage,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  questionText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: Colors.charcoal,
    lineHeight: 22,
  },
  answer: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: Colors.charcoal,
    lineHeight: 22,
    minHeight: 80,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.offWhiteDark,
    paddingHorizontal: 0,
  },
  footer: { paddingHorizontal: 24, paddingTop: 20, gap: 10 },
  btn: { width: '100%' },
  hint: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: Colors.charcoalMuted,
    textAlign: 'center',
  },
});
