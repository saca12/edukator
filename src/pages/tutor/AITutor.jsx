import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, Loader2, Lightbulb, Brain, BookOpen, PenTool } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function AITutor() {
  const { chatHistory, sendMessage, user } = useUser();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Suggestions pédagogiques pour aider l'élève à démarrer
  const suggestions = [
    { icon: Brain, text: "Explique-moi un concept", prompt: "Peux-tu m'expliquer un concept de mon cours simplement" },
    { icon: PenTool, text: "Génère un quiz", prompt: "Fais-moi un quiz à choix multiples de 3 questions sur mon dernier chapitre pour réviser." },
    { icon: BookOpen, text: "Fais un résumé", prompt: "Peux-tu me faire un résumé clair et structuré (avec des puces) de ma dernière leçon ?" },
    { icon: Lightbulb, text: "Aide aux devoirs", prompt: "J'ai besoin d'indices pour résoudre un exercice, sans me donner la réponse directe. Peux-tu m'aider ?" }
  ];

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  // Fonction unifiée pour envoyer un message (manuel ou via suggestion)
  const handleSendMessage = async (textToSubmit) => {
    if (!textToSubmit.trim() || isTyping) return;
    
    setInput("");
    setIsTyping(true);
    
    await sendMessage(textToSubmit); 
    
    setIsTyping(false);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="flex flex-col h-full min-h-[80vh] bg-white dark:bg-slate-950 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
      
      {/* HEADER */}
      <div className="bg-indigo-600 dark:bg-indigo-900 p-4 md:p-6 text-white flex items-center justify-between shrink-0 shadow-md z-10">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-2 md:p-3 rounded-xl backdrop-blur-md">
            <Bot size={24} className="md:w-7 md:h-7" />
          </div>
          <div>
            <h2 className="font-black text-base md:text-xl leading-tight">Mon Tuteur IA</h2>
            <div className="flex items-center gap-2 text-indigo-100 dark:text-indigo-200 text-xs font-bold uppercase tracking-wider mt-1">
              <Sparkles size={12} /> Prêt à t'aider à réviser
            </div>
          </div>
        </div>
      </div>

      {/* ZONE DE CHAT */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950">
        
        {/* MESSAGE DE BIENVENUE & SUGGESTIONS (Empty State) */}
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-full py-10">
            <div className="bg-indigo-100 dark:bg-indigo-500/10 p-4 rounded-full mb-6 text-indigo-600 dark:text-indigo-400">
              <Bot size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 text-center">
              Salut {user?.first_name || "!"} 👋
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-8 font-medium">
              Je suis ton tuteur personnel. Que veux-tu travailler aujourd'hui ? Choisis une option ou pose ta propre question.
            </p>

            {/* Grille de suggestions pédagogiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  className="flex items-center gap-4 p-4 text-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-indigo-400 hover:shadow-md dark:hover:border-indigo-500/50 transition-all group"
                >
                  <div className="bg-indigo-50 dark:bg-slate-700 p-3 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-200">{item.text}</p>
                    <p className="text-xs text-slate-400 line-clamp-1">{item.prompt}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Historique des messages */}
        <AnimatePresence initial={false}>
          {chatHistory.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-sm text-sm md:text-base font-medium transition-colors leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-sm' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-slate-700'
              }`}>
                {/* Plus tard, tu pourras ajouter un composant ReactMarkdown ici pour formater les réponses (gras, listes) */}
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Indicateur de frappe */}
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
              <Loader2 size={18} className="animate-spin text-indigo-500" />
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Le tuteur prépare sa réponse...
              </span>
            </div>
          </motion.div>
        )}

        <div ref={scrollRef} className="h-1" />
      </div>

      {/* ZONE DE SAISIE */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0 transition-colors">
        
        {/* Raccourcis rapides au-dessus de la barre de recherche (visibles si le chat n'est pas vide) */}
        {chatHistory.length > 0 && (
          <div className="flex gap-2 overflow-x-auto p-3 no-scrollbar border-b border-slate-50 dark:border-slate-800/50">
            {['Plus de détails', 'Donne un exemple', 'Fais un quiz là-dessus'].map((shortcut, i) => (
              <button 
                key={i}
                onClick={() => setInput(shortcut)}
                className="whitespace-nowrap px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400 transition-colors"
              >
                {shortcut}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={onFormSubmit} className="p-4 md:p-5 flex gap-2 md:gap-4">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder="Pose une question, demande un résumé..."
            className="flex-1 px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all disabled:opacity-50 font-medium"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white px-6 py-4 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all flex items-center justify-center disabled:cursor-not-allowed group"
          >
            {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
          </button>
        </form>
      </div>
    </div>
  );
}