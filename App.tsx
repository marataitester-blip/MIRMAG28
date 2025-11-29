
import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult, AnalysisStep } from './types';
import { CardDisplay } from './components/CardDisplay';
import { Sparkles, RefreshCcw, ShieldCheck, Volume2, Square } from 'lucide-react';

export default function App() {
  const [input, setInput] = useState('');
  const [step, setStep] = useState<AnalysisStep>(AnalysisStep.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const resultRef = useRef<HTMLDivElement>(null);

  // Stop speech if component unmounts or resets
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

 const handleAnalyze = async () => {
  if (!input.trim()) return;
  
  setResult(null);
  setErrorMessage(null);
  setStep(AnalysisStep.PROCESSING);

  // ===== ПОКАЗАТЬ ЛОАДЕР =====
  showLoader();
  
  try {
    const response = await fetch('/api/analyze', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ mode: 'groq', userRequest: input })
    });

    const data = await response.json();

    // ===== СКРЫТЬ ЛОАДЕР =====
    hideLoader();

    if (!response.ok) {
      throw new Error(data.error || `Ошибка сервера: ${response.status}`);
    }

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.generatedImageUrl || !data.interpretation) {
      console.error("Bad response format:", data);
      throw new Error("Сервер вернул неполные данные");
    }

    setResult(data);
    setStep(AnalysisStep.COMPLETED);
    
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

  } catch (error: any) {
    // ===== СКРЫТЬ ЛОАДЕР ПРИ ОШИБКЕ =====
    hideLoader();
    
    console.error("Workflow failed", error);
    setErrorMessage(error.message || "Произошла ошибка связи с сервером");
    setStep(AnalysisStep.ERROR);
  }
};

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Ошибка сервера: ${response.status}`);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.generatedImageUrl || !data.interpretation) {
        console.error("Bad response format:", data);
        throw new Error("Сервер вернул неполные данные");
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
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setInput('');
    setResult(null);
    setErrorMessage(null);
    setStep(AnalysisStep.IDLE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSpeech = () => {
    if (!result?.interpretation) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(result.interpretation);
      utterance.rate = 0.9;
      utterance.pitch = 0.9;
      utterance.lang = 'ru-RU';

      const voices = window.speechSynthesis.getVoices();
      const ruVoices = voices.filter(v => v.lang.includes('ru'));
      const preferredVoice = ruVoices.find(v => v.name.toLowerCase().includes('google')) || 
                             ruVoices.find(v => v.name.toLowerCase().includes('premium')) ||
                             ruVoices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
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
              Синхронизация потоков...
            </h3>
            <p style={{color: 'var(--text-muted)'}}>
                Параллельная генерация текста и образа (Groq Turbo)
            </p>
          </div>
        )}

        {/* Results */}
        {result && step === AnalysisStep.COMPLETED && (
          <div ref={resultRef}>
            
            {/* Cards Grid */}
            <div className="results-grid">
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

                 {/* TTS Button */}
                 <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                    <button 
                        onClick={toggleSpeech} 
                        className="btn-primary" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    >
                        {isSpeaking ? <Square size={18} fill="currentColor" /> : <Volume2 size={18} />}
                        <span>{isSpeaking ? "Остановить" : "Прослушать"}</span>
                    </button>
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
