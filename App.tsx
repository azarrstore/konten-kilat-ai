import React, { useState, useEffect } from 'react';
import { AnalysisState } from './types';
import { analyzeImageWithGemini } from './services/geminiService';
import { generateMarketingCopy } from './services/kolosalService';
import { StepIndicator } from './components/StepIndicator';
import { ImageUploader } from './components/ImageUploader';

const App: React.FC = () => {
  // State Management
  const [kolosalKey, setKolosalKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    imageSrc: null,
    imageDescription: null,
    finalCopy: null,
    error: null,
  });

  // Effect: Load stored data on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('KOLOSAL_API_KEY');
    if (savedKey) setKolosalKey(savedKey);

    const savedTheme = localStorage.getItem('KK_THEME');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    }
  }, []);

  // Effect: Apply theme classes to body
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('hell-mode');
      document.body.classList.remove('heaven-mode');
    } else {
      document.body.classList.add('heaven-mode');
      document.body.classList.remove('hell-mode');
    }
    localStorage.setItem('KK_THEME', theme);
  }, [theme]);

  // Handlers
  const handleSaveKey = () => {
    if (!kolosalKey.trim()) return;
    localStorage.setItem('KOLOSAL_API_KEY', kolosalKey);
    setShowSaveConfirmation(true);
    setTimeout(() => {
      setShowSaveConfirmation(false);
    }, 3000);
  };

  const handleImageSelect = async (file: File) => {
    if (!kolosalKey) {
      alert('Please enter your Kolosal API Key in the settings menu first.');
      setShowKeyInput(true);
      return;
    }

    // Reset state for new process
    setState((prev) => ({
      ...prev,
      status: 'analyzing_image',
      error: null,
      finalCopy: null,
      imageDescription: null,
    }));

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setState((prev) => ({ ...prev, imageSrc: base64String }));

      try {
        // Step 1: Gemini Vision Analysis
        const description = await analyzeImageWithGemini(base64String, file.type);

        setState((prev) => ({
          ...prev,
          imageDescription: description,
          status: 'generating_copy',
        }));

        // Step 2: Kolosal AI Copywriting
        const copy = await generateMarketingCopy(description, kolosalKey);

        setState((prev) => ({
          ...prev,
          finalCopy: copy,
          status: 'complete',
        }));
      } catch (err: any) {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: err?.message || 'An unexpected error occurred.',
        }));
      }
    };

    reader.readAsDataURL(file);
  };

  // Utilities
  const prepareContentForShare = (rawText: string) => {
    const appPromo = '\n\n✨ Made with Konten Kilat AI - Try it now!';
    return rawText.trim() + appPromo;
  };

  const handleShare = (
    platform: 'twitter' | 'facebook' | 'linkedin' | 'tiktok' | 'instagram',
    content: string
  ) => {
    const finalContent = prepareContentForShare(content);
    const textEncoded = encodeURIComponent(finalContent);
    const urlEncoded = encodeURIComponent(window.location.href);
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${textEncoded}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${urlEncoded}&quote=${textEncoded}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${textEncoded}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
        break;
      case 'instagram':
        navigator.clipboard.writeText(finalContent);
        alert('Text copied! Redirecting to Instagram...');
        window.open('https://www.instagram.com/', '_blank');
        break;
      case 'tiktok':
        navigator.clipboard.writeText(finalContent);
        alert('Text copied! Redirecting to TikTok...');
        window.open('https://www.tiktok.com/', '_blank');
        break;
    }
  };

  const handleCopy = (content: string) => {
    const finalContent = prepareContentForShare(content);
    navigator.clipboard.writeText(finalContent);
    alert('Text successfully copied to clipboard!');
  };

  const renderMarkdown = (text: string) => {
    if (!text) return { __html: '' };
    // Safety check if marked is loaded globally
    if ((window as any).marked) {
      return { __html: (window as any).marked.parse(text) };
    }
    // Fallback if marked isn't loaded
    return { __html: text.replace(/\n/g, '<br />') };
  };

  const getVariations = (fullText: string | null) => {
    if (!fullText) return [];
    const delimiter = '---BATAS_VARIASI---'; // Keep the internal delimiter consistent
    if (fullText.includes(delimiter)) {
      return fullText
        .split(delimiter)
        .map((v) => v.trim())
        .filter((v) => v.length > 0);
    }
    return [fullText];
  };

  const variations = getVariations(state.finalCopy);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-100 py-10 px-4 sm:px-6 lg:px-8 animated-bg">
      <div className="max-w-5xl mx-auto relative">
        {/* Header Section */}
        <div className="text-center mb-10 relative">
          {/* Theme Toggle: Heaven / Hell */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="absolute left-0 top-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border border-slate-200/70 bg-white/70 backdrop-blur theme-toggle shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-sky-300 transition-all"
            title={theme === 'light' ? 'Switch to Hell Mode' : 'Switch to Heaven Mode'}
          >
            {theme === 'light' ? (
              <>
                <span className="w-4 h-4 rounded-full bg-gradient-to-br from-sky-400 to-amber-300 shadow-sm" />
                <span>Heaven</span>
              </>
            ) : (
              <>
                <span className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400 shadow-sm" />
                <span>Hell</span>
              </>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="absolute right-0 top-0 text-slate-400 hover:text-sky-500 settings-spin"
            title="API Key Settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white/70 shadow-sm border border-slate-200/60 text-xs font-medium text-sky-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Vision + Copywriting • Powered by AI</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 neon-title">
            Konten Kilat{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500">
              AI
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-slate-500 subtitle-glow">
            Turn product photos into top-tier marketing content — complete with viral-ready captions for every platform.
          </p>
        </div>

        {/* API Key Input Panel */}
        {showKeyInput && (
          <div className="mb-8 p-4 sm:px-5 sm:py-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/70 max-w-2xl mx-auto glass-card settings-panel">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Kolosal AI API Key
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  This key is stored locally in your browser and used solely to call Kolosal GLM 4.6.
                </p>
              </div>
              {showSaveConfirmation && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 text-[11px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Saved
                </span>
              )}
            </div>

            <div className="mt-2 flex flex-col sm:flex-row gap-3">
              <input
                type="password"
                value={kolosalKey}
                onChange={(e) => setKolosalKey(e.target.value)}
                placeholder="Enter your Kolosal AI API Key"
                className="flex-1 w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-sky-400 focus:ring-1 focus:ring-sky-300 outline-none"
              />
              <button
                onClick={handleSaveKey}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:scale-95 shadow-md"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Upload & Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/80 glass-card rounded-3xl shadow-2xl overflow-hidden p-6 sticky top-8 border border-slate-100/70">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L9 18" />
                </svg>
                Upload Product
              </h2>

              <ImageUploader
                imageSrc={state.imageSrc}
                onImageSelected={handleImageSelect}
                isLoading={
                  state.status !== 'idle' &&
                  state.status !== 'complete' &&
                  state.status !== 'error'
                }
              />

              {/* Progress Indicator */}
              {(state.status === 'analyzing_image' || state.status === 'generating_copy') && (
                <div className="mt-6">
                  <StepIndicator currentStep={state.status} />
                </div>
              )}

              {/* Step 1 Result: Description (Debug) */}
              {state.imageDescription && (
                <div className="mt-6 bg-white/80 glass-card rounded-xl shadow-sm p-4 border border-blue-100/80">
                  <details className="text-sm text-slate-600">
                    <summary className="font-medium cursor-pointer text-sky-700 hover:text-sky-800">
                      View Gemini Visual Analysis
                    </summary>
                    <p className="mt-2 p-2 bg-slate-50 rounded border border-slate-100 text-xs leading-relaxed max-h-40 overflow-y-auto">
                      {state.imageDescription}
                    </p>
                  </details>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-7 space-y-6">
            {state.error ? (
              <div className="bg-white/90 glass-card rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center text-red-500 bg-red-50/90 border border-red-100/90 min-h-[400px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-4"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-center font-medium text-lg">{state.error}</p>
              </div>
            ) : variations.length > 0 && state.finalCopy ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Content Options
                  </h2>
                  <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {variations.length} Variations Available
                  </span>
                </div>

                {variations.map((variantText, idx) => (
                  <div
                    key={idx}
                    className="bg-white/85 glass-card rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="bg-slate-50/80 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Option #{idx + 1}
                      </span>
                    </div>
                    <div className="p-6">
                      <div
                        className="prose prose-sm prose-slate max-w-none prose-headings:text-slate-800 prose-a:text-sky-600 mb-6"
                        dangerouslySetInnerHTML={renderMarkdown(variantText)}
                      />

                      {/* Action Bar */}
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100">
                        <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-start">
                          {/* Twitter */}
                          <button
                            onClick={() => handleShare('twitter', variantText)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200/80 bg-slate-50 hover:bg-sky-50 transition-all"
                            title="Share to Twitter"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.2 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 4.9 4.1 9 4 0-1.4.6-4.6 4-5 1.1 0 3 .5 3 3z" />
                            </svg>
                          </button>
                          {/* Facebook */}
                          <button
                            onClick={() => handleShare('facebook', variantText)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200/80 bg-slate-50 hover:bg-blue-50 transition-all"
                            title="Share to Facebook"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                          </button>
                          {/* LinkedIn */}
                          <button
                            onClick={() => handleShare('linkedin', variantText)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200/80 bg-slate-50 hover:bg-blue-50 transition-all"
                            title="Share to LinkedIn"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                              <rect x="2" y="9" width="4" height="12" />
                              <circle cx="4" cy="4" r="2" />
                            </svg>
                          </button>

                          <div className="w-px h-6 bg-slate-200 mx-1" />

                          {/* Instagram */}
                          <button
                            onClick={() => handleShare('instagram', variantText)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200/80 bg-slate-50 hover:bg-pink-50 transition-all"
                            title="Copy & Open Instagram"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="3" y="3" width="18" height="18" rx="4" />
                              <circle cx="12" cy="12" r="3.5" />
                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                          </button>
                          {/* TikTok */}
                          <button
                            onClick={() => handleShare('tiktok', variantText)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200/80 bg-slate-50 hover:bg-slate-200 transition-all"
                            title="Copy & Open TikTok"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                            </svg>
                          </button>
                        </div>

                        <button
                          onClick={() => handleCopy(variantText)}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white primary-cta transition-transform duration-150 hover:scale-[1.02] active:scale-95"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="9" y="9" width="13" height="13" rx="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          Copy Text
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/80 glass-card rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-gray-100 bg-gray-50/70 floating-empty min-h-[380px]">
                {state.status === 'idle' ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="42"
                      height="42"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mb-4 text-slate-400"
                    >
                      <path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16" />
                      <path d="M14 14l1-1a2 2 0 0 1 2.828 0L20 15" />
                      <circle cx="9" cy="7" r="2" />
                      <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                    <p className="text-lg">Upload an image to start</p>
                    <p className="text-sm mt-2 opacity-60">
                      Content variations will appear here automatically.
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                    <p className="text-sm font-medium text-slate-500 animate-pulse text-center">
                      {state.status === 'analyzing_image' && 'Analyzing visual details...'}
                      {state.status === 'generating_copy' && 'Writing content variations...'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info & Credits Section */}
        <div className="mt-12 bg-white/80 glass-card rounded-2xl shadow-lg border border-slate-200/80 p-6 md:p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4">About Konten Kilat AI</h3>
          <div className="grid md:grid-cols-2 gap-8 text-sm text-slate-600">
            <div className="space-y-2">
              <p>
                Konten Kilat AI combines Google Gemini 2.5 Flash's visual analysis capabilities with Kolosal GLM 4.6's language intelligence to create relevant, engaging, and ready-to-use marketing content.
              </p>
              <p>
                Simply upload a product photo, let the AI read the visual context, and choose the script or caption that best fits your brand.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">How to Use</h4>
              <ol className="list-decimal list-inside space-y-1 leading-relaxed">
                <li>Click the settings icon (top right) and enter your Kolosal AI API Key.</li>
                <li>Upload the product photo you want to market.</li>
                <li>Wait for the visual analysis and copywriting process to finish.</li>
                <li>Select the best variation, then copy or share it to your favorite social media!</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center space-y-2 pb-8">
          <p className="text-sm text-gray-400">
            Powered by Google Gemini 2.5 Flash &amp; Kolosal AI GLM 4.6
          </p>
          <p className="text-sm font-medium text-slate-500">
            <span className="typing-credit">Credits: Azarr &amp; AunuHost (NCHMPK)</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
