import React, { useState, useRef } from 'react';
import { ALL_CARDS } from './constants';
import { AnalysisResult, AnalysisStep } from './types';
import * as GeminiService from './services/geminiService';
import { CardDisplay } from './components/CardDisplay';
import { Send, Sparkles, RefreshCcw } from 'lucide-react';

export default function App() {
  const [input, setInput] = useState('');
  const [step, setStep] = useState<AnalysisStep>(AnalysisStep.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  // Ref for auto-scrolling to results
  const resultRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setResult(null);
    setStep(AnalysisStep.ANALYZING);
    
    try {
      // 1. Find Card
      const card = await GeminiService.findBestMatchingCard(input);
      // Partial result update to show the matched card immediately
      setResult({ card, interpretation: '', generatedImageUrl: null });
      
      // 2. Start parallel generation (Image + Text)
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
      
      // Scroll to results
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
    <div className="min-h-screen pb-12">
      
      {/* Header */}
      <header className="pt-8 pb-6 text-center px-4">
        <h1 className="font-cinzel text-3xl md:text-4xl text-astral-accent font-bold tracking-wider mb-2">
          Astral Hero
        </h1>
        <p className="font-cormorant text-astral-muted text-lg italic opacity-80">
          Психологический Портрет
        </p>
      </header>

      {/* Main Input Section */}
      <main className="max-w-2xl mx-auto px-5">
        
        {step === AnalysisStep.IDLE && (
            <div className="animate-fade-in-up">
                <div className="bg-astral-card border border-astral-accent/20 rounded-2xl p-6 shadow-2xl mb-8">
                <label className="block text-astral-accent font-cinzel text-lg mb-3">
                    Опишите ваше состояние или ситуацию
                </label>
                <textarea
                    className="w-full bg-[#0a0a0e] text-astral-fg border border-astral-muted/20 rounded-xl p-4 min-h-[150px] focus:border-astral-accent focus:outline-none focus:ring-1 focus:ring-astral-accent transition-all font-cormorant text-lg"
                    placeholder="Например: Я чувствую себя потерянным перед важным выбором, но внутри есть надежда..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <div className="mt-4 flex justify-end">
                    <button
                    onClick={handleAnalyze}
                    disabled={!input.trim()}
                    className="group flex items-center gap-2 bg-transparent border-2 border-astral-accent text-astral-accent px-6 py-2 rounded-full font-cinzel font-bold hover:bg-astral-accent hover:text-astral-bg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    <span>Раскрыть</span>
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </button>
                </div>
                </div>

                <div className="text-center">
                    <a href="https://t.me/+y7Inf371g7w0NzMy" target="_blank" rel="noreferrer" className="inline-block text-astral-muted/60 text-sm hover:text-astral-accent transition-colors border-b border-transparent hover:border-astral-accent">
                        Связь с Мастером
                    </a>
                </div>
            </div>
        )}

        {/* Loading State */}
        {step !== AnalysisStep.IDLE && step !== AnalysisStep.COMPLETED && step !== AnalysisStep.ERROR && (
          <div className="py-20 text-center space-y-4 animate-pulse">
            <div className="inline-block relative w-20 h-20">
               <div className="absolute inset-0 border-4 border-astral-accent/30 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-t-astral-accent rounded-full animate-spin"></div>
            </div>
            <h3 className="font-cinzel text-xl text-astral-accent">
              {step === AnalysisStep.ANALYZING && "Подбор Архетипа..."}
              {step === AnalysisStep.PAINTING && "Создание образа и толкование..."}
            </h3>
            <p className="text-astral-muted font-cormorant">
                Нейросеть обращается к коллективному бессознательному
            </p>
          </div>
        )}

        {/* Results */}
        {result && (step === AnalysisStep.PAINTING || step === AnalysisStep.COMPLETED) && (
          <div ref={resultRef} className="space-y-12 animate-fade-in">
            
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Original Card */}
                <CardDisplay 
                    imageSrc={result.card.imageUrl}
                    title={result.card.name}
                    subtitle={result.card.keyword}
                    isGenerated={false}
                />
                
                {/* Generated Card */}
                <CardDisplay 
                    imageSrc={result.generatedImageUrl}
                    title="Ваш Портрет"
                    subtitle="Отражение состояния"
                    isGenerated={true}
                    isLoading={!result.generatedImageUrl}
                />
            </div>

            {/* Interpretation Text */}
            <div className="bg-astral-card border border-astral-accent/20 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-astral-accent to-transparent opacity-50"></div>
                 
                 <h2 className="font-cinzel text-2xl text-astral-accent mb-6 text-center">
                    Психологическое Толкование
                 </h2>
                 
                 {result.interpretation ? (
                     <div className="prose prose-invert prose-lg max-w-none font-cormorant leading-relaxed text-astral-fg whitespace-pre-line">
                        {result.interpretation}
                     </div>
                 ) : (
                     <div className="h-32 flex items-center justify-center space-x-2 text-astral-muted">
                        <span className="w-2 h-2 bg-astral-accent rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-astral-accent rounded-full animate-bounce delay-75"></span>
                        <span className="w-2 h-2 bg-astral-accent rounded-full animate-bounce delay-150"></span>
                     </div>
                 )}
            </div>

            {/* Reset Button */}
            <div className="flex justify-center pb-10">
                <button 
                    onClick={reset}
                    className="flex items-center gap-2 text-astral-muted hover:text-astral-accent transition-colors font-cinzel"
                >
                    <RefreshCcw className="w-5 h-5" />
                    <span>Новый запрос</span>
                </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}