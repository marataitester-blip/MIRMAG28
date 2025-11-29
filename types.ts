
export interface TarotCard {
  name: string;
  keyword: string;
  imageUrl: string;
}

export interface AnalysisResult {
  card: TarotCard;
  interpretation: string;
  generatedImageUrl: string | null;
  // Extended fields
  timestamp?: string;
  image_prompt?: string;
  imageUrl?: string;
}

export enum AnalysisStep {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING', // Parallel: Interpretation + Image Prompt Generation
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
