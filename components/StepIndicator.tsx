import React from 'react';

interface StepIndicatorProps {
  currentStep: 'idle' | 'uploading' | 'analyzing_image' | 'generating_copy' | 'complete' | 'error';
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  let progress = 0;
  let label = '';
  let subLabel = '';
  let barColor = 'bg-blue-600';

  switch (currentStep) {
    case 'analyzing_image':
      progress = 45;
      label = 'Fase 1: Analisis Visual';
      subLabel = 'Gemini sedang memindai detail gambar...';
      barColor = 'bg-blue-600';
      break;
    case 'generating_copy':
      progress = 85;
      label = 'Fase 2: Penulisan Kreatif';
      subLabel = 'Kolosal AI sedang merangkai kata...';
      barColor = 'bg-purple-600';
      break;
    case 'complete':
      progress = 100;
      label = 'Selesai!';
      subLabel = 'Konten siap digunakan';
      barColor = 'bg-green-500';
      break;
    case 'error':
      progress = 100;
      label = 'Error';
      subLabel = 'Terjadi kesalahan';
      barColor = 'bg-red-500';
      break;
    default:
      progress = 0;
  }

  return (
    <div className="w-full px-1">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-bold text-slate-700">{label}</span>
        <span className="text-xs font-semibold text-slate-500">{progress}%</span>
      </div>
      
      {/* Track */}
      <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden shadow-inner border border-slate-200">
        {/* Bar */}
        <div 
          className={`h-3 rounded-full transition-all duration-700 ease-out relative ${barColor} ${(currentStep === 'analyzing_image' || currentStep === 'generating_copy') ? 'animate-pulse' : ''}`}
          style={{ width: `${progress}%` }}
        >
          {/* Shimmer effect overlay */}
          {(currentStep === 'analyzing_image' || currentStep === 'generating_copy') && (
            <div className="absolute top-0 left-0 bottom-0 right-0 bg-white opacity-20 w-full h-full animate-pulse"></div>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500 italic text-center min-h-[1.25rem]">
        {subLabel}
      </p>
    </div>
  );
};
