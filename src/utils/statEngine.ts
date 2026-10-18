import { ColumnMeta, DatasetMeta, StatisticalTestResult } from '../types';

// Mathematical statistical helper functions

/**
 * Gamma function approximation (Lanczos approximation)
 */
export function gamma(z: number): number {
  const p = [
    676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.61502916214059,
    12.507343278686905, -0.13857109526572012, 9.984369578019571e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  z -= 1;
  let x = 0.99999999999980993;
  for (let i = 0; i < p.length; i++) {
    x += p[i] / (z + i + 1);
  }
  const t = z + p.length - 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

/**
 * Regularized Incomplete Gamma Function P(a, x)
 */
export function gammaP(a: number, x: number): number {
  if (x < 0 || a <= 0) return 0;
  if (x === 0) return 0;
  if (x < a + 1) {
    let sum = 1 / a;
    let term = 1 / a;
    for (let n = 1; n < 100; n++) {
      term *= x / (a + n);
      sum += term;
      if (Math.abs(term) < 1e-10 * Math.abs(sum)) break;
    }
    return Math.exp(-x + a * Math.log(x) - Math.log(gamma(a))) * sum;
  } else {
    // Continued fraction for Q(a, x) = 1 - P(a, x)
    let b = x + 1 - a;
    let c = 1 / 1e-30;
    let d = 1 / b;
    let h = d;
    for (let i = 1; i < 100; i++) {
      const an = -i * (i - a);
      b += 2;
      d = an * d + b;
      if (Math.abs(d) < 1e-30) d = 1e-30;
      c = b + an / c;
      if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < 1e-10) break;
    }
    return 1 - Math.exp(-x + a * Math.log(x) - Math.log(gamma(a))) * h;
  }
}

/**
 * Chi-Square CDF (P-Value = 1 - CDF)
 */
export function chiSquarePValue(chi2: number, df: number): number {
  if (chi2 <= 0 || df <= 0) return 1.0;
  const p = gammaP(df / 2, chi2 / 2);
  return Math.max(0, Math.min(1, 1 - p));
}

/**
 * Standard Normal Cumulative Distribution Function (CDF)
 */
export function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x >= 0 ? 1 - p : p;
}

/**
 * Regularized Incomplete Beta Function
 */
export function betaIncomplete(a: number, b: number, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;

  const bt = Math.exp(
    Math.log(gamma(a + b)) -
      Math.log(gamma(a)) -
      Math.log(gamma(b)) +
      a * Math.log(x) +
      b * Math.log(1 - x)
  );

  if (x < (a + 1) / (a + b + 2)) {
    return (bt * betaContinuedFraction(a, b, x)) / a;
  } else {
    return 1 - (bt * betaContinuedFraction(b, a, 1 - x)) / b;
  }
}

function betaContinuedFraction(a: number, b: number, x: number): number {
  const maxIter = 100;
  const eps = 3e-7;
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;

  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d;
  let h = d;

  for (let m = 1; m <= maxIter; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    h *= d * c;

    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    const del = d * c;
    h *= del;

    if (Math.abs(del - 1) < eps) break;
  }

  return h;
}

/**
 * Student's t distribution two-tailed p-value
 */
export function studentTPValue(t: number, df: number): number {
  if (isNaN(t) || isNaN(df) || df <= 0) return 1.0;
  const absT = Math.abs(t);
  const x = df / (df + absT * absT);
  const p = betaIncomplete(df / 2, 0.5, x);
  return Math.max(0, Math.min(1, p));
}

/**
 * Analyzes dataset schema, data types, missing values, and column statistics
 */
