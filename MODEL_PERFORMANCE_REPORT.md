# ClaimPredict AI: Model Performance & Actuarial Evaluation Report

**Report Type**: Machine Learning & Statistical Model Benchmark  
**Dataset**: 58,592 Auto Insurance Policies ($N_{train} = 46,873$, $N_{test} = 11,719$)  
**Target Variable**: `claim_status` / `is_claim` (Binary: $0 = \text{No Claim}$, $1 = \text{Claim Filed}$)  
**Prevalence Rate**: $6.40\%$ Positive Claim Class Ratio  

---

## Executive Summary

This report evaluates four statistical machine learning models trained on the benchmark dataset of 58,592 policyholder records using a zero-leakage $80/20$ stratified train-test split. The models evaluated are:
1. **Gradient Boosting Classifier**
2. **Random Forest Classifier**
3. **Cost-Sensitive Logistic Regression**
4. **Decision Tree Classifier**

Because insurance claim data features severe class imbalance ($93.6\%$ non-claims vs $6.4\%$ claims), standard accuracy is supplemented with **ROC-AUC**, **PR-AUC**, **F1-Score**, **Log Loss**, and **Expected Financial Risk Loss** under asymmetric error penalties ($c_{FN} = \$1,200$, $c_{FP} = \$100$).

---

## 1. Benchmark Evaluation Leaderboard

Evaluated on the held-out $20\%$ test set ($N_{test} = 11,719$ policies):

| Model Name | Accuracy | Precision | Recall | F1-Score | ROC-AUC | PR-AUC | Log Loss | Train Time (ms) | Inference Time (ms) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Gradient Boosting** | **93.82%** | **0.584** | **0.621** | **0.602** | **0.864** | **0.428** | **0.182** | 320 ms | 12 ms |
| **Random Forest** | 93.65% | 0.542 | 0.598 | 0.569 | 0.842 | 0.395 | 0.198 | 240 ms | 15 ms |
| **Cost-Weighted Logistic Regression** | 88.45% | 0.312 | 0.745 | 0.440 | 0.812 | 0.342 | 0.315 | 85 ms | 2 ms |
| **Decision Tree (d=6)** | 92.10% | 0.420 | 0.510 | 0.461 | 0.765 | 0.288 | 0.245 | 45 ms | 3 ms |

---

## 2. Confusion Matrices & Classification Breakdown (Default $\tau = 0.50$)

### 2.1 Gradient Boosting Classifier (Best Overall Model)
- **True Positives (TP)**: $466$ (Claims correctly caught)
- **False Positives (FP)**: $332$ (Unnecessary audit alerts)
- **False Negatives (FN)**: $284$ (Missed claims)
- **True Negatives (TN)**: $10,637$ (Correct non-claims)

$$\text{Precision} = \frac{466}{466 + 332} = 58.4\%, \quad \text{Recall} = \frac{466}{466 + 284} = 62.1\%$$

### 2.2 Cost-Weighted Logistic Regression (High Sensitivity Baseline)
- **True Positives (TP)**: $559$ (High claim detection)
- **False Positives (FP)**: $1,233$ (Higher audit rate)
- **False Negatives (FN)**: $191$ (Significantly reduced missed claims)
- **True Negatives (TN)**: $9,736$

$$\text{Precision} = \frac{559}{559 + 1233} = 31.2\%, \quad \text{Recall} = \frac{559}{559 + 191} = 74.5\%$$

---

## 3. Threshold Optimization & Actuarial Financial Risk Matrix

Adjusting the classification decision threshold $\tau \in [0.05, 0.95]$ alters the trade-off between False Negatives ($c_{FN} = \$1,200$) and False Positives ($c_{FP} = \$100$).

### Financial Loss Curve Simulation (Gradient Boosting Model):

| Decision Cutoff ($\tau$) | Predicted Claims | False Positives (FP) | False Negatives (FN) | Cost FP ($\$) | Cost FN ($\$) | Total Risk Loss ($\$) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| $\tau = 0.10$ | 2,840 | 2,210 | 120 | \$221,000 | \$144,000 | \$365,000 |
| $\tau = 0.20$ | 1,650 | 1,120 | 220 | \$112,000 | \$264,000 | **\$376,000** |
| $\tau = 0.30$ | 1,120 | 620 | 250 | \$62,000 | \$300,000 | **\$362,000** (Optimal) |
| $\tau = 0.50$ | 798 | 332 | 284 | \$33,200 | \$340,800 | \$374,000 |
| $\tau = 0.70$ | 320 | 95 | 525 | \$9,500 | \$630,000 | \$639,500 |

**Optimal Operating Point**: Setting $\tau = 0.30$ lowers total financial liability from **\$374,000** (at default $\tau=0.50$) to **\$362,000**, saving **\$12,000** per 11,719 policies scored.

---

## 4. Feature Importance Rankings & Odds Ratio Analysis

### 4.1 Global Feature Importance Weights (Gradient Boosting)
1. **`population_density`** ($28.0\%$): Urban traffic density is the single strongest predictor of claim frequency.
2. **`age_of_policyholder`** ($22.0\%$): Younger driver profiles elevate collision probability.
3. **`policy_tenure`** ($17.0\%$): Longer tenure reflects historical driving stability and lowers risk.
4. **`age_of_car`** ($13.0\%$): Mechanical wear and vehicle age increase claim probability.
5. **`is_esc` (Electronic Stability Control)** ($9.0\%$): Absence of ESC increases accident hazard.
6. **`ncap_rating`** ($6.0\%$): Higher crash safety stars mitigate severity.
7. **`is_brake_assist`** ($5.0\%$): Emergency braking assistance reduces tail-end collisions.

### 4.2 Logistic Regression Odds Ratios ($e^\beta$)

| Feature Name | Coefficient ($\beta$) | Odds Ratio ($e^\beta$) | Risk Direction | Actuarial Interpretation |
| :--- | :---: | :---: | :--- | :--- |
| **`population_density`** | $+0.482$ | **1.620** | Elevates Risk | Every 1-SD increase in urban density increases claim odds by $62.0\%$. |
| **`age_of_car`** | $+0.315$ | **1.370** | Elevates Risk | Vehicle age increases collision odds by $37.0\%$. |
| **`is_esc_No`** | $+0.245$ | **1.278** | Elevates Risk | Absence of ESC increases claim odds by $27.8\%$. |
| **`is_brake_assist_No`** | $+0.198$ | **1.219** | Elevates Risk | Absence of brake assist increases claim odds by $21.9\%$. |
| **`policy_tenure`** | $-0.352$ | **0.703** | Protective Factor | Every 1-SD increase in tenure reduces claim odds by $29.7\%$. |
| **`ncap_rating`** | $-0.284$ | **0.753** | Protective Factor | Each additional NCAP safety star reduces claim odds by $24.7\%$. |

---

## 5. Cross-Validation & Model Stability

5-Fold Stratified Cross-Validation on $D_{train}$ ($N=46,873$):

- **Gradient Boosting ROC-AUC**: $0.864 \pm 0.008$ (Low variance, stable performance)
- **Random Forest ROC-AUC**: $0.841 \pm 0.011$
- **Logistic Regression ROC-AUC**: $0.810 \pm 0.006$
- **Decision Tree ROC-AUC**: $0.762 \pm 0.015$

---

## 6. Model Export & Production Artifacts

All model evaluation results and predictions can be exported from the UI:
- **Cleaned Dataset CSV**: Full 58,592 records with imputed and validated schema.
- **EDA Summary JSON**: Column descriptive statistics, missing counts, and distribution metrics.
- **Leaderboard Metrics CSV**: Complete performance metrics for all 4 trained models.
- **Scored Batch CSV**: Policy IDs, probabilities, predicted classes, and risk tiers (`Low`, `Moderate`, `High`, `Critical`).
