
import React, { useState, useEffect } from 'react';
import { Consigne, GradeLevel } from '../types';
import { generateConsigne } from '../services/geminiService';
import { Sparkles, BookOpen, Target, PenLine } from 'lucide-react';

interface ConsignePanelProps {
  onConsigneChange: (c: Consigne) => void;
  activeConsigne: Consigne | null;
  isDarkMode?: boolean;
}

export const ConsignePanel: React.FC<ConsignePanelProps> = ({ onConsigneChange, activeConsigne, isDarkMode }) => {
  const [showGenerator, setShowGenerator] = useState(false);
  const [grade, setGrade] = useState<GradeLevel>('6ème');
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [manualText, setManualText] = useState('');

  // Sincronise l'input manuel si une consigne externe est chargée (optionnel)
  useEffect(() => {
    if (activeConsigne && activeConsigne.title === "Consigne personnalisée") {
      setManualText(activeConsigne.description);
    }
  }, [activeConsigne]);

  const handleGenerate = async () => {
    if (!theme) return;
    setLoading(true);
    try {
      const c = await generateConsigne(grade, theme);
      onConsigneChange(c);
      setShowGenerator(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualChange = (val: string) => {
    setManualText(val);
    if (val.trim()) {
      onConsigneChange({
        title: "Consigne personnalisée",
        description: val,
        gradeLevel: grade,
        type: 'narratif'
      });
    } else {
      // Si on vide tout, on peut considérer qu'il n'y a plus de consigne active
      // @ts-ignore
      onConsigneChange(null as any);
    }
  };

  return (
    <div className={`rounded-2xl shadow-sm border overflow-hidden transition-colors ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div className={`p-5 flex items-center justify-between border-b ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-indigo-900 border-indigo-950 text-white'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-bold font-display">Mon Sujet LaboStyle</h2>
        </div>
        <button 
          onClick={() => setShowGenerator(!showGenerator)}
          className={`text-sm font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 bg-white/10 text-white hover:bg-white/20 border border-white/20`}
        >
          <Sparkles className="w-4 h-4" />
          Générer un scénario
        </button>
      </div>

      <div className="p-6">
        {showGenerator ? (
          <div className={`space-y-4 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'
          }`}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Niveau</label>
                <select 
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as GradeLevel)}
                  className={`w-full rounded-lg border text-sm p-2 outline-none focus:ring-2 transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-900 border-slate-700 text-slate-200 focus:ring-indigo-500' 
                      : 'bg-white border-slate-200 focus:ring-indigo-500'
                  }`}
                >
                  <option value="6ème">6ème</option>
                  <option value="5ème">5ème</option>
                  <option value="4ème">4ème</option>
                  <option value="3ème">3ème</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Thème</label>
                <input 
                  type="text"
                  placeholder="Ex: Le fantastique..."
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className={`w-full rounded-lg border text-sm p-2 outline-none focus:ring-2 transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-900 border-slate-700 text-slate-200 focus:ring-indigo-500 placeholder:text-slate-600' 
                      : 'bg-white border-slate-200 focus:ring-indigo-500'
                  }`}
                />
              </div>
            </div>
            <button 
              disabled={loading}
              onClick={handleGenerate}
              className="w-full py-2 rounded-lg text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Génération...' : 'Créer mon sujet'}
            </button>
          </div>
        ) : activeConsigne && activeConsigne.title !== "Consigne personnalisée" ? (
          <div className={`p-4 rounded-xl border transition-colors ${
            isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50/50 border-indigo-100'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                <Target className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block ${
                  isDarkMode ? 'bg-indigo-500/30 text-indigo-200' : 'bg-indigo-200 text-indigo-700'
                }`}>
                  {activeConsigne.gradeLevel} • {activeConsigne.type}
                </span>
                <h3 className={`font-bold leading-tight mb-1 transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  {activeConsigne.title}
                </h3>
                <p className={`text-sm line-clamp-2 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {activeConsigne.description}
                </p>
                <button 
                  onClick={() => { setManualText(''); onConsigneChange(null as any); }}
                  className="mt-2 text-[10px] font-bold text-indigo-500 hover:underline"
                >
                  Changer pour une saisie manuelle
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={`relative group p-1 rounded-xl border-2 border-dashed transition-all ${
            isDarkMode 
              ? 'border-slate-800 bg-slate-900/40 hover:border-slate-700' 
              : 'border-slate-200 bg-slate-50/50 hover:border-indigo-200 hover:bg-white'
          }`}>
            <div className="absolute top-3 left-3 pointer-events-none opacity-20 group-focus-within:opacity-0 transition-opacity">
               <PenLine className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-indigo-900'}`} />
            </div>
            <textarea
              value={manualText}
              onChange={(e) => handleManualChange(e.target.value)}
              placeholder="Indique ici tes consignes ou les critères à travailler. L'IA les utilisera pour analyser ton texte (ex: 'Récit fantastique, utiliser l'imparfait')..."
              className={`w-full min-h-[100px] p-3 pl-10 bg-transparent outline-none resize-none text-sm leading-relaxed transition-colors ${
                isDarkMode ? 'text-slate-300 placeholder:text-slate-600' : 'text-slate-700 placeholder:text-slate-400 font-medium'
              }`}
            />
            {manualText && (
               <div className="absolute bottom-2 right-2 flex items-center gap-1">
                  <span className="text-[9px] font-black uppercase text-indigo-500/50">Consigne Manuelle Active</span>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
