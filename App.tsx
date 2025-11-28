import React, { useState, useRef } from 'react';
import { AnalysisResult, AnalysisStep } from './types';
import * as GeminiService from './services/geminiService';
import { CardDisplay } from './components/CardDisplay';
import { Send, Sparkles, RefreshCcw } from 'lucide-react';

export default function App() {
  const [input, setInput] = useState('');
  const [step, setStep] = useState<AnalysisStep>(AnalysisStep.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  const resultRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setResult(null);
    setStep(AnalysisStep.ANALYZING);
    
    try {
      // 1. Find Card
      const card = await GeminiService.findBestMatchingCard(input);
      setResult({ card, interpretation: '', generatedImageUrl: null });
      
      // 2. Start parallel generation
      setStep(AnalysisStep.PAINTING);
      
      const [interpretation, genImage] = await Promise.all([
        GeminiService.generateInterpretation(input, card),
        GeminiService.generatePersonalizedImage(input, card)
      ]);

      setResult({
        card,
        interpretation,
        generatedImageUrl: genImage
      });
      
      setStep(AnalysisStep.COMPLETED);
      
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error("Workflow failed", error);
      setStep(AnalysisStep.ERROR);
    }
  };

  const reset = () => {
    setInput('');
    setResult(null);
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
        {step !== AnalysisStep.IDLE && step !== AnalysisStep.COMPLETED && step !== AnalysisStep.ERROR && (
          <div className="loading-container">
            <div className="spinner-box">
               <div className="spinner-ring"></div>
               <div className="spinner-active"></div>
            </div>
            <h3 style={{fontFamily: 'Cinzel, serif', color: 'var(--accent-gold)', fontSize: '1.25rem'}}>
              {step === AnalysisStep.ANALYZING && "Подбор Архетипа..."}
              {step === AnalysisStep.PAINTING && "Создание образа и толкование..."}
            </h3>
            <p style={{color: 'var(--text-muted)'}}>
                Нейросеть обращается к коллективному бессознательному
            </p>
          </div>
        )}

        {/* Results */}
        {result && (step === AnalysisStep.PAINTING || step === AnalysisStep.COMPLETED) && (
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
                     <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '2rem'}}>
                        <span style={{width: '8px', height: '8px', backgroundColor: 'var(--accent-gold)', borderRadius: '50%'}}></span>
                        <span style={{width: '8px', height: '8px', backgroundColor: 'var(--accent-gold)', borderRadius: '50%'}}></span>
                        <span style={{width: '8px', height: '8px', backgroundColor: 'var(--accent-gold)', borderRadius: '50%'}}></span>
                     </div>
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
      </main>
    </div>
  );
}