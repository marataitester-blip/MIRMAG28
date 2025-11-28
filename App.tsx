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
    <div className="min-h-screen pb-12 bg-[#0f0f14] text-[#eae6df] font-cormorant">
      
      {/* Header */}
      <header className="pt-8 pb-6 text-center px-4">
        <h1 className="font-cinzel text-3xl md:text-4xl text-[#c7a87b] font-bold tracking-wider mb-2">
          Astral Hero
        </h1>
        <p className="font-cormorant text-[#c9c3b8] text-lg italic opacity-80">
          Психологический Портрет
        </p>
      </header>

      {/* Main Input Section */}
      <main className="max-w-2xl mx-auto px-5">
        
        {step === AnalysisStep.IDLE && (
            <div>
                <div className="bg-[#16161d] border border-[#c7a87b]/20 rounded-2xl p-6 shadow-2xl mb-8">
                <label className="block text-[#c7a87b] font-cinzel text-lg mb-3">
                    Опишите ваше состояние или ситуацию
                </label>
                <textarea
                    className="w-full bg-[#0a0a0e] text-[#eae6df] border border-[#c9c3b8]/20 rounded-xl p-4 min-h-[150px] focus:border-[#c7a87b] focus:outline-none focus:ring-1 focus:ring-[#c7a87b] transition-all font-cormorant text-lg resize-y placeholder-gray-600"
                    placeholder="Например: Я чувствую себя потерянным перед важным выбором, но внутри есть надежда..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <div className="mt-4 flex justify-end">
                    <button
                    onClick={handleAnalyze}
                    disabled={!input.trim()}
                    className="group flex items-center gap-2 bg-transparent border-2 border-[#c7a87b] text-[#c7a87b] px-6 py-2 rounded-full font-cinzel font-bold hover:bg-[#c7a87b] hover:text-[#0f0f14] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    <span>Раскрыть</span>
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </button>
                </div>
                </div>

                <div className="text-center">
                    <a href="https://t.me/+y7Inf371g7w0NzMy" target="_blank" rel="noreferrer" className="inline-block text-[#c9c3b8] text-sm hover:text-[#c7a87b] transition-colors border-b border-transparent hover:border-[#c7a87b] pb-1">
                        Связь с Мастером
                    </a>
                </div>
            </div>
        )}

        {/* Loading State */}
        {step !== AnalysisStep.IDLE && step !== AnalysisStep.COMPLETED && step !== AnalysisStep.ERROR && (
          <div className="py-20 text-center space-y-4">
            <div className="inline-block relative w-20 h-20">
               <div className="absolute inset-0 border-4 border-[#c7a87b]/30 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-t-[#c7a87b] rounded-full animate-spin"></div>
            </div>
            <h3 className="font-cinzel text-xl text-[#c7a87b]">
              {step === AnalysisStep.ANALYZING && "Подбор Архетипа..."}
              {step === AnalysisStep.PAINTING && "Создание образа и толкование..."}
            </h3>
            <p className="text-[#c9c3b8] font-cormorant">
                Нейросеть обращается к коллективному бессознательному
            </p>
          </div>
        )}

        {/* Results */}
        {result && (step === AnalysisStep.PAINTING || step === AnalysisStep.COMPLETED) && (
          <div ref={resultRef} className="space-y-12">
            
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
            <div className="bg-[#16161d] border border-[#c7a87b]/20 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c7a87b] to-transparent opacity-50"></div>
                 
                 <h2 className="font-cinzel text-2xl text-[#c7a87b] mb-6 text-center">
                    Психологическое Толкование
                 </h2>
                 
                 {result.interpretation ? (
                     <div className="text-lg md:text-xl leading-relaxed text-[#eae6df] whitespace-pre-line font-cormorant text-justify">
                        {result.interpretation}
                     </div>
                 ) : (
                     <div className="h-32 flex items-center justify-center space-x-2 text-[#c9c3b8]">
                        <span className="w-2 h-2 bg-[#c7a87b] rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-[#c7a87b] rounded-full animate-bounce delay-75"></span>
                        <span className="w-2 h-2 bg-[#c7a87b] rounded-full animate-bounce delay-150"></span>
                     </div>
                 )}
            </div>

            {/* Reset Button */}
            <div className="flex justify-center pb-10">
                <button 
                    onClick={reset}
                    className="flex items-center gap-2 text-[#c9c3b8] hover:text-[#c7a87b] transition-colors font-cinzel"
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