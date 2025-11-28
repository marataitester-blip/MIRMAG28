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

  useEffect(() => {
    setIsImgLoaded(false);
    setHasError(false);
  }, [imageSrc]);

  // Determine logic for showing spinner
  const showLoading = externalLoading || (imageSrc && !isImgLoaded && !hasError);

  // Dynamic class for the frame
  let frameClass = "card-frame";
  if (showLoading) frameClass += " loading";
  if (isGenerated) frameClass += " generated";

  return (
    <div className="card-wrapper">
      <div className={frameClass}>
        
        {/* Loading Spinner */}
        {showLoading && (
          <div className="card-loader">
            <div className="mini-spinner"></div>
          </div>
        )}

        {/* Image */}
        {imageSrc && !hasError && (
          <img 
            src={imageSrc} 
            alt={title} 
            className={`card-img ${isImgLoaded ? 'loaded' : ''}`}
            onLoad={() => setIsImgLoaded(true)}
            onError={() => setHasError(true)}
          />
        )}

        {/* Error / Empty State */}
        {(!imageSrc || hasError) && !showLoading && (
          <div className="card-error">
            {hasError ? (
                <>
                    <span style={{fontSize: '1.5rem', color: '#f87171'}}>✕</span>
                    <p>Не удалось загрузить образ</p>
                </>
            ) : (
                <p>Изображение формируется...</p>
            )}
          </div>
        )}
        
        {/* Overlay Label for Generated/Original */}
        {isImgLoaded && (
            <div className="card-overlay">
                <span className="card-tag">
                    {isGenerated ? "Уникальный Образ" : "Архетип Колоды"}
                </span>
            </div>
        )}
      </div>
      
      <div className="card-info">
        <h3 className="card-title">{title}</h3>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};