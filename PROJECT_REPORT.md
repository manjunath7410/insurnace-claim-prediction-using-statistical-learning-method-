# ClaimPredict AI: Comprehensive Engineering & Actuarial Project Report

**Project Title**: Insurance Claim Prediction Using Statistical Learning Methods  
**System Version**: 1.0.0 (Production Build)  
**Target Domain**: Auto Insurance Underwriting, Actuarial Risk Stratification, and Fraud Prevention  
**Author / Repository**: `manjunath7410/insurnace-claim-prediction-using-statistical-learning-method-`  
**License**: Apache License 2.0  

---

## Executive Summary

Auto insurance claim frequency modeling presents significant challenges due to **extreme class imbalance** (empirical claim prevalence is ~6.40% in historical datasets) and **asymmetric risk costs**. Standard machine learning models optimizing symmetric loss functions (such as accuracy) tend to default to predicting the majority "No Claim" class, achieving seemingly high accuracy (93.6%) while missing 100% of actual insurance claims. In practice, the financial penalty of a **False Negative** (an unforeseen, unreserved claim liability) is orders of magnitude higher than a **False Positive** (an underwriting audit flag).

**ClaimPredict AI** addresses these challenges by delivering an end-to-end, zero-leakage statistical learning platform built using React 19, TypeScript, Vite, Tailwind CSS v4, and Express/Serverless edge APIs. The platform implements a unified 5-stage pipeline:
1. **Data Ingestion & Quality Auditing**: Automated schema verification, missingness rates, and Interquartile Range (IQR) outlier detection across 58,592 records and 41 attributes.
2. **Inferential Statistical Engine**: Pure mathematical implementations of Welch's t-test, Mann-Whitney U test, Pearson Chi-Square test ($\chi^2$), and Benjamini-Hochberg False Discovery Rate (FDR) control across all covariates.
3. **Zero-Leakage Preprocessing & ML Engine**: Custom `TransformerPipeline` guaranteeing fit-only training parameters, coupled with 4 supervised classifiers: Cost-Weighted Logistic Regression, Decision Tree Classifier, Random Forest Classifier, and Gradient Boosting Classifier.
4. **Actuarial Financial Loss Engine**: Real-time classification threshold optimization ($\tau \in [0.05, 0.95]$) minimizing asymmetric financial loss matrices ($c_{FN} = \$1,200$, $c_{FP} = \$100$).
5. **Operational Underwriting & Governance**: Interactive single-record risk prediction, vector batch CSV scoring, global feature importances, Logistic Odds Ratios ($e^\beta$), 3-tier Role-Based Access Control (RBAC), client-side AES-256-GCM encryption via the W3C Web Crypto API, and immutable audit event logs.

---

## 1. Problem Formulation & Actuarial Context

### 1.1 The Class Imbalance Paradox in Claim Frequency
In property and casualty (P&C) automobile insurance, claim events represent rare stochastic occurrences. In the benchmark dataset of 58,592 policyholders:
- **Non-Claim Policies ($Y = 0$)**: 54,844 records (**93.60%**)
- **Claim-Filing Policies ($Y = 1$)**: 3,748 records (**6.40%**)

A baseline dummy classifier assigning $\hat{Y} = 0$ for all policies yields:
$$\text{Accuracy} = \frac{54,844}{58,592} = 93.60\%$$
However, its **Recall for Claim Policies** is $0.00\%$, rendering it completely useless for underwriting and reserve management.

### 1.2 Asymmetric Financial Loss Formulation
In insurance operations, classification errors carry severely unequal economic costs:
- **Cost of False Positive ($c_{FP}$)**: Cost of requesting additional driver documentation or manual underwriter review ($\approx \$100$).
- **Cost of False Negative ($c_{FN}$)**: Cost of unreserved claim payout, litigation, or fraudulent payout ($\approx \$1,200$).

The actuarial objective function minimizes Total Expected Financial Loss $L(\tau)$ as a function of the decision threshold $\tau$:
$$L(\tau) = c_{FP} \cdot FP(\tau) + c_{FN} \cdot FN(\tau)$$
where $FP(\tau)$ and $FN(\tau)$ represent false positive and false negative counts at threshold $\tau$.

---

## 2. Benchmark Dataset Architecture

The system incorporates a benchmark auto insurance claims dataset (`public/Insurance claims data.csv`, **11.5 MB**) containing **58,592 policyholder records** across **41 feature columns**.

### 2.1 Feature Attribute Classification
The features are structured across 5 domain categories:

| Domain | Variables | Data Type | Description |
| :--- | :--- | :--- | :--- |
| **Identifier & Target** | `policy_id`, `claim_status` | Alphanumeric / Binary | Policy ID (`ID000001`–`ID058592`) and Target ($0/1$). |
| **Policyholder & Vehicle Age** | `policy_tenure`, `age_of_car`, `age_of_policyholder` | Continuous | Relationship length, normalized vehicle age, and policyholder age. |
| **Geographic & Demographics** | `area_cluster`, `population_density` | Categorical / Continuous | 14 regional rating territories (`C1`–`C14`) and population density (2,000–73,400 per $\text{km}^2$). |
| **Vehicle Specifications** | `make`, `segment`, `model`, `fuel_type`, `engine_type`, `steering_type`, `length`, `width`, `height`, `gross_weight`, `turning_radius` | Categorical / Continuous | Vehicle segment (`A`, `B1`, `B2`, `C1`, `C2`, `Utility`), fuel (`CNG`, `Petrol`, `Diesel`), and physical dimensions. |
| **Safety Ratings & ADAS (19 Features)** | `ncap_rating`, `airbags`, `is_esc`, `is_brake_assist`, `is_tpms`, `is_parking_sensors`, `is_speed_alert`, `is_rear_camera`, `is_adjustable_steering`, `is_door_lock_option`, `is_central_locking`, `is_power_steering`, `is_driver_seat_height_adjustable`, `is_day_night_rear_view_mirror`, `is_ecw`, `is_rear_window_wiper`, `is_rear_window_washer`, `is_rear_window_defogger`, `is_power_door_locks` | Categorical / Binary | NCAP crash stars (0–5), airbag count (1, 2, 6), and 17 binary safety/ADAS flags (`Yes`/`No`). |

---

## 3. Statistical Learning & Machine Learning Methodology

### 3.1 Zero-Leakage Preprocessing Pipeline (`TransformerPipeline`)
To eliminate data leakage between training and evaluation steps:
1. **Stratified Train/Test Partitioning**: Splits data into $80\%$ training ($N_{train} = 46,873$) and $20\%$ testing ($N_{test} = 11,719$) while maintaining the exact $6.40\%$ positive class proportion.
2. **Numerical Imputation & Scaling**: Calculates numerical medians $\tilde{x}_j$, means $\mu_j$, and standard deviations $\sigma_j$ **solely from $D_{train}$**. Standard Z-score normalization:
   $$z_{ij} = \frac{x_{ij} - \mu_j}{\sigma_j}$$
3. **Categorical Encoding**: Fits One-Hot dummy matrices on $D_{train}$ categories. Unseen levels encountered during testing or batch deployment map to fallback zero vectors.

### 3.2 Implemented Machine Learning Classifiers

#### 1. Cost-Weighted Logistic Regression
Computes log-odds of claim occurrence:
$$P(Y=1 \mid X) = \sigma(w^T X + b) = \frac{1}{1 + e^{-(w^T X + b)}}$$
Optimized using cost-weighted binary cross-entropy loss with L2 regularization:
$$J(w, b) = -\frac{1}{N} \sum_{i=1}^N \left[ c_1 y_i \log(\hat{y}_i) + c_0 (1 - y_i) \log(1 - \hat{y}_i) \right] + \frac{\lambda}{2} \|w\|_2^2$$
where class weight ratio $c_1 / c_0 = \frac{N_{neg}}{N_{pos}} \approx 14.6$. Generates Odds Ratios $\text{OR}_j = \exp(w_j)$ for actuarial interpretability.

#### 2. Decision Tree Classifier
Constructs recursive binary splits by maximizing Gini Impurity reduction:
$$I_G(t) = 1 - \sum_{k=0}^1 p(k \mid t)^2$$
Split quality evaluation:
$$\Delta I_G(s, t) = I_G(t) - \frac{N_L}{N_t} I_G(t_L) - \frac{N_R}{N_t} I_G(t_R)$$
Constrained by `maxDepth` ($3 \le d \le 12$) to control tree complexity and variance.

#### 3. Random Forest Classifier
Ensemble of $B$ decision trees trained on bootstrap samples with random feature subspace selection ($\sqrt{p}$). Class probabilities are averaged across the ensemble:
$$\hat{P}_{RF}(Y=1 \mid X) = \frac{1}{B} \sum_{b=1}^B \hat{P}_b(Y=1 \mid X)$$

