
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
import { FileText, Trash2, Edit3, Camera, FileUp, Sparkles, Wand2, Lightbulb, CheckCircle2, Feather } from 'lucide-react';

type TipCategory = 'vocabulary' | 'grammar' | 'organization' | 'style' | 'general';

interface Tip {
  text: string;
  category: TipCategory;
}

const TIPS: Tip[] = [
  { text: "Remplace le verbe 'faire' par des verbes plus précis : construire, préparer, cuisiner, rédiger...", category: 'vocabulary' },
  { text: "Évite les répétitions ! Utilise des synonymes ou des pronoms pour désigner tes personnages.", category: 'style' },
  { text: "Utilise des connecteurs logiques comme 'pourtant', 'néanmoins' ou 'ainsi' pour lier tes idées.", category: 'organization' },
  { text: "Varie la longueur de tes phrases. Des phrases courtes pour l'action, de plus longues pour la description.", category: 'style' },
  { text: "N'oublie pas l'accord du participe passé avec l'auxiliaire 'être' : il s'accorde avec le sujet.", category: 'grammar' },
  { text: "Avec l'auxiliaire 'avoir', le participe passé ne s'accorde jamais avec le sujet, mais avec le COD s'il est placé avant.", category: 'grammar' },
  { text: "La ponctuation est ton amie. Elle donne du rythme et aide le lecteur à respirer.", category: 'style' },
  { text: "Accroche ton lecteur dès les premières lignes avec une question ou une image forte.", category: 'style' },
  { text: "Décris ce que tes personnages ressentent : pas seulement ce qu'ils voient, mais aussi ce qu'ils entendent ou sentent.", category: 'style' },
  { text: "Utilise des métaphores pour transformer une idée abstraite en image concrète.", category: 'style' },
  { text: "Relis ton texte à haute voix : si tu manques de souffle, c'est que tes phrases sont trop longues !", category: 'general' },
  { text: "Mémorise l'orthographe des mots 'invariables' : toujours, déjà, bientôt, parfois, souvent.", category: 'grammar' },
  { text: "Pour savoir s'il faut écrire -é ou -er, remplace le verbe par 'vendre'. Si on peut dire 'vendu', c'est -é.", category: 'grammar' },
  { text: "Dans un récit au passé, utilise l'imparfait pour le décor et le passé simple pour les actions soudaines.", category: 'grammar' },
  { text: "Donne de la personnalité à tes personnages par un détail unique : une cicatrice, un tic de langage, un chapeau...", category: 'style' },
  { text: "Évite les clichés comme 'une peur bleue' ou 'un froid de canard'. Essaie d'inventer tes propres expressions.", category: 'style' },
  { text: "Les adverbes en '-ment' sont utiles, mais n'en abuse pas. Un bon verbe est souvent plus puissant.", category: 'vocabulary' },
  { text: "Soigne ta conclusion. Elle doit répondre aux attentes du lecteur ou ouvrir sur un nouvel horizon.", category: 'organization' },
  { text: "Fais toujours un plan au brouillon. C'est la boussole qui t'empêchera de te perdre en chemin.", category: 'organization' },
  { text: "Le dictionnaire n'est pas ton ennemi. En cas de doute, vérifie l'orthographe ou le sens d'un mot.", category: 'general' },
  { text: "Le point d'exclamation est comme une épice : un peu suffit, trop gâche tout le plat !", category: 'style' },
  { text: "Les dialogues rendent ton récit vivant. Utilise-les pour montrer le caractère de tes personnages.", category: 'style' },
  { text: "Vérifie les homophones : a (verbe) / à (préposition), ou (choix) / où (lieu), ce (démonstratif) / se (pronom).", category: 'grammar' },
  { text: "Lis régulièrement ! C'est la meilleure façon d'enrichir ton vocabulaire sans t'en rendre compte.", category: 'general' },
  { text: "Cherche l'adjectif exact. Au lieu de 'beau', utilise 'majestueux', 'splendide' ou 'radieux'.", category: 'vocabulary' },
  { text: "Évite les pléonasmes : ne dis pas 'monter en haut' ou 'prévoir d'avance'.", category: 'style' },
  { text: "Une copie propre et bien présentée donne tout de suite une meilleure impression au correcteur.", category: 'general' },
  { text: "Le présent de narration peut donner un sentiment d'urgence et d'immédiateté à tes scènes d'action.", category: 'style' },
  { text: "Fais une pause de 5 minutes après avoir fini d'écrire avant de te relancer dans la relecture finale.", category: 'general' },
  { text: "Si tu bloques, ferme les yeux et imagine la scène comme un film dans ta tête.", category: 'general' },
  { text: "Repère les 'mots béquilles' comme 'puis', 'ensuite', 'alors'. Remplace-les par des transitions plus fluides.", category: 'organization' },
  { text: "Crée des champs lexicaux riches pour tes descriptions : par exemple, tout le vocabulaire de la mer.", category: 'vocabulary' },
  { text: "N'oublie pas la cédille sous le 'c' devant 'a', 'o', 'u' pour garder le son [s] (comme dans 'garçon').", category: 'grammar' },
  { text: "Attention au pluriel des noms composés : souvent, seuls le nom et l'adjectif prennent la marque du pluriel.", category: 'grammar' },
  { text: "Utilise des comparaisons originales : 'ses yeux brillaient comme...' (évite 'des étoiles').", category: 'style' },
  { text: "La concordance des temps est essentielle pour que ton récit reste logique et compréhensible.", category: 'grammar' },
  { text: "Bannis le langage SMS de tes rédactions, même pour les dialogues (sauf si c'est l'effet recherché !).", category: 'style' },
  { text: "Varie les verbes de parole : ne te contente pas de 'dit-il'. Utilise 'chuchota-t-il', 'répliqua-t-elle'...", category: 'vocabulary' },
  { text: "Ne dis pas que ton personnage a peur, montre ses mains qui tremblent et son cœur qui bat.", category: 'style' },
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

  const [currentTipIndex, setCurrentTipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));
  const [tipHistory, setTipHistory] = useState<number[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  const setView = (view: AppView) => {
    setState(prev => ({ ...prev, view }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSmartTipIndex = useCallback((analysis: any = null, currentIdx: number, history: number[]) => {
    let poolIndices = TIPS.map((_, i) => i);
    const recentBuffer = history.slice(-5);
    poolIndices = poolIndices.filter(idx => !recentBuffer.includes(idx) && idx !== currentIdx);

    if (analysis) {
      const improvementsStr = (analysis.improvements || []).join(' ').toLowerCase();
      const needsHelp = {
        grammar: improvementsStr.includes('grammaire') || improvementsStr.includes('orthographe') || improvementsStr.includes('conjugaison'),
        vocabulary: improvementsStr.includes('vocabulaire') || improvementsStr.includes('mots') || improvementsStr.includes('précis'),
        organization: improvementsStr.includes('organisation') || improvementsStr.includes('structure') || improvementsStr.includes('connecteur'),
        style: improvementsStr.includes('style') || improvementsStr.includes('répétition') || improvementsStr.includes('rythme')
      };

      const prioritizedCategories: TipCategory[] = [];
      if (needsHelp.grammar) prioritizedCategories.push('grammar');
      if (needsHelp.vocabulary) prioritizedCategories.push('vocabulary');
      if (needsHelp.organization) prioritizedCategories.push('organization');
      if (needsHelp.style) prioritizedCategories.push('style');

      if (prioritizedCategories.length > 0) {
        const matchingIndices = poolIndices.filter(idx => prioritizedCategories.includes(TIPS[idx].category));
        if (matchingIndices.length > 0 && Math.random() > 0.2) {
          poolIndices = matchingIndices;
        }
      }
    }

    if (poolIndices.length === 0) poolIndices = TIPS.map((_, i) => i).filter(idx => idx !== currentIdx);
    return poolIndices[Math.floor(Math.random() * poolIndices.length)];
  }, []);

  const nextTip = useCallback(() => {
    const nextIdx = getSmartTipIndex(state.analysis, currentTipIndex, tipHistory);
    setCurrentTipIndex(nextIdx);
    setTipHistory(prev => [...prev, nextIdx].slice(-10));
  }, [state.analysis, currentTipIndex, tipHistory, getSmartTipIndex]);

  useEffect(() => {
    if (state.analysis) {
      const nextIdx = getSmartTipIndex(state.analysis, currentTipIndex, tipHistory);
      setCurrentTipIndex(nextIdx);
    }
  }, [state.analysis]);

  const toggleDarkMode = () => {
    setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  const handleAnalyze = async () => {
    if (!state.text.trim()) return;
    setState(prev => ({ ...prev, isAnalyzing: true, analysis: null }));
    try {
      const result = await analyzeRedaction(state.text, state.consigne);
      setState(prev => ({ ...prev, analysis: result, isAnalyzing: false }));
      setTimeout(() => {
        const analysisEl = document.getElementById('analysis-results');
        if (analysisEl) analysisEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const clearText = () => {
    if (confirm("Effacer tout le texte ?")) {
      setState(prev => ({ ...prev, text: '', analysis: null, correctionMode: false }));
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
      if (state.text.trim() && !confirm("Remplacer ton texte actuel par le contenu du fichier ?")) {
        setState(prev => ({ ...prev, text: prev.text + "\n\n" + content }));
      } else {
        setState(prev => ({ ...prev, text: content }));
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleScanComplete = (extractedText: string) => {
    if (state.text.trim() && !confirm("Ajouter le texte scanné à ton texte actuel ? (Annuler pour remplacer)")) {
      setState(prev => ({ ...prev, text: extractedText }));
    } else {
      setState(prev => ({ ...prev, text: (prev.text + "\n\n" + extractedText).trim() }));
    }
    setShowScanner(false);
  };

  const progressData = useMemo(() => {
    let percent = 0;
    let label = "Commence à écrire...";
    const wordCount = state.text.trim() ? state.text.trim().split(/\s+/).length : 0;
    
    if (state.correctionMode) {
      percent = 100;
      label = "Perfectionnement en cours !";
    } else if (state.analysis) {
      percent = 85;
      label = "Analyse Pluméo terminée !";
    } else if (state.isAnalyzing) {
      percent = 65;
      label = "Ta plume est à l'étude...";
    } else if (wordCount > 0) {
      percent = Math.min(Math.floor((wordCount / 150) * 50), 50);
      label = wordCount < 150 ? "L'inspiration arrive..." : "Prêt pour le bilan Pluméo !";
    }

    return { percent, label };
  }, [state.text, state.analysis, state.isAnalyzing, state.correctionMode]);

  return (
    <Layout 
      isDarkMode={state.isDarkMode} 
      onToggleDarkMode={toggleDarkMode}
      currentView={state.view}
      onViewChange={setView}
    >
      {state.view === 'editor' ? (
        <>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".txt,.md" 
            onChange={handleFileChange} 
          />

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
            <div className={`h-3 w-full rounded-full overflow-hidden transition-colors relative ${state.isDarkMode ? 'bg-slate-800' : 'bg-indigo-50 shadow-inner shadow-indigo-100/50'}`}>
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
                  progressData.percent === 100 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                    : 'bg-gradient-to-r from-indigo-900 via-indigo-700 to-blue-800 shadow-[0_0_10px_rgba(30,58,138,0.2)]'
                }`}
                style={{ width: `${progressData.percent}%` }}
              >
                <div className="absolute inset-0 bg-white/10 w-full h-1/2 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-9 space-y-10">
              <ConsignePanel 
                activeConsigne={state.consigne}
                onConsigneChange={(c) => setState(prev => ({ ...prev, consigne: c }))}
                isDarkMode={state.isDarkMode}
              />

              <div className={`rounded-3xl shadow-2xl border overflow-hidden ring-1 transition-all ${
                state.isDarkMode 
                  ? 'bg-slate-900 border-slate-800 ring-slate-800 shadow-black' 
                  : 'bg-white border-slate-200 ring-slate-100 shadow-indigo-100/30'
              }`}>
                <div className={`p-6 flex items-center justify-between border-b ${state.isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-indigo-950 border-indigo-950'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <Feather className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white text-xl font-display uppercase tracking-tight">Ma Plume</h2>
                      <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Atelier de rédaction</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={clearText}
                      className="p-2.5 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                      title="Effacer tout"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className={`relative transition-colors ${state.isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                  <div className={`absolute left-12 top-0 bottom-0 w-[1px] hidden md:block ${state.isDarkMode ? 'bg-white/5' : 'bg-indigo-100/50'}`}></div>
                  <textarea 
                    value={state.text}
                    onChange={(e) => setState(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Laisse couler ton inspiration sur cette page Pluméo..."
                    className={`w-full min-h-[650px] p-10 md:pl-20 text-xl leading-relaxed outline-none resize-none font-serif placeholder:italic transition-colors bg-transparent relative z-10 ${
                      state.isDarkMode ? 'text-slate-200 placeholder:text-slate-600' : 'text-slate-800 placeholder:text-slate-300'
                    }`}
                  />
                  {!state.text && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${state.isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <FileText className={`w-12 h-12 ${state.isDarkMode ? 'text-slate-600' : 'text-slate-200'}`} />
                      </div>
                      <p className={`${state.isDarkMode ? 'text-slate-500' : 'text-indigo-200'} font-bold text-lg text-center`}>Ta plume n'attend que toi.</p>
                    </div>
                  )}
                </div>

                <div className={`p-8 border-t flex flex-col md:flex-row items-center justify-between gap-8 transition-colors ${
                  state.isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-4">
                    <button 
                        onClick={handleImportClick}
                        className={`flex items-center gap-3 text-sm font-bold px-5 py-3 rounded-xl border transition-all shadow-sm ${
                      state.isDarkMode 
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-800'
                    }`}>
                      <FileUp className="w-5 h-5" /> Importer
                    </button>
                    <button 
                      onClick={() => setShowScanner(true)}
                      className={`flex items-center gap-3 text-sm font-bold px-5 py-3 rounded-xl border transition-all shadow-sm ${
                      state.isDarkMode 
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-800'
                    }`}>
                      <Camera className="w-5 h-5" /> Scanner
                    </button>
                  </div>
                  <button 
                    disabled={!state.text.trim() || state.isAnalyzing}
                    onClick={handleAnalyze}
                    className={`
                      w-full md:w-auto px-12 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-4 transition-all shadow-xl
                      ${state.isAnalyzing 
                        ? (state.isDarkMode ? 'bg-slate-800 text-slate-600' : 'bg-slate-200 text-slate-400') + ' cursor-not-allowed shadow-none' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-900/20 hover:-translate-y-1 active:translate-y-0 scale-105'
                      }
                    `}
                  >
                    {state.isAnalyzing ? (
                      <>
                        <div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin"></div>
                        Analyse Pluméo...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-6 h-6" />
                        Sublimer mon texte
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-10">
              <div className={`rounded-3xl p-6 shadow-xl relative overflow-hidden group transition-all animate-in fade-in slide-in-from-right-4 duration-500 ${
                state.isDarkMode 
                  ? 'bg-gradient-to-br from-indigo-900 via-slate-900 to-black border border-slate-800 shadow-black' 
                  : 'bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white shadow-indigo-100'
              }`}>
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h3 className={`font-bold text-lg flex items-center gap-2 ${state.isDarkMode ? 'text-indigo-400' : 'text-white'}`}>
                    <span className="text-amber-300">💡</span> Astuce
                  </h3>
                  <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
                    state.isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/20 text-indigo-100'
                  }`}>
                    {TIPS[currentTipIndex].category === 'grammar' ? 'Langue' : 
                    TIPS[currentTipIndex].category === 'vocabulary' ? 'Lexique' : 
                    TIPS[currentTipIndex].category === 'organization' ? 'Structure' : 'Conseil'}
                  </span>
                </div>

                <p className={`text-sm leading-relaxed min-h-[100px] mb-8 relative z-10 font-medium ${state.isDarkMode ? 'text-slate-300' : 'text-indigo-50'}`}>
                  "{TIPS[currentTipIndex].text}"
                </p>
                
                <button 
                  onClick={nextTip}
                  className={`w-full text-xs font-bold py-3 rounded-xl transition-all border relative z-10 ${
                  state.isDarkMode 
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20' 
                    : 'bg-white/20 text-white border-white/20 hover:bg-white/30'
                }`}>
                  Suivant
                </button>
              </div>

              <DictionaryPanel isDarkMode={state.isDarkMode} />
              <ToolkitPanel isDarkMode={state.isDarkMode} />

              <div className={`rounded-3xl shadow-lg border p-8 transition-colors ${
                state.isDarkMode 
                  ? 'bg-slate-900 border-slate-800 shadow-black' 
                  : 'bg-white border-slate-200 shadow-indigo-50/30'
              }`}>
                <h3 className={`font-bold mb-6 flex items-center gap-2 font-display ${state.isDarkMode ? 'text-slate-200' : 'text-indigo-950'}`}>
                  <Lightbulb className="w-5 h-5 text-amber-500" /> Guide Pluméo
                </h3>
                <div className="space-y-6">
                  <MethodItem number="1" title="Sujet" desc="Prépare ton voyage littéraire." isDarkMode={state.isDarkMode} />
                  <MethodItem number="2" title="Écriture" desc="Ta plume prend son envol." isDarkMode={state.isDarkMode} />
                  <MethodItem number="3" title="Bilan" desc="L'IA sublime ton style." isDarkMode={state.isDarkMode} />
                  <MethodItem number="4" title="Perfection" desc="Deviens un auteur accompli." isDarkMode={state.isDarkMode} />
                </div>
              </div>
            </div>
          </div>

          {state.analysis && (
            <div id="analysis-results" className="mt-20 mb-32 max-w-5xl mx-auto scroll-mt-24">
              <AnalysisView 
                analysis={state.analysis} 
                isDarkMode={state.isDarkMode}
                onActivateCorrection={() => setState(prev => ({ ...prev, correctionMode: true }))}
              />
            </div>
          )}

          {state.correctionMode && state.analysis && (
            <CorrectionOverlay 
              annotatedText={state.analysis.annotatedText}
              isDarkMode={state.isDarkMode}
              onClose={() => setState(prev => ({ ...prev, correctionMode: false }))}
            />
          )}

          {showScanner && (
            <ScannerModal 
              onClose={() => setShowScanner(false)} 
              onScanComplete={handleScanComplete}
              isDarkMode={state.isDarkMode}
            />
          )}
        </>
      ) : (
        <InspirationView 
          isDarkMode={state.isDarkMode} 
          onBack={() => setView('editor')} 
        />
      )}
    </Layout>
  );
};

const MethodItem = ({ number, title, desc, isDarkMode }: { number: string, title: string, desc: string, isDarkMode: boolean }) => (
  <div className="flex gap-4 group">
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-slate-800 text-indigo-400 group-hover:bg-indigo-800 group-hover:text-white' 
        : 'bg-indigo-50 text-indigo-800 group-hover:bg-indigo-800 group-hover:text-white'
    }`}>
      {number}
    </div>
    <div>
      <h4 className={`text-sm font-bold leading-tight mb-1 transition-colors ${isDarkMode ? 'text-slate-200' : 'text-indigo-950'}`}>{title}</h4>
      <p className={`text-[10px] leading-relaxed ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{desc}</p>
    </div>
  </div>
);

export default App;
