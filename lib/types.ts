export interface TranslationData {
  english_text: string;
  mnemonics: string;
  ipa: string;
  segments: {
    en: string;
    zh: string;
    ipa: string;
  }[];
}

export interface ScoreResponse {
  overall_score: number;
  pronunciation: number;
  fluency: number;
  completeness: number;
  feedback: string;
  suggestions: string[];
}

export type AppState = 'IDLE' | 'TRANSLATING' | 'PRACTICING' | 'SCORING' | 'RESULT';

export interface PracticeHistory {
  id: string;
  date: string;
  zhText: string;
  translation: TranslationData;
  score?: ScoreResponse;
}
