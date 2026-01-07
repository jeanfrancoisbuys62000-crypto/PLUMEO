
import React, { useState } from 'react';
import { 
  BookMarked, ChevronRight, Hash, Quote, Zap, Sparkles, X, 
  User, Dog, Shirt, Wand2, Layers, MessageSquare, Scale, 
  ListChecks, MessageCircleMore, BrainCircuit, PenTool, MapPin
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  shortDesc: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  category: 'imagination' | 'reflexion';
}

interface ToolkitPanelProps {
  isDarkMode?: boolean;
}

export const ToolkitPanel: React.FC<ToolkitPanelProps> = ({ isDarkMode }) => {
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'imagination' | 'reflexion'>('imagination');

  const resources: Resource[] = [
    // IMAGINATION
    {
      id: 'rep',
      category: 'imagination',
      title: "Éviter les répétitions",
      shortDesc: "Varier son vocabulaire narratif.",
      icon: <Hash className="w-4 h-4" />,
      content: (
        <div className="space-y-3">
          <p>Utilise des synonymes ou des pronoms pour désigner tes personnages :</p>
          <ul className="list-disc pl-4 space-y-2">
            <li><strong>Le héros</strong> → <em>ce jeune homme, le protagoniste, l'aventurier, celui-ci</em>.</li>
            <li><strong>Manger</strong> → <em>dévorer, savourer, grignoter, se sustenter</em>.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'place',
      category: 'imagination',
      title: "Décrire un lieu",
      shortDesc: "Ville, campagne et intérieurs.",
      icon: <MapPin className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div>
            <p className="font-bold text-emerald-600 dark:text-emerald-400 text-xs uppercase mb-1">🌆 La Ville</p>
            <p className="text-[13px]"><em>Effervescence, artères encombrées, façades lépreuses, bitume brûlant, néons clignotants, grouillement citadin.</em></p>
          </div>
          <div>
            <p className="font-bold text-green-600 dark:text-green-400 text-xs uppercase mb-1">🌳 La Campagne</p>
            <p className="text-[13px]"><em>Paysage vallonné, atmosphère bucolique, bruissement des feuilles, horizon dégagé, senteurs terreuses, calme olympien.</em></p>
          </div>
          <div>
            <p className="font-bold text-amber-600 dark:text-amber-400 text-xs uppercase mb-1">🏠 Les Intérieurs</p>
            <p className="text-[13px]"><em>Pièce exiguë, salon spacieux, ambiance feutrée, pénombre mystérieuse, décor dépouillé, mobilier patiné par le temps.</em></p>
          </div>
          <p className="text-[11px] italic border-l-2 border-slate-300 pl-2 mt-2">
            N'oublie pas de solliciter les 5 sens : que voit-on, qu'entend-on, quelle est l'odeur du lieu ?
          </p>
        </div>
      )
    },
    {
      id: 'human',
      category: 'imagination',
      title: "Décrire un humain",
      shortDesc: "Portrait physique et moral.",
      icon: <User className="w-4 h-4" />,
      content: (
        <div className="space-y-3">
          <p><strong>Portrait physique :</strong> <em>trapu, frêle, le teint cireux, des yeux malicieux, une allure fière</em>.</p>
          <p><strong>Portrait moral :</strong> <em>intrépide, mélancolique, fourbe, altruiste, taciturne</em>.</p>
        </div>
      )
    },
    {
      id: 'animal',
      category: 'imagination',
      title: "Décrire un animal",
      shortDesc: "Pelages, cris et mouvements.",
      icon: <Dog className="w-4 h-4" />,
      content: (
        <div className="space-y-3">
          <ul className="space-y-2">
            <li>🐾 <strong>Le corps :</strong> pelage <em>dru</em>, plumage <em>diapré</em>, écailles <em>rugueuses</em>.</li>
            <li>🏃 <strong>Mouvement :</strong> <em>bondir, se faufiler, planer, charger</em>.</li>
            <li>🔊 <strong>Cris :</strong> <em>hurlement, glapissement, sifflement</em>.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'clothes',
      category: 'imagination',
      title: "Décrire un vêtement",
      shortDesc: "Matières et signes sociaux.",
      icon: <Shirt className="w-4 h-4" />,
      content: (
        <div className="space-y-3">
          <p>Les vêtements en disent long sur le personnage :</p>
          <ul className="space-y-2">
            <li>🧥 <strong>Richesse :</strong> <em>soie, brocard, velours, bijoux rutilants</em>.</li>
            <li>🏚️ <strong>Misère :</strong> <em>toile rêche, haillons, étoffe élimée, souliers troués</em>.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'dire',
      category: 'imagination',
      title: "Le verbe 'dire'",
      shortDesc: "Dialogues vivants.",
      icon: <Quote className="w-4 h-4" />,
      content: (
        <div className="space-y-3">
          <p>Remplace "dit-il" par l'intention :</p>
          <ul className="grid grid-cols-2 gap-2 text-xs">
            <li className="p-1 border rounded italic">S'exclamer, tonner</li>
            <li className="p-1 border rounded italic">Chuchoter, souffler</li>
            <li className="p-1 border rounded italic">Répliquer, rétorquer</li>
            <li className="p-1 border rounded italic">Balbutier, bégayer</li>
          </ul>
        </div>
      )
    },
    {
      id: 'figures',
      category: 'imagination',
      title: "Figures de style",
      shortDesc: "Images et poésie.",
      icon: <Wand2 className="w-4 h-4" />,
      content: (
        <div className="space-y-3">
          <p><strong>Métaphore :</strong> "Le lac était un miroir d'argent."</p>
          <p><strong>Comparaison :</strong> "Fort comme un lion."</p>
          <p><strong>Personnification :</strong> "Le vent hurlait sa douleur."</p>
        </div>
      )
    },
    {
      id: 'exp',
      category: 'imagination',
      title: "Expressivité",
      shortDesc: "Montrer au lieu de dire.",
      icon: <Zap className="w-4 h-4" />,
      content: (
        <div className="space-y-3">
          <p>Au lieu de "Il avait peur", écris :</p>
          <p className="italic">"Ses mains tremblaient, sa gorge était sèche et son cœur battait à se rompre."</p>
        </div>
      )
    },
    // RÉFLEXION
    {
      id: 'connecteurs',
      category: 'reflexion',
      title: "Connecteurs logiques",
      shortDesc: "Lier tes idées proprement.",
      icon: <Layers className="w-4 h-4" />,
      content: (
        <div className="space-y-3">
          <p>Organise ton argumentation :</p>
          <ul className="space-y-1 text-xs">
            <li>🟢 <strong>Addition :</strong> De plus, par ailleurs, en outre.</li>
            <li>🔴 <strong>Opposition :</strong> Cependant, toutefois, néanmoins.</li>
            <li>🟡 <strong>Conséquence :</strong> Par conséquent, ainsi, c'est pourquoi.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'structure',
      category: 'reflexion',
      title: "Structurer un argument",
      shortDesc: "La méthode I.A.E.",
      icon: <ListChecks className="w-4 h-4" />,
      content: (
        <div className="space-y-3">
          <p>Chaque paragraphe doit suivre cet ordre :</p>
          <ol className="list-decimal pl-4 space-y-2">
            <li><strong>Idée :</strong> Énonce clairement ton avis.</li>
            <li><strong>Argument :</strong> Explique pourquoi tu penses cela.</li>
            <li><strong>Exemple :</strong> Donne un exemple concret (livre, film, fait historique).</li>
          </ol>
        </div>
      )
    },
    {
      id: 'opinion',
      category: 'reflexion',
      title: "Exprimer son opinion",
      shortDesc: "Au-delà du 'je pense'.",
      icon: <MessageCircleMore className="w-4 h-4" />,
      content: (
        <div className="space-y-3">
          <p>Utilise des verbes d'opinion variés :</p>
          <ul className="grid grid-cols-2 gap-2 text-xs">
            <li className="p-1 border rounded">J'estime que...</li>
            <li className="p-1 border rounded">Je soutiens que...</li>
            <li className="p-1 border rounded">Il est indéniable que...</li>
            <li className="p-1 border rounded">Je déplore que...</li>
          </ul>
        </div>
      )
    },
    {
      id: 'nuance',
      category: 'reflexion',
      title: "Nuancer son propos",
      shortDesc: "Ne pas être trop catégorique.",
      icon: <Scale className="w-4 h-4" />,
      content: (
        <div className="space-y-3">
          <p>Utilise des modalisateurs pour montrer que tu réfléchis :</p>
          <p><em>Peut-être, sans doute, il semble que, vraisemblablement, dans une certaine mesure...</em></p>
          <p className="text-xs italic">Cela montre au correcteur que tu es capable de recul.</p>
        </div>
      )
    },
    {
      id: 'refutation',
      category: 'reflexion',
      title: "Réfuter un argument",
      shortDesc: "Répondre aux adversaires.",
      icon: <BrainCircuit className="w-4 h-4" />,
      content: (
        <div className="space-y-3">
          <p>Pour contredire une idée reçue :</p>
          <p><em>"Certes, certains affirment que... mais il faut aussi considérer que..."</em></p>
          <p><em>"Contrairement à l'idée répandue..."</em></p>
        </div>
      )
    },
    {
      id: 'exemple',
      category: 'reflexion',
      title: "Introduire un exemple",
      shortDesc: "Rendre l'idée concrète.",
      icon: <MessageSquare className="w-4 h-4" />,
      content: (
        <div className="space-y-3">
          <p>Mots pour amener tes preuves :</p>
          <p><em>"Notamment", "à titre d'illustration", "comme en témoigne l'œuvre de...", "prenons le cas de..."</em></p>
        </div>
      )
    }
  ];

  const filteredResources = resources.filter(res => res.category === activeTab);
  const selectedResource = resources.find(r => r.id === selectedResourceId);

  return (
    <div className={`rounded-3xl shadow-lg border p-6 transition-colors ${
      isDarkMode ? 'bg-slate-900 border-slate-800 shadow-black' : 'bg-white border-slate-200 shadow-emerald-50/50'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`font-bold flex items-center gap-2 font-display ${isDarkMode ? 'text-slate-200' : 'text-emerald-900'}`}>
          <BookMarked className="w-5 h-5 text-emerald-600" /> Boîte à outils
        </h3>
      </div>
      
      {/* Tab Selector */}
      <div className={`flex p-1 rounded-2xl mb-6 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
        <button
          onClick={() => { setActiveTab('imagination'); setSelectedResourceId(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'imagination'
              ? (isDarkMode ? 'bg-emerald-500 text-white shadow-lg' : 'bg-emerald-600 text-white shadow-md')
              : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-800')
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          Imagination
        </button>
        <button
          onClick={() => { setActiveTab('reflexion'); setSelectedResourceId(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'reflexion'
              ? (isDarkMode ? 'bg-emerald-500 text-white shadow-lg' : 'bg-emerald-600 text-white shadow-md')
              : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-800')
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          Réflexion
        </button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredResources.map((res) => (
          <button
            key={res.id}
            onClick={() => setSelectedResourceId(res.id)}
            className={`w-full text-left p-3 rounded-xl border flex items-center justify-between group transition-all ${
              isDarkMode 
                ? 'bg-slate-950 border-slate-800 hover:border-emerald-700 hover:bg-slate-900' 
                : 'bg-slate-50 border-slate-100 hover:border-emerald-200 hover:bg-white hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'bg-slate-800 text-emerald-400 group-hover:bg-emerald-900' : 'bg-white text-emerald-600 group-hover:bg-emerald-50'
              }`}>
                {res.icon}
              </div>
              <div>
                <p className={`text-[13px] font-bold leading-tight ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{res.title}</p>
                <p className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{res.shortDesc}</p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`} />
          </button>
        ))}
      </div>

      {/* Resource Detail Overlay */}
      {selectedResourceId && selectedResource && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${
            isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'
          }`}>
            <div className={`p-4 flex items-center justify-between border-b ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : (activeTab === 'imagination' ? 'bg-emerald-50 border-emerald-100' : 'bg-teal-50 border-teal-100')
            }`}>
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white text-emerald-600 shadow-sm'}`}>
                  {selectedResource.icon}
                </div>
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-emerald-950'}`}>{selectedResource.title}</h4>
              </div>
              <button 
                onClick={() => setSelectedResourceId(null)}
                className={`p-1.5 rounded-full transition-colors ${
                  isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`p-6 text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {selectedResource.content}
            </div>
            <div className={`p-4 text-center border-t ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
              <button 
                onClick={() => setSelectedResourceId(null)}
                className={`text-xs font-bold hover:underline ${isDarkMode ? 'text-emerald-500' : 'text-emerald-600'}`}
              >
                J'ai compris, je retourne à mon texte
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
};
