import { motion } from 'framer-motion';
import { Clock, BookOpenCheck } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useClasse } from '../../context/ClasseContext';
import { AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, X } from 'lucide-react';
import {StatCard} from './components/StatCard';
import { PenTool, Timer, GraduationCap, BookCheck } from 'lucide-react';
import { RewardBadge } from './components/RewardBadge';
import LoadingScreen from '../../components/LoadingScreen';



const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const CourseCard = ({ course }) => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    whileHover={{ y: -5 }}
    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all"
  >
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <span className="rounded-xl bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
          {course.subject}
        </span>
        {course.progress === 100 && <BookOpenCheck className="text-green-500" size={20} />}
      </div>
      
      <h3 className="text-lg font-bold text-slate-800 h-12 overflow-hidden">
        {course.title}
      </h3>

      {/* Barre de progression visuelle */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${course.progress}%` }}
          className="bg-indigo-500 h-full"
        />
      </div>

      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
        <Clock size={14} />
        {course.duration}
      </div>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const { user, notifications, clearNotification, badges, isLoading } = useUser();
  const { courses, dashboardStats } = useClasse();


  // Filtrer les cours pour n'afficher que ceux du niveau de l'élève
  const filteredCourses = courses.filter(c => c.level === user.level);

  const checkUnlock = (badge) => {
    if (badge.criteria === 'courses') return courses.some(c => c.progress === 100);
    if (badge.criteria === 'grade') return parseFloat(user.stats.gradeHistory.at(-1)) >= 16;
    return false; // Par défaut verrouillé pour l'exemple
  };
  if (isLoading) return <LoadingScreen />;
  return (
    <main className="flex-1 p-10">
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 w-80">
            <AnimatePresence>
                {notifications?.map((n) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        className="bg-white border border-slate-200 shadow-xl p-4 rounded-2xl flex items-start gap-3"
                    >
                        <div className={n.type === 'success' ? 'text-green-500' : 'text-indigo-500'}>
                            {n.type === 'success' ? <CheckCircle size={20}/> : <Info size={20}/>}
                        </div>
                        <p className="text-sm font-medium text-slate-700 flex-1">{n.message}</p>
                        <button onClick={() => clearNotification(n.id)} className="text-slate-400 hover:text-slate-600">
                            <X size={16} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mes statistiques</h1>
          <p className="text-slate-500">Bravo {user.name}, tes efforts paient !</p>
        </div>
      </header>
      <motion.div 
        initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        <StatCard label="Cours" value={dashboardStats.courseProgress} icon={BookCheck} color="bg-indigo-500" />
        
        {/* La carte avec le graphique */}
        <StatCard 
          label="Moyenne" 
          value={dashboardStats.average} 
          icon={GraduationCap} 
          color="bg-emerald-500"
          chartData={user?.stats?.gradeHistory}
          chartColor="#10b981" // emerald-500
        />
        
        <StatCard label="Devoirs" value={dashboardStats.homeworksCount} icon={PenTool} color="bg-orange-500" />
        <StatCard label="Temps" value={dashboardStats.studyTime} icon={Timer} color="bg-purple-500" />
      </motion.div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Tes cours en cours</h2>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {filteredCourses?.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
        {/* Colonne des Badges (prend 1/4) */}
        <div className="lg:col-span-1">
          <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              Mes Succès <span className="text-indigo-300 text-sm">({badges?.filter(checkUnlock)?.length})</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {badges?.map(badge => (
                <RewardBadge 
                  key={badge.id} 
                  badge={badge} 
                  isUnlocked={checkUnlock(badge)} 
                />
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-400/30 rounded-2xl text-xs font-bold transition-colors">
              Voir tous les badges
            </button>
          </div>
        </div>  
        {/* Section Exercices simplifiée */}
        <div className="lg:col-span-3 mt-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Exercices à rendre</h2>
            <div className="bg-white border border-slate-200 rounded-3xl p-4 italic text-slate-400">
                Consultez la liste complète dans l'onglet "Mes devoirs".
            </div>
        </div>
      </motion.div>
    </main>
  );
}