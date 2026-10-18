import React, { useState } from 'react';
import { Cpu, Play, CheckCircle2, ShieldCheck, Settings, RefreshCw, Zap } from 'lucide-react';
import { DatasetMeta, ModelType, PreprocessingConfig, TrainedModelResult } from '../../types';
import { stratifiedTrainTestSplit, trainModel, TransformerPipeline } from '../../utils/mlEngine';

interface ModelTrainingViewProps {
  dataset: DatasetMeta | null;
  rawRecords: Record<string, any>[];
  onModelTrained: (result: TrainedModelResult, pipeline: TransformerPipeline, rawModel: any) => void;
}

export const ModelTrainingView: React.FC<ModelTrainingViewProps> = ({
  dataset,
  rawRecords,
  onModelTrained,
}) => {
  const [selectedModel, setSelectedModel] = useState<ModelType>('logistic_regression');
  const [testRatio, setTestRatio] = useState<number>(0.2);
  const [scaling, setScaling] = useState<'standard' | 'minmax' | 'none'>('standard');
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);

  // Hyperparameters
  const [lrEpochs, setLrEpochs] = useState<number>(120);
  const [lrLearningRate, setLrLearningRate] = useState<number>(0.05);
  const [dtMaxDepth, setDtMaxDepth] = useState<number>(6);
  const [rfEstimators, setRfEstimators] = useState<number>(15);
  const [gbEstimators, setGbEstimators] = useState<number>(15);

  if (!dataset) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Cpu className="w-12 h-12 text-slate-700 mx-auto mb-3" />
        <p className="text-sm">Please upload or load a dataset first to configure and train statistical learning models.</p>
      </div>
    );
  }

  const handleStartTraining = () => {
    setIsTraining(true);
    setTrainingLogs([
      'Initializing leakage-safe preprocessing pipeline...',
      `Splitting dataset into ${(100 - testRatio * 100).toFixed(0)}% Train / ${(testRatio * 100).toFixed(0)}% Test splits (stratified)...`,
    ]);

    setTimeout(() => {
      try {
        const numCols = dataset.columns.filter((c) => c.type === 'numerical').map((c) => c.name);
        const catCols = dataset.columns.filter((c) => c.type === 'categorical').map((c) => c.name);
        const targetCol = dataset.targetColumn || 'claim_status';

        const config: PreprocessingConfig = {
          imputeStrategyNum: 'median',
          imputeStrategyCat: 'mode',
          scalingStrategy: scaling,
          encodingStrategy: 'onehot',
          imbalanceHandling: 'class_weights',
          testSize: testRatio,
          randomSeed: 42,
          excludedColumns: [dataset.identifierColumn || 'policy_id'],
        };

        const { trainRecords, testRecords } = stratifiedTrainTestSplit(
          rawRecords,
          targetCol,
          testRatio,
          42
        );

        setTrainingLogs((prev) => [
          ...prev,
          `Train Set: ${trainRecords.length.toLocaleString()} rows | Test Set: ${testRecords.length.toLocaleString()} rows`,
          `Fitting scaler and one-hot encoders strictly on train set...`,
          `Executing ${selectedModel.replace('_', ' ').toUpperCase()} statistical optimization...`,
        ]);

        const hyperparams: Record<string, any> = {
          epochs: lrEpochs,
          lr: lrLearningRate,
          maxDepth: dtMaxDepth,
          nEstimators: selectedModel === 'random_forest' ? rfEstimators : gbEstimators,
        };

        const { modelResult, pipeline, rawModel } = trainModel(
          selectedModel,
          trainRecords,
          testRecords,
          numCols,
          catCols,
          targetCol,
          config,
          hyperparams
        );

        setTrainingLogs((prev) => [
          ...prev,
          `Optimization complete in ${modelResult.metrics.trainingTimeMs} ms!`,
          `Evaluated held-out test metrics: ROC-AUC = ${modelResult.metrics.rocAuc}, F1 = ${modelResult.metrics.f1Score}`,
        ]);

        onModelTrained(modelResult, pipeline, rawModel);
        setIsTraining(false);
      } catch (err: any) {
        setTrainingLogs((prev) => [...prev, `ERROR: ${err.message}`]);
        setIsTraining(false);
      }
    }, 100);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1440px] mx-auto text-slate-100 bg-[#0B1020] min-h-screen">
      <div className="border-b border-slate-800/80 pb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Cpu className="w-5 h-5 text-violet-400" />
          Leakage-Safe Model Training Studio
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Train Logistic Regression, Decision Trees, Random Forests, or Gradient Boosting with stratified splits and 5-fold cross validation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Model & Preprocessing Controls */}
        <div className="lg:col-span-2 bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-cyan-400" />
              1. Select Model & Hyperparameters
            </h3>
            <span className="text-[11px] font-mono text-slate-400">scikit-learn compliant</span>
          </div>

          {/* Model Type Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'logistic_regression', name: 'Logistic Regression', desc: 'Primary statistical baseline with Odds Ratios' },
              { id: 'decision_tree', name: 'Decision Tree Classifier', desc: 'Interpretable Gini/Entropy decision tree' },
              { id: 'random_forest', name: 'Random Forest Classifier', desc: 'Bagging ensemble of decision trees' },
              { id: 'gradient_boosting', name: 'Gradient Boosting Classifier', desc: 'Stage-wise residual boosting' },
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedModel(m.id as ModelType)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-1 ${
                  selectedModel === m.id
                    ? 'border-violet-500 bg-violet-950/40 glow-violet'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                }`}
              >
                <div className="text-xs font-bold text-white">{m.name}</div>
                <p className="text-[11px] text-slate-400">{m.desc}</p>
              </div>
            ))}
          </div>

          {/* Hyperparameter Controls per Model */}
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Model Hyperparameters</h4>

            {selectedModel === 'logistic_regression' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Gradient Descent Epochs ({lrEpochs})
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="300"
                    value={lrEpochs}
                    onChange={(e) => setLrEpochs(Number(e.target.value))}
                    className="w-full accent-violet-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Learning Rate ({lrLearningRate})
                  </label>
                  <input
                    type="range"
                    min="0.01"
                    max="0.2"
                    step="0.01"
                    value={lrLearningRate}
                    onChange={(e) => setLrLearningRate(Number(e.target.value))}
                    className="w-full accent-violet-600"
                  />
                </div>
              </div>
            )}

            {selectedModel === 'decision_tree' && (
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Maximum Tree Depth ({dtMaxDepth})
                </label>
                <input
                  type="range"
                  min="3"
                  max="12"
                  value={dtMaxDepth}
                  onChange={(e) => setDtMaxDepth(Number(e.target.value))}
                  className="w-full accent-violet-600"
                />
              </div>
            )}

            {selectedModel === 'random_forest' && (
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Number of Estimator Trees ({rfEstimators})
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={rfEstimators}
                  onChange={(e) => setRfEstimators(Number(e.target.value))}
                  className="w-full accent-violet-600"
                />
              </div>
            )}

            {selectedModel === 'gradient_boosting' && (
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Number of Boosting Stages ({gbEstimators})
                </label>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={gbEstimators}
                  onChange={(e) => setGbEstimators(Number(e.target.value))}
                  className="w-full accent-violet-600"
                />
              </div>
            )}
          </div>

          {/* Feature Scaling & Train Split Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Numerical Feature Scaling
              </label>
              <select
                value={scaling}
                onChange={(e) => setScaling(e.target.value as any)}
                className="w-full text-xs font-semibold bg-slate-900 border border-slate-700 py-2.5 px-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="standard">Standard Scaling (Z-score)</option>
                <option value="minmax">Min-Max Scaling [0, 1]</option>
                <option value="none">None (Raw values)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Stratified Test Split ({(testRatio * 100).toFixed(0)}%)
              </label>
              <input
                type="range"
                min="0.15"
                max="0.35"
                step="0.05"
                value={testRatio}
                onChange={(e) => setTestRatio(Number(e.target.value))}
                className="w-full mt-2 accent-violet-600"
              />
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            onClick={handleStartTraining}
            disabled={isTraining}
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isTraining ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Training Statistical Model...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Train {selectedModel.replace('_', ' ').toUpperCase()} Model</span>
              </>
            )}
          </button>
        </div>

        {/* Execution Log Terminal */}
        <div className="bg-[#111827]/90 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4 font-mono text-xs flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Training Execution Console
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="flex-1 bg-slate-950/90 p-4 rounded-xl border border-slate-800/80 overflow-y-auto max-h-80 space-y-2 text-[11px] leading-relaxed text-slate-300">
            {trainingLogs.length === 0 ? (
              <p className="text-slate-500 italic">Console output will stream here during model fitting...</p>
            ) : (
              trainingLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400">&gt;</span>
                  <span>{log}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
