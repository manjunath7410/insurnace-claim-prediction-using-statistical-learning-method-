# ClaimPredict AI: Insurance Claim Prediction Using Statistical Learning Methods

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmanjunath7410%2Finsurnace-claim-prediction-using-statistical-learning-method-)
![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-007ACC?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19.0.1-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=flat-square&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21.2-000000?style=flat-square&logo=express&logoColor=white)
![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=flat-square)

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Dataset Specification](#-dataset-specification)
3. [Statistical Inference & Hypothesis Testing Engine](#-statistical-inference--hypothesis-testing-engine)
4. [Statistical Learning & Machine Learning Models](#-statistical-learning--machine-learning-models)
5. [System Architecture & Existing Application Modules](#-system-architecture--existing-application-modules)
6. [Security, RBAC & Cryptographic Protection](#-security-rbac--cryptographic-protection)
7. [API Endpoints Specification](#-api-endpoints-specification)
8. [Repository Directory Structure](#-repository-directory-structure)
9. [Installation & Local Execution](#-installation--local-execution)
10. [Deployment to Vercel](#-deployment-to-vercel)
11. [Build Verification & Quality Standards](#-build-verification--quality-standards)

---

## 📌 Project Overview

**ClaimPredict AI** is a production-grade actuarial intelligence platform built to predict auto insurance claim liabilities and analyze risk factors using rigorous statistical learning techniques.

In vehicle insurance underwriting, claim events are rare (~6.4% in historical data), causing severe **class imbalance**. A naive model that classifies every policy as "No Claim" achieves 93.6% accuracy while failing 100% of claims. Moreover, the business cost of a **False Negative** (an unpaid or un-underwritten catastrophic claim) is significantly higher than a **False Positive** (an underwriting audit flag).

This system provides:
- **Strict Zero-Leakage Pipeline**: All data imputation, scaling, and one-hot encoding parameters are fitted strictly on training folds.
- **Pure Mathematical Foundations**: Full client- and server-side statistical implementations (Welch's t-test, Mann-Whitney U, Chi-Square, Benjamini-Hochberg FDR) without third-party black-box dependencies.
- **Supervised Learning Algorithms**: Custom implementations of Gradient Boosting, Random Forest, Decision Tree, and Cost-Weighted Logistic Regression.
- **Operational Underwriting Tools**: Dynamic decision threshold tuning with asymmetric cost optimization matrices, single-policy real-time inference, and batch CSV scoring.
- **Enterprise Governance**: Role-Based Access Control (RBAC), client-side AES-256-GCM encryption for sensitive policyholder PII, and immutable activity audit logs.

---

## 📊 Dataset Specification

The project includes the benchmark dataset `public/Insurance claims data.csv` containing **58,592 policyholder records** across **41 feature attributes**:

- **Target Variable**: `claim_status` / `is_claim` (Binary: `0` = No Claim [93.6%], `1` = Claim Filed [6.4%]).
- **Identifier**: `policy_id` (Unique alphanumeric policy token).

### Feature Inventory:
| Category | Variables | Description & Encoding |
| :--- | :--- | :--- |
| **Driver & Policy Dynamics** | `policy_tenure`, `age_of_policyholder`, `age_of_car` | Normalized continuous variables representing tenure and demographic risk. |
| **Geographic Density** | `area_cluster`, `population_density` | Categorical clusters (`C1`–`C14`) and population density per square kilometer. |
| **Vehicle Specifications** | `make`, `segment`, `model`, `fuel_type`, `engine_type`, `steering_type` | Categorical attributes representing vehicle classifications (`A`, `B1`, `B2`, `C1`, `C2`, `Utility`), fuel (`CNG`, `Petrol`, `Diesel`), and mechanical setups. |
| **Vehicle Physical Dimensions** | `length`, `width`, `height`, `gross_weight`, `turning_radius` | Numerical measurements in millimeters, kilograms, and meters. |
| **Safety Ratings & Restraints** | `ncap_rating`, `airbags` | NCAP crash safety stars (0–5) and total installed airbag count (1, 2, 6). |
| **Active Safety & ADAS Features** | `is_esc`, `is_adjustable_steering`, `is_tpms`, `is_parking_sensors`, `is_speed_alert`, `is_door_lock_option`, `is_central_locking`, `is_power_steering`, `is_driver_seat_height_adjustable`, `is_day_night_rear_view_mirror`, `is_ecw`, `is_rear_window_wiper`, `is_rear_window_washer`, `is_rear_window_defogger`, `is_brake_assist`, `is_power_door_locks`, `is_sensor`, `is_rear_camera` | Binary attributes (`Yes` / `No`) indicating the presence of electronic stability, braking assistance, camera sensors, and visibility aids. |

---

## 🔬 Statistical Inference & Hypothesis Testing Engine

All statistical tests are implemented in `src/utils/statEngine.ts` using core mathematical formulations:

### 1. Welch's Two-Sample t-Test (Numerical Features)
Tests whether the mean of a continuous feature differs significantly between claim and non-claim groups without assuming equal variances:
$$t = \frac{\bar{X}_1 - \bar{X}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}}$$
Degrees of freedom are computed via the **Welch-Satterthwaite approximation**:
$$\nu \approx \frac{\left(\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}\right)^2}{\frac{(s_1^2 / n_1)^2}{n_1 - 1} + \frac{(s_2^2 / n_2)^2}{n_2 - 1}}$$
Effect size is reported as **Cohen's d**.

### 2. Mann-Whitney U Rank-Sum Test (Non-Parametric)
Employed when numerical feature distributions exhibit skewness or non-normality:
$$U_1 = R_1 - \frac{n_1(n_1 + 1)}{2}, \quad U = \min(U_1, U_2)$$
Uses asymptotic normal approximation with continuity correction:
$$z = \frac{U - \frac{n_1 n_2}{2} + 0.5}{\sqrt{\frac{n_1 n_2 (n_1 + n_2 + 1)}{12}}}$$
Effect size is reported as rank-biserial correlation $r = 1 - \frac{2U}{n_1 n_2}$.

### 3. Pearson's Chi-Square Test of Independence ($\chi^2$) (Categorical Features)
Evaluates association between categorical parameters (e.g., `area_cluster`, `is_esc`) and claim probability:
$$\chi^2 = \sum_{i=1}^r \sum_{j=1}^c \frac{(O_{ij} - E_{ij})^2}{E_{ij}}, \quad E_{ij} = \frac{R_i C_j}{N}$$
Effect size is reported as **Cramér's V**:
$$V = \sqrt{\frac{\chi^2}{N \min(r - 1, c - 1)}}$$

### 4. Benjamini-Hochberg False Discovery Rate (FDR) Procedure
Controls the expected proportion of false discoveries when simultaneously evaluating 40+ hypothesis tests:
$$p_{(i)} \le \frac{i}{m} \cdot Q$$
Adjusted p-values:
$$p_{adj(i)} = \min_{k \ge i} \left( \min\left(1, \frac{m}{k} p_{(k)}\right) \right)$$

---

## 🤖 Statistical Learning & Machine Learning Models

Implemented in `src/utils/mlEngine.ts`:

### 1. Zero-Leakage Preprocessing Pipeline (`TransformerPipeline`)
- **Stratified Split**: Preserves the exact 6.4% minority class ratio across training and testing partitions.
- **Imputation**: Numerical values imputed using the median; categorical values imputed using the mode (fitted solely on the training partition).
- **Feature Scaling**: Standard Z-Score normalization ($\mu = 0, \sigma = 1$) or Min-Max scaling ($[0, 1]$).
- **Categorical Transformation**: One-Hot dummy encoding with explicit fallback for previously unseen categories during inference.

### 2. Cost-Sensitive Logistic Regression (`LogisticRegressionModel`)
- Fits a linear boundary through the sigmoid activation function:
  $$P(Y=1 \mid X) = \sigma(w^T X + b) = \frac{1}{1 + e^{-(w^T X + b)}}$$
- Optimized via mini-batch gradient descent with L2 Ridge Regularization:
  $$J(w) = -\frac{1}{N} \sum_{i=1}^N \left[ c_1 y_i \log(\hat{y}_i) + c_0 (1 - y_i) \log(1 - \hat{y}_i) \right] + \frac{\lambda}{2} \|w\|^2$$
- Class weight ratio $c_1 / c_0 = \frac{N_{neg}}{N_{pos}} \approx 14.6$ forces the model to heavily penalize missed claims.
- Exports explicit **Odds Ratios** ($e^\beta$) for actuarial interpretability.

### 3. Decision Tree Classifier (`DecisionTreeClassifierModel`)
- Implements recursive binary tree partitioning using **Gini Impurity**:
  $$I_G(p) = 1 - \sum_{k=0}^1 p_k^2$$
- Evaluates split quality using information gain:
  $$\Delta I_G = I_G(D) - \left( \frac{|D_L|}{|D|} I_G(D_L) + \frac{|D_R|}{|D|} I_G(D_R) \right)$$
- Constrained by configurable `maxDepth` (3 to 12) and `minSamplesLeaf` to prevent overfitting.

### 4. Random Forest Classifier (`RandomForestClassifierModel`)
- Constructs an ensemble of decorrelated decision trees using bootstrap aggregation (bagging).
- Feature sub-sampling: each candidate split selects a random subset of features ($\sqrt{p}$).
- Aggregates probability estimates across all trees to reduce variance:
  $$\hat{P}_{RF}(Y=1 \mid X) = \frac{1}{B} \sum_{b=1}^B \hat{P}_b(Y=1 \mid X)$$

### 5. Gradient Boosting Classifier (`GradientBoostingClassifierModel`)
- Builds an additive series of regression decision trees fit to the negative gradients (pseudo-residuals) of the binary cross-entropy loss:
  $$r_{im} = -\left[\frac{\partial L(y_i, f(x_i))}{\partial f(x_i)}\right]_{f(x)=f_{m-1}(x)} = y_i - \sigma(f_{m-1}(x_i))$$
- Updates log-odds predictions using a learning rate shrinkage parameter $\eta$:
  $$f_m(x) = f_{m-1}(x) + \eta \sum_{j=1}^{J_m} \gamma_{jm} \mathbf{1}(x \in R_{jm})$$

---

## 🖥️ System Architecture & Existing Application Modules

The application interface is structured into **12 specialized intelligence views**:

```
src/components/views/
├── HomeDashboardView.tsx        # High-level pipeline flowchart, model inventory, and quick CTAs
├── DatasetUploadView.tsx        # Ingests custom CSVs or loads the 58,592-record benchmark
├── DataQualityView.tsx          # Missingness audits, cardinality tracking, and outlier checks
├── EDAView.tsx                  # Distributions, quartiles, and Pearson correlation heatmaps
├── StatisticalTestsView.tsx     # Welch's t-test, Mann-Whitney U, Chi-square & Benjamini-Hochberg FDR
├── ModelTrainingView.tsx        # Hyperparameter controls, scaling configuration, and live logs
├── ModelComparisonView.tsx      # ROC-AUC/PR-AUC leaderboards, confusion matrices, and financial loss tuning
├── SinglePredictionView.tsx     # Interactive single-record underwriter simulation with risk factors
├── BatchPredictionView.tsx      # High-throughput batch CSV inference with downloadable scored CSVs
├── ExplainabilityView.tsx       # Global feature importance rankings and Logistic Regression odds ratios
├── ReportsView.tsx              # Generates cleaned CSVs, EDA summaries (JSON), and leaderboard exports
└── SecurityView.tsx             # RBAC role switching, AES-256 payload encryption, and audit logs
```

---

## 🔒 Security, RBAC & Cryptographic Protection

Implemented in `src/utils/security.ts`:

### 1. Role-Based Access Control (RBAC)
- **Administrator / Lead Data Scientist**: Unrestricted authorization (uploading datasets, training models, tuning hyperparameters, exporting audit logs).
- **Actuary / Risk Analyst**: Authorized for dataset exploration, statistical testing, model evaluation, and report generation.
- **Underwriter / Insurance Agent**: Focused on operational execution (single-policy risk calculation and batch CSV underwriting scoring).

### 2. Client-Side AES-256-GCM Payload Encryption
- Uses the native **Web Crypto API** (`window.crypto.subtle`) for end-to-end cryptographic confidentiality.
- Sensitive policyholder personally identifiable information (PII) is encrypted using authenticated **AES-256-GCM** with a dynamic 12-byte initialization vector (IV) before network transport or client-side caching.

### 3. Immutable Activity Audit Log
- Automatically generates auditable records for every key system action (`DATASET_SYNC`, `MODEL_TRAINED`, `BATCH_PREDICTION`, `ENCRYPTION_EVENT`) with timestamps, username, user role, and operation metadata.

---

## 🔌 API Endpoints Specification

The Express backend (`server.ts`) and Vercel serverless functions (`api/`) expose the following endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns server status, uptime, active record count (58,592), memory usage, and timestamp. |
| `GET` | `/api/dataset/sample` | Delivers metadata and a sample preview of the benchmark insurance claims dataset. |
| `POST` | `/api/dataset/sync` | Synchronizes active in-memory dataset records across connected client sessions. |

---

## 📂 Repository Directory Structure

```
├── .env.example                       # Environment variables template
├── .gitignore                         # Build and dependency ignore definitions
├── README.md                          # Comprehensive project report & documentation
├── api/                               # Vercel serverless API handlers
│   ├── dataset/
│   │   └── sync.ts                    # Serverless dataset sync endpoint
│   └── health.ts                      # Serverless health endpoint
├── index.html                         # SPA HTML entry point
├── metadata.json                      # AI Studio platform configuration
├── package.json                       # Dependencies and run scripts
├── public/                            # Static assets and benchmark datasets
│   ├── Insurance claims data.csv      # Full 58,592-record benchmark dataset (11.5 MB)
│   └── Insurance claims data (1).csv  # Secondary benchmark copy
├── scripts/
│   └── build_dataset_csv.ts           # Benchmark dataset compiler script
├── server.ts                          # Express backend with Vite middleware
├── src/
│   ├── App.tsx                        # Root application component & layout state
│   ├── components/
│   │   ├── Header.tsx                 # Navigation bar, role switch, sync status, and Vercel CTA
│   │   ├── Sidebar.tsx                # 12-module intelligence navigation
│   │   └── views/                     # All 12 domain-specific analytics views
│   ├── index.css                      # Tailwind CSS v4 directives & theme styles
│   ├── main.tsx                       # React DOM entry point
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces (DatasetMeta, ModelMetrics, etc.)
│   └── utils/
│       ├── datasetGenerator.ts        # Synthetic/benchmark dataset generator
│       ├── formatters.ts              # NaN-safe numerical formatters (`safeNum`, `safeInt`)
│       ├── mlEngine.ts                # Machine learning algorithms & preprocessing pipeline
│       ├── security.ts                # RBAC definitions, AES-256-GCM crypto, audit logging
│       └── statEngine.ts              # Mathematical statistical testing & correlation engine
├── tsconfig.json                      # TypeScript configuration
├── vercel.json                        # Vercel deployment configuration & routing rewrites
└── vite.config.ts                     # Vite build configuration with React & Tailwind plugins
```

---

## 💻 Installation & Local Execution

### Prerequisites
- **Node.js**: Version `18.0.0` or higher
- **npm**: Version `9.0.0` or higher

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/manjunath7410%2Finsurnace-claim-prediction-using-statistical-learning-method-.git
   cd insurnace-claim-prediction-using-statistical-learning-method-
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the local full-stack server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

4. **Verify TypeScript compilation**:
   ```bash
   npm run lint
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **Preview production build locally**:
   ```bash
   npm run preview
   ```

---

## 🚀 Deployment to Vercel

The codebase is pre-configured for **zero-configuration deployment on Vercel** using `vercel.json`:

### Option A: One-Click Instant Deployment
Click the button below to fork and deploy directly into your Vercel account:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmanjunath7410%2Finsurnace-claim-prediction-using-statistical-learning-method-)

### Option B: Deploy via Vercel Dashboard
1. Navigate to [vercel.com/new](https://vercel.com/new).
2. Select your imported GitHub repository: `manjunath7410/insurnace-claim-prediction-using-statistical-learning-method-`.
3. Vercel automatically detects the framework preset as **Vite**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click **Deploy**. The application and serverless endpoints will be live immediately.

### Option C: Deploy via Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

---

## ✅ Build Verification & Quality Standards

- **TypeScript Strict Checking**: `tsc --noEmit` completes with **0 errors**.
- **Production Bundle**: Minified and optimized asset bundles in `dist/` with immutable caching headers.
- **Runtime Integrity**: All numerical displays, division operations, and statistical calculations are protected against `NaN` or unhandled division-by-zero states.
- **License**: Apache-2.0.