export function analyzeDataset(
  rawRecords: Record<string, any>[],
  datasetName: string = 'Insurance Claims Dataset'
): DatasetMeta {
  if (!rawRecords || rawRecords.length === 0) {
    throw new Error('Uploaded dataset is empty or invalid.');
  }

  const totalRows = rawRecords.length;
  const colNames = Object.keys(rawRecords[0]);
  const totalCols = colNames.length;

  let missingTotalCount = 0;
  let duplicateRowsCount = 0;

  // Identify candidate identifier and target columns
  let targetColumn: string | null = null;
  let identifierColumn: string | null = null;

  for (const name of colNames) {
    const lower = name.toLowerCase();
    if (lower === 'claim_status' || lower === 'claim' || lower === 'is_claim' || lower === 'target') {
      targetColumn = name;
    }
    if (lower === 'policy_id' || lower === 'id' || lower === 'record_id' || lower === 'customer_id') {
      identifierColumn = name;
    }
  }

  // Count duplicates
  const rowHashes = new Set<string>();
  for (let i = 0; i < Math.min(totalRows, 5000); i++) {
    const str = JSON.stringify(rawRecords[i]);
    if (rowHashes.has(str)) duplicateRowsCount++;
    else rowHashes.add(str);
  }
  if (totalRows > 5000) {
    duplicateRowsCount = Math.round((duplicateRowsCount / 5000) * totalRows);
  }

  const columnsMeta: ColumnMeta[] = colNames.map((col) => {
    let missingCount = 0;
    const uniqueValues = new Set<any>();
    const values: any[] = [];
    let isNumericCandidate = true;

    for (let i = 0; i < totalRows; i++) {
      const val = rawRecords[i][col];
      if (val === null || val === undefined || val === '' || String(val).trim() === 'NA' || String(val).trim() === 'NaN') {
        missingCount++;
        missingTotalCount++;
      } else {
        uniqueValues.add(val);
        if (isNumericCandidate && isNaN(Number(val))) {
          isNumericCandidate = false;
        }
        values.push(val);
      }
    }

    const uniqueCount = uniqueValues.size;
    const missingPct = Number(((missingCount / totalRows) * 100).toFixed(2));

    // Determine type
    let colType: ColumnMeta['type'] = 'categorical';
    if (col === targetColumn) {
      colType = 'target';
    } else if (col === identifierColumn || (uniqueCount === totalRows && !isNumericCandidate)) {
      colType = 'identifier';
    } else if (isNumericCandidate && uniqueCount > 2) {
      colType = 'numerical';
    }

    let min: number | undefined;
    let max: number | undefined;
    let mean: number | undefined;
    let std: number | undefined;
    let median: number | undefined;
    let q25: number | undefined;
    let q75: number | undefined;
    let mode: string | undefined;
    let categories: ColumnMeta['categories'];

    if (colType === 'numerical' || (isNumericCandidate && uniqueCount > 1)) {
      const numVals = values.map((v) => Number(v)).sort((a, b) => a - b);
      if (numVals.length > 0) {
        min = numVals[0];
        max = numVals[numVals.length - 1];
        const sum = numVals.reduce((acc, v) => acc + v, 0);
        mean = Number((sum / numVals.length).toFixed(4));
        const variance = numVals.reduce((acc, v) => acc + Math.pow(v - mean!, 2), 0) / numVals.length;
        std = Number(Math.sqrt(variance).toFixed(4));
        median = getQuantile(numVals, 0.5);
        q25 = getQuantile(numVals, 0.25);
        q75 = getQuantile(numVals, 0.75);
      }
    }

    // Category frequency breakdown for categorical / low-cardinality columns
    if (uniqueCount <= 50 || colType === 'categorical') {
      const countsMap = new Map<string, number>();
      for (const val of values) {
        const sVal = String(val);
        countsMap.set(sVal, (countsMap.get(sVal) || 0) + 1);
      }
      const sortedCats = Array.from(countsMap.entries())
        .map(([value, count]) => ({
          value,
          count,
          pct: Number(((count / (totalRows - missingCount)) * 100).toFixed(2)),
        }))
        .sort((a, b) => b.count - a.count);

      mode = sortedCats[0]?.value;
      categories = sortedCats.slice(0, 15);
    }

    return {
      name: col,
      type: colType,
      missingCount,
      missingPct,
      uniqueCount,
      min,
      max,
      mean,
      std,
      median,
      q25,
      q75,
      mode,
      categories,
    };
  });

  // Calculate target class distribution if target column exists
  let positiveCount = 0;
  let negativeCount = 0;
  if (targetColumn) {
    for (let i = 0; i < totalRows; i++) {
      const val = Number(rawRecords[i][targetColumn]);
      if (val === 1) positiveCount++;
      else negativeCount++;
    }
  }

  const positiveRatio = totalRows > 0 ? Number(((positiveCount / totalRows) * 100).toFixed(2)) : 0;

  return {
    name: datasetName,
    totalRows,
    totalCols,
    missingTotalCount,
    duplicateRowsCount,
    targetColumn,
    identifierColumn,
    classDistribution: {
      negativeCount,
      positiveCount,
      positiveRatio,
    },
    columns: columnsMeta,
    previewRows: rawRecords.slice(0, 100),
    loadedAt: new Date().toISOString(),
  };
}

function getQuantile(sortedArr: number[], q: number): number {
  if (sortedArr.length === 0) return 0;
  const pos = (sortedArr.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sortedArr[base + 1] !== undefined) {
    return Number((sortedArr[base] + rest * (sortedArr[base + 1] - sortedArr[base])).toFixed(4));
  } else {
    return Number(sortedArr[base].toFixed(4));
  }
}

/**
 * Calculates Pearson Correlation Matrix for numerical columns
 */
export function calculateCorrelationMatrix(
  records: Record<string, any>[],
  columns: string[]
): { columns: string[]; matrix: number[][] } {
  const n = records.length;
  const m = columns.length;
  const means: number[] = new Array(m).fill(0);
  const stds: number[] = new Array(m).fill(0);

  const parsedData: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < m; j++) {
      row.push(Number(records[i][columns[j]]) || 0);
    }
    parsedData.push(row);
  }

  for (let j = 0; j < m; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += parsedData[i][j];
    }
    means[j] = sum / n;

    let sqSum = 0;
    for (let i = 0; i < n; i++) {
      sqSum += Math.pow(parsedData[i][j] - means[j], 2);
    }
    stds[j] = Math.sqrt(sqSum / n);
  }

  const matrix: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));

  for (let j1 = 0; j1 < m; j1++) {
    for (let j2 = 0; j2 < m; j2++) {
      if (j1 === j2) {
        matrix[j1][j2] = 1.0;
        continue;
      }
      if (stds[j1] === 0 || stds[j2] === 0) {
        matrix[j1][j2] = 0.0;
        continue;
      }
      let cov = 0;
      for (let i = 0; i < n; i++) {
        cov += (parsedData[i][j1] - means[j1]) * (parsedData[i][j2] - means[j2]);
      }
      cov /= n;
      const r = cov / (stds[j1] * stds[j2]);
      matrix[j1][j2] = Number(r.toFixed(3));
    }
  }

  return { columns, matrix };
}

/**
 * Run Chi-Square Test of Independence for categorical features against target
 */
export function runChiSquareTest(
  records: Record<string, any>[],
  featureName: string,
  targetName: string
): StatisticalTestResult {
  const contingencyMap = new Map<string, Map<number, number>>();
  let totalN = 0;

  for (const r of records) {
    const fVal = String(r[featureName] ?? 'Missing');
    const tVal = Number(r[targetName]) === 1 ? 1 : 0;

    if (!contingencyMap.has(fVal)) {
      contingencyMap.set(fVal, new Map([[0, 0], [1, 0]]));
    }
    const rowMap = contingencyMap.get(fVal)!;
    rowMap.set(tVal, (rowMap.get(tVal) || 0) + 1);
    totalN++;
  }

  const categories = Array.from(contingencyMap.keys());
  const rCount = categories.length;
  const cCount = 2; // binary target 0 and 1

  const rowTotals: number[] = categories.map((cat) => (contingencyMap.get(cat)?.get(0) || 0) + (contingencyMap.get(cat)?.get(1) || 0));
  const colTotals: number[] = [0, 0];

  for (const cat of categories) {
    colTotals[0] += contingencyMap.get(cat)?.get(0) || 0;
    colTotals[1] += contingencyMap.get(cat)?.get(1) || 0;
  }

  let chi2 = 0;
  for (let i = 0; i < rCount; i++) {
    const cat = categories[i];
    for (let j = 0; j < cCount; j++) {
      const observed = contingencyMap.get(cat)?.get(j) || 0;
      const expected = (rowTotals[i] * colTotals[j]) / totalN;
      if (expected > 0) {
        chi2 += Math.pow(observed - expected, 2) / expected;
      }
    }
  }

  const df = Math.max(1, (rCount - 1) * (cCount - 1));
  const pValue = chiSquarePValue(chi2, df);

  // Cramer's V
  const minDim = Math.min(rCount - 1, cCount - 1) || 1;
  const cramersV = Math.sqrt(chi2 / (totalN * minDim));

  let effectInterpretation: StatisticalTestResult['effectInterpretation'] = 'Negligible';
  if (cramersV >= 0.3) effectInterpretation = 'Large';
  else if (cramersV >= 0.2) effectInterpretation = 'Medium';
  else if (cramersV >= 0.1) effectInterpretation = 'Small';

  const significant = pValue < 0.05;

  return {
    featureName,
    featureType: 'categorical',
    testType: 'chi_square',
    statisticName: 'Chi-Square (χ²)',
    statisticValue: Number(chi2.toFixed(3)),
    degreesOfFreedom: df,
    pValue: Number(pValue.toExponential(3)),
    significant,
    effectSizeName: "Cramer's V",
    effectSizeValue: Number(cramersV.toFixed(3)),
    effectInterpretation,
    conclusion: significant
      ? `Statistically significant association detected between ${featureName} and ${targetName} (p < 0.05, Cramer's V = ${cramersV.toFixed(3)}).`
      : `No statistically significant association found between ${featureName} and ${targetName} (p ≥ 0.05).`,
  };
}

