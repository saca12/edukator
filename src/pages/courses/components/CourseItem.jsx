import { useState } from 'react';
import { useClasse } from '../../../context/ClasseContext';
import { 
  Maximize2, Minimize2, ChevronLeft, ChevronRight, 
  CheckCircle, Play, BookOpen, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CourseItem = ({ course, onFocus, isFocused }) => {
  const { updateCourseProgress } = useClasse();
  const [currentPage, setCurrentPage] = useState(0);

  const sections = course.content && course.content.length > 0 
    ? course.content 
    : [{ subtitle: "Introduction", text: "Le contenu arrive bientôt." }];

  const totalPages = sections.length;

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      const newProgress = Math.round(((nextPage + 1) / totalPages) * 100);
      if (newProgress > course.progress) {
        updateCourseProgress(course.id, newProgress);
      }
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <motion.div 
      layout 
      className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-all ${
        isFocused 
          ? 'fixed inset-0 z-50 rounded-none md:relative md:inset-auto md:rounded-[2.5rem] md:min-h-[600px] flex flex-col' 
          : 'rounded-[2rem] hover:shadow-md'
      }`}
    >
      
      {/* --- EN-TÊTE --- */}
      <motion.div layout="position" className="p-6 md:p-8 border-b border-slate-50 dark:border-slate-700/50 bg-white dark:bg-slate-800 shrink-0">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
             isFocused ? 'bg-indigo-600 text-white' : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
          }`}>
            {course.subject}
          </span>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              onFocus(course.id);
            }}
            className="p-2 bg-slate-50 dark:bg-slate-700 rounded-xl text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {isFocused ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>

        <motion.h3 layout="position" className={`font-black text-slate-900 dark:text-white leading-tight ${isFocused ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
          {course.title}
        </motion.h3>

        {!isFocused && (
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             className="flex items-center gap-4 mt-3 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase"
           >
              <div className="flex items-center gap-1"><Clock size={14}/> {course.duration}</div>
              <div className="flex items-center gap-1"><BookOpen size={14}/> {sections.length} Chapitres</div>
           </motion.div>
        )}
      </motion.div>

      {/* --- CONTENU --- */}
      <AnimatePresence mode="wait">
        {!isFocused ? (
          /* VUE CARTE */
          <motion.div 
            key="list-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 pt-0"
          >
            <div className="mt-4 mb-6">
              <div className="flex justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2">
                <span>Progression</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500" 
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>

            <button 
              onClick={() => onFocus(course.id)}
              className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 dark:hover:bg-indigo-600 transition-colors"
            >
              {course.progress > 0 ? 'Reprendre' : 'Commencer'} <Play size={18} fill="currentColor" />
            </button>
          </motion.div>

        ) : (
          /* VUE LISEUSE (Focus) */
          <motion.div 
            key="reader-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col flex-1 overflow-hidden bg-white dark:bg-slate-900"
          >
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              <div className="max-w-3xl mx-auto">
                <span className="text-indigo-500 dark:text-indigo-400 font-bold uppercase text-xs tracking-widest mb-2 block">
                    Chapitre {currentPage + 1} / {totalPages}
                </span>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">
                  {sections[currentPage].subtitle}
                </h2>
                {/* dark:prose-invert inverse les couleurs du texte automatiquement */}
                <div 
                  className="prose prose-slate dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: sections[currentPage].text }} 
                />
              </div>
            </div>

            <div className="p-4 md:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0 safe-area-bottom">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                  className={`p-3 md:px-6 md:py-3 rounded-xl font-bold transition-all ${
                    currentPage === 0 
                    ? 'text-slate-300 dark:text-slate-600' 
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-white shadow-sm hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <ChevronLeft size={24} /> <span className="hidden md:inline">Précédent</span>
                </button>

                <div className="flex gap-1.5">
                    {sections.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentPage ? 'w-6 bg-indigo-500' : 'w-1.5 bg-slate-300 dark:bg-slate-600'}`} />
                    ))}
                </div>

                {currentPage === totalPages - 1 ? (
                  <button 
                    onClick={() => onFocus(course.id)}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-black shadow-lg shadow-emerald-200 dark:shadow-none"
                  >
                    <span className="hidden md:inline">Terminer</span> <CheckCircle size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="p-3 md:px-6 md:py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none"
                  >
                     <span className="hidden md:inline">Suivant</span> <ChevronRight size={24} />
                  </button>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};