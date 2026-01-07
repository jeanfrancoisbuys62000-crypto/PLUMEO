
import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { CheckCircle2, AlertCircle, Lightbulb, GraduationCap, Layout as LayoutIcon, Type, Book, Sparkle, Target, Copy, Check } from 'lucide-react';

interface AnalysisViewProps {
  analysis: AnalysisResult;
  onActivateCorrection: () => void;
  isDarkMode?: boolean;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ analysis, onActivateCorrection, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'globale' | 'points' | 'conseils'>('globale');
  const [copied, setCopied] = useState(false);

  // Seuils ajustés pour une note sur 40 (32/40 = 8/10, 24/40 = 6/10)
  const scoreColor = analysis.score >= 32 ? 'text-green-600' : analysis.score >= 24 ? 'text-indigo-600' : 'text-orange-500';
  const scoreBg = analysis.score >= 32 ? 'bg-green-50' : analysis.score >= 24 ? 'bg-indigo-50' : 'bg-orange-50';
  
  const scoreColorDark = analysis.score >= 32 ? 'text-green-400' : analysis.score >= 24 ? 'text-indigo-400' : 'text-orange-400';
  const scoreBgDark = analysis.score >= 32 ? 'bg-green-500/20' : analysis.score >= 24 ? 'bg-indigo-500/20' : 'bg-orange-500/20';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(analysis.annotatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie :', err);
    }
  };

  return (
    <div className={`rounded-2xl shadow-xl border overflow-hidden animate-in fade-in zoom-in-95 duration-500 transition-colors ${
      isDarkMode ? 'bg-slate-900 border-slate-800 shadow-black' : 'bg-white border-slate-200'
    }`}>
      <div className={`${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-600'} p-6 text-white flex items-center justify-between transition-colors`}>
        <div>
          <h2 className="text-2xl font-bold font-display">Ton bilan pédagogique</h2>
          <p className={`${isDarkMode ? 'text-indigo-300' : 'text-indigo-100'} mt-1`}>Bravo pour tes efforts ! Découvre comment t'améliorer.</p>
        </div>
        <div className={`${isDarkMode ? scoreBgDark : scoreBg} w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-inner transition-colors`}>
          <span className={`text-3xl font-black ${isDarkMode ? scoreColorDark : scoreColor}`}>{analysis.score}</span>
          <span className={`text-[10px] font-bold uppercase ${isDarkMode ? scoreColorDark : scoreColor}/60`}>/ 40</span>
        </div>
      </div>

      <div className={`flex border-b transition-colors ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
        <TabButton 
          active={activeTab === 'globale'} 
          onClick={() => setActiveTab('globale')} 
          label="Évaluation globale" 
          isDarkMode={isDarkMode} 
        />
        <TabButton 
          active={activeTab === 'points'} 
          onClick={() => setActiveTab('points')} 
          label="Points forts & progrès" 
          isDarkMode={isDarkMode} 
        />
        <TabButton 
          active={activeTab === 'conseils'} 
          onClick={() => setActiveTab('conseils')} 
          label="Mes conseils" 
          isDarkMode={isDarkMode} 
        />
      </div>

      <div className="p-8">
        {activeTab === 'globale' && (
          <div className="space-y-6">
            <div className={`rounded-xl p-5 border italic relative transition-colors ${
              isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-700'
            }`}>
              <span className={`absolute -top-3 left-4 px-2 text-xs font-bold uppercase tracking-widest border rounded-full transition-colors ${
                isDarkMode ? 'bg-slate-900 text-indigo-400 border-slate-700' : 'bg-white text-indigo-500 border-slate-200'
              }`}>
                Le mot du coach
              </span>
              "{analysis.summary}"
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border transition-colors ${
                isDarkMode ? 'border-green-900 bg-green-900/10' : 'border-green-100 bg-green-50/30'
              }`}>
                <h4 className={`font-bold flex items-center gap-2 mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                  <CheckCircle2 className="w-4 h-4" /> Ce qui est réussi
                </h4>
                <ul className="space-y-2">
                  {analysis.strengths.slice(0, 2).map((s, i) => (
                    <li key={i} className={`text-sm flex items-start gap-2 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      <span className="text-green-500 mt-1">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`p-4 rounded-xl border transition-colors ${
                isDarkMode ? 'border-orange-900 bg-orange-900/10' : 'border-orange-100 bg-orange-50/30'
              }`}>
                <h4 className={`font-bold flex items-center gap-2 mb-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-700'}`}>
                  <AlertCircle className="w-4 h-4" /> À surveiller
                </h4>
                <ul className="space-y-2">
                  {analysis.improvements.slice(0, 2).map((s, i) => (
                    <li key={i} className={`text-sm flex items-start gap-2 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      <span className="text-orange-500 mt-1">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'points' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                <Sparkle className="w-4 h-4 text-yellow-400" /> Tes succès
              </h3>
              <ul className="space-y-3">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className={`border p-3 rounded-xl shadow-sm flex items-start gap-3 transition-colors ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-100 text-slate-700'
                  }`}>
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                    }`}>✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                <Target className={`w-4 h-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} /> Tes prochains défis
              </h3>
              <ul className="space-y-3">
                {analysis.improvements.map((s, i) => (
                  <li key={i} className={`border p-3 rounded-xl shadow-sm flex items-start gap-3 transition-colors ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-100 text-slate-700'
                  }`}>
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
                    }`}>!</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'conseils' && (
          <div className="grid md:grid-cols-2 gap-4">
            <AdviceCard icon={<LayoutIcon className="w-5 h-5"/>} title="Organisation" text={analysis.advice.organization} color="blue" isDarkMode={isDarkMode} />
            <AdviceCard icon={<Book className="w-5 h-5"/>} title="Vocabulaire" text={analysis.advice.vocabulary} color="teal" isDarkMode={isDarkMode} />
            <AdviceCard icon={<Type className="w-5 h-5"/>} title="Grammaire" text={analysis.advice.grammar} color="purple" isDarkMode={isDarkMode} />
            <AdviceCard icon={<GraduationCap className="w-5 h-5"/>} title="Style & Ton" text={analysis.advice.style} color="indigo" isDarkMode={isDarkMode} />
          </div>
        )}
      </div>

      <div className={`p-6 border-t flex flex-col md:flex-row items-center justify-between gap-4 transition-colors ${
        isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
            <Lightbulb className={`w-6 h-6 animate-pulse transition-colors ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </div>
          <div>
            <p className={`text-sm font-bold leading-tight transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Envie de repérer tes erreurs ?</p>
            <p className={`text-xs transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Le coach t'aide à les trouver toi-même !</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleCopy}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-2 ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-slate-600' 
                : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50'
            }`}
            title="Copier le texte annoté"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copié !' : 'Copier le texte'}
          </button>
          <button 
            onClick={onActivateCorrection}
            className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 group ${
              isDarkMode 
                ? 'bg-indigo-500 text-white shadow-indigo-950/20 hover:bg-indigo-600' 
                : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'
            }`}
          >
            Correction Autonome
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, label, isDarkMode }: { active: boolean, onClick: () => void, label: string, isDarkMode?: boolean }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${
      active 
        ? (isDarkMode ? 'text-indigo-400 border-indigo-400 bg-slate-900' : 'text-indigo-600 border-indigo-600 bg-white')
        : (isDarkMode ? 'text-slate-500 border-transparent hover:text-slate-300' : 'text-slate-500 border-transparent hover:text-slate-700')
    }`}
  >
    {label}
  </button>
);

const AdviceCard = ({ icon, title, text, color, isDarkMode }: { icon: React.ReactNode, title: string, text: string, color: string, isDarkMode?: boolean }) => {
  const colors: Record<string, string> = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    teal: "text-teal-600 bg-teal-50 border-teal-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100"
  };
  const colorsDark: Record<string, string> = {
    blue: "text-blue-400 bg-blue-900/20 border-blue-900/40",
    teal: "text-teal-400 bg-teal-900/20 border-teal-900/40",
    purple: "text-purple-400 bg-purple-900/20 border-purple-900/40",
    indigo: "text-indigo-400 bg-indigo-900/20 border-indigo-900/40"
  };
  
  return (
    <div className={`p-4 rounded-xl border flex gap-4 transition-colors ${
      isDarkMode ? (colorsDark[color] || colorsDark.indigo) : (colors[color] || colors.indigo)
    }`}>
      <div className="mt-1">{icon}</div>
      <div>
        <h4 className="font-bold text-sm mb-1">{title}</h4>
        <p className={`text-xs leading-relaxed transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{text}</p>
      </div>
    </div>
  );
};
