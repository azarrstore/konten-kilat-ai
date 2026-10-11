import React, { useState, useEffect } from 'react';
import { AnalysisState } from './types';
import { analyzeImageWithGemini } from './services/geminiService';
import { generateMarketingCopy } from './services/kolosalService';
import { StepIndicator } from './components/StepIndicator';
import { ImageUploader } from './components/ImageUploader';

const App: React.FC = () => {
  const [kolosalKey, setKolosalKey] = useState<string>(() => {
    try { return localStorage.getItem('KOLOSAL_API_KEY') || ''; } catch { return ''; }
  });
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const s = localStorage.getItem('KK_THEME');
      return s === 'dark' || s === 'light' ? s : 'light';
    } catch { return 'light'; }
  });

  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    imageSrc: null,
    imageDescription: null,
    finalCopy: null,
    error: null,
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('hell-mode');
      document.body.classList.remove('heaven-mode');
    } else {
      document.body.classList.add('heaven-mode');
      document.body.classList.remove('hell-mode');
    }
    try { localStorage.setItem('KK_THEME', theme); } catch {}
  }, [theme]);

  const handleSaveKey = () => {
    if (!kolosalKey.trim()) return;
    try { localStorage.setItem('KOLOSAL_API_KEY', kolosalKey); } catch {}
    setShowSaveConfirmation(true);
    setTimeout(() => {
      setShowSaveConfirmation(false);
    }, 3000);
  };

  const handleImageSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setState(prev => ({ ...prev, status: 'error', error: 'File harus berupa gambar (PNG/JPG/WEBP).' }));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setState(prev => ({ ...prev, status: 'error', error: 'Ukuran gambar maksimal 8MB.' }));
      return;
    }
    const key = kolosalKey || (()=>{ try{return localStorage.getItem('KOLOSAL_API_KEY')||''}catch{return ''}})();
    if (!key) {
      alert('Please enter your Kolosal API Key in the settings menu first.');
      setShowKeyInput(true);
      return;
    }
    setState((prev) => ({
      ...prev,
      status: 'analyzing_image',
      error: null,
      finalCopy: null,
      imageDescription: null,
    }));
    const reader = new FileReader();
    reader.onerror = () => {
      setState(prev => ({ ...prev, status: 'error', error: 'Gagal membaca file gambar.' }));
    };
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setState((prev) => ({ ...prev, imageSrc: base64String }));
      try {
        const description = await analyzeImageWithGemini(base64String, file.type);
        setState((prev) => ({
          ...prev,
          imageDescription: description,
          status: 'generating_copy',
        }));
        const copy = await generateMarketingCopy(description, key);
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

  const prepareContentForShare = (rawText: string) => {
    const appPromo = '\n\n✨ Made with Konten Kilat AI - Try it now!';
    return rawText.trim() + appPromo;
  };

  const handleShare = async (
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
        try { await navigator.clipboard.writeText(finalContent); alert('Teks disalin! Membuka Instagram...'); } catch { alert('Gagal menyalin, silakan salin manual.'); }
        window.open('https://www.instagram.com/', '_blank');
        break;
      case 'tiktok':
        try { await navigator.clipboard.writeText(finalContent); alert('Teks disalin! Membuka TikTok...'); } catch { alert('Gagal menyalin, silakan salin manual.'); }
        window.open('https://www.tiktok.com/', '_blank');
        break;
    }
  };

  const handleCopy = async (content: string) => {
    const finalContent = prepareContentForShare(content);
    try {
      await navigator.clipboard.writeText(finalContent);
      alert('Teks berhasil disalin!');
    } catch {
      alert('Gagal menyalin ke clipboard.');
    }
  };

  const renderMarkdown = (text: string) => {
    if (!text) return { __html: '' };
    if ((window as any).marked) {
      return { __html: (window as any).marked.parse(text) };
    }
    return { __html: text.replace(/\n/g, '<br />') };
  };

  const getVariations = (fullText: string | null) => {
    if (!fullText) return [];
    const delimiter = '---BATAS_VARIASI---';
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 animated-bg">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 bg-white theme-toggle shadow-sm hover:border-sky-300 transition-colors"
            title={theme === 'light' ? 'Switch to Hell Mode' : 'Switch to Heaven Mode'}
          >
            {theme === 'light' ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-sky-400 to-amber-300 shadow-xs" />
                <span>Heaven</span>
              </>
            ) : (
              <>
                <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400 shadow-xs" />
                <span>Hell</span>
              </>
            )}
          </button>
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="p-2 text-slate-400 hover:text-sky-600 rounded-lg transition-colors"
            title="API Key Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
          </button>
        </div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white shadow-sm border border-slate-200 text-xs font-medium text-sky-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Vision + Copywriting • Powered by AI</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 neon-title">Konten Kilat <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500">AI</span></h1>
          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-slate-500 subtitle-glow">Ubah foto produk menjadi materi promosi siap viral dalam hitungan detik untuk UMKM Indonesia.</p>
        </div>
        {showKeyInput && (
          <div className="mb-8 p-4 sm:p-5 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-2xl mx-auto glass-card settings-panel">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kolosal AI API Key</label>
                <p className="text-xs text-slate-500 mb-2">Kunci tersimpan aman di browser lokal Anda untuk memproses model Kolosal GLM 4.6.</p>
              </div>
              {showSaveConfirmation && (<span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 text-[11px] font-medium"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Saved</span>)}
            </div>
            <div className="mt-2 flex flex-col sm:flex-row gap-3">
              <input type="password" value={kolosalKey} onChange={(e) => setKolosalKey(e.target.value)} placeholder="Masukkan Kolosal AI API Key" className="flex-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:bg-white focus:border-sky-400 focus:ring-1 focus:ring-sky-300 outline-none" />
              <button onClick={handleSaveKey} className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:scale-95 shadow-sm transition-transform">Simpan</button>
            </div>
          </div>
        )}
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white glass-card rounded-2xl shadow-sm p-5 sm:p-6 lg:sticky lg:top-6 border border-slate-200">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L9 18" /></svg>Unggah Produk</h2>
              <ImageUploader imageSrc={state.imageSrc} onImageSelected={handleImageSelect} isLoading={state.status !== 'idle' && state.status !== 'complete' && state.status !== 'error'} />
              {(state.status === 'analyzing_image' || state.status === 'generating_copy') && (<div className="mt-6"><StepIndicator currentStep={state.status} /></div>)}
              {state.imageDescription && (<div className="mt-6 bg-slate-50 glass-card rounded-xl p-4 border border-slate-200"><details className="text-sm text-slate-600"><summary className="font-medium cursor-pointer text-sky-700 hover:text-sky-800">Lihat Hasil Analisis Visual Gemini</summary><p className="mt-2 p-2 bg-white rounded border border-slate-100 text-xs leading-relaxed max-h-40 overflow-y-auto">{state.imageDescription}</p></details></div>)}
            </div>
          </div>
          <div className="lg:col-span-7 space-y-6">
            {state.error ? (<div className="bg-red-50 glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-red-600 border border-red-200 min-h-[320px]"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg><p className="text-center font-medium text-base">{state.error}</p></div>) : variations.length > 0 && state.finalCopy ? (<div className="space-y-6"><div className="flex items-center justify-between"><h2 className="text-lg sm:text-xl font-semibold text-slate-800 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>Pilihan Caption</h2><span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">{variations.length} Variasi Siap Pakai</span></div>{variations.map((variantText, idx) => (<div key={idx} className="bg-white glass-card rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200"><div className="bg-slate-50 px-5 sm:px-6 py-3 border-b border-slate-200 flex justify-between items-center"><span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Opsi #{idx + 1}</span></div><div className="p-5 sm:p-6"><div className="prose prose-sm prose-slate max-w-none prose-headings:text-slate-800 prose-a:text-sky-600 mb-6 leading-relaxed" dangerouslySetInnerHTML={renderMarkdown(variantText)} /><div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-100"><div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-start"><button onClick={() => handleShare('twitter', variantText)} className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 hover:bg-sky-50 transition-colors" title="Bagikan ke Twitter / X"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.2 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 4.9 4.1 9 4 0-1.4.6-4.6 4-5 1.1 0 3 .5 3 3z" /></svg></button><button onClick={() => handleShare('facebook', variantText)} className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 transition-colors" title="Bagikan ke Facebook"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></button><button onClick={() => handleShare('linkedin', variantText)} className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 transition-colors" title="Bagikan ke LinkedIn"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg></button><div className="w-px h-6 bg-slate-200 mx-1" /><button onClick={() => handleShare('instagram', variantText)} className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 hover:bg-pink-50 transition-colors" title="Salin & Buka Instagram"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="12" cy="12" r="3.5" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg></button><button onClick={() => handleShare('tiktok', variantText)} className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors" title="Salin & Buka TikTok"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg></button></div><button onClick={() => handleCopy(variantText)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white primary-cta shadow-sm active:scale-95 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Salin Teks</button></div></div></div>))}</div>) : (<div className="bg-white glass-card rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200 min-h-[300px]">{state.status === 'idle' ? (<><svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3 text-slate-300"><path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16" /><path d="M14 14l1-1a2 2 0 0 1 2.828 0L20 15" /><circle cx="9" cy="7" r="2" /><path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg><p className="text-base font-medium text-slate-600">Unggah foto produk untuk memulai</p><p className="text-xs mt-1 text-slate-400 text-center">Tiga variasi caption akan dibuat otomatis oleh AI.</p></>) : (<div className="flex flex-col items-center"><div className="w-10 h-10 border-3 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-3" /><p className="text-sm font-medium text-slate-500 text-center">{state.status === 'analyzing_image' && 'Memindai detail visual produk...'}{state.status === 'generating_copy' && 'Menyusun caption variasi...'}</p></div>)}</div>)}
          </div>
        </div>
        <div className="mt-10 bg-white glass-card rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-3">Tentang Konten Kilat AI</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-600 leading-relaxed">
            <p>Konten Kilat AI memadukan ketajaman analisis visual Google Gemini 2.5 Flash dengan kecerdasan bahasa Kolosal GLM 4.6 untuk menciptakan caption pemasaran yang relevan, persuasif, dan siap unggah.</p>
            <div><h4 className="font-semibold text-slate-700 mb-1.5">Langkah Cepat</h4><ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-slate-500"><li>Masukkan Kolosal API Key di menu pengaturan.</li><li>Unggah foto produk jualan Anda.</li><li>Pilih variasi caption (Viral, Profesional, Storytelling) dan bagikan!</li></ol></div>
          </div>
        </div>
        <div className="mt-8 text-center space-y-1.5 pb-6">
          <p className="text-xs text-slate-400">Didukung oleh Google Gemini 2.5 Flash &amp; Kolosal AI GLM 4.6</p>
          <p className="text-xs sm:text-sm font-medium text-slate-500"><span>Dibuat untuk UMKM Indonesia • NCHMPK Team</span></p>
        </div>
      </div>
    </div>
  );
};

export default App;
