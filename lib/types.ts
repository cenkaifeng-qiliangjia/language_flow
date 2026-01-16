export interface TranslationData {
  format_result: string;
  format_helper: string;
  format_pron: string;
  // 以下为旧字段，保留兼容性
  english_text?: string;
  mnemonics?: string;
  ipa?: string;
  segments?: {
    en: string;
    zh: string;
    ipa: string;
  }[];
}

export interface ScoreResponse {
  score: number;
  judge: string;
  proposal: string;
}

export type AppState = 'IDLE' | 'TRANSLATING' | 'PRACTICING' | 'SCORING' | 'RESULT';

export interface PracticeHistory {
  id: string;
  date: string;
  zhText: string;
  translation: TranslationData;
  score?: ScoreResponse;
}
