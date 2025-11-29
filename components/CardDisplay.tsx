
import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

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

  const downloadImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!imageSrc) return;

    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Set a nice filename
      link.download = isGenerated ? 'mirmag_portrait.jpg' : 'mirmag_archetype.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

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
        
        {/* Overlay Label AND Download Button */}
        {isImgLoaded && (
            <div className="card-overlay" style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
            }}>
                <span className="card-tag">
                    {isGenerated ? "Уникальный Образ" : "Архетип Колоды"}
                </span>
                
                <button 
                    onClick={downloadImage}
                    title="Скачать изображение"
                    style={{
                        background: 'rgba(0,0,0,0.6)',
                        border: '1px solid var(--accent-gold)',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-gold)',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--accent-gold)'}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.6)';
                        e.currentTarget.style.color = 'var(--accent-gold)';
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--bg-color)'}
                >
                    <Download size={16} />
                </button>
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
