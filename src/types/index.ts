export type ColumnType = 'numerical' | 'categorical' | 'identifier' | 'target';

export interface ColumnMeta {
  name: string;
  type: ColumnType;
  missingCount: number;
  missingPct: number;
  uniqueCount: number;
  min?: number;
  max?: number;
  mean?: number;
  std?: number;
  median?: number;
  q25?: number;
  q75?: number;
  mode?: string;
  categories?: { value: string; count: number; pct: number }[];
}

export interface DatasetMeta {
  name: string;
  totalRows: number;
  totalCols: number;
  missingTotalCount: number;
  duplicateRowsCount: number;
  targetColumn: string | null;
  identifierColumn: string | null;
  classDistribution: {
    negativeCount: number;
    positiveCount: number;
    positiveRatio: number; // percentage of claim=1
  };
  columns: ColumnMeta[];
  previewRows: Record<string, any>[];
  loadedAt: string;
}

export interface PreprocessingConfig {
  imputeStrategyNum: 'median' | 'mean';
  imputeStrategyCat: 'mode' | 'missing';
  scalingStrategy: 'standard' | 'minmax' | 'none';
  encodingStrategy: 'onehot' | 'ordinal';
  imbalanceHandling: 'none' | 'class_weights' | 'oversample';
  testSize: number; // e.g. 0.2
  randomSeed: number;
  excludedColumns: string[];
}

export interface StatisticalTestResult {
  featureName: string;
  featureType: 'categorical' | 'numerical';
  testType: 'chi_square' | 'welch_ttest' | 'mann_whitney_u';
  statisticName: string;
  statisticValue: number;
  degreesOfFreedom?: number;
  pValue: number;
  adjustedPValue?: number;
  significant: boolean; // p < 0.05
  effectSizeName: string;
  effectSizeValue: number;
  effectInterpretation: 'Negligible' | 'Small' | 'Medium' | 'Large';
  confidenceInterval95?: [number, number];
  conclusion: string;
}

export interface ConfusionMatrix {
  tp: number;
  fp: number;
  tn: number;
  fn: number;
}

export interface ClassificationReport {
  class0: { precision: number; recall: number; f1: number; support: number };
  class1: { precision: number; recall: number; f1: number; support: number };
  macroAvg: { precision: number; recall: number; f1: number };
  weightedAvg: { precision: number; recall: number; f1: number };
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  prAuc: number;
  logLoss: number;
  trainingTimeMs: number;
  inferenceTimeMs: number;
  confusionMatrix: ConfusionMatrix;
  rocCurvePoints: { fpr: number; tpr: number; threshold: number }[];
  prCurvePoints: { recall: number; precision: number; threshold: number }[];
  crossValScores: {
    folds: number[];
    mean: number;
    std: number;
  };
  classificationReport: ClassificationReport;
}

export type ModelType = 'logistic_regression' | 'decision_tree' | 'random_forest' | 'gradient_boosting';

export interface FeatureImportance {
  feature: string;
  importance: number;
  type?: string;
  oddsRatio?: number;
}

export interface TrainedModelResult {
  id: string;
  modelType: ModelType;
  modelName: string;
  parameters: Record<string, any>;
  metrics: ModelMetrics;
  featureImportances: FeatureImportance[];
  oddsRatios?: { feature: string; coefficient: number; oddsRatio: number }[];
  permutationImportances?: FeatureImportance[];
  decisionThreshold: number;
  trainedAt: string;
  trainSize: number;
  testSize: number;
  rawModelInstance?: any; // internal serialized payload
}

export interface SinglePredictionInput {
  record: Record<string, any>;
}

export interface PredictionFactor {
  feature: string;
  value: any;
  impact: number; // positive = pushes towards claim, negative = reduces claim probability
  description: string;
}

export type RiskTier = 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk';

export interface PredictionResult {
  id: string;
  policyId?: string;
  claimProbability: number;
  predictedClass: 0 | 1;
  riskTier: RiskTier;
  decisionThreshold: number;
  topFactors: PredictionFactor[];
  inputRecord: Record<string, any>;
  predictionTimeMs: number;
}

export interface BatchPredictionSummary {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  totalClaimsPredicted: number;
  totalNonClaimsPredicted: number;
  highRiskCount: number;
  averageProbability: number;
  processingTimeMs: number;
  predictions: PredictionResult[];
}

export type UserRole = 'admin' | 'actuary' | 'underwriter';

export interface UserSession {
  username: string;
  role: UserRole;
  displayName: string;
  email: string;
  encryptedToken: string;
  isEncrypted: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  username: string;
  role: UserRole;
  action: string;
  details: string;
}
