
export interface TarotCard {
  name: string;
  keyword: string;
  imageUrl: string;
}

export interface AnalysisResult {
  card: TarotCard;
  interpretation: string;
  generatedImageUrl: string | null;
}

export enum AnalysisStep {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING', // Combined analysis and generation
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
