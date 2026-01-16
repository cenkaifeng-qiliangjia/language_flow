import { PracticeHistory } from './types';

const STORAGE_KEY = 'language_flow_history';
const MAX_HISTORY = 20;

export const saveHistory = (item: PracticeHistory) => {
  if (typeof window === 'undefined') return;
  
  const existing = getHistory();
  const updated = [item, ...existing].slice(0, MAX_HISTORY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getHistory = (): PracticeHistory[] => {
  if (typeof window === 'undefined') return [];
  
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const clearHistory = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};
