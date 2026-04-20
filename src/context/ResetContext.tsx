import React, { createContext, useContext, useState } from 'react';

interface ResetDraft {
  brainDump: string;
  reflections: { question1: string; question2: string; question3: string };
  priorities: [string, string, string];
  schedule: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
  };
}

interface ResetContextValue {
  draft: ResetDraft;
  updateBrainDump: (text: string) => void;
  updateReflection: (key: keyof ResetDraft['reflections'], value: string) => void;
  updatePriorities: (priorities: [string, string, string]) => void;
  updateSchedule: (day: keyof ResetDraft['schedule'], items: string[]) => void;
  clearDraft: () => void;
}

const emptyDraft: ResetDraft = {
  brainDump: '',
  reflections: { question1: '', question2: '', question3: '' },
  priorities: ['', '', ''],
  schedule: { monday: [], tuesday: [], wednesday: [], thursday: [], friday: [] },
};

const ResetContext = createContext<ResetContextValue | null>(null);

export function ResetProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<ResetDraft>(emptyDraft);

  const updateBrainDump = (text: string) => setDraft(d => ({ ...d, brainDump: text }));

  const updateReflection = (key: keyof ResetDraft['reflections'], value: string) =>
    setDraft(d => ({ ...d, reflections: { ...d.reflections, [key]: value } }));

  const updatePriorities = (priorities: [string, string, string]) =>
    setDraft(d => ({ ...d, priorities }));

  const updateSchedule = (day: keyof ResetDraft['schedule'], items: string[]) =>
    setDraft(d => ({ ...d, schedule: { ...d.schedule, [day]: items } }));

  const clearDraft = () => setDraft(emptyDraft);

  return (
    <ResetContext.Provider
      value={{ draft, updateBrainDump, updateReflection, updatePriorities, updateSchedule, clearDraft }}
    >
      {children}
    </ResetContext.Provider>
  );
}

export function useReset() {
  const ctx = useContext(ResetContext);
  if (!ctx) throw new Error('useReset must be used within ResetProvider');
  return ctx;
}
