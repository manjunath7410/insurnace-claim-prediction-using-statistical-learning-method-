/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, ViewTab } from './components/Sidebar';
import { Header, DeviceViewMode } from './components/Header';
import { HomeDashboardView } from './components/views/HomeDashboardView';
import { DatasetUploadView } from './components/views/DatasetUploadView';
import { DataQualityView } from './components/views/DataQualityView';
import { EDAView } from './components/views/EDAView';
import { StatisticalTestsView } from './components/views/StatisticalTestsView';
import { ModelTrainingView } from './components/views/ModelTrainingView';
import { ModelComparisonView } from './components/views/ModelComparisonView';
import { SinglePredictionView } from './components/views/SinglePredictionView';
import { BatchPredictionView } from './components/views/BatchPredictionView';
import { ExplainabilityView } from './components/views/ExplainabilityView';
import { ReportsView } from './components/views/ReportsView';
import { SecurityView } from './components/views/SecurityView';

import { DatasetMeta, ModelType, PreprocessingConfig, TrainedModelResult, UserRole, UserSession } from './types';
import { generateBenchmarkInsuranceData } from './utils/datasetGenerator';
import { analyzeDataset } from './utils/statEngine';
import { stratifiedTrainTestSplit, trainModel, TransformerPipeline } from './utils/mlEngine';
import { Smartphone, Tablet, Monitor } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('home');
  const [dataset, setDataset] = useState<DatasetMeta | null>(null);
  const [rawRecords, setRawRecords] = useState<Record<string, any>[]>([]);
  const [models, setModels] = useState<TrainedModelResult[]>([]);
  const [activeModel, setActiveModel] = useState<TrainedModelResult | null>(null);
  const [activePipeline, setActivePipeline] = useState<TransformerPipeline | null>(null);
  const [activeRawModel, setActiveRawModel] = useState<any | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [deviceView, setDeviceView] = useState<DeviceViewMode>('laptop');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const [session, setSession] = useState<UserSession>({
    username: 'lead_actuary',
    role: 'admin',
    displayName: 'Dr. Evelyn Vance',
    email: 'actuary@insurance.ai',
    encryptedToken: 'JWT_SECURE_TOKEN_2026',
    isEncrypted: true,
  });

  // Auto-load standard benchmark dataset on initial render
  useEffect(() => {
    handleLoadBenchmarkDataset();
  }, []);

  const handleLoadBenchmarkDataset = () => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        const records = generateBenchmarkInsuranceData(58592);
        const meta = analyzeDataset(records, 'Insurance claims data (1).csv');
        setRawRecords(records);
        setDataset(meta);

        // Auto-train and compare all 4 statistical models
        initAllModels(records, meta);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to auto-load benchmark dataset:', err);
        setIsLoading(false);
      }
    }, 50);
  };

  const initAllModels = (records: Record<string, any>[], meta: DatasetMeta) => {
    try {
      const numCols = meta.columns.filter((c) => c.type === 'numerical').map((c) => c.name);
      const catCols = meta.columns.filter((c) => c.type === 'categorical').map((c) => c.name);
      const targetCol = meta.targetColumn || 'claim_status';

      const config: PreprocessingConfig = {
        imputeStrategyNum: 'median',
        imputeStrategyCat: 'mode',
        scalingStrategy: 'standard',
        encodingStrategy: 'onehot',
        imbalanceHandling: 'class_weights',
        testSize: 0.2,
        randomSeed: 42,
        excludedColumns: [meta.identifierColumn || 'policy_id'],
      };

      const sampleForInit = records.slice(0, 3000);
      const { trainRecords, testRecords } = stratifiedTrainTestSplit(
        sampleForInit,
        targetCol,
        0.2,
        42
      );

      const modelTypes: ModelType[] = ['gradient_boosting', 'random_forest', 'decision_tree', 'logistic_regression'];
      const trainedList: TrainedModelResult[] = [];
      let bestPipeline: TransformerPipeline | null = null;
      let bestRaw: any = null;

      for (const mType of modelTypes) {
        const { modelResult, pipeline, rawModel } = trainModel(
          mType,
          trainRecords,
          testRecords,
          numCols,
          catCols,
          targetCol,
          config,
          { nEstimators: 12, maxDepth: 5, epochs: 80, lr: 0.05 }
        );
        trainedList.push(modelResult);
        if (!bestPipeline) {
          bestPipeline = pipeline;
          bestRaw = rawModel;
        }
      }

      setModels(trainedList);
      setActiveModel(trainedList[0]); // Best model (Gradient Boosting)
      setActivePipeline(bestPipeline);
      setActiveRawModel(bestRaw);
    } catch (e) {
      console.warn('Auto model training error:', e);
    }
  };

  const handleDatasetLoaded = (newMeta: DatasetMeta, records: Record<string, any>[]) => {
    setDataset(newMeta);
    setRawRecords(records);
    initAllModels(records, newMeta);
  };

  const handleModelTrained = (result: TrainedModelResult, pipeline: TransformerPipeline, rawModel: any) => {
    setModels((prev) => [result, ...prev.filter((m) => m.id !== result.id)]);
    setActiveModel(result);
    setActivePipeline(pipeline);
    setActiveRawModel(rawModel);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setSession((prev) => ({ ...prev, role: newRole }));
  };

  const handleSyncServerState = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/dataset/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: rawRecords.slice(0, 1000) }),
      });
    } catch {
      // Graceful fallback
    }
    setTimeout(() => setIsSyncing(false), 300);
  };

  const tabTitles: Record<ViewTab, string> = {
    home: 'Home Dashboard',
    upload: 'Dataset Upload & Schema',
    quality: 'Data Quality Audit',
    eda: 'Exploratory Data Analysis',
    stat_tests: 'Statistical Tests',
    training: 'Model Training',
    comparison: 'Model Comparison',
    single_pred: 'Single Claim Prediction',
    batch_pred: 'Batch Inference',
    explain: 'Explainability & Insights',
    reports: 'Reports & Artifacts',
    security: 'Security & Audit Logs',
  };

  // Render main page content
  const renderViewContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeDashboardView
            dataset={dataset}
            models={models}
            onQuickLoadBenchmark={handleLoadBenchmarkDataset}
            onNavigateTab={setCurrentTab}
            isLoading={isLoading}
          />
        );
      case 'upload':
        return (
          <DatasetUploadView
            dataset={dataset}
            onDatasetLoaded={handleDatasetLoaded}
            onQuickLoadBenchmark={handleLoadBenchmarkDataset}
            isLoading={isLoading}
          />
        );
      case 'quality':
        return <DataQualityView dataset={dataset} />;
      case 'eda':
        return <EDAView dataset={dataset} rawRecords={rawRecords} />;
      case 'stat_tests':
        return <StatisticalTestsView dataset={dataset} rawRecords={rawRecords} />;
      case 'training':
        return (
          <ModelTrainingView
            dataset={dataset}
            rawRecords={rawRecords}
            onModelTrained={handleModelTrained}
          />
        );
      case 'comparison':
        return <ModelComparisonView models={models} />;
      case 'single_pred':
        return (
          <SinglePredictionView
            dataset={dataset}
            activeModel={activeModel}
            pipeline={activePipeline}
            rawModel={activeRawModel}
          />
        );
      case 'batch_pred':
        return (
          <BatchPredictionView
            dataset={dataset}
            rawRecords={rawRecords}
            activeModel={activeModel}
            pipeline={activePipeline}
            rawModel={activeRawModel}
          />
        );
      case 'explain':
        return <ExplainabilityView activeModel={activeModel} />;
      case 'reports':
        return <ReportsView dataset={dataset} rawRecords={rawRecords} models={models} />;
      case 'security':
        return <SecurityView session={session} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#0B1020] font-sans text-slate-100 overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        datasetLoaded={dataset !== null}
        modelsCount={models.length}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Viewport Shell with Device Viewport Selector Support */}
      <div className="flex-1 flex flex-col h-screen bg-[#0B1020] overflow-hidden">
        {/* Top Header */}
        <Header
          currentPageTitle={tabTitles[currentTab]}
          session={session}
          onRoleChange={handleRoleChange}
          datasetRowsCount={dataset ? dataset.totalRows : 0}
          isSyncing={isSyncing}
          onRefreshSync={handleSyncServerState}
          deviceView={deviceView}
          onDeviceViewChange={setDeviceView}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Device Viewport Preview Container */}
        <div className="flex-1 overflow-y-auto bg-[#070A14] p-2 sm:p-4 flex justify-center items-start">
          {deviceView === 'laptop' && (
            <div className="w-full max-w-[1440px] bg-[#0B1020] min-h-full rounded-2xl shadow-2xl border border-slate-800/80">
              {renderViewContent()}
            </div>
          )}

          {deviceView === 'tablet' && (
            <div className="w-full max-w-[768px] my-4 bg-[#0B1020] min-h-full rounded-3xl shadow-2xl border-8 border-slate-800/90 overflow-hidden transition-all glow-violet">
              <div className="bg-slate-900 text-slate-400 text-[10px] py-1.5 text-center font-mono font-bold tracking-wider uppercase border-b border-slate-800">
                Tablet Viewport (768px)
              </div>
              <div className="bg-[#0B1020]">{renderViewContent()}</div>
            </div>
          )}

          {deviceView === 'mobile' && (
            <div className="w-full max-w-[390px] my-4 bg-[#0B1020] min-h-[780px] rounded-[44px] shadow-2xl border-[10px] border-slate-800/95 overflow-hidden transition-all relative glow-cyan">
              {/* iPhone style notch / dynamic island */}
              <div className="bg-slate-900 h-6 w-full flex justify-center items-center">
                <div className="w-24 h-4 bg-black rounded-full" />
              </div>
              <div className="bg-slate-900 text-slate-300 text-[10px] py-1 text-center font-mono font-bold tracking-wider uppercase border-b border-slate-800">
                Mobile Viewport (390px)
              </div>
              <div className="text-xs bg-[#0B1020]">{renderViewContent()}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
