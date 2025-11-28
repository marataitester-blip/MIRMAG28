import React, { useState, useRef } from 'react';
import { AnalysisResult, AnalysisStep } from './types';
import { CardDisplay } from './components/CardDisplay';
import { Sparkles, RefreshCcw, ShieldCheck } from 'lucide-react';

export default function App() {
  const [input, setInput] = useState('');
  const [step, setStep] = useState<AnalysisStep>(AnalysisStep.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const resultRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setResult(null);
    setErrorMessage(null);
    setStep(AnalysisStep.PROCESSING);
    
    try {
      // Safe Fetch Logic
      const response = await fetch('/api/analyze', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ mode: 'groq', userRequest: input })
      });

      // Parse JSON first to extract potential server error messages
      const data = await response.json();

      // 1. Check for HTTP errors
      if (!response.ok) {
        throw new Error(data.error || `Ошибка сервера: ${response.status}`);
      }

      // 2. Check for explicit API errors
      if (data.error) {
        throw new Error(data.error);
      }

      // 3. Validate Data Integrity (Crucial!)
      if (!data.generatedImageUrl || !data.interpretation) {
        console.error("Bad response format:", data);
        throw new Error("Сервер вернул неполные данные (нет изображения или толкования)");
      }

      setResult(data);
      setStep(AnalysisStep.COMPLETED);
      
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error: any) {
      console.error("Workflow failed", error);
      setErrorMessage(error.message || "Произошла ошибка связи с сервером");
      setStep(AnalysisStep.ERROR);
    }
  };

  const reset = () => {
    setInput('');
    setResult(null);
    setErrorMessage(null);
    setStep(AnalysisStep.IDLE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-wrapper">
      
      {/* Header */}
      <header className="header">
        <h1>Astral Hero</h1>
        <p>Психологический Портрет</p>
      </header>

      {/* Main Content */}
      <main className="main-container">
        
        {step === AnalysisStep.IDLE && (
            <div>
                <div className="input-card">
                    <label className="input-label">
                        Опишите ваше состояние или ситуацию
                    </label>
                    <textarea
                        className="styled-textarea"
                        placeholder="Например: Я чувствую себя потерянным перед важным выбором, но внутри есть надежда..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <div className="btn-wrapper" style={{gap: '10px'}}>
                        <button
                            onClick={handleAnalyze}
                            disabled={!input.trim()}
                            className="btn-primary"
                        >
                            <span>🚀 GROQ FAST</span>
                            <Sparkles size={20} />
                        </button>
                    </div>
                </div>

                <div className="footer-link">
                    <a href="https://t.me/+y7Inf371g7w0NzMy" target="_blank" rel="noreferrer">
                        Связь с Мастером
                    </a>
                </div>
            </div>
        )}

        {/* Loading State */}
        {step === AnalysisStep.PROCESSING && (
          <div className="loading-container">
            <div className="spinner-box">
               <div className="spinner-ring"></div>
               <div className="spinner-active"></div>
            </div>
            <h3 style={{fontFamily: 'Cinzel, serif', color: 'var(--accent-gold)', fontSize: '1.25rem'}}>
              Обращение к коллективному бессознательному...
            </h3>
            <p style={{color: 'var(--text-muted)'}}>
                Анализ архетипов и формирование образа (Groq Llama-3)
            </p>
          </div>
        )}

        {/* Results */}
        {result && step === AnalysisStep.COMPLETED && (
          <div ref={resultRef}>
            
            {/* Cards Grid */}
            <div className="results-grid">
                {/* 
                   Safe Render: Only render if we have data.
                   The backend now returns the 'generatedImageUrl' inside the 'card' object too 
                   to simplify mapping, but we kept the dual display structure.
                */}
                
                {result.card && (
                    <CardDisplay 
                        imageSrc={result.card.imageUrl}
                        title={result.card.name}
                        subtitle={result.card.keyword}
                        isGenerated={false}
                    />
                )}
                
                {result.generatedImageUrl && (
                    <CardDisplay 
                        imageSrc={result.generatedImageUrl}
                        title="Ваш Портрет"
                        subtitle="Отражение состояния"
                        isGenerated={true}
                        isLoading={false} 
                    />
                )}
            </div>

            {/* Interpretation Text */}
            <div className="interpretation-card">
                 <div style={{
                     position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', 
                     background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)', opacity: 0.5
                 }}></div>
                 
                 <h2 style={{
                     fontFamily: 'Cinzel, serif', color: 'var(--accent-gold)', 
                     fontSize: '1.5rem', textAlign: 'center', marginBottom: '1.5rem'
                 }}>
                    Психологическое Толкование
                 </h2>
                 
                 <div className="interpretation-text">
                    {result.interpretation}
                 </div>
            </div>

            {/* Reset Button */}
            <div className="reset-wrapper">
                <button onClick={reset} className="btn-reset">
                    <RefreshCcw size={20} />
                    <span>Новый запрос</span>
                </button>
            </div>

          </div>
        )}
        
        {step === AnalysisStep.ERROR && (
             <div className="interpretation-card" style={{borderColor: '#f87171'}}>
                <h3 style={{color: '#f87171', textAlign: 'center'}}>Произошла ошибка</h3>
                <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>
                    {errorMessage || "Не удалось установить связь с сервером."}
                </p>
                <div className="reset-wrapper">
                    <button onClick={() => setStep(AnalysisStep.IDLE)} className="btn-reset">
                        Попробовать снова
                    </button>
                </div>
             </div>
        )}
      </main>
    </div>
  );
}