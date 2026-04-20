import React from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StageHeader } from '../../src/components/StageHeader';
import { Button } from '../../src/components/Button';
import { useReset } from '../../src/context/ResetContext';
import { Colors } from '../../src/constants/colors';

export default function Stage1Release() {
  const { draft, updateBrainDump } = useReset();

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
            stage={1}
            title="Release"
            subtitle="Empty your mind. Write everything that's on it — worries, tasks, thoughts, anything. No filter."
          />

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={draft.brainDump}
              onChangeText={updateBrainDump}
              placeholder="Start typing freely…"
              placeholderTextColor={Colors.charcoalMuted}
              multiline
              textAlignVertical="top"
              autoFocus
            />
          </View>

          <View style={styles.footer}>
            <Button
              label="Continue to Reflect →"
              onPress={() => router.push('/reset/stage2')}
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
  scroll: { flexGrow: 1, paddingBottom: 24 },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 24,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    minHeight: 280,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: Colors.charcoal,
    lineHeight: 26,
    minHeight: 240,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  btn: { width: '100%' },
});
