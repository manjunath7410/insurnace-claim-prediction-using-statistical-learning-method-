# ClaimPredict AI: Production-Grade Insurance Claim Prediction Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmanjunath7410%2Finsurnace-claim-prediction-using-statistical-learning-method-)
![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-007ACC?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19.0.1-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=flat-square&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21.2-000000?style=flat-square&logo=express&logoColor=white)
![Web Crypto](https://img.shields.io/badge/Web_Crypto-AES--256--GCM-emerald?style=flat-square)
![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=flat-square)

---

## 📑 Table of Contents
1. [Executive Summary](#-executive-summary)
2. [End-to-End System Architecture](#-end-to-end-system-architecture)
3. [The 5 Core Modules](#-the-5-core-modules)
   - [Module 1: Ingestion & Data Quality Auditing](#module-1-ingestion--data-quality-auditing)
   - [Module 2: Exploratory Data Analysis & Inferential Statistical Testing](#module-2-exploratory-data-analysis--inferential-statistical-testing)
   - [Module 3: Leakage-Free Preprocessing & Statistical Learning Models](#module-3-leakage-free-preprocessing--statistical-learning-models)
   - [Module 4: Model Evaluation, Threshold Optimization & Actuarial Loss Tuning](#module-4-model-evaluation-threshold-optimization--actuarial-loss-tuning)
   - [Module 5: Operational Underwriting Inference, Explainability & Governance](#module-5-operational-underwriting-inference-explainability--governance)
4. [Statistical Learning Methodology & Mathematical Formulations](#-statistical-learning-methodology--mathematical-formulations)
5. [Benchmark Dataset Specification (58,592 Records × 41 Attributes)](#-benchmark-dataset-specification-58592-records--41-attributes)
6. [Security, Governance & Cryptographic Protection](#-security-governance--cryptographic-protection)
7. [API Endpoints & Serverless Interfaces](#-api-endpoints--serverless-interfaces)
8. [Repository Directory Structure](#-repository-directory-structure)
9. [Installation & Local Execution](#-installation--local-execution)
10. [Deployment to Vercel](#-deployment-to-vercel)
11. [Verification & Production Standards](#-verification--production-standards)

---

## 🏛️ Executive Summary

**ClaimPredict AI** is a specialized, production-ready actuarial platform engineered for automobile insurance claim frequency prediction, risk stratification, and statistical inference. 

In vehicle insurance underwriting, claim occurrences represent rare events (~6.4% positive prevalence in empirical policy data). Traditional machine learning models evaluated under standard symmetric loss functions optimize for accuracy by defaulting to the majority negative class, leading to high false-negative rates and substantial unhedged risk exposure. Furthermore, the operational cost of a **False Negative** (an unforeseen, unreserved claim liability) is typically 10 to 15 times greater than a **False Positive** (an underwriting audit flag).

To solve this problem, ClaimPredict AI implements a unified statistical learning pipeline that combines:
1. Pure mathematical hypothesis testing (Welch's t-test, Mann-Whitney U, Pearson Chi-Square, Benjamini-Hochberg FDR control).
2. Zero-leakage data transformers (stratified splitting, fit-only imputation, z-score scaling, one-hot encoding).
3. Cost-weighted statistical classifiers (Gradient Boosting, Random Forest, Decision Tree, Cost-Weighted Logistic Regression).
4. Dynamic decision threshold optimization minimizing asymmetric financial risk loss matrices.
5. High-throughput client-side inference with cryptographic privacy controls (AES-256-GCM) and role-based access governance.

---

## 🏗️ End-to-End System Architecture

The application is architected as a high-performance single-page application (SPA) backed by an Express server and Vercel serverless API handlers. Preprocessing, statistical hypothesis computations, model training, and scoring are executed via a deterministic, multi-threaded JavaScript/TypeScript numerical engine (`src/utils/statEngine.ts` and `src/utils/mlEngine.ts`).

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT INTERFACE (React 19)                          │
│                                                                                        │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────────────┐  │
│  │ Module 1: Ingestion  │  │ Module 2: EDA &      │  │ Module 3: ML Training        │  │
│  │ & Quality Audit      │─▶│ Statistical Testing  │─▶│ Pipeline & 4 Models          │  │
│  └──────────────────────┘  └──────────────────────┘  └──────────────┬───────────────┘  │
│                                                                     │                  │
│  ┌──────────────────────────────────────────────────┐               │                  │
│  │ Module 5: Operational Underwriting & Governance  │               ▼                  │
│  │ ├─ Single-Policy Real-Time Predictor             │  ┌─────────────────────────────┐ │
│  │ ├─ High-Throughput Batch CSV Scoring Manifest    │◀─│ Module 4: Leaderboard,      │ │
│  │ ├─ Global SHAP & Logistic Odds Ratios (e^β)      │  │ Threshold Tuning & Loss     │ │
│  │ └─ Web Crypto AES-256-GCM & RBAC Audit Engine    │  └─────────────────────────────┘ │
│  └──────────────────────────────────────────────────┘                                  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ HTTP / JSON
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                           SERVER & SERVERLESS BACKEND RUNTIME                          │
│                                                                                        │
│  ┌─────────────────────────┐  ┌───────────────────────────┐  ┌───────────────────────┐ │
│  │ Express Engine          │  │ In-Memory Dataset Sync    │  │ Vercel Serverless     │ │
│  │ (server.ts on Port 3000)│  │ (/api/dataset/sync)       │  │ (/api/health.ts)      │ │
│  └─────────────────────────┘  └───────────────────────────┘  └───────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ The 5 Core Modules

The production system is partitioned into 5 core operational modules:

### Module 1: Ingestion & Data Quality Auditing
- **High-Capacity Ingestion**: Ingests custom external CSV files via `PapaParse` or loads the pre-compiled 58,592-record auto insurance benchmark with zero UI lag.
- **Automated Type Inference**: Classifies schema variables into `numerical`, `categorical`, `identifier`, and `target` (`claim_status`).
- **Comprehensive Quality Audit**:
  - Missingness percentage quantification ($0.0\%$ in benchmark data).
  - Interquartile Range (IQR) outlier boundary computation ($Q_1 - 1.5 \times \text{IQR}$ to $Q_3 + 1.5 \times \text{IQR}$).
  - Unique cardinality tracking and distinct category inventory.
  - Target label distribution profiling ($N_{neg} = 54,844$, $N_{pos} = 3,748$, positive claim rate = $6.40\%$).

### Module 2: Exploratory Data Analysis & Inferential Statistical Testing
- **Parametric & Non-Parametric Profiling**: Evaluates mean, standard deviation, median, 25th percentile, 75th percentile, minimum, and maximum across all numerical features.
- **Multicollinearity Heatmap**: Computes full bivariate Pearson correlation matrix ($r \in [-1.0, +1.0]$) across continuous variables (`policy_tenure`, `age_of_car`, `age_of_policyholder`, `population_density`, `ncap_rating`, etc.).
- **Rigorous Hypothesis Testing Engine**:
  - **Welch's Two-Sample t-test**: Compares continuous variables across claim vs. non-claim cohorts with unequal variances using Satterthwaite degrees of freedom.
  - **Mann-Whitney U Rank-Sum Test**: Evaluates continuous variables that exhibit distributional skewness using normal approximations and continuity corrections.
  - **Pearson's Chi-Square ($\chi^2$) Test of Independence**: Assesses statistical association between categorical features and claim status with Cramér's V effect size.
  - **Benjamini-Hochberg False Discovery Rate (FDR)**: Adjusts raw p-values across all simultaneous tests to eliminate Type I error inflation.

### Module 3: Leakage-Free Preprocessing & Statistical Learning Models
- **`TransformerPipeline` Design**:
  - Fits preprocessing transformations (median/mean numerical imputers, mode categorical imputers, standard/min-max scalers, one-hot category dictionaries) **strictly on the training split**.
  - Applies fitted transforms to the held-out test split, eliminating data leakage.
  - Preserves minority-class prevalence via stratified sampling.
- **4 Native Supervised Classifiers (Implemented in TypeScript)**:
  1. **Cost-Sensitive Logistic Regression**: L2 Ridge regularized logistic loss with class weight ratio $c_1/c_0 \approx 14.6$. Generates actuarially interpretable Odds Ratios ($e^\beta$).
  2. **Decision Tree Classifier**: Recursive binary splitting driven by Gini Impurity reduction with configurable maximum tree depth ($3 \le \text{depth} \le 12$) and minimum leaf sample constraints.
  3. **Random Forest Classifier**: Ensemble of decorrelated decision trees built on bootstrap samples with random feature subspace selection ($\sqrt{p}$).
  4. **Gradient Boosting Classifier**: Sequential boosting framework iteratively fitting decision tree base-learners to the negative gradient (pseudo-residuals) of binary cross-entropy loss.

### Module 4: Model Evaluation, Threshold Optimization & Actuarial Loss Tuning
- **Evaluation Metrics**: Computes Accuracy, Precision, Recall, F1-Score, ROC-AUC (trapezoidal integration), PR-AUC, and Cross-Validation folds.
- **Confusion Matrix Simulation**: Tracks True Positives (TP), False Positives (FP), True Negatives (TN), and False Negatives (FN).
- **Dynamic Decision Threshold Tuning**: Allows underwriters to adjust classification cutoff $\tau \in [0.05, 0.95]$ in real time.
- **Financial Risk Loss Optimization**: Minimizes total expected risk liability based on underwriting penalty costs:
  $$\text{Total Financial Risk} = (c_{FN} \times FN) + (c_{FP} \times FP)$$
  where default actuarial penalties are set to $c_{FN} = \$1,200$ (missed claim hazard) and $c_{FP} = \$100$ (underwriting audit administrative expense).

### Module 5: Operational Underwriting Inference, Explainability & Governance
- **Single-Policy Prediction Studio**: Real-time risk probability calculation for individual policyholder inputs, complete with 4-tier risk classification (`Low Risk` $< 30\%$, `Moderate Risk` $30\text{--}50\%$, `High Risk` $50\text{--}70\%$, `Critical Risk` $\ge 70\%$) and influential feature attribution.
- **High-Throughput Batch Inference**: Streams batch CSV scoring across thousands of policyholder records simultaneously, generating downloadable CSV files containing policy IDs, probabilities, predicted classes, and risk tiers.
- **SHAP & Feature Importance Explainability**: Global feature importance charts alongside Logistic Regression odds ratios ($e^\beta > 1.0$ indicates increased claim risk).
- **Security & RBAC Layer**:
  - 3-tier Role-Based Access Control (`admin`, `actuary`, `underwriter`).
  - Native client-side **AES-256-GCM** encryption for sensitive PII using the Web Crypto API.
  - Immutable activity audit log recording all user actions with ISO-8601 timestamps.

---

## 📐 Statistical Learning Methodology & Mathematical Formulations

### 1. Welch's Two-Sample t-Test
For unequal sample sizes ($n_1, n_2$) and variances ($s_1^2, s_2^2$):
$$t = \frac{\bar{X}_1 - \bar{X}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}}$$
Degrees of freedom ($\nu$) via the Satterthwaite approximation:
$$\nu \approx \frac{\left(\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}\right)^2}{\frac{(s_1^2 / n_1)^2}{n_1 - 1} + \frac{(s_2^2 / n_2)^2}{n_2 - 1}}$$
Effect size is reported as Cohen's $d$:
$$d = \frac{\bar{X}_1 - \bar{X}_2}{s_{\text{pooled}}}, \quad s_{\text{pooled}} = \sqrt{\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}}$$

### 2. Mann-Whitney U Rank-Sum Test
For continuous features where normality is violated:
$$U_1 = R_1 - \frac{n_1(n_1 + 1)}{2}, \quad U_2 = n_1 n_2 - U_1, \quad U = \min(U_1, U_2)$$
Asymptotic normal approximation with continuity correction:
$$z = \frac{U - \frac{n_1 n_2}{2} + 0.5}{\sqrt{\frac{n_1 n_2 (n_1 + n_2 + 1)}{12}}}$$
Effect size reported as rank-biserial correlation:
$$r = 1 - \frac{2U}{n_1 n_2}$$

### 3. Pearson's Chi-Square Test of Independence ($\chi^2$)
For categorical variables cross-tabulated against `claim_status`:
$$\chi^2 = \sum_{i=1}^r \sum_{j=1}^c \frac{(O_{ij} - E_{ij})^2}{E_{ij}}, \quad E_{ij} = \frac{R_i \cdot C_j}{N}$$
Degrees of freedom:
$$\text{df} = (r - 1)(c - 1)$$
Effect size reported as Cramér's $V$:
$$V = \sqrt{\frac{\chi^2}{N \cdot \min(r - 1, c - 1)}}$$

### 4. Benjamini-Hochberg False Discovery Rate (FDR) Procedure
Given $m$ ordered p-values $p_{(1)} \le p_{(2)} \le \dots \le p_{(m)}$ and target FDR level $Q = 0.05$:
$$k = \max \left\{ i : p_{(i)} \le \frac{i}{m} Q \right\}$$
Adjusted p-values:
$$p_{\text{adj}(i)} = \min_{k \ge i} \left( \min\left(1, \frac{m}{k} p_{(k)}\right) \right)$$

### 5. Cost-Sensitive Logistic Regression
Sigmoid hypothesis function:
$$\hat{y} = P(Y=1 \mid X) = \sigma(w^T X + b) = \frac{1}{1 + e^{-(w^T X + b)}}$$
Cost-weighted objective with L2 regularization:
$$J(w, b) = -\frac{1}{N} \sum_{i=1}^N \left[ c_1 y_i \log(\hat{y}_i) + c_0 (1 - y_i) \log(1 - \hat{y}_i) \right] + \frac{\lambda}{2} \|w\|_2^2$$
Odds Ratio for feature $j$:
$$\text{OR}_j = \exp(w_j)$$

### 6. Decision Tree Gini Impurity
Impurity of node $t$:
$$I_G(t) = 1 - \sum_{k=0}^1 p(k \mid t)^2$$
Split quality evaluation:
$$\Delta I_G(s, t) = I_G(t) - \frac{N_L}{N_t} I_G(t_L) - \frac{N_R}{N_t} I_G(t_R)$$

### 7. Gradient Boosting Loss & Pseudo-Residuals
For binary cross-entropy loss $L(y, f(x)) = -y f(x) + \log(1 + e^{f(x)})$, the pseudo-residuals at iteration $m$ are:
$$r_{im} = -\left[\frac{\partial L(y_i, f(x_i))}{\partial f(x_i)}\right]_{f(x) = f_{m-1}(x)} = y_i - \sigma(f_{m-1}(x_i))$$
The model accumulates additive tree predictions scaled by shrinkage $\eta$:
$$f_m(x) = f_{m-1}(x) + \eta \sum_{j=1}^{J_m} \gamma_{jm} \mathbf{1}(x \in R_{jm})$$

---

## 📊 Benchmark Dataset Specification (58,592 Records × 41 Attributes)

Located in `public/Insurance claims data.csv` (**11.5 MB**):

- **Target Variable**: `claim_status` / `is_claim` (`0` = No Claim, `1` = Claim Filed).
- **Identifier**: `policy_id` (`ID000001` through `ID058592`).

### Complete Attribute Dictionary:
| Attribute Name | Data Type | Permitted Values / Typical Range | Actuarial Relevance |
| :--- | :--- | :--- | :--- |
| `policy_id` | Identifier | `ID000001`–`ID058592` | Primary unique policy token. |
| `policy_tenure` | Continuous | $0.001$ to $1.396$ years | Length of policyholder relationship with insurer. |
| `age_of_car` | Continuous | $0.00$ to $0.15$ normalized | Vehicle age; higher values correlate with mechanical wear. |
| `age_of_policyholder` | Continuous | $0.28$ to $0.90$ normalized | Policyholder age; younger drivers correlate with higher accident risk. |
| `area_cluster` | Categorical | `C1` through `C14` (14 clusters) | Geographic rating territory and loss experience zone. |
| `population_density` | Integer | $2,000$ to $73,400$ per $\text{km}^2$ | Traffic density; urban congestion elevates claim probability. |
| `make` | Categorical | `1`, `2`, `3`, `4`, `5` | Vehicle manufacturer identifier. |
| `segment` | Categorical | `A`, `B1`, `B2`, `C1`, `C2`, `Utility` | Vehicle size and market class. |
| `model` | Categorical | `M1` through `M11` | Vehicle specific model variant. |
| `fuel_type` | Categorical | `CNG`, `Petrol`, `Diesel` | Fuel propulsion type. |
| `max_torque` | Categorical | e.g., `113Nm@4400rpm`, `250Nm@2750rpm` | Powertrain torque output. |
| `max_power` | Categorical | e.g., `88bhp@6000rpm`, `113bhp@4000rpm` | Powertrain engine horsepower. |
| `engine_type` | Categorical | e.g., `1.2 L K Series`, `1.5 L U2 CRDi` | Internal combustion engine family. |
| `airbags` | Integer | `1`, `2`, `6` | Passive safety occupant restraint count. |
| `ncap_rating` | Integer | `0`, `1`, `2`, `3`, `4`, `5` | Independent crash safety assessment star rating. |
| `length` | Integer | $3,445$ to $4,300$ mm | Vehicle exterior longitudinal dimension. |
| `width` | Integer | $1,515$ to $1,790$ mm | Vehicle exterior lateral dimension. |
| `height` | Integer | $1,475$ to $1,825$ mm | Vehicle exterior vertical dimension. |
| `gross_weight` | Integer | $1,051$ to $1,720$ kg | Vehicle total loaded mass. |
| `steering_type` | Categorical | `Power`, `Manual`, `Electric` | Steering mechanism type. |
| `turning_radius` | Float | $4.5$ to $5.3$ meters | Turning circle clearance. |
| `is_esc` | Binary | `Yes`, `No` | Electronic Stability Control. |
| `is_adjustable_steering` | Binary | `Yes`, `No` | Tilt/telescopic steering adjustment. |
| `is_tpms` | Binary | `Yes`, `No` | Tire Pressure Monitoring System. |
| `is_parking_sensors` | Binary | `Yes`, `No` | Ultrasonic parking proximity alert. |
| `is_speed_alert` | Binary | `Yes`, `No` | Acoustic speeding compliance warning. |
| `is_door_lock_option` | Binary | `Yes`, `No` | Automatic impact/speed sensing door locks. |
| `is_central_locking` | Binary | `Yes`, `No` | Centralized power door lock actuator. |
| `is_power_steering` | Binary | `Yes`, `No` | Assisted steering system. |
| `is_driver_seat_height_adjustable` | Binary | `Yes`, `No` | Ergonomic vertical seating adjustment. |
| `is_day_night_rear_view_mirror` | Binary | `Yes`, `No` | Anti-glare prismatic interior mirror. |
| `is_ecw` | Binary | `Yes`, `No` | Engine check alert notification system. |
| `is_rear_window_wiper` | Binary | `Yes`, `No` | Rear glass precipitation wiper. |
| `is_rear_window_washer` | Binary | `Yes`, `No` | Rear glass washer fluid jet. |
| `is_rear_window_defogger` | Binary | `Yes`, `No` | Electric rear window defroster grid. |
| `is_brake_assist` | Binary | `Yes`, `No` | Emergency brake assist hydraulic booster. |
| `is_power_door_locks` | Binary | `Yes`, `No` | Electric power door locking mechanisms. |
| `is_sensor` | Binary | `Yes`, `No` | Integrated crash/impact warning sensors. |
| `is_rear_camera` | Binary | `Yes`, `No` | Rear-view reversing camera feed. |
| `claim_status` | Binary Target | `0` (No Claim), `1` (Claim Filed) | Ground truth binary insurance claim indicator. |

---

## 🔒 Security, Governance & Cryptographic Protection

Implemented in `src/utils/security.ts`:

### 1. Role-Based Access Control (RBAC)
The platform enforces role-restricted views and operational authorizations:
- **`admin` (Administrator / Lead Data Scientist)**: Full access. Dataset ingestion, model retraining, hyperparameter optimization, threshold setting, PII encryption testing, and audit log inspection.
- **`actuary` (Actuary / Risk Analyst)**: Analytical authorization. Exploratory data analysis, hypothesis testing execution, model evaluation, and report exporting.
- **`underwriter` (Underwriter / Insurance Agent)**: Operational authorization. Single-policy underwriting calculation, batch CSV scoring, and scored manifest export.

### 2. Client-Side Web Crypto AES-256-GCM Encryption
Sensitive policyholder personally identifiable information (PII) is encrypted directly within the browser using the **W3C Web Crypto API** (`window.crypto.subtle`):
- **Algorithm**: `AES-GCM` with a 256-bit cryptographic key.
- **Initialization Vector (IV)**: Cryptographically secure 12-byte random IV per payload via `window.crypto.getRandomValues()`.
- **Integrity**: Authenticated ciphertext output guarantees tamper detection before network transit or local storage.

### 3. Immutable System Audit Log
Every critical workflow mutation emits an auditable entry:
```typescript
interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO-8601
  username: string;
  role: UserRole;
  action: string;    // e.g., 'TRAIN_MODEL', 'BATCH_PREDICTION', 'ENCRYPT_PAYLOAD'
  details: string;
}
```

---

## 🔌 API Endpoints & Serverless Interfaces

### Express Application Server (`server.ts`)
- **`GET /api/health`**: Returns system uptime, active record cache count, memory utilization, and timestamp.
- **`GET /api/dataset/sample`**: Serves a structured preview of the 58,592-record benchmark dataset.
- **`POST /api/dataset/sync`**: Accepts and caches active dataset records in memory across connected sessions.

### Vercel Serverless Functions (`api/`)
- **`api/health.ts`**: Standalone serverless health probe returning active service metadata.
- **`api/dataset/sync.ts`**: Standalone serverless handler accepting JSON payloads to synchronize dataset records.

---

## 📁 Repository Directory Structure

```
├── .env.example                       # Template for environment configuration
├── .gitignore                         # Git exclusion rules
├── README.md                          # Comprehensive system architecture & methodology report
├── api/                               # Vercel serverless API handlers
│   ├── dataset/
│   │   └── sync.ts                    # Serverless dataset sync endpoint
│   └── health.ts                      # Serverless health endpoint
├── index.html                         # SPA HTML entry point
├── metadata.json                      # AI Studio platform configuration
├── package.json                       # Dependencies, scripts, and package metadata
├── public/                            # Static assets and benchmark datasets
│   ├── Insurance claims data.csv      # Complete 58,592-record auto insurance dataset (11.5 MB)
│   └── Insurance claims data (1).csv  # Secondary dataset reference
├── scripts/
│   └── build_dataset_csv.ts           # Benchmark dataset compiler script
├── server.ts                          # Express server with Vite middleware integration
├── src/
│   ├── App.tsx                        # Root layout, routing state, and tab navigation
│   ├── components/
│   │   ├── Header.tsx                 # Navigation bar, RBAC role switcher, and Vercel CTA
│   │   ├── Sidebar.tsx                # 12-module intelligence navigation drawer
│   │   └── views/                     # 12 active production views
│   │       ├── BatchPredictionView.tsx      # Module 5: High-throughput batch CSV scoring
│   │       ├── DataQualityView.tsx          # Module 1: Missingness & IQR outlier audits
│   │       ├── DatasetUploadView.tsx        # Module 1: Ingestion & benchmark loader
│   │       ├── EDAView.tsx                  # Module 2: Correlation heatmap & quartiles
│   │       ├── ExplainabilityView.tsx       # Module 5: Feature importance & odds ratios
│   │       ├── HomeDashboardView.tsx        # Overview dashboard & pipeline diagram
│   │       ├── ModelComparisonView.tsx      # Module 4: Leaderboard, threshold & loss
│   │       ├── ModelTrainingView.tsx        # Module 3: Hyperparameter tuning & logs
│   │       ├── ReportsView.tsx              # Module 5: CSV & JSON artifact exports
│   │       ├── SecurityView.tsx             # Module 5: RBAC & AES-256-GCM testing
│   │       ├── SinglePredictionView.tsx     # Module 5: Interactive policy risk scoring
│   │       └── StatisticalTestsView.tsx     # Module 2: Welch, Mann-Whitney, Chi-Sq, FDR
│   ├── index.css                      # Tailwind CSS v4 styling rules
│   ├── main.tsx                       # React application bootstrap
│   ├── types/
│   │   └── index.ts                   # Strict TypeScript type definitions
│   └── utils/
│       ├── datasetGenerator.ts        # Synthetic/benchmark dataset generator
│       ├── formatters.ts              # NaN-safe numerical formatting utilities
│       ├── mlEngine.ts                # Machine learning models & TransformerPipeline
│       ├── security.ts                # RBAC permissions, Web Crypto AES-256-GCM, audit
│       └── statEngine.ts              # Mathematical statistical testing & correlation
├── tsconfig.json                      # Strict TypeScript compiler options
├── vercel.json                        # Vercel deployment configuration with SPA rewrites
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

2. **Install all required dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   The local application will launch on `http://localhost:3000`.

4. **Verify TypeScript compilation**:
   ```bash
   npm run lint
   ```

5. **Build the production bundle**:
   ```bash
   npm run build
   ```

6. **Preview the production build**:
   ```bash
   npm run preview
   ```

---

## 🚀 Deployment to Vercel

The application is pre-configured for **zero-configuration deployment on Vercel** via `vercel.json`:

### Method 1: One-Click Instant Deployment
Deploy directly to Vercel using the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmanjunath7410%2Finsurnace-claim-prediction-using-statistical-learning-method-)

### Method 2: Import via Vercel Web Dashboard
1. Navigate to [vercel.com/new](https://vercel.com/new).
2. Choose your repository: `manjunath7410/insurnace-claim-prediction-using-statistical-learning-method-`.
3. Vercel automatically detects the **Vite** framework preset:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click **Deploy**.

### Method 3: Deploy via Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

---

## 🛡️ Verification & Production Standards

- **TypeScript Strict Compliance**: `tsc --noEmit` validates with **0 errors**.
- **Production Asset Compilation**: Bundles clean static chunks in `dist/` with immutable asset caching (`Cache-Control: public, max-age=31536000, immutable`).
- **Numerical Resilience**: Bounded safeguards in `src/utils/formatters.ts` prevent any runtime `NaN` or unhandled division-by-zero states.
- **License**: Apache-2.0.