#### 4. Gradient Boosting Classifier
Iteratively fits regression decision trees to the negative gradient (pseudo-residuals) of the binary cross-entropy loss:
$$r_{im} = -\left[\frac{\partial L(y_i, f(x_i))}{\partial f(x_i)}\right]_{f(x) = f_{m-1}(x)} = y_i - \sigma(f_{m-1}(x_i))$$
Additive update with learning rate shrinkage $\eta = 0.1$:
$$f_m(x) = f_{m-1}(x) + \eta \sum_{j=1}^{J_m} \gamma_{jm} \mathbf{1}(x \in R_{jm})$$

---

## 4. Inferential Statistical Testing Engine

All hypothesis tests are calculated in pure TypeScript in `src/utils/statEngine.ts`:

### 4.1 Welch's Two-Sample t-Test
Tests continuous variable differences between claim ($Y=1$) and non-claim ($Y=0$) groups without assuming equal variances:
$$t = \frac{\bar{X}_1 - \bar{X}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}}$$
Degrees of freedom via the Satterthwaite approximation:
$$\nu \approx \frac{\left(\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}\right)^2}{\frac{(s_1^2 / n_1)^2}{n_1 - 1} + \frac{(s_2^2 / n_2)^2}{n_2 - 1}}$$

### 4.2 Mann-Whitney U Rank-Sum Test
Non-parametric test for skewed numerical variables (`population_density`, `age_of_car`):
$$U_1 = R_1 - \frac{n_1(n_1 + 1)}{2}, \quad U = \min(U_1, n_1 n_2 - U_1)$$
Asymptotic normal approximation:
$$z = \frac{U - \frac{n_1 n_2}{2} + 0.5}{\sqrt{\frac{n_1 n_2 (n_1 + n_2 + 1)}{12}}}$$

### 4.3 Pearson's Chi-Square Test ($\chi^2$)
Tests categorical independence against target `claim_status`:
$$\chi^2 = \sum_{i=1}^r \sum_{j=1}^c \frac{(O_{ij} - E_{ij})^2}{E_{ij}}, \quad E_{ij} = \frac{R_i \cdot C_j}{N}$$
Effect size reported as Cramér's $V$:
$$V = \sqrt{\frac{\chi^2}{N \cdot \min(r - 1, c - 1)}}$$

### 4.4 Benjamini-Hochberg False Discovery Rate (FDR)
Adjusts raw p-values across all 40 simultaneous feature tests to control false discovery rate at $Q = 0.05$:
$$p_{\text{adj}(i)} = \min_{k \ge i} \left( \min\left(1, \frac{m}{k} p_{(k)}\right) \right)$$

---

## 5. Security, Access Governance & Cryptography

### 5.1 Role-Based Access Control (RBAC)
The system enforces 3 granular user roles defined in `src/utils/security.ts`:
- **`admin` (Administrator / Lead Data Scientist)**: Full system access including dataset upload, hyperparameter training, threshold setting, PII encryption testing, and audit log inspection.
- **`actuary` (Actuary / Risk Analyst)**: Analytical privileges including EDA, hypothesis testing, model evaluation, and report export.
- **`underwriter` (Underwriter / Insurance Agent)**: Operational privileges including single-policy risk evaluation and batch CSV scoring.

### 5.2 Client-Side AES-256-GCM Encryption
Sensitive PII fields are encrypted directly in the browser via the W3C Web Crypto API (`window.crypto.subtle`):
- **Cipher**: `AES-256-GCM` with 256-bit symmetric key.
- **IV Generation**: 12-byte cryptographically random initial vector via `window.crypto.getRandomValues()`.
- **Integrity Guarantee**: Authenticated cipher text tags ensure tamper detection prior to client storage or API sync.

### 5.3 Audit Trail Logging
Every security or data mutation event creates an auditable JSON record:
```typescript
interface AuditLogEntry {
  id: string;
  timestamp: string;
  username: string;
  role: UserRole;
  action: string;
  details: string;
}
```

---

## 6. System Execution & Deployment Verification

- **Build Output**: Compiles static assets in `dist/` in under 800ms (`vite build`).
- **TypeScript Verification**: `tsc --noEmit` validates with **0 errors**.
- **Numerical Protection**: All division and formatting methods rely on `safeNum` and `safeInt` in `src/utils/formatters.ts`, completely preventing `NaN` or `Infinity` rendering glitches.
- **Vercel Readiness**: `vercel.json` configures SPA rewrites, static caching headers, and serverless API handlers (`/api/health.ts` and `/api/dataset/sync.ts`).
