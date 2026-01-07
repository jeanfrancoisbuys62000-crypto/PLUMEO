
export type GradeLevel = '6ème' | '5ème' | '4ème' | '3ème';
export type AppView = 'editor' | 'inspiration';

export interface Consigne {
  title: string;
  description: string;
  gradeLevel: GradeLevel;
  type: 'narratif' | 'argumentatif' | 'descriptif' | 'explicatif';
}

export interface ErrorAnnotation {
  text: string;
  type: 'grammar' | 'lexical';
  hint: string;
  guidance: string;
}

export interface AnalysisResult {
  summary: string;
  score: number; // 0-40 (Standard Brevet)
  strengths: string[];
  improvements: string[];
  advice: {
    organization: string;
    vocabulary: string;
    grammar: string;
    style: string;
  };
  annotatedText: string; // Text with markers for errors
}

export interface AppState {
  view: AppView;
  text: string;
  consigne: Consigne | null;
  analysis: AnalysisResult | null;
  isAnalyzing: boolean;
  correctionMode: boolean;
  isDarkMode: boolean;
}
