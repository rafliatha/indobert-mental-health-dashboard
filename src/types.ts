export type MentalHealthCategory = 'Positif Terindikasi (1)' | 'Netral (0)';

export interface ModelMetrics {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  latencyMs: number;
  ramUsageMb: number;
  throughputSamplesPerSec: number;
}

export interface ClassPerformance {
  category: string;
  indoBertBase: {
    precision: number;
    recall: number;
    f1Score: number;
  };
  indoBertweet: {
    precision: number;
    recall: number;
    f1Score: number;
  };
}

export interface ConfusionMatrixData {
  category: string;
  predictedPositif: number;
  predictedNetral: number;
}

export interface SingleModelPrediction {
  label: MentalHealthCategory;
  probabilities: {
    'Positif Terindikasi (1)': number;
    'Netral (0)': number;
  };
  latencyMs: number;
  ramUsageMb: number;
  subwords: string[];
  oovCount: number;
  explanation: string;
  wordWeights?: { word: string; weight: number }[];
}

export interface ComparisonPrediction {
  inputText: string;
  processedText: string;
  firstPersonValidated: boolean;
  hasLexiconKeyword: boolean;
  indoBertBase: SingleModelPrediction;
  indoBertweet: SingleModelPrediction;
  recommendedModel: 'IndoBERTweet' | 'IndoBERT-Base';
  analysisNote: string;
}

export interface LexiconItem {
  category: MentalHealthCategory;
  keywords: string[];
  description: string;
}

export interface TweetSample {
  id: string;
  text: string;
  groundTruth: MentalHealthCategory;
  description: string;
  hasCodeMixing: boolean;
  hasSlang: boolean;
}

export interface PreprocessingStep {
  step: number;
  title: string;
  description: string;
  bypassReason?: string;
  exampleInput: string;
  exampleOutput: string;
}
