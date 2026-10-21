# Insurance Claim Prediction Using Statistical Learning Methods

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmanjunath7410%2Finsurnace-claim-prediction-using-statistical-learning-method-)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

An enterprise-grade, high-performance insurance claim prediction and statistical learning platform. Features automated exploratory data analysis (EDA), rigorous hypothesis testing (Welch's t-test, Mann-Whitney U, Chi-square with Benjamini-Hochberg FDR correction), multiple supervised statistical models (Gradient Boosting, Random Forest, Decision Tree, Cost-Weighted Logistic Regression), interactive ROC/PR curve threshold tuning, and real-time risk scoring.

---

## 🚀 How to Deploy to Vercel

### Method 1: One-Click Deploy (Easiest)

Click the button below to instantly import and deploy this repository on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmanjunath7410%2Finsurnace-claim-prediction-using-statistical-learning-method-)

---

### Method 2: Import from Vercel Web Dashboard

1. Go to [vercel.com/new](https://vercel.com/new) and log in.
2. Under **"Import Git Repository"**, select your GitHub account and choose:
   ```
   manjunath7410/insurnace-claim-prediction-using-statistical-learning-method-
   ```
3. In the project configuration screen:
   - **Framework Preset**: `Vite` (automatically detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (or `vite build`)
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click **Deploy**. Your live insurance analytics platform will be live with an SSL domain in under 60 seconds!

---

### Method 3: Deploy via Vercel CLI

If you prefer deploying from your terminal:

1. Install the Vercel CLI globally:
   ```bash
   npm i -g vercel
   ```
2. In the project root directory, run:
   ```bash
   vercel
   ```
3. Follow the quick terminal prompts (press Enter for defaults).
4. For production deployment:
   ```bash
   vercel --prod
   ```

---

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/manjunath7410/insurnace-claim-prediction-using-statistical-learning-method-.git
cd insurnace-claim-prediction-using-statistical-learning-method-

# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🔬 Core Features & Architecture

- **Automated Data Quality & Schema Profiling**: 58,592 claim records benchmark with zero missing data anomalies, robust IQR outlier detection, and automated distribution tracking.
- **Statistical Inference Suite**:
  - Welch's t-test with Satterthwaite degrees of freedom
  - Mann-Whitney U rank-sum test with normal approximation & continuity correction
  - Pearson's Chi-Square test of independence with Cramér's V effect size
  - Benjamini-Hochberg False Discovery Rate (FDR) multiple testing correction
- **Statistical Machine Learning Engine**:
  - Gradient Boosted Decision Trees
  - Random Forest Classifier with bootstrap sampling
  - Cost-Sensitive Logistic Regression
  - Decision Tree Classifier
- **Operational Policy Underwriting**:
  - Interactive decision threshold optimizer
  - Expected cost matrix simulation (False Negative vs False Positive penalties)
  - Single-policy risk scoring and batch CSV scoring engine
