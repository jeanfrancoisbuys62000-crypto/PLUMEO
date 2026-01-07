
import React, { useState, useMemo } from 'react';
import { HelpCircle, X, CheckCircle } from 'lucide-react';

interface CorrectionOverlayProps {
  annotatedText: string;
  onClose: () => void;
  isDarkMode?: boolean;
}

interface ParsedPart {
  type: 'text' | 'error';
  content: string;
  errorType?: 'grammar' | 'lexical';
  hint?: string;
  guidance?: string;
}

export const CorrectionOverlay: React.FC<CorrectionOverlayProps> = ({ annotatedText, onClose, isDarkMode }) => {
  const [selectedError, setSelectedError] = useState<ParsedPart | null>(null);

  // Simple parser for the <error> tags
  const parts = useMemo(() => {
    const result: ParsedPart[] = [];
    let remaining = annotatedText;
    const regex = /<error type="(.*?)" hint="(.*?)" guidance="(.*?)">(.*?)<\/error>/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(annotatedText)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        result.push({ type: 'text', content: annotatedText.substring(lastIndex, match.index) });
      }
      // Add error part
      result.push({
        type: 'error',
        errorType: match[1] as 'grammar' | 'lexical',
        hint: match[2],
        guidance: match[3],
        content: match[4]
      });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < annotatedText.length) {
      result.push({ type: 'text', content: annotatedText.substring(lastIndex) });
    }

    return result;
  }, [annotatedText]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-colors ${
      isDarkMode ? 'bg-black/60' : 'bg-slate-900/40'
    }`}>
      <div className={`w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 transition-colors ${
        isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'
      }`}>
        <div className={`border-b p-4 flex items-center justify-between transition-colors ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white transition-colors ${
              isDarkMode ? 'bg-indigo-500' : 'bg-indigo-600'
            }`}>
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className={`font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Mode Correction Autonome</h3>
          </div>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${
            isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
          }`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h4 className={`text-xs font-black uppercase tracking-widest mb-4 transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Ton texte annoté</h4>
            <div className={`text-lg leading-relaxed whitespace-pre-wrap font-serif p-6 rounded-xl border shadow-inner transition-all ${
              isDarkMode 
                ? 'bg-slate-950 border-slate-800 text-slate-300' 
                : 'bg-slate-50 border-slate-100 text-slate-700'
            }`}>
              {parts.map((part, i) => (
                part.type === 'text' ? (
                  <span key={i}>{part.content}</span>
                ) : (
                  <span 
                    key={i} 
                    onClick={() => setSelectedError(part)}
                    className={`cursor-help transition-all duration-200 rounded px-0.5 border-b-2 ${
                      part.errorType === 'grammar' 
                        ? (isDarkMode ? 'border-red-900 bg-red-900/20 text-red-300 hover:bg-red-900/40' : 'border-red-400 bg-red-50 text-red-700 hover:bg-red-100')
                        : (isDarkMode ? 'border-green-900 bg-green-900/20 text-green-300 hover:bg-green-900/40' : 'border-green-400 bg-green-50 text-green-700 hover:bg-green-100')
                    } ${selectedError === part ? (isDarkMode ? 'ring-2 ring-indigo-500' : 'ring-2 ring-indigo-400') : ''}`}
                  >
                    {part.content}
                  </span>
                )
              ))}
            </div>
            <p className={`mt-4 text-sm flex items-center gap-2 transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              <HelpCircle className="w-4 h-4" /> Clique sur les passages soulignés pour voir un indice.
            </p>
          </div>

          <div className="w-full md:w-72 flex flex-col gap-4">
            <h4 className={`text-xs font-black uppercase tracking-widest transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Le coin des indices</h4>
            {selectedError ? (
              <div className={`p-5 rounded-2xl border-2 animate-in fade-in slide-in-from-right-4 transition-colors ${
                selectedError.errorType === 'grammar' 
                  ? (isDarkMode ? 'border-red-900 bg-red-900/10' : 'border-red-100 bg-red-50') 
                  : (isDarkMode ? 'border-green-900 bg-green-900/10' : 'border-green-100 bg-green-50')
              }`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 inline-block transition-colors ${
                  selectedError.errorType === 'grammar' 
                    ? (isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-200 text-red-700') 
                    : (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-200 text-green-700')
                }`}>
                  {selectedError.errorType === 'grammar' ? 'Grammaire / Ortho' : 'Vocabulaire'}
                </span>
                <p className={`font-bold text-lg mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>"{selectedError.content}"</p>
                <div className="space-y-4">
                  <div>
                    <label className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Indice</label>
                    <p className={`text-sm italic transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>{selectedError.hint}</p>
                  </div>
                  <div className={`p-3 rounded-lg border shadow-sm transition-colors ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                  }`}>
                    <label className="text-[10px] font-bold text-indigo-500 uppercase">Réflexion</label>
                    <p className={`text-sm font-medium transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{selectedError.guidance}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
                isDarkMode ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <HelpCircle className={`w-6 h-6 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                </div>
                <p className="text-slate-400 text-sm italic">Clique sur une erreur pour obtenir de l'aide sans avoir la réponse !</p>
              </div>
            )}
            <div className={`p-4 rounded-xl border transition-colors ${
              isDarkMode ? 'bg-indigo-900/10 border-indigo-900/40' : 'bg-indigo-50 border-indigo-100'
            }`}>
              <h5 className={`text-xs font-bold mb-1 transition-colors ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>Légende</h5>
              <div className="space-y-1">
                <div className={`flex items-center gap-2 text-xs transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span className="w-3 h-3 rounded-full bg-red-400"></span> Grammaire & Orthographe
                </div>
                <div className={`flex items-center gap-2 text-xs transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span className="w-3 h-3 rounded-full bg-green-400"></span> Vocabulaire & Lexique
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-4 border-t text-center transition-colors ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <p className="text-xs text-slate-500">Note: Le but est d'apprendre à corriger soi-même pour devenir autonome !</p>
        </div>
      </div>
    </div>
  );
};
