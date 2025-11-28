import React, { useState, useEffect } from 'react';

interface CardDisplayProps {
  imageSrc: string | null;
  title: string;
  subtitle?: string;
  isGenerated?: boolean;
  isLoading?: boolean;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ 
  imageSrc, 
  title, 
  subtitle, 
  isGenerated,
  isLoading: externalLoading 
}) => {
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset state when source changes
  useEffect(() => {
    setIsImgLoaded(false);
    setHasError(false);
  }, [imageSrc]);

  // Show loading if:
  // 1. Parent says we are waiting for the URL (externalLoading)
  // 2. We have a URL (imageSrc) but the browser hasn't loaded the bytes yet (!isImgLoaded) and no error occurred
  const showLoading = externalLoading || (imageSrc && !isImgLoaded && !hasError);

  return (
    <div className="flex flex-col items-center w-full max-w-[300px] mx-auto group">
      <div className={`
        relative w-full aspect-[600/1040] rounded-xl overflow-hidden 
        border border-astral-accent/30 shadow-lg transition-all duration-500
        ${showLoading ? 'animate-pulse bg-astral-card' : 'bg-black'}
        ${isGenerated ? 'shadow-[0_0_20px_rgba(199,168,123,0.3)]' : ''}
      `}>
        
        {/* Loading Spinner */}
        {showLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-12 h-12 border-2 border-astral-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Image */}
        {imageSrc && !hasError && (
          <img 
            src={imageSrc} 
            alt={title} 
            className={`w-full h-full object-cover transition-opacity duration-700 ${isImgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsImgLoaded(true)}
            onError={() => setHasError(true)}
          />
        )}

        {/* Error / Empty State */}
        {(!imageSrc || hasError) && !showLoading && (
          <div className="flex flex-col items-center justify-center h-full text-astral-muted text-sm p-4 text-center">
            {hasError ? (
                <>
                    <span className="text-2xl mb-2 text-red-400">✕</span>
                    <p>Не удалось загрузить образ</p>
                </>
            ) : (
                <p>Изображение формируется...</p>
            )}
          </div>
        )}
        
        {/* Overlay Label for Generated/Original */}
        {isImgLoaded && (
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-3 pointer-events-none">
                <span className="text-astral-accent text-xs font-cinzel tracking-widest uppercase">
                    {isGenerated ? "Уникальный Образ" : "Архетип Колоды"}
                </span>
            </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <h3 className="font-cinzel text-xl text-astral-accent">{title}</h3>
        {subtitle && <p className="font-cormorant text-astral-muted italic">{subtitle}</p>}
      </div>
    </div>
  );
};