import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { ResetProvider } from '../src/context/ResetContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ResetProvider>
      <StatusBar style="dark" backgroundColor="#FAF7F2" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FAF7F2' } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="reset/stage1" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="reset/stage2" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="reset/stage3" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="reset/stage4" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="reset/stage5" options={{ animation: 'fade' }} />
      </Stack>
    </ResetProvider>
  );
}