/**
 * Run Welch's t-test for numerical feature comparison across target groups
 */
export function runWelchTTest(
  records: Record<string, any>[],
  featureName: string,
  targetName: string
): StatisticalTestResult {
  const group0: number[] = [];
  const group1: number[] = [];

  for (const r of records) {
    const val = Number(r[featureName]);
    const tVal = Number(r[targetName]);
    if (!isNaN(val)) {
      if (tVal === 1) group1.push(val);
      else group0.push(val);
    }
  }

  const n0 = group0.length;
  const n1 = group1.length;

  if (n0 < 2 || n1 < 2) {
    return {
      featureName,
      featureType: 'numerical',
      testType: 'welch_ttest',
      statisticName: "Welch's t",
      statisticValue: 0,
      pValue: 1.0,
      significant: false,
      effectSizeName: "Cohen's d",
      effectSizeValue: 0,
      effectInterpretation: 'Negligible',
      conclusion: 'Insufficient sample size for Welch t-test.',
    };
  }

  const mean0 = group0.reduce((a, b) => a + b, 0) / n0;
  const mean1 = group1.reduce((a, b) => a + b, 0) / n1;

  const var0 = group0.reduce((a, b) => a + Math.pow(b - mean0, 2), 0) / (n0 - 1);
  const var1 = group1.reduce((a, b) => a + Math.pow(b - mean1, 2), 0) / (n1 - 1);

  const se0 = var0 / n0;
  const se1 = var1 / n1;
  const seDiff = Math.sqrt(se0 + se1);

  const tStat = seDiff > 0 ? (mean1 - mean0) / seDiff : 0;

  // Welch-Satterthwaite degrees of freedom
  const dfNumerator = Math.pow(se0 + se1, 2);
  const dfDenominator = Math.pow(se0, 2) / (n0 - 1) + Math.pow(se1, 2) / (n1 - 1);
  const df = dfDenominator > 0 ? dfNumerator / dfDenominator : n0 + n1 - 2;

  const pValue = studentTPValue(tStat, df);

  // Pooled standard deviation & Cohen's d
  const pooledVar = ((n0 - 1) * var0 + (n1 - 1) * var1) / (n0 + n1 - 2);
  const pooledStd = Math.sqrt(pooledVar);
  const cohensD = pooledStd > 0 ? (mean1 - mean0) / pooledStd : 0;

  let effectInterpretation: StatisticalTestResult['effectInterpretation'] = 'Negligible';
  const absD = Math.abs(cohensD);
  if (absD >= 0.8) effectInterpretation = 'Large';
  else if (absD >= 0.5) effectInterpretation = 'Medium';
  else if (absD >= 0.2) effectInterpretation = 'Small';

  const marginOfError = 1.96 * seDiff;
  const ciLower = Number((mean1 - mean0 - marginOfError).toFixed(4));
  const ciUpper = Number((mean1 - mean0 + marginOfError).toFixed(4));

  const significant = pValue < 0.05;

  return {
    featureName,
    featureType: 'numerical',
    testType: 'welch_ttest',
    statisticName: "Welch's t",
    statisticValue: Number(tStat.toFixed(3)),
    degreesOfFreedom: Number(df.toFixed(1)),
    pValue: Number(pValue.toExponential(3)),
    significant,
    effectSizeName: "Cohen's d",
    effectSizeValue: Number(cohensD.toFixed(3)),
    effectInterpretation,
    confidenceInterval95: [ciLower, ciUpper],
    conclusion: significant
      ? `Statistically significant mean difference found for ${featureName} across claim groups (t = ${tStat.toFixed(3)}, p < 0.05, Cohen's d = ${cohensD.toFixed(3)}).`
      : `No significant mean difference for ${featureName} across claim groups (p ≥ 0.05).`,
  };
}

