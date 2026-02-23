import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClasse } from '../../../context/ClasseContext';
import { 
  Users, BookOpen, CheckSquare, TrendingUp, 
  ArrowUpRight, Clock, Edit, 
  FileText, X, Download, Printer 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { courses, homeworks, grades, loadIntoCMS } = useClasse();
  const [selectedClass, setSelectedClass] = useState("2nde A");
  const [showReport, setShowReport] = useState(false);
  const navigate = useNavigate();

  // SÉCURITÉ API
  const safeCourses = courses || [];
  const safeHomeworks = homeworks || [];
  const safeGrades = grades || [];

  // --- LOGIQUE DE CALCULS ---
  // On s'assure de récupérer les cours de la classe (ou tous si classId n'est pas encore géré par ton API)
  const classCourses = safeCourses.filter(c => c.classId === selectedClass || !c.classId);
  const classGrades = safeGrades.filter(g => g.classId === selectedClass || !g.classId);
  const classAvg = classGrades.length > 0 
    ? (classGrades.reduce((acc, curr) => acc + (curr.score || 0), 0) / classGrades.length).toFixed(1) 
    : "0.0";

  const stats = [
    { label: "Cours Publiés", value: classCourses.length, icon: BookOpen, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
    { label: "Devoirs Actifs", value: safeHomeworks.length, icon: CheckSquare, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10" },
    { label: "Moyenne", value: `${classAvg}/20`, icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
    { label: "Élèves", value: "24", icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
  ];

  const handleCourseEdit = (course) => {
    loadIntoCMS(course, 'cours'); 
    navigate(`/admin/manage`);
  };

  return (
    <div className="flex-1 p-10 bg-slate-50 dark:bg-slate-950 min-h-screen relative transition-colors">
      
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Statistiques globales</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Analyse des performances pour la <span className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedClass}</span></p>
        </div>
        
        <select 
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-700 dark:text-slate-200 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
        >
          <option value="2nde A">Classe : 2nde A</option>
          <option value="2nde B">Classe : 2nde B</option>
          <option value="1ère S1">Classe : 1ère S1</option>
        </select>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end gap-2 mt-1">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
              <span className="text-emerald-500 text-xs font-bold mb-1 flex items-center">
                <ArrowUpRight size={14} /> +12%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white italic">Gestion rapide des contenus</h3>
            <button onClick={()=>navigate('/admin/manage')} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                Créer un nouveau
            </button>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {classCourses.length > 0 ? (
                classCourses.map(course => (
                  <div key={course.id} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-xs uppercase">
                        {(course.subject || 'NA').substring(0,2)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{course.title || course.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{course.duration || '30 min'} • {course.level || 'Tous'}</p>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleCourseEdit(course); }} className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all shadow-sm">
                        <Edit size={18} />
                    </button>
                  </div>
                ))
            ) : (
                <p className="text-slate-500 text-sm text-center py-4">Aucun cours pour cette classe.</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-colors">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 italic">Flux d'activité</h3>
          <div className="space-y-8 flex-1">
            {[
              { user: "Inès M.", action: "a terminé le Quiz", time: "2m", icon: "🔥" },
              { user: "Lucas R.", action: "a rendu son devoir", time: "15m", icon: "📄" },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 relative">
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg shadow-sm border border-white dark:border-slate-700 shrink-0">
                  {activity.icon}
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-tight">
                    <span className="font-black text-slate-900 dark:text-white">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                    <Clock size={10} /> Il y a {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setShowReport(true)} className="w-full mt-10 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all shadow-xl uppercase tracking-widest flex items-center justify-center gap-2">
            <FileText size={16} /> Rapport complet
          </button>
        </div>
      </div>

      {/* --- MODALE RAPPORT COMPLET --- */}
      <AnimatePresence>
        {showReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl border border-transparent dark:border-slate-800">
              {/* Le reste de ta modale reste identique... */}
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10 transition-colors">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="text-indigo-600" /> Rapport Mensuel
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Classe : {selectedClass}</p>
                </div>
                <button onClick={() => setShowReport(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-500/20">
                        <p className="text-emerald-800 dark:text-emerald-400 font-bold text-sm uppercase">Moyenne Globale</p>
                        <p className="text-4xl font-black text-emerald-600 mt-2">{classAvg}/20</p>
                    </div>
                 </div>
                 {/* ... (Reste de ton tableau de rapport) ... */}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}