
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Layout } from './components/Layout';
import { ConsignePanel } from './components/ConsignePanel';
import { ToolkitPanel } from './components/ToolkitPanel';
import { DictionaryPanel } from './components/DictionaryPanel';
import { AnalysisView } from './components/AnalysisView';
import { CorrectionOverlay } from './components/CorrectionOverlay';
import { ScannerModal } from './components/ScannerModal';
import { InspirationView } from './components/InspirationView';
import { AppState, Consigne, AppView } from './types';
import { analyzeRedaction } from './services/geminiService';
import { FileText, Trash2, Edit3, Camera, FileUp, Sparkles, Wand2, Lightbulb, CheckCircle2, Feather, AlertTriangle, Clock, Type, BarChart3, Beaker, ShieldCheck } from 'lucide-react';

type TipCategory = 'vocabulary' | 'grammar' | 'organization' | 'style' | 'general';

interface Tip {
  text: string;
  category: TipCategory;
}

const TIPS: Tip[] = [
  { text: "Remplace le verbe 'faire' par des verbes plus précis : construire, préparer, cuisiner, rédiger...", category: 'vocabulary' },
  { text: "Évite les répétitions ! Utilise des synonymes ou des pronoms pour désigner tes personnages.", category: 'style' },
  { text: "Utilise des connecteurs logiques comme 'pourtant', 'néanmoins' ou 'ainsi' pour l'agent tes idées.", category: 'organization' },
  { text: "Varie la longueur de tes phrases. Des phrases courtes pour l'action, de plus longues pour la description.", category: 'style' },
  { text: "N'oublie pas l'accord du participe passé avec l'auxiliaire 'être' : il s'accorde avec le sujet.", category: 'grammar' },
  { text: "Relis ton texte à haute voix : si tu manques de souffle, c'est que tes phrases sont trop longues !", category: 'general' },
  { text: "Fais confiance à ton imagination. C'est ton super-pouvoir le plus précieux !", category: 'general' }
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'editor',
    text: '',
    consigne: null,
    analysis: null,
    isAnalyzing: false,
    correctionMode: false,
    isDarkMode: false,
  });

  const [isActivated, setIsActivated] = useState<boolean | null>(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));
  const [tipHistory, setTipHistory] = useState<number[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Vérification de l'activation de la clé au démarrage
  useEffect(() => {
    const checkActivation = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsActivated(hasKey);
      } else {
        // Hors environnement AI Studio, on considère activé si la clé process.env est là
        setIsActivated(!!process.env.API_KEY);
      }
    };
    checkActivation();
  }, []);

  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  const handleActivate = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setIsActivated(true);
    } else {
      setIsActivated(true);
    }
  };

  const setView = (view: AppView) => {
    setState(prev => ({ ...prev, view }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSmartTipIndex = useCallback((analysis: any = null, currentIdx: number, history: number[]) => {
    let poolIndices = TIPS.map((_, i) => i);
    const recentBuffer = history.slice(-5);
    poolIndices = poolIndices.filter(idx => !recentBuffer.includes(idx) && idx !== currentIdx);
    return poolIndices[Math.floor(Math.random() * poolIndices.length)];
  }, []);

  const nextTip = useCallback(() => {
    const nextIdx = getSmartTipIndex(state.analysis, currentTipIndex, tipHistory);
    setCurrentTipIndex(nextIdx);
    setTipHistory(prev => [...prev, nextIdx].slice(-10));
  }, [state.analysis, currentTipIndex, tipHistory, getSmartTipIndex]);

  const toggleDarkMode = () => {
    setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  const handleAnalyze = async () => {
    if (!state.text.trim()) return;
    setErrorMsg(null);
    setState(prev => ({ ...prev, isAnalyzing: true, analysis: null }));
    try {
      const result = await analyzeRedaction(state.text, state.consigne);
      setState(prev => ({ ...prev, analysis: result, isAnalyzing: false }));
      setTimeout(() => {
        const analysisEl = document.getElementById('analysis-results');
        if (analysisEl) analysisEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Oups, LaboStyle a rencontré un problème. Réessaie !");
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const clearText = () => {
    if (confirm("Effacer tout le texte ?")) {
      setState(prev => ({ ...prev, text: '', analysis: null, correctionMode: false }));
      setErrorMsg(null);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setState(prev => ({ ...prev, text: content }));
    };
    reader.readAsText(file);
  };

  const handleScanComplete = (extractedText: string) => {
    setState(prev => ({ ...prev, text: (prev.text + "\n\n" + extractedText).trim() }));
    setShowScanner(false);
  };

  const wordCount = useMemo(() => state.text.trim() ? state.text.trim().split(/\s+/).length : 0, [state.text]);
  const charCount = useMemo(() => state.text.length, [state.text]);
  const readingTime = useMemo(() => Math.ceil(wordCount / 200), [wordCount]);

  const progressData = useMemo(() => {
    let percent = 0;
    let label = "Commence à écrire...";
    if (state.correctionMode) { percent = 100; label = "Perfectionnement en cours !"; }
    else if (state.analysis) { percent = 85; label = "Analyse LaboStyle terminée !"; }
    else if (state.isAnalyzing) { percent = 65; label = "Ta plume est à l'étude..."; }
    else if (wordCount > 0) {
      percent = Math.min(Math.floor((wordCount / 150) * 50), 50);
      label = wordCount < 150 ? "L'inspiration arrive..." : "Prêt pour le bilan LaboStyle !";
    }
    return { percent, label };
  }, [state.text, state.analysis, state.isAnalyzing, state.correctionMode, wordCount]);

  // Écran d'activation (Gate)
  if (isActivated === false) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center">
             <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-6 rotate-3">
                <Beaker className="w-12 h-12 text-white" />
             </div>
             <h1 className="text-4xl font-black text-white font-display tracking-tight mb-2">LaboStyle</h1>
             <p className="text-indigo-300 font-medium">L'atelier intelligent de rédaction</p>
          </div>
          <div className="bg-slate-900/50 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
             <h2 className="text-xl font-bold text-white mb-4">Activation requise</h2>
             <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Pour libérer toute la puissance de ton coach LaboStyle, nous devons activer ton accès sécurisé au Laboratoire.
             </p>
             <button 
                onClick={handleActivate}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-3 group"
             >
                <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Activer mon accès
             </button>
             <p className="text-[10px] text-slate-600 mt-6 uppercase tracking-widest font-black">
                Connexion sécurisée via Gemini API
             </p>
          </div>
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-xs text-indigo-400/50 hover:text-indigo-400 transition-colors">En savoir plus sur la facturation</a>
        </div>
      </div>
    );
  }

  if (isActivated === null) return null; // Chargement silencieux

  return (
    <Layout 
      isDarkMode={state.isDarkMode} 
      onToggleDarkMode={toggleDarkMode}
      currentView={state.view}
      onViewChange={setView}
    >
      {state.view === 'editor' ? (
        <>
          <input type="file" ref={fileInputRef} className="hidden" accept=".txt,.md" onChange={handleFileChange} />

          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className={`text-sm font-black uppercase tracking-widest flex items-center gap-3 ${state.isDarkMode ? 'text-indigo-400' : 'text-indigo-900'}`}>
                {progressData.percent === 100 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${state.isDarkMode ? 'bg-indigo-400' : 'bg-indigo-800'}`}></div>
                )}
                {progressData.label}
              </span>
              <span className={`text-sm font-bold ${state.isDarkMode ? 'text-slate-500' : 'text-indigo-800/60'}`}>
                {progressData.percent}%
              </span>
            </div>
            <div className={`h-3 w-full rounded-full overflow-hidden transition-colors relative ${state.isDarkMode ? 'bg-slate-800' : 'bg-indigo-50 shadow-inner'}`}>
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${progressData.percent === 100 ? 'bg-green-500' : 'bg-indigo-600'}`}
                style={{ width: `${progressData.percent}%` }}
              ></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-9 space-y-10">
              <ConsignePanel 
                activeConsigne={state.consigne}
                onConsigneChange={(c) => setState(prev => ({ ...prev, consigne: c }))}
                isDarkMode={state.isDarkMode}
              />

              <div className={`rounded-3xl shadow-2xl border overflow-hidden ring-1 transition-all relative ${
                state.isDarkMode ? 'bg-slate-900 border-slate-800 ring-slate-800 shadow-black' : 'bg-white border-slate-200 ring-slate-100'
              }`}>
                <div className={`p-6 flex items-center justify-between border-b ${state.isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-indigo-950 border-indigo-950'}`}>
                  <div className="flex items-center gap-4 text-white">
                    <Feather className="w-6 h-6" />
                    <div>
                      <h2 className="font-bold text-xl font-display">Mon Labo</h2>
                      <p className="text-white/40 text-[10px] uppercase font-black">Atelier de rédaction</p>
                    </div>
                  </div>
                  <button onClick={clearText} className="p-2.5 text-white/50 hover:text-white rounded-xl transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="relative">
                  <textarea 
                    value={state.text}
                    onChange={(e) => setState(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Laisse couler ton inspiration..."
                    className={`w-full min-h-[600px] p-10 text-xl leading-relaxed outline-none resize-none font-serif transition-colors bg-transparent ${
                      state.isDarkMode ? 'text-slate-200 placeholder:text-slate-600' : 'text-slate-800 placeholder:text-slate-300'
                    }`}
                  />
                </div>

                <div className={`p-4 border-t flex flex-wrap items-center justify-between gap-4 px-10 ${state.isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                  <div className="flex items-center gap-8 text-xs font-bold">
                    <span><strong className={state.isDarkMode ? 'text-slate-200' : 'text-slate-700'}>{wordCount}</strong> mots</span>
                    <span><strong className={state.isDarkMode ? 'text-slate-200' : 'text-slate-700'}>{charCount}</strong> signes</span>
                    <span>~<strong className={state.isDarkMode ? 'text-slate-200' : 'text-slate-700'}>{readingTime}</strong> min</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${wordCount > 100 ? 'bg-indigo-500/20 text-indigo-500' : 'bg-slate-500/20 text-slate-500'}`}>
                    {wordCount > 100 ? 'Expert' : 'Apprenti'}
                  </span>
                </div>

                {errorMsg && (
                  <div className={`mx-8 mb-4 p-4 rounded-xl border flex items-center gap-3 ${state.isDarkMode ? 'bg-red-900/20 border-red-900/50 text-red-300' : 'bg-red-50 border-red-100 text-red-800'}`}>
                    <AlertTriangle className="w-5 h-5" />
                    <p className="text-sm font-bold">{errorMsg}</p>
                  </div>
                )}

                <div className={`p-8 border-t flex flex-col md:flex-row items-center justify-between gap-8 ${state.isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-4">
                    <button onClick={handleImportClick} className={`flex items-center gap-3 text-sm font-bold px-5 py-3 rounded-xl border transition-all ${state.isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:border-indigo-300'}`}>
                      <FileUp className="w-5 h-5" /> Importer
                    </button>
                    <button onClick={() => setShowScanner(true)} className={`flex items-center gap-3 text-sm font-bold px-5 py-3 rounded-xl border transition-all ${state.isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:border-indigo-300'}`}>
                      <Camera className="w-5 h-5" /> Scanner
                    </button>
                  </div>
                  <button 
                    disabled={!state.text.trim() || state.isAnalyzing}
                    onClick={handleAnalyze}
                    className={`px-12 py-5 rounded-2xl font-black text-lg flex items-center gap-4 transition-all shadow-xl ${
                      state.isAnalyzing ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 scale-105'
                    }`}
                  >
                    {state.isAnalyzing ? <><div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin"></div> Analyse...</> : <><Wand2 className="w-6 h-6" /> Sublimer mon texte</>}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-10">
              <div className={`rounded-3xl p-6 shadow-xl relative overflow-hidden group transition-all ${state.isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-indigo-900 text-white'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center gap-2">💡 Astuce</h3>
                </div>
                <p className="text-sm leading-relaxed min-h-[100px] mb-8 font-medium">"{TIPS[currentTipIndex].text}"</p>
                <button onClick={nextTip} className={`w-full text-xs font-bold py-3 rounded-xl border transition-all ${state.isDarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-white/20 text-white hover:bg-white/30'}`}>Suivant</button>
              </div>
              <DictionaryPanel isDarkMode={state.isDarkMode} />
              <ToolkitPanel isDarkMode={state.isDarkMode} />
            </div>
          </div>

          {state.analysis && (
            <div id="analysis-results" className="mt-20 mb-32 max-w-5xl mx-auto scroll-mt-24">
              <AnalysisView analysis={state.analysis} isDarkMode={state.isDarkMode} onActivateCorrection={() => setState(prev => ({ ...prev, correctionMode: true }))} />
            </div>
          )}

          {state.correctionMode && state.analysis && (
            <CorrectionOverlay annotatedText={state.analysis.annotatedText} isDarkMode={state.isDarkMode} onClose={() => setState(prev => ({ ...prev, correctionMode: false }))} />
          )}

          {showScanner && (
            <ScannerModal onClose={() => setShowScanner(false)} onScanComplete={handleScanComplete} isDarkMode={state.isDarkMode} />
          )}
        </>
      ) : (
        <InspirationView isDarkMode={state.isDarkMode} onBack={() => setView('editor')} />
      )}
    </Layout>
  );
};

export default App;
