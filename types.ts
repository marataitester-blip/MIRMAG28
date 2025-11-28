
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
  ANALYZING = 'ANALYZING', // Selecting the card
  PAINTING = 'PAINTING',   // Generating image
  INTERPRETING = 'INTERPRETING', // Writing text
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
