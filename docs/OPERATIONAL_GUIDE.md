# ClaimPredict AI: Operational Guide & User Handbook

**Handbook Scope**: User Manual for Administrators, Actuaries, and Underwriters  
**Platform Version**: 1.0.0 (Production Release)  

---

## 1. User Roles & Security Authorization

The platform supports 3 distinct roles accessible via the role selector in the top navigation header:

| Role Name | Access Permissions | Primary Tasks |
| :--- | :--- | :--- |
| **`admin` (Administrator / Lead Data Scientist)** | Unrestricted authorization across all 12 modules. | Dataset ingestion, model retraining, hyperparameter selection, decision threshold setting, AES-256 PII encryption testing, and audit log inspection. |
| **`actuary` (Actuary / Risk Analyst)** | Analytics, EDA, statistical testing, model evaluation, and report export. | Hypotheses verification, correlation analysis, leaderboard evaluation, and CSV/JSON report downloads. |
| **`underwriter` (Underwriter / Insurance Agent)** | Operational inference and scoring. | Real-time single-policy risk calculation, high-throughput batch CSV scoring, and downloading scored manifests. |

---

## 2. Step-by-Step Module Workflows

### Module 1: Ingestion & Data Quality Audit
1. Navigate to **"Dataset Upload"** in the sidebar.
2. Click **"Load 58,592-Record Benchmark"** to load the pre-compiled auto insurance claims dataset.
3. Alternatively, click **"Browse CSV File"** to upload a custom policy dataset.
4. Navigate to **"Data Quality Audit"** to view missing value counts, IQR outlier bounds, distinct value counts, and class imbalance distributions.

### Module 2: Exploratory EDA & Statistical Hypothesis Testing
1. Navigate to **"Exploratory EDA"** to inspect feature summary statistics (mean, median, standard deviation, 25th/75th percentiles) and the interactive Pearson correlation matrix.
2. Navigate to **"Statistical Tests"** to inspect automated hypothesis tests:
   - **Welch's t-test** for continuous parameters.
   - **Mann-Whitney U test** for non-normal parameters.
   - **Pearson Chi-Square test ($\chi^2$)** for categorical parameters.
   - Toggle **"Enable Benjamini-Hochberg FDR Control"** to view adjusted p-values.

### Module 3: Model Training & Hyperparameter Tuning
1. Navigate to **"Model Training"**.
2. Select target model: `Gradient Boosting`, `Random Forest`, `Cost-Weighted Logistic Regression`, or `Decision Tree`.
3. Configure numerical feature scaling (`Standard Scaling [Z-Score]`, `Min-Max Scaling [0,1]`, or `None`).
4. Set the stratified test split ratio ($15\%\text{--}35\%$, default $20\%$).
5. Adjust hyperparameter sliders (e.g., maximum depth $3\text{--}12$, estimator count $5\text{--}50$).
6. Click **"Train Model"** to run the zero-leakage pipeline.

### Module 4: Model Leaderboard & Threshold Optimization
1. Navigate to **"Model Comparison"**.
2. Review the model leaderboard comparing Accuracy, Precision, Recall, F1-Score, ROC-AUC, PR-AUC, and Log Loss.
3. Select an active model to inspect its 4-quadrant **Confusion Matrix** (TP, FP, TN, FN).
4. Use the **Decision Cutoff Slider** ($\tau \in [0.05, 0.95]$) to adjust classification thresholds.
5. Input custom penalty costs ($c_{FN}$ missed claim penalty, $c_{FP}$ audit penalty) to calculate **Total Expected Risk Liability**.

### Module 5: Single-Policy Scoring & High-Throughput Batch Scoring
1. Navigate to **"Claim Prediction"** (Single Policy Studio):
   - Adjust policyholder sliders (`policy_tenure`, `age_of_policyholder`, `population_density`, `ncap_rating`, etc.) or click a sample profile preset.
   - Click **"Calculate Insurance Claim Probability"** to generate the verdict, risk tier (`Low`, `Moderate`, `High`, `Critical`), probability gauge, and top factor driver breakdown.
2. Navigate to **"Batch Inference"**:
   - Drag and drop any batch policy CSV file.
   - The streaming engine scores all records in parallel.
   - View summary metrics (total scored, predicted claims, high-risk count, mean probability).
   - Click **"Export CSV (Scored Manifest)"** to download the complete predictions file.

---

## 3. Cryptography & Security Testing

1. Navigate to **"Security & Audit"**.
2. In the **AES-256-GCM Payload Encryption Test** panel, enter sensitive policyholder PII (e.g., driver's license number, SSN, or policyholder name).
3. Click **"Encrypt Payload"**.
4. The system executes client-side W3C Web Crypto API (`AES-GCM` with a 12-byte random IV) and displays the authenticated base64 cipher text.
5. Inspect the **System Activity Audit Log** table to review all timestamped system actions.
