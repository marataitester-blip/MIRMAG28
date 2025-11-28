import React, { useState, useRef } from 'react';
import { AnalysisResult, AnalysisStep } from './types';
import { CardDisplay } from './components/CardDisplay';
import { Sparkles, RefreshCcw } from 'lucide-react';

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
      // Logic: Send text to backend API
      const response = await fetch('/api/analyze', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ mode: 'groq', userRequest: input })
      });

      if (!response.ok) {
        throw new Error(`Server connection error: ${response.status}`);
      }

      const analysisResult: AnalysisResult = await response.json();
      
      setResult(analysisResult);
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
                    <div className="btn-wrapper">
                        <button
                            onClick={handleAnalyze}
                            disabled={!input.trim()}
                            className="btn-primary"
                        >
                            <span>Раскрыть</span>
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
                Анализ архетипов и формирование образа
            </p>
          </div>
        )}

        {/* Results */}
        {result && step === AnalysisStep.COMPLETED && (
          <div ref={resultRef}>
            
            {/* Cards Grid */}
            <div className="results-grid">
                <CardDisplay 
                    imageSrc={result.card.imageUrl}
                    title={result.card.name}
                    subtitle={result.card.keyword}
                    isGenerated={false}
                />
                
                <CardDisplay 
                    imageSrc={result.generatedImageUrl}
                    title="Ваш Портрет"
                    subtitle="Отражение состояния"
                    isGenerated={true}
                    // If URL is present, it will try to load.
                    isLoading={!result.generatedImageUrl}
                />
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
                 
                 {result.interpretation ? (
                     <div className="interpretation-text">
                        {result.interpretation}
                     </div>
                 ) : (
                     <p>Толкование отсутствует</p>
                 )}
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