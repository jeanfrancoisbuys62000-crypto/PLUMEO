
import React, { useState } from 'react';
import { Heart, Ghost, Rocket, Scale, MapPin, Search, MessageSquare, Mic, ArrowLeft, Loader2, Sparkles, Copy, Check, Wand2, BookOpen, User, Quote } from 'lucide-react';
import { getInspirationContent } from '../services/geminiService';

interface LiteraryExcerpt {
  author: string;
  source: string;
  text: string;
}

interface ThemeCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgClass: string;
  desc: string;
  classicExample: string;
  classicTips: string[];
  literaryLibrary: LiteraryExcerpt[];
}

const THEMES: ThemeCard[] = [
  { 
    id: 'amour', 
    title: 'Textes d\'Amour', 
    icon: <Heart className="w-6 h-6" />, 
    color: 'text-rose-500', 
    bgClass: 'from-rose-500/10 to-rose-500/5', 
    desc: 'Passion, sentiments et lyrisme.',
    classicExample: "Ton regard est un océan où mon âme vient se perdre. Chaque battement de mon cœur résonne comme un vers de poésie dédié à ta grâce. Même le silence, entre nous, semble chargé d'une musique que nous seuls pouvons entendre, un lien invisible qui défie le temps et l'absence.",
    classicTips: ["Utilise le champ lexical des sens (vue, ouïe, toucher).", "Emploie des métaphores pour exprimer l'invisible.", "Soigne le rythme des phrases pour créer une mélodie."],
    literaryLibrary: [
      { author: "Victor Hugo", source: "Les Contemplations", text: "Demain, dès l'aube, à l'heure où blanchit la campagne, / Je partirai. Vois-tu, je sais que tu m'attends. / J'irai par la forêt, j'irai par la montagne. / Je ne puis demeurer loin de toi plus longtemps." },
      { author: "Edmond Rostand", source: "Cyrano de Bergerac", text: "Un baiser, mais à tout prendre, qu'est-ce ? / Un serment fait d'un peu plus près, une promesse / Plus précise, un aveu qui veut se confirmer, / Un point rose qu'on met sur l'i du mot aimer." }
    ]
  },
  { 
    id: 'fantastique', 
    title: 'Fantastique', 
    icon: <Ghost className="w-6 h-6" />, 
    color: 'text-purple-500', 
    bgClass: 'from-purple-500/10 to-purple-500/5', 
    desc: 'Surnaturel et mystère.',
    classicExample: "L'horloge du salon sonna treize coups. Un frisson parcourut l'échine de Paul. À travers la vitre givrée, il vit une ombre se détacher de la brume, une silhouette sans visage qui semblait flotter au-dessus du sol. La serrure de la porte grinça doucement, alors qu'aucune clé ne s'y trouvait.",
    classicTips: ["Installe le doute : est-ce réel ou une illusion ?", "Utilise des adjectifs liés à l'inquiétude.", "Précise les bruits et les jeux d'ombre."],
    literaryLibrary: [
      { author: "Guy de Maupassant", source: "Le Horla", text: "Je n'ai plus la force de vouloir ; je l'ai, cette volonté, mais quelqu'un s'en empare et la dirige ! Elle ne m'appartient plus. Je ne suis plus rien qu'un spectateur esclave et terrifié de toutes les choses que je fais." },
      { author: "Théophile Gautier", source: "La Cafetière", text: "Tout à coup, le feu prit une étrange couleur bleue ; les bougies s'allongèrent en jetant une lumière blafarde, et je vis avec effroi que les personnages des tapisseries commençaient à s'agiter." }
    ]
  },
  { 
    id: 'sf', 
    title: 'Science-Fiction', 
    icon: <Rocket className="w-6 h-6" />, 
    color: 'text-blue-500', 
    bgClass: 'from-blue-500/10 to-blue-500/5', 
    desc: 'Futur, robots et voyages spatiaux.',
    classicExample: "Le chrome des gratte-ciels de Néo-Paris étincelait sous l'éclat des trois lunes artificielles. Le cyborg XJ-9 ajusta ses capteurs optiques ; il percevait le flux d'informations des voitures volantes comme une pluie de chiffres bleutés. Dans ce monde de métal, il cherchait désespérément un souvenir humain.",
    classicTips: ["Invente des mots pour de nouvelles technologies.", "Crée un décor radicalement différent du nôtre.", "Interroge la place de l'homme face aux machines."],
    literaryLibrary: [
      { author: "Jules Verne", source: "Vingt mille lieues sous les mers", text: "La mer est tout ! Elle couvre les sept dixièmes du globe terrestre. Son souffle est pur et sain. C'est l'immense désert où l'homme n'est jamais seul, car il sent frémir la vie à ses côtés." },
      { author: "René Barjavel", source: "La Nuit des temps", text: "Ils étaient là, sous la glace, depuis neuf cent mille ans. L'homme et la femme, immobiles, parfaits, attendant que le monde se souvienne d'eux." }
    ]
  },
  { 
    id: 'argumentatif', 
    title: 'Argumentatif', 
    icon: <Scale className="w-6 h-6" />, 
    color: 'text-amber-500', 
    bgClass: 'from-amber-500/10 to-amber-500/5', 
    desc: 'Défendre une idée avec brio.',
    classicExample: "Il est impératif de protéger notre environnement, car la Terre n'est pas un héritage de nos ancêtres, mais un prêt de nos enfants. Premièrement, la biodiversité assure notre survie. Deuxièmement, le dérèglement climatique menace la paix mondiale. Enfin, il en va de notre responsabilité morale.",
    classicTips: ["Utilise des connecteurs logiques (premièrement, enfin).", "Appuie-toi sur des valeurs universelles.", "Conclue par une ouverture ou une question forte."],
    literaryLibrary: [
      { author: "Montesquieu", source: "De l'Esprit des Lois", text: "La liberté est le droit de faire tout ce que les lois permettent ; et si un citoyen pouvait faire ce qu'elles défendent, il n'aurait plus de liberté, parce que les autres auraient tout de même ce pouvoir." },
      { author: "Voltaire", source: "Traité sur la tolérance", text: "La tolérance n'a jamais excité de guerre civile ; l'intolérance a couvert la terre de carnage." }
    ]
  },
  { 
    id: 'description', 
    title: 'Descriptions', 
    icon: <MapPin className="w-6 h-6" />, 
    color: 'text-emerald-500', 
    bgClass: 'from-emerald-500/10 to-emerald-500/5', 
    desc: 'Peindre des paysages avec les mots.',
    classicExample: "La forêt exhalait une odeur de mousse humide et de résine sauvage. Les rayons du soleil, filtrés par la voûte d'émeraude des chênes, dessinaient sur le sol un tapis de lumière mouvante. Un ruisseau, aux eaux si claires qu'on y voyait briller chaque galet, chantait une chanson cristalline.",
    classicTips: ["Ordonne ta description (du général au particulier).", "Choisis des adjectifs de couleur très précis.", "Évoque les textures et les odeurs."],
    literaryLibrary: [
      { author: "Gustave Flaubert", source: "Madame Bovary", text: "C'était une de ces coiffures d'ordre composite, où l'on retrouve les éléments du bonnet à poil, du chapska, du chapeau rond, de la casquette de loutre et du bonnet de coton..." },
      { author: "Émile Zola", source: "Le Ventre de Paris", text: "C'était une mer de légumes, les Halles s'éveillaient dans un balancement de lanternes, au milieu des cris des charretiers et du craquement des fouets." }
    ]
  },
  { 
    id: 'realiste', 
    title: 'Réalisme', 
    icon: <Search className="w-6 h-6" />, 
    color: 'text-slate-500', 
    bgClass: 'from-slate-500/10 to-slate-500/5', 
    desc: 'La vie quotidienne brute.',
    classicExample: "Le vieil homme posa son journal froissé sur la nappe en plastique tachée de café. Dehors, la pluie fine frappait les carreaux avec une régularité lassante. Dans la cuisine, le ronronnement du vieux frigo était le seul bruit qui l'accompagnait dans sa routine silencieuse et immuable.",
    classicTips: ["Décris des objets banals pour créer du vrai.", "Utilise des verbes d'action ordinaires.", "Évite les fioritures poétiques trop marquées."],
    literaryLibrary: [
      { author: "Honoré de Balzac", source: "Le Père Goriot", text: "La façade de la pension donne sur un jardinet, en sorte que la maison tombe à angle droit sur la rue Neuve-Sainte-Geneviève, où vous la voyez coupée dans sa profondeur." },
      { author: "Guy de Maupassant", source: "Une Vie", text: "Jeanne, ayant fini ses malles, s'approcha de la fenêtre, mais la pluie ne cessait pas." }
    ]
  },
  { 
    id: 'dialogue', 
    title: 'Dialogues', 
    icon: <MessageSquare className="w-6 h-6" />, 
    color: 'text-indigo-500', 
    bgClass: 'from-indigo-500/10 to-indigo-500/5', 
    desc: 'Faire parler ses personnages.',
    classicExample: "— Tu as encore oublié la clé, n'est-ce pas ? soupira Clara.\n— Pas du tout, elle est... là, balbutia-t-il en tapotant ses poches.\n— Je déteste quand tu fais ça. On va rester coincés ici toute la nuit !\n— Calme-toi, je vais bien finir par la retrouver.",
    classicTips: ["Varie les verbes de parole (soupira, balbutia).", "Adapte le niveau de langue au personnage.", "Mêle des gestes aux paroles pour donner de la vie."],
    literaryLibrary: [
      { author: "Molière", source: "L'Avare", text: "— Au voleur ! au voleur ! à l'assassin ! au meurtrier ! Justice, juste Ciel ! je suis perdu, je suis assassiné, on m'a coupé la gorge, on m'a dérobé mon argent !" },
      { author: "Alfred de Musset", source: "On ne badine pas avec l'amour", text: "— Adieu, Camille, retourne à ton couvent, et lorsqu'on te fera de ces récits hideux qui t'ont empoisonnée, réponds ce que je vais te dire : Tous les hommes sont menteurs, inconstants, faux..." }
    ]
  },
  { 
    id: 'discours', 
    title: 'Discours Célèbres', 
    icon: <Mic className="w-6 h-6" />, 
    color: 'text-orange-500', 
    bgClass: 'from-orange-500/10 to-orange-500/5', 
    desc: 'Éloquence et persuasion.',
    classicExample: "Citoyens, l'heure n'est plus aux doutes, elle est au courage ! Nous sommes les héritiers d'une histoire glorieuse, les gardiens d'une liberté chèrement acquise. Que notre voix s'élève comme un seul cri pour affirmer notre volonté de construire, ensemble, un avenir de fraternité et de justice !",
    classicTips: ["Utilise des questions oratoires pour impliquer l'auditeur.", "Emploie l'anaphore (répétition en début de phrase).", "Appelle à l'émotion et aux valeurs communes."],
    literaryLibrary: [
      { author: "Charles de Gaulle", source: "Appel du 18 juin", text: "Quoi qu'il arrive, la flamme de la résistance française ne doit pas s'éteindre et ne s'éteindra pas." },
      { author: "André Malraux", source: "Transfert des cendres de Jean Moulin", text: "Entre ici, Jean Moulin, avec ton cortège d'ombres ! Avec ceux qui sont morts dans les caves sans avoir parlé, comme toi ; et même, ce qui est peut-être plus atroce, en ayant parlé..." }
    ]
  },
];

export const InspirationView: React.FC<{ isDarkMode: boolean, onBack: () => void }> = ({ isDarkMode, onBack }) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeCard | null>(null);
  const [content, setContent] = useState<{ text: string, tips: string[], source?: string, author?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateIA = async () => {
    if (!selectedTheme) return;
    setLoading(true);
    try {
      const data = await getInspirationContent(selectedTheme.title);
      setContent({ ...data, author: "L'IA Pluméo", source: "Génération Unique" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeClick = (theme: ThemeCard) => {
    setSelectedTheme(theme);
    setContent({ text: theme.classicExample, tips: theme.classicTips, author: "Pluméo", source: "Exemple Pédagogique" });
  };

  const loadExcerpt = (excerpt: LiteraryExcerpt) => {
    if (!selectedTheme) return;
    setContent({ 
      text: excerpt.text, 
      tips: selectedTheme.classicTips, 
      author: excerpt.author, 
      source: excerpt.source 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={onBack}
          className={`flex items-center gap-2 text-sm font-bold transition-all ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-indigo-600'}`}
        >
          <ArrowLeft className="w-4 h-4" /> Retour à l'Atelier
        </button>
        <div className="text-center flex-1 pr-24">
          <h2 className={`text-4xl font-black font-display mb-2 ${isDarkMode ? 'text-white' : 'text-indigo-950'}`}>Bibliothèque d'Inspiration</h2>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>Découvre des chefs-d'œuvre pour nourrir ta propre plume.</p>
        </div>
      </div>

      {!selectedTheme ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeClick(theme)}
              className={`group relative p-8 rounded-[2rem] border-2 transition-all hover:-translate-y-2 text-left overflow-hidden ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/50' 
                  : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-2xl shadow-indigo-100/50'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${theme.bgClass}`}></div>
              <div className={`p-4 rounded-2xl mb-6 inline-block transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <div className={theme.color}>{theme.icon}</div>
              </div>
              <h3 className={`text-xl font-bold mb-2 font-display relative z-10 ${isDarkMode ? 'text-white' : 'text-indigo-950'}`}>{theme.title}</h3>
              <p className={`text-sm leading-relaxed relative z-10 transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400 font-medium'}`}>{theme.desc}</p>
              
              <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Explorer <Sparkles className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid lg:grid-cols-3 gap-10 items-start animate-in zoom-in-95 duration-500">
            <div className="lg:col-span-2 space-y-6">
              <div className={`p-10 rounded-[2.5rem] border shadow-2xl relative min-h-[500px] flex flex-col transition-all ${
                isDarkMode ? 'bg-slate-900 border-slate-800 shadow-black/40' : 'bg-white border-slate-100 shadow-indigo-100/30'
              }`}>
                <div className="absolute top-8 right-8 flex gap-2">
                    <button 
                      onClick={handleCopy}
                      className={`p-3 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-white shadow-sm'}`}
                      title="Copier le texte"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-indigo-50'} ${selectedTheme.color}`}>
                    {selectedTheme.icon}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-black font-display ${isDarkMode ? 'text-white' : 'text-indigo-950'}`}>{selectedTheme.title}</h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{content?.author}</span>
                       <span className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>•</span>
                       <span className={`text-[10px] italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{content?.source}</span>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
                    <p className={`italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Pluméo invoque les muses pour toi...</p>
                  </div>
                ) : content && (
                  <div className="flex-1">
                    <p className={`text-2xl leading-relaxed font-serif transition-colors whitespace-pre-wrap ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {content.text}
                    </p>
                  </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <button 
                    onClick={handleGenerateIA}
                    disabled={loading}
                    className={`flex items-center gap-2 text-sm font-bold py-3 px-6 rounded-xl transition-all ${
                      isDarkMode 
                        ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' 
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    }`}
                  >
                    <Wand2 className="w-4 h-4" /> Créer une variante unique avec Gemini
                  </button>
                  <button 
                    onClick={() => handleThemeClick(selectedTheme)}
                    className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-slate-400 hover:text-indigo-500'}`}
                  >
                    Retour à l'exemple pédagogique
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className={`p-8 rounded-[2rem] border shadow-xl ${isDarkMode ? 'bg-indigo-900/10 border-indigo-900/30' : 'bg-indigo-50/50 border-indigo-100'}`}>
                <h4 className={`font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>
                  <Sparkles className="w-4 h-4" /> Conseils d'Écriture
                </h4>
                <div className="space-y-6">
                  {content?.tips.map((tip, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {i + 1}
                      </div>
                      <p className={`text-sm leading-relaxed font-medium ${isDarkMode ? 'text-slate-400' : 'text-indigo-950/70'}`}>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setSelectedTheme(null)}
                className={`w-full py-5 rounded-2xl font-black transition-all border-2 ${
                  isDarkMode 
                    ? 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white' 
                    : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-700'
                }`}
              >
                Voir d'autres thématiques
              </button>
            </div>
          </div>

          <div className="space-y-8 animate-in fade-in duration-1000 delay-300">
             <div className="flex items-center gap-4">
                <div className={`h-[1px] flex-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                <h3 className={`text-xl font-black font-display uppercase tracking-widest flex items-center gap-3 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-900'}`}>
                  <BookOpen className="w-6 h-6" /> Le Panthéon des Lettres
                </h3>
                <div className={`h-[1px] flex-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedTheme.literaryLibrary.map((excerpt, idx) => (
                  <button 
                    key={idx}
                    onClick={() => loadExcerpt(excerpt)}
                    className={`group p-8 rounded-[2rem] border-2 text-left transition-all hover:-translate-y-1 ${
                      isDarkMode 
                        ? 'bg-slate-900/40 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900' 
                        : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-xl shadow-indigo-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                       <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                          <Quote className="w-4 h-4" />
                       </div>
                       <div className="text-right">
                          <p className={`text-sm font-black font-display ${isDarkMode ? 'text-white' : 'text-indigo-950'}`}>{excerpt.author}</p>
                          <p className={`text-[10px] italic font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{excerpt.source}</p>
                       </div>
                    </div>
                    <p className={`text-sm leading-relaxed line-clamp-3 font-serif italic ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      "{excerpt.text}"
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      Lire l'extrait complet <ArrowLeft className="w-3 h-3 rotate-180" />
                    </div>
                  </button>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
