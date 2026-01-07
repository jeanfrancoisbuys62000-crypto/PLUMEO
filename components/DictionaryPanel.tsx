
import React, { useState } from 'react';
import { Search, Book, Repeat, Loader2, ExternalLink, X } from 'lucide-react';
import { getLexicalInfo } from '../services/geminiService';

interface DictionaryPanelProps {
  isDarkMode?: boolean;
}

export const DictionaryPanel: React.FC<DictionaryPanelProps> = ({ isDarkMode }) => {
  const [word, setWord] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [type, setType] = useState<'definition' | 'synonymes'>('definition');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!word.trim()) return;
    
    setLoading(true);
    setResult(null);
    try {
      const info = await getLexicalInfo(word.trim(), type);
      setResult(info);
    } catch (err) {
      setResult("Erreur lors de la recherche. Réessaie plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`rounded-3xl shadow-lg border p-6 transition-all ${
      isDarkMode ? 'bg-slate-900 border-slate-800 shadow-black' : 'bg-white border-slate-200 shadow-blue-50/50'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-bold flex items-center gap-2 font-display ${isDarkMode ? 'text-slate-200' : 'text-blue-950'}`}>
          <Search className="w-5 h-5 text-indigo-500" /> Aide Lexicale
        </h3>
      </div>

      <form onSubmit={handleSearch} className="space-y-3">
        <div className="relative">
          <input 
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Chercher un mot..."
            className={`w-full py-2.5 pl-4 pr-10 rounded-xl border text-sm outline-none transition-all ${
              isDarkMode 
                ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' 
                : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400'
            }`}
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-indigo-500/10 text-indigo-500 transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => setType('definition')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
              type === 'definition'
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : (isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')
            }`}
          >
            <Book className="w-3 h-3" /> Définition
          </button>
          <button 
            type="button"
            onClick={() => setType('synonymes')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
              type === 'synonymes'
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : (isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')
            }`}
          >
            <Repeat className="w-3 h-3" /> Synonymes
          </button>
        </div>
      </form>

      {result && (
        <div className={`mt-4 p-4 rounded-xl border relative animate-in fade-in slide-in-from-top-2 ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-indigo-50/30 border-indigo-100'
        }`}>
          <button 
            onClick={() => setResult(null)}
            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3 h-3" />
          </button>
          <div className={`text-xs leading-relaxed max-h-40 overflow-y-auto pr-2 custom-scrollbar ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            {result}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 flex flex-wrap gap-x-4 gap-y-2">
        <a 
          href={`https://www.cnrtl.fr/definition/${word}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 flex items-center gap-1 transition-colors"
        >
          CNRTL <ExternalLink className="w-2.5 h-2.5" />
        </a>
        <a 
          href={`https://www.larousse.fr/dictionnaires/francais/${word}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 flex items-center gap-1 transition-colors"
        >
          Larousse <ExternalLink className="w-2.5 h-2.5" />
        </a>
        <a 
          href={`https://www.cnrtl.fr/synonymie/${word}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 flex items-center gap-1 transition-colors"
        >
          Synonymes <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );
};
