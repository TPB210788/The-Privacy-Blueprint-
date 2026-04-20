import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, WeeklyReset } from '../types';

const APP_STATE_KEY = '@ritual:app_state';

const defaultState: AppState = {
  streak: 0,
  lastResetDate: null,
  resets: [],
  notificationsEnabled: false,
  notificationTime: { hour: 18, minute: 0 },
};

export async function loadAppState(): Promise<AppState> {
  try {
    const json = await AsyncStorage.getItem(APP_STATE_KEY);
    if (!json) return defaultState;
    return { ...defaultState, ...JSON.parse(json) };
  } catch {
    return defaultState;
  }
}

export async function saveAppState(state: AppState): Promise<void> {
  await AsyncStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
}

export async function saveCompletedReset(reset: WeeklyReset): Promise<AppState> {
  const state = await loadAppState();
  const now = new Date().toISOString();
  const newStreak = calculateStreak(state.lastResetDate, state.streak);

  const updated: AppState = {
    ...state,
    streak: newStreak,
    lastResetDate: now,
    resets: [reset, ...state.resets],
  };

  await saveAppState(updated);
  return updated;
}

export async function updateNotificationSettings(
  enabled: boolean,
  time: { hour: number; minute: number }
): Promise<void> {
  const state = await loadAppState();
  await saveAppState({ ...state, notificationsEnabled: enabled, notificationTime: time });
}

function calculateStreak(lastResetDate: string | null, currentStreak: number): number {
  if (!lastResetDate) return 1;

  const last = new Date(lastResetDate);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  // Within 14 days (one week + grace) = streak continues
  if (daysDiff <= 14) return currentStreak + 1;
  return 1;
}
