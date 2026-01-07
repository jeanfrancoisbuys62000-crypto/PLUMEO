
import React from 'react';
import { Moon, Sun, Feather, Sparkles, Beaker } from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, isDarkMode, onToggleDarkMode, currentView, onViewChange }) => {
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <div className={`fixed inset-0 pointer-events-none notebook-bg ${isDarkMode ? 'text-indigo-500/5' : 'text-indigo-100'}`}></div>
      
      <header className={`sticky top-0 z-30 border-b transition-all duration-500 ${
        isDarkMode 
          ? 'bg-[#050510]/90 backdrop-blur-md border-indigo-900/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-950 border-indigo-950 shadow-xl shadow-indigo-900/20'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onViewChange('editor')}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 ${isDarkMode ? 'bg-indigo-500/20' : 'bg-white/10'}`}>
              <Beaker className={`w-6 h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-300'}`} />
            </div>
            <h1 className={`text-2xl font-black tracking-tighter font-display transition-colors ${isDarkMode ? 'text-indigo-400' : 'text-indigo-300'}`}>
              LaboStyle
            </h1>
          </div>
          
          <nav className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => onViewChange('editor')}
                className={`text-sm font-bold transition-all hover:text-white ${currentView === 'editor' ? 'text-white underline decoration-indigo-400 decoration-2 underline-offset-8' : 'text-indigo-100/70'}`}
              >
                Mon Atelier
              </button>
              <button 
                onClick={() => onViewChange('inspiration')}
                className={`text-sm font-bold transition-all hover:text-white flex items-center gap-2 ${currentView === 'inspiration' ? 'text-white underline decoration-indigo-400 decoration-2 underline-offset-8' : 'text-indigo-100/70'}`}
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Inspiration
              </button>
              <a href="#" className="text-sm font-bold transition-all text-indigo-100/70 hover:text-white">Ma bibliothèque</a>
            </div>
            
            <div className={`h-8 w-[1px] hidden md:block ${isDarkMode ? 'bg-slate-800' : 'bg-white/10'}`}></div>

            <button 
              onClick={onToggleDarkMode}
              className={`p-2.5 rounded-xl transition-all border ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' 
                  : 'bg-white/10 border-white/10 text-indigo-200 hover:bg-white/20 hover:text-white'
              }`}
              title={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button className={`px-6 py-2.5 rounded-xl text-sm font-black border transition-all ${
              isDarkMode 
                ? 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-500 shadow-lg shadow-indigo-900/20' 
                : 'bg-white text-indigo-950 border-white hover:bg-indigo-50 shadow-lg shadow-black/10'
            }`}>
              Connexion
            </button>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 max-w-[1400px] mx-auto w-full p-4 md:p-8 relative z-10">
        {children}
      </main>
      
      <footer className={`py-12 border-t relative z-10 transition-colors ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-indigo-50/30 border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-4">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2 shadow-lg transition-transform hover:rotate-6 ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-900/50' : 'bg-indigo-600 text-white'}`}>
            <Beaker className="w-5 h-5" />
          </div>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            LaboStyle — Redonner ses lettres de noblesse à l'écriture.
          </p>
          <p className={`text-[10px] uppercase tracking-widest font-black ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>
            © 2024 • Laboratoire Littéraire Intelligent
          </p>
        </div>
      </footer>
    </div>
  );
};