/**
 * Run Mann-Whitney U test for non-normal / ordinal numerical features
 */
export function runMannWhitneyUTest(
  records: Record<string, any>[],
  featureName: string,
  targetName: string
): StatisticalTestResult {
  const group0: { val: number; group: 0 }[] = [];
  const group1: { val: number; group: 1 }[] = [];

  for (const r of records) {
    const val = Number(r[featureName]);
    const tVal = Number(r[targetName]);
    if (!isNaN(val)) {
      if (tVal === 1) group1.push({ val, group: 1 });
      else group0.push({ val, group: 0 });
    }
  }

  const n0 = group0.length;
  const n1 = group1.length;

  if (n0 === 0 || n1 === 0) {
    return {
      featureName,
      featureType: 'numerical',
      testType: 'mann_whitney_u',
      statisticName: 'Mann-Whitney U',
      statisticValue: 0,
      pValue: 1.0,
      significant: false,
      effectSizeName: 'Rank Biserial r',
      effectSizeValue: 0,
      effectInterpretation: 'Negligible',
      conclusion: 'Insufficient samples for Mann-Whitney U test.',
    };
  }

  // Combine and sort
  const combined = [...group0, ...group1].sort((a, b) => a.val - b.val);

  // Assign ranks with tie handling
  let rankSum1 = 0;
  let i = 0;
  const N = combined.length;

  while (i < N) {
    let j = i;
    while (j < N && combined[j].val === combined[i].val) {
      j++;
    }
    const count = j - i;
    const avgRank = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) {
      if (combined[k].group === 1) {
        rankSum1 += avgRank;
      }
    }
    i = j;
  }

  const u1 = rankSum1 - (n1 * (n1 + 1)) / 2;
  const u0 = n0 * n1 - u1;
  const uMin = Math.min(u0, u1);

  const meanU = (n0 * n1) / 2;
  const stdU = Math.sqrt((n0 * n1 * (n0 + n1 + 1)) / 12);

  const z = stdU > 0 ? (uMin - meanU) / stdU : 0;
  const pValue = Math.min(1, 2 * (1 - normalCDF(Math.abs(z))));

  const rankBiserial = 1 - (2 * uMin) / (n0 * n1);

  let effectInterpretation: StatisticalTestResult['effectInterpretation'] = 'Negligible';
  const absR = Math.abs(rankBiserial);
  if (absR >= 0.5) effectInterpretation = 'Large';
  else if (absR >= 0.3) effectInterpretation = 'Medium';
  else if (absR >= 0.1) effectInterpretation = 'Small';

  const significant = pValue < 0.05;

  return {
    featureName,
    featureType: 'numerical',
    testType: 'mann_whitney_u',
    statisticName: 'Mann-Whitney U',
    statisticValue: Number(uMin.toFixed(1)),
    pValue: Number(pValue.toExponential(3)),
    significant,
    effectSizeName: 'Rank Biserial Correlation',
    effectSizeValue: Number(rankBiserial.toFixed(3)),
    effectInterpretation,
    conclusion: significant
      ? `Statistically significant distribution shift observed for ${featureName} via Mann-Whitney U test (U = ${uMin.toFixed(0)}, p < 0.05).`
      : `No significant distribution difference detected for ${featureName} (p ≥ 0.05).`,
  };
}

/**
 * Apply Benjamini-Hochberg False Discovery Rate (FDR) adjustment to p-values
 */
export function applyFDRCorrection(results: StatisticalTestResult[]): StatisticalTestResult[] {
  const m = results.length;
  if (m === 0) return [];

  // Sort by raw p-value
  const indexed = results.map((res, idx) => ({ res, idx }));
  indexed.sort((a, b) => a.res.pValue - b.res.pValue);

  const adjusted: { idx: number; adjP: number }[] = [];
  let minP = 1.0;

  for (let i = m - 1; i >= 0; i--) {
    const rank = i + 1;
    const rawP = indexed[i].res.pValue;
    const candidate = (rawP * m) / rank;
    minP = Math.min(minP, Math.min(1.0, candidate));
    adjusted.push({ idx: indexed[i].idx, adjP: minP });
  }

  const adjMap = new Map(adjusted.map((item) => [item.idx, item.adjP]));

  return results.map((res, idx) => {
    const adjP = adjMap.get(idx) ?? res.pValue;
    return {
      ...res,
      adjustedPValue: Number(adjP.toExponential(3)),
      significant: adjP < 0.05,
    };
  });
}
