import { useState } from 'react';
import { useClasse } from '../../context/ClasseContext';
import { useUser } from '../../context/UserContext';
import { Search, ArrowLeft, Layers } from 'lucide-react';
import { CourseItem } from './components/CourseItem';

export default function Courses() {
  const { courses, globalProgress } = useClasse();
  const { isFocusMode, toggleFocusMode } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [focusedCourseId, setFocusedCourseId] = useState(null);

  // SÉCURITÉ API : Assurer que courses est un tableau même pendant le chargement
  const safeCourses = courses || [];

  const handleToggleFocus = (courseId) => {
    if (!isFocusMode) {
      setFocusedCourseId(courseId);
    } else {
      setFocusedCourseId(null);
    }
    toggleFocusMode();
  };


  const displayedCourses = safeCourses.filter(c => {
    if (isFocusMode) return c.id === focusedCourseId;
    const matchesSubject = selectedSubject === c.subject;
    // Supporte 'title' ou 'name' selon ce que ton API Django renvoie
    const titleMatch = c.title || c.name || ""; 
    const matchesSearch = titleMatch.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="flex-1 p-4 md:p-10 bg-[#F8FAFC] dark:bg-slate-950 min-h-screen transition-colors">
      
      {!isFocusMode && (
        <header className="mb-8">
          {selectedSubject ? (
             <button 
               onClick={() => setSelectedSubject(null)}
               className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-all mb-4 group"
             >
               <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 border border-slate-100 dark:border-slate-700">
                 <ArrowLeft size={20} />
               </div>
               Retour aux matières
             </button>
          ) : (
            <div>
               <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Mes Matières</h1>
               <p className="text-slate-500 dark:text-slate-400 mt-2">Choisis une matière pour accéder aux leçons.</p>
            </div>
          )}
        </header>
      )}

      {/* VUE 1 : GRILLE DES MATIÈRES */}
      {!selectedSubject && !isFocusMode && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {globalProgress.map((sub, index) => (
            <div key={index} onClick={() => setSelectedSubject(sub.name)} className="cursor-pointer group">
              <div className={`bg-white dark:bg-slate-800 p-6 rounded-[2rem] border ${sub.color.border} shadow-sm dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all h-full`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${sub.color.bg.replace('bg-', 'bg-opacity-10 text-')} dark:bg-opacity-20`}>
                    {sub.count} Cours
                  </span>
                  <div className={`p-2 rounded-full bg-slate-50 dark:bg-slate-900 ${sub.color.text}`}>
                    <Layers size={20} />
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">{sub.name}</h3>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${sub.color.bg}`} style={{ width: `${sub.progress}%` }} />
                  </div>
                  <span className="font-bold text-slate-400 dark:text-slate-500 text-sm">{sub.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VUE 2 : LISTE DES COURS */}
      {selectedSubject && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!isFocusMode && (
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">{selectedSubject}</h2>
                    <div className="relative group w-full max-w-xs hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                        <input 
                            type="text"
                            placeholder="Filtrer les leçons..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
                        />
                    </div>
                </div>
            )}

            <div className={`flex flex-col gap-4 ${isFocusMode ? 'items-center' : ''}`}>
                {displayedCourses.length > 0 ? (
                    displayedCourses.map(course => (
                    <div key={course.id} className={isFocusMode ? 'w-full max-w-5xl' : 'w-full'}>
                        <CourseItem course={course} onFocus={() => handleToggleFocus(course.id)} isFocused={isFocusMode && focusedCourseId === course.id}/>
                    </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700">
                        <p className="text-slate-400 dark:text-slate-500 font-bold">Aucun cours trouvé dans cette matière.</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
}