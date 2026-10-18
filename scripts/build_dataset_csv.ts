import fs from 'fs';
import path from 'path';
import { generateBenchmarkInsuranceData } from '../src/utils/datasetGenerator.ts';
import Papa from 'papaparse';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating 58,592 records for Insurance claims data (1).csv...');
const records = generateBenchmarkInsuranceData(58592);
const csvContent = Papa.unparse(records);

const file1 = path.join(publicDir, 'Insurance claims data (1).csv');
const file2 = path.join(publicDir, 'Insurance claims data.csv');

fs.writeFileSync(file1, csvContent, 'utf-8');
fs.writeFileSync(file2, csvContent, 'utf-8');

console.log(`Created ${file1} (${(fs.statSync(file1).size / 1024 / 1024).toFixed(2)} MB)`);
console.log(`Created ${file2} (${(fs.statSync(file2).size / 1024 / 1024).toFixed(2)} MB)`);
