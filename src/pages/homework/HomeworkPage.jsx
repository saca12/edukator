import { useState, useMemo } from 'react'; // Ajout de useMemo
import { motion } from 'framer-motion';
import { useClasse } from '../../context/ClasseContext';
import { HomeworkCard } from './components/HomeworkCard';
import { Filter } from 'lucide-react'; // Ajout d'une icône
import { QuizMode } from './components/QuizMode';

export default function HomeworkPage() {
  const { homeworks } = useClasse();
  const [filter, setFilter] = useState('A faire');
  const [selectedSubject, setSelectedSubject] = useState('Toutes'); // Nouvel état pour le filtre matière
  const [activeHomework, setActiveHomework] = useState(null);
  const safeHomeworks = Array.isArray(homeworks) ? homeworks : [];
  console.log("Safe homeworks array:", safeHomeworks); // Debug : vérifier que c'est bien un tableau

  // Extraire la liste des matières uniques présentes dans les devoirs
  const subjects = useMemo(() => {
    const allSubjects = safeHomeworks.map(h => h.subject);
    return ['Toutes', ...new Set(allSubjects)];
  }, [safeHomeworks]);

  if (activeHomework) {
    return <QuizMode homework={activeHomework} onExit={() => setActiveHomework(null)} />;
  }

  // Double filtrage : par statut (onglet) ET par matière
  const filteredTasks = safeHomeworks.filter(t => {
    const matchesStatus = t.status === filter;
    const matchesSubject = selectedSubject === 'Toutes' || t.subject === selectedSubject;
    return matchesStatus && matchesSubject;
  });

  return (
    <div className="flex-1 p-10 bg-[#F8FAFC] dark:bg-slate-950 min-h-screen transition-colors">
      <div className="flex flex-col gap-10">
        <div className="flex-1">
          <header className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Mes devoirs</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Priorise tes exercices pour réussir tes examens.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* FILTRE PAR MATIÈRE */}
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="pl-2 text-slate-400">
                    <Filter size={18} />
                </div>
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-transparent border-none text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-0 outline-none pr-8"
                >
                  {subjects.map(sub => (
                    <option key={sub} value={sub} className="dark:bg-slate-800">{sub}</option>
                  ))}
                </select>
              </div>

              {/* ONGLETS DE STATUT */}
              <div className="bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex gap-1 shadow-sm">
                {['A faire', 'En cours', 'Terminé'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      filter === tab 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredTasks.map(task => (
               <HomeworkCard 
                 key={task.id} 
                 task={task} 
                 onStart={() => setActiveHomework(task)} 
               />
             ))}
             
             {filteredTasks.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-20 bg-white dark:bg-slate-800 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700"
                >
                    <p className="text-slate-400 dark:text-slate-500 font-bold">
                        Aucun devoir pour "{selectedSubject}" dans la catégorie "{filter}".
                    </p>
                </motion.div>
             )}
           </motion.div>
        </div>
      </div>
    </div>
  );
}