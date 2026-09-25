# CardioPulse: 10-Year Coronary Heart Disease (CHD) Prediction System

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An end-to-end clinical machine learning and diagnostic application built to forecast the **10-year risk of Coronary Heart Disease (CHD)** based on epidemiological data from the **Framingham Heart Study**. 

This system integrates data exploration, class imbalance correction (SMOTE-ENN), model evaluation, Explainable AI (XAI with SHAP & LIME), a lightweight Express REST API microservice, and a modern glassmorphic React interface.

---

## 📑 Table of Contents
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Clinical Parameters (15 Features)](#-clinical-parameters-15-features)
- [Machine Learning Pipeline](#-machine-learning-pipeline)
- [Quick Start Guide](#-quick-start-guide)
  - [1. Machine Learning Notebooks](#1-machine-learning-notebooks)
  - [2. Starting the API Backend](#2-starting-the-api-backend)
  - [3. Starting the Frontend UI](#3-starting-the-frontend-ui)
- [Ethical & Clinical Disclaimer](#-ethical--clinical-disclaimer)

---

## 🏛 Architecture Overview

```text
┌─────────────────────────┐         ┌─────────────────────────┐
│     React Frontend      │  HTTP   │   Express API Server    │
│  (CardioPulse Dark UI)  ├────────►│     (Port 3000)         │
│  - 15 Clinical Inputs   │  POST   │  - Input Validation     │
│  - Quick-Test Profiles  │         │  - Feature Normalizer   │
│  - Radial Risk Gauge    │◄────────┤  - Model Inference      │
└─────────────────────────┘  JSON   └───────────┬─────────────┘
                                                │
                                                ▼
                                    ┌─────────────────────────┐
                                    │ Trained Logistic Model  │
                                    │ (lr_model_export.json)  │
                                    │ Calibrated on Framingham│
                                    └─────────────────────────┘
```

---

## 📁 Project Structure

```text
Heart-Disease-Prediction/
│
├── .gitignore                      # Ignore patterns for node_modules, checkpoints, caches
├── README.md                       # Complete documentation
│
├── codes/                          # Machine Learning Core & Backend Microservice
│   ├── api/                        # Express API Microservice
│   │   ├── model/                  # Exported weights, scaler parameters, & JS inference
│   │   │   ├── lr_model_export.json
│   │   │   └── predict.js
│   │   ├── package.json
│   │   └── server.js               # REST API Server (Port 3000)
│   │
│   ├── data/                       # Datasets
│   │   ├── raw/                    # Raw Framingham dataset
│   │   └── processed/              # Cleaned & imputed datasets
│   │
│   ├── notebooks/                  # 11 Sequential ML Development Notebooks
│   │   ├── 01_data_exploration.ipynb
│   │   ├── 02_data_cleaning.ipynb
│   │   ├── 03_EDA.ipynb
│   │   ├── 04_logistic_regression.ipynb
│   │   ├── 05_random_forest.ipynb
│   │   ├── 06_xgboost.ipynb
│   │   ├── 06b_smoteenn_models.ipynb
│   │   ├── 07_hyperparameter_tuning.ipynb
│   │   ├── 08_model_comparison.ipynb
│   │   ├── 09_explainability.ipynb   # SHAP & LIME Interpretability
│   │   └── 10_save_model.ipynb       # Export model parameters for deployment
│   │
│   ├── src/                        # Modular Python helper libraries
│   │   ├── evaluation/
│   │   ├── explainability/
│   │   ├── preprocessing/
│   │   └── training/
│   └── requirements.txt            # Python dependencies
│
└── frontend/                       # Interactive React + Tailwind Diagnostic Dashboard
    ├── public/
    │   └── index.html              # Typography & Favicon setup
    ├── src/
    │   ├── App.jsx                 # Application shell & real-time API health monitor
    │   ├── HeartDiseaseForm.jsx    # 15-parameter form, quick-test profiles, SVG risk gauge
    │   ├── index.css               # Glassmorphism tokens & custom animations
    │   └── index.js
    ├── package.json
    └── tailwind.config.js
```

---

## 🩺 Clinical Parameters (15 Features)

The prediction engine consumes 15 validated biometric and demographic inputs:

| Feature | Category | Type | Description / Reference Range |
| :--- | :--- | :--- | :--- |
| `male` | Demographics | Binary | Biological sex (`1` = Male, `0` = Female) |
| `age` | Demographics | Continuous | Age in years |
| `education` | Demographics | Categorical | Education level (1 = Some HS, 2 = HS Grad, 3 = College, 4 = Degree+) |
| `currentSmoker` | Lifestyle | Binary | Smoking status (`1` = Yes, `0` = No) |
| `cigsPerDay` | Lifestyle | Integer | Average cigarettes smoked per day |
| `BPMeds` | History | Binary | Patient currently on Blood Pressure Medication (`1` = Yes, `0` = No) |
| `prevalentStroke`| History | Binary | Prior history of stroke (`1` = Yes, `0` = No) |
| `prevalentHyp` | History | Binary | Prevalent hypertension diagnosis (`1` = Yes, `0` = No) |
| `diabetes` | History | Binary | Diagnosed diabetes mellitus (`1` = Yes, `0` = No) |
| `totChol` | Biomarker | Continuous | Total Cholesterol in mg/dL (Normal: < 200 mg/dL) |
| `sysBP` | Vitals | Continuous | Systolic Blood Pressure in mmHg (Normal: < 120 mmHg) |
| `diaBP` | Vitals | Continuous | Diastolic Blood Pressure in mmHg (Normal: < 80 mmHg) |
| `BMI` | Biomarker | Continuous | Body Mass Index in kg/m² (Normal: 18.5 – 24.9) |
| `heartRate` | Vitals | Continuous | Resting heart rate in beats per minute (Normal: 60 – 100 bpm) |
| `glucose` | Biomarker | Continuous | Fasting blood glucose in mg/dL (Normal: 70 – 99 mg/dL) |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (3.10+)

---

### 1. Machine Learning Notebooks
To explore the dataset and reproduce model training:
```bash
cd codes
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
jupyter notebook
```
Navigate to the `notebooks/` directory and run the notebooks in sequence (`01` through `10`).

---

### 2. Starting the API Backend
The Express API provides model scoring and health endpoints:
```bash
cd codes/api
npm install
node server.js
```
The server will start on `http://localhost:3000`.
- Health check: `GET http://localhost:3000/`
- Prediction: `POST http://localhost:3000/predict`

---

### 3. Starting the Frontend UI
In a separate terminal:
```bash
cd frontend
npm install
npm start
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

- Use the **Quick-Test Patient Profiles** at the top (`Low Risk Patient`, `Moderate / Borderline`, `High Risk Patient`) for instant 1-click clinical simulations.
- Monitor real-time API connectivity via the status pill in the top header.

---

## ⚖️ Ethical & Clinical Disclaimer

> **Important:** This system is developed for academic research, education, and algorithmic demonstration using the Framingham Heart Study dataset. It is **not** a certified medical diagnostic device and must not be used as a substitute for professional medical evaluation, diagnosis, or clinical advice.
