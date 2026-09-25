import React, { useState } from 'react';

const PRESETS = {
  low: {
    male: 0,
    age: 38,
    education: 3,
    currentSmoker: 0,
    cigsPerDay: 0,
    BPMeds: 0,
    prevalentStroke: 0,
    prevalentHyp: 0,
    diabetes: 0,
    totChol: 180,
    sysBP: 116,
    diaBP: 76,
    BMI: 22.8,
    heartRate: 68,
    glucose: 84
  },
  borderline: {
    male: 1,
    age: 52,
    education: 2,
    currentSmoker: 1,
    cigsPerDay: 12,
    BPMeds: 0,
    prevalentStroke: 0,
    prevalentHyp: 1,
    diabetes: 0,
    totChol: 235,
    sysBP: 138,
    diaBP: 88,
    BMI: 27.4,
    heartRate: 76,
    glucose: 96
  },
  high: {
    male: 1,
    age: 63,
    education: 1,
    currentSmoker: 1,
    cigsPerDay: 25,
    BPMeds: 1,
    prevalentStroke: 1,
    prevalentHyp: 1,
    diabetes: 1,
    totChol: 288,
    sysBP: 168,
    diaBP: 104,
    BMI: 32.5,
    heartRate: 88,
    glucose: 148
  }
};

const INITIAL_FORM = {
  male: 1,
  age: 45,
  education: 2,
  currentSmoker: 0,
  cigsPerDay: 0,
  BPMeds: 0,
  prevalentStroke: 0,
  prevalentHyp: 0,
  diabetes: 0,
  totChol: 200,
  sysBP: 120,
  diaBP: 80,
  BMI: 24.5,
  heartRate: 72,
  glucose: 85
};

const HeartDiseaseForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [apiError, setApiError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'currentSmoker' && Number(value) === 0) {
        updated.cigsPerDay = 0;
      }
      return updated;
    });
  };

  const applyPreset = (key) => {
    setFormData(PRESETS[key]);
    setPrediction(null);
    setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);

    // Ensure all 15 parameters are passed as valid Numbers
    const payload = {};
    for (const key of Object.keys(INITIAL_FORM)) {
      payload[key] = Number(formData[key]);
    }

    try {
      const response = await fetch('http://localhost:3000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Prediction calculation failed');
      }

      setPrediction({
        risk: data.risk,
        probability: Number(data.probability),
        confidence: (Number(data.probability) * 100).toFixed(1),
        predictionVal: data.prediction,
        inputs: { ...payload }
      });
    } catch (err) {
      console.error('API Error:', err);
      setApiError(
        err.message || 'Unable to connect to prediction service on port 3000.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Identify elevated clinical metrics to show in risk breakdown
  const getRiskBreakdown = (data) => {
    const alerts = [];
    if (data.sysBP >= 140 || data.diaBP >= 90) {
      alerts.push({ label: 'Hypertensive BP', desc: `${data.sysBP}/${data.diaBP} mmHg (Target: <120/80)`, level: 'high' });
    } else if (data.sysBP >= 130 || data.diaBP >= 80) {
      alerts.push({ label: 'Prehypertension', desc: `${data.sysBP}/${data.diaBP} mmHg`, level: 'warn' });
    }
    if (data.totChol >= 240) {
      alerts.push({ label: 'High Total Cholesterol', desc: `${data.totChol} mg/dL (Optimal: <200)`, level: 'high' });
    } else if (data.totChol >= 200) {
      alerts.push({ label: 'Borderline High Cholesterol', desc: `${data.totChol} mg/dL`, level: 'warn' });
    }
    if (data.currentSmoker === 1) {
      alerts.push({ label: 'Active Smoker', desc: `${data.cigsPerDay} cigarettes/day`, level: 'high' });
    }
    if (data.diabetes === 1 || data.glucose >= 126) {
      alerts.push({ label: 'Elevated Fasting Glucose', desc: `${data.glucose} mg/dL (Normal: <100)`, level: 'high' });
    }
    if (data.BMI >= 30) {
      alerts.push({ label: 'Obese BMI Range', desc: `${data.BMI} kg/m² (Normal: 18.5-24.9)`, level: 'warn' });
    }
    if (data.prevalentHyp === 1) {
      alerts.push({ label: 'History of Hypertension', desc: 'Diagnosed hypertension history', level: 'warn' });
    }
    if (data.prevalentStroke === 1) {
      alerts.push({ label: 'History of Stroke', desc: 'Prior cerebrovascular event', level: 'high' });
    }
    return alerts;
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      {/* Top Banner / Test Profiles */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 rounded-xl glass-panel">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Quick-Test Patient Profiles:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPreset('low')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Low Risk Patient
          </button>
          <button
            type="button"
            onClick={() => applyPreset('borderline')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Moderate / Borderline
          </button>
          <button
            type="button"
            onClick={() => applyPreset('high')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-all flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            High Risk Patient
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData(INITIAL_FORM);
              setPrediction(null);
              setApiError(null);
            }}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
          >
            Reset Form
          </button>
        </div>
      </div>

      {/* Main Grid: Form Inputs + Results Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 xl:col-span-8">
          <form
            onSubmit={handleSubmit}
            className="glass-card rounded-2xl p-6 sm:p-8 space-y-6"
          >
            {/* Header */}
            <div className="border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2 text-rose-500 mb-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider">Clinical Assessment Form</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                10-Year Coronary Heart Disease Risk
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Enter patient demographic, lifestyle, and biochemical parameters to evaluate 10-year CHD probability.
              </p>
            </div>

            {/* Section 1: Demographics */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 text-xs">1</span>
                Demographic Background
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Biological Sex
                  </label>
                  <select
                    value={formData.male}
                    onChange={(e) => handleInputChange('male', Number(e.target.value))}
                    className="w-full glass-input rounded-lg px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value={1} className="bg-slate-900 text-white">Male</option>
                    <option value={0} className="bg-slate-900 text-white">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Age <span className="text-slate-500">(years)</span>
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={95}
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', Number(e.target.value))}
                    className="w-full glass-input rounded-lg px-3 py-2 text-sm focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Education Level
                  </label>
                  <select
                    value={formData.education}
                    onChange={(e) => handleInputChange('education', Number(e.target.value))}
                    className="w-full glass-input rounded-lg px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value={1} className="bg-slate-900 text-white">Some High School</option>
                    <option value={2} className="bg-slate-900 text-white">High School Grad / GED</option>
                    <option value={3} className="bg-slate-900 text-white">Some College / Vocational</option>
                    <option value={4} className="bg-slate-900 text-white">College Degree +</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Behavioral / Lifestyle */}
            <div className="space-y-4 pt-3 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 text-xs">2</span>
                Lifestyle & Smoking Habits
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Current Cigarette Smoker?
                  </label>
                  <select
                    value={formData.currentSmoker}
                    onChange={(e) => handleInputChange('currentSmoker', Number(e.target.value))}
                    className="w-full glass-input rounded-lg px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value={0} className="bg-slate-900 text-white">No (Non-smoker)</option>
                    <option value={1} className="bg-slate-900 text-white">Yes (Active Smoker)</option>
                  </select>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Cigarettes Per Day
                    </label>
                    <span className="text-[11px] text-slate-500">
                      {formData.currentSmoker === 1 ? 'Daily avg' : 'N/A'}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={80}
                    disabled={formData.currentSmoker === 0}
                    value={formData.cigsPerDay}
                    onChange={(e) => handleInputChange('cigsPerDay', Number(e.target.value))}
                    className={`w-full glass-input rounded-lg px-3 py-2 text-sm focus:outline-none ${
                      formData.currentSmoker === 0 ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Medical History */}
            <div className="space-y-4 pt-3 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 text-xs">3</span>
                Medical History & Diagnoses
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.BPMeds === 1 
                    ? 'border-rose-500/50 bg-rose-500/10 text-rose-200' 
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                }`}>
                  <span className="text-xs font-semibold mb-1">BP Meds</span>
                  <span className="text-[11px] text-slate-400 mb-2">On anti-hypertensives</span>
                  <input
                    type="checkbox"
                    checked={formData.BPMeds === 1}
                    onChange={(e) => handleInputChange('BPMeds', e.target.checked ? 1 : 0)}
                    className="accent-rose-500 rounded"
                  />
                </label>

                <label className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.prevalentHyp === 1 
                    ? 'border-rose-500/50 bg-rose-500/10 text-rose-200' 
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                }`}>
                  <span className="text-xs font-semibold mb-1">Hypertension</span>
                  <span className="text-[11px] text-slate-400 mb-2">Prevalent condition</span>
                  <input
                    type="checkbox"
                    checked={formData.prevalentHyp === 1}
                    onChange={(e) => handleInputChange('prevalentHyp', e.target.checked ? 1 : 0)}
                    className="accent-rose-500 rounded"
                  />
                </label>

                <label className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.diabetes === 1 
                    ? 'border-rose-500/50 bg-rose-500/10 text-rose-200' 
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                }`}>
                  <span className="text-xs font-semibold mb-1">Diabetes</span>
                  <span className="text-[11px] text-slate-400 mb-2">Diagnosed diabetic</span>
                  <input
                    type="checkbox"
                    checked={formData.diabetes === 1}
                    onChange={(e) => handleInputChange('diabetes', e.target.checked ? 1 : 0)}
                    className="accent-rose-500 rounded"
                  />
                </label>

                <label className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.prevalentStroke === 1 
                    ? 'border-rose-500/50 bg-rose-500/10 text-rose-200' 
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                }`}>
                  <span className="text-xs font-semibold mb-1">Stroke</span>
                  <span className="text-[11px] text-slate-400 mb-2">Prior stroke event</span>
                  <input
                    type="checkbox"
                    checked={formData.prevalentStroke === 1}
                    onChange={(e) => handleInputChange('prevalentStroke', e.target.checked ? 1 : 0)}
                    className="accent-rose-500 rounded"
                  />
                </label>
              </div>
            </div>

            {/* Section 4: Vitals & Laboratory */}
            <div className="space-y-4 pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 text-xs">4</span>
                  Vitals & Clinical Biomarkers
                </div>
                <span className="text-[11px] text-slate-500">Normal reference in labels</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-slate-300">Systolic BP</label>
                    <span className="text-[10px] text-emerald-400/90">&lt;120 mmHg</span>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    min={70}
                    max={260}
                    value={formData.sysBP}
                    onChange={(e) => handleInputChange('sysBP', Number(e.target.value))}
                    className="w-full glass-input rounded-lg px-3 py-2 text-sm focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-slate-300">Diastolic BP</label>
                    <span className="text-[10px] text-emerald-400/90">&lt;80 mmHg</span>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    min={40}
                    max={160}
                    value={formData.diaBP}
                    onChange={(e) => handleInputChange('diaBP', Number(e.target.value))}
                    className="w-full glass-input rounded-lg px-3 py-2 text-sm focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-slate-300">Total Cholesterol</label>
                    <span className="text-[10px] text-emerald-400/90">&lt;200 mg/dL</span>
                  </div>
                  <input
                    type="number"
                    step="1"
                    min={100}
                    max={600}
                    value={formData.totChol}
                    onChange={(e) => handleInputChange('totChol', Number(e.target.value))}
                    className="w-full glass-input rounded-lg px-3 py-2 text-sm focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-slate-300">Body Mass Index (BMI)</label>
                    <span className="text-[10px] text-emerald-400/90">18.5 - 24.9</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min={12}
                    max={60}
                    value={formData.BMI}
                    onChange={(e) => handleInputChange('BMI', Number(e.target.value))}
                    className="w-full glass-input rounded-lg px-3 py-2 text-sm focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-slate-300">Heart Rate</label>
                    <span className="text-[10px] text-emerald-400/90">60 - 100 bpm</span>
                  </div>
                  <input
                    type="number"
                    min={40}
                    max={200}
                    value={formData.heartRate}
                    onChange={(e) => handleInputChange('heartRate', Number(e.target.value))}
                    className="w-full glass-input rounded-lg px-3 py-2 text-sm focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-slate-300">Fasting Glucose</label>
                    <span className="text-[10px] text-emerald-400/90">70 - 99 mg/dL</span>
                  </div>
                  <input
                    type="number"
                    step="1"
                    min={40}
                    max={400}
                    value={formData.glucose}
                    onChange={(e) => handleInputChange('glucose', Number(e.target.value))}
                    className="w-full glass-input rounded-lg px-3 py-2 text-sm focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {apiError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <strong className="font-semibold block mb-0.5">Connection Error:</strong>
                  {apiError}
                  <span className="block mt-1 text-slate-400">
                    Make sure the prediction API is running (`node codes/api/server.js`) on port 3000.
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Computing 10-Year CHD Probability...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span>Evaluate 10-Year CHD Risk</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-6">
          <div className="glass-card rounded-2xl p-6 sm:p-7 border border-slate-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Predictive Diagnostics
            </h3>

            {!prediction ? (
              <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-800/80 bg-slate-900/30">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500 animate-pulse-subtle">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="text-base font-semibold text-slate-200">No Assessment Yet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Click a quick-test profile at the top or fill in the clinical form to calculate cardiac risk.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Risk Gauge */}
                <div className="text-center pt-2">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-36 h-36 transform -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        stroke="#1e293b"
                        strokeWidth="10"
                        fill="transparent"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        stroke={prediction.risk === 'High Risk' ? '#f43f5e' : '#10b981'}
                        strokeWidth="10"
                        strokeDasharray={377}
                        strokeDashoffset={377 - (377 * Math.min(prediction.probability, 1))}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-extrabold text-white">
                        {prediction.confidence}%
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        Probability
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                        prediction.risk === 'High Risk'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          prediction.risk === 'High Risk' ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                      ></span>
                      {prediction.risk} (10-Year CHD)
                    </span>
                    <p className="text-xs text-slate-400 mt-2">
                      {prediction.risk === 'High Risk'
                        ? 'High probability of developing coronary heart disease within the next 10 years based on Framingham criteria.'
                        : 'Low projected risk of 10-year coronary events under current physiological and behavioral parameters.'}
                    </p>
                  </div>
                </div>

                {/* Contributing Risk Factors */}
                <div className="border-t border-slate-800/80 pt-4">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                    Identified Clinical Flags
                  </h4>
                  {(() => {
                    const factors = getRiskBreakdown(prediction.inputs);
                    if (factors.length === 0) {
                      return (
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                          All submitted biometric values fall within healthy baseline ranges.
                        </div>
                      );
                    }
                    return (
                      <div className="space-y-2">
                        {factors.map((f, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                              f.level === 'high'
                                ? 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                                : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                            }`}
                          >
                            <span className="font-medium">{f.label}</span>
                            <span className="text-[11px] opacity-80">{f.desc}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Reset / Re-test */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setPrediction(null)}
                    className="w-full py-2 px-4 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    Clear Results & Test Another Patient
                  </button>
                </div>
              </div>
            )}

            {/* Medical Disclaimer */}
            <div className="mt-6 p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 text-[10px] text-slate-500 leading-relaxed">
              <strong className="text-slate-400">Notice:</strong> This model is built for academic research and educational screening using the Framingham Heart Study dataset. It is not intended as a substitute for professional clinical diagnosis.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeartDiseaseForm;
