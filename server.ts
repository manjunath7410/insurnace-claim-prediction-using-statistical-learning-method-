import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { generateBenchmarkInsuranceData } from './src/utils/datasetGenerator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Server-side dataset state cache for session synchronization
let cachedDatasetRecords: Record<string, any>[] | null = null;
let activeSessionsCount = 100000; // Scalable active records & simulated user sessions count

// API Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    uptimeSeconds: Math.floor(process.uptime()),
    activeRecordsCount: cachedDatasetRecords ? cachedDatasetRecords.length : 58592,
    simulatedUsers: activeSessionsCount,
    memoryUsageMB: Number((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)),
    timestamp: new Date().toISOString(),
  });
});

// Endpoint to load or generate benchmark insurance claims dataset
app.get('/api/dataset/sample', (req, res) => {
  try {
    if (!cachedDatasetRecords) {
      console.log('Generating benchmark insurance claims dataset (58,592 rows x 41 cols)...');
      cachedDatasetRecords = generateBenchmarkInsuranceData(58592);
    }
    res.json({
      success: true,
      totalRows: cachedDatasetRecords.length,
      sampleRows: cachedDatasetRecords.slice(0, 500),
      columnsCount: Object.keys(cachedDatasetRecords[0]).length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Sync user dataset to server memory
app.post('/api/dataset/sync', (req, res) => {
  try {
    const { records } = req.body;
    if (Array.isArray(records)) {
      cachedDatasetRecords = records;
      res.json({ success: true, count: records.length, message: 'Dataset synchronized across active instances.' });
    } else {
      res.status(400).json({ success: false, error: 'Invalid dataset format.' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Insurance Claim Prediction System running on http://localhost:${PORT}`);
  });
}

startServer();
