export interface WeeklyReset {
  id: string;
  completedAt: string;
  weekStartDate: string;
  brainDump: string;
  reflections: {
    question1: string;
    question2: string;
    question3: string;
  };
  priorities: [string, string, string];
  schedule: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
  };
}

export interface AppState {
  streak: number;
  lastResetDate: string | null;
  resets: WeeklyReset[];
  notificationsEnabled: boolean;
  notificationTime: { hour: number; minute: number };
}

export type RootStackParamList = {
  '(tabs)': undefined;
  'reset/stage1': undefined;
  'reset/stage2': undefined;
  'reset/stage3': undefined;
  'reset/stage4': undefined;
  'reset/stage5': undefined;
};
