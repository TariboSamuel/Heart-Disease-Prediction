import React, { useState, useEffect } from 'react';
import HeartDiseaseForm from './HeartDiseaseForm';
import './index.css';

function App() {
  const [apiOnline, setApiOnline] = useState(null);

  useEffect(() => {
    // Check if the backend API is up on port 3000
    const checkApi = async () => {
      try {
        const res = await fetch('http://localhost:3000/', { signal: AbortSignal.timeout(1000) });
        if (res.ok) {
          setApiOnline(true);
        } else {
          setApiOnline(false);
        }
      } catch (e) {
        setApiOnline(false);
      }
    };
    checkApi();
    const interval = setInterval(checkApi, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header / Navbar */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/40">
              <svg className="w-6 h-6 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">CardioPulse</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  AI Diagnostic
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Framingham 10-Year Coronary Heart Disease Risk Predictor
              </p>
            </div>
          </div>

          {/* Right Status Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  apiOnline === true
                    ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                    : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                }`}
              ></span>
              <span className="text-slate-300 text-[11px] font-medium hidden sm:inline">
                Engine:
              </span>
              <span
                className={`text-[11px] font-semibold ${
                  apiOnline === true ? 'text-emerald-400' : 'text-cyan-300'
                }`}
              >
                {apiOnline === true ? 'API Connected (Port 3000)' : 'Client-Side Offline Mode Active'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow py-8 sm:py-12">
        {/* Intro Hero Badge & Stats */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-3">
            <svg className="w-3.5 h-3.5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            Machine Learning &amp; Clinical Epidemiology
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Predict &amp; Prevent Cardiovascular Events
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Interactive risk calculator calibrated on the Framingham Heart Study cohort to forecast 10-year risk of developing coronary heart disease.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto mt-6">
            <div className="p-3 rounded-xl glass-panel text-center">
              <div className="text-lg sm:text-xl font-bold text-white">15</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Clinical Features</div>
            </div>
            <div className="p-3 rounded-xl glass-panel text-center">
              <div className="text-lg sm:text-xl font-bold text-rose-400">10-Year</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Horizon Risk</div>
            </div>
            <div className="p-3 rounded-xl glass-panel text-center">
              <div className="text-lg sm:text-xl font-bold text-emerald-400">Offline Ready</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Zero Backend Needed</div>
            </div>
          </div>
        </div>

        {/* The Diagnostic Form Component */}
        <HeartDiseaseForm />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Heart Disease Prediction System &bull; Framingham Heart Study ML Implementation
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>FastAPI / Express Microservice</span>
            <span>&bull;</span>
            <span>React &amp; Tailwind</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
