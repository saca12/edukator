import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { useClasse } from '../../context/ClasseContext';
import { useState } from 'react';
import { 
  Camera, Settings, ShieldCheck, Mail, MapPin, 
  BookCheck, GraduationCap, PenTool, Timer, Lock 
} from 'lucide-react';
import { StatCard } from './components/StatCard';
import SettingsModal from '../../components/SettingsModal';
import { RewardBadge } from './components/RewardBadge';

// Liste des badges (en attendant qu'ils viennent de ton API)
const AVAILABLE_BADGES = [
    { id: 1, name: "Premier Pas", icon: "🚀", desc: "Termine ton premier cours", criteria: "courses" },
    { id: 2, name: "Génie", icon: "🧠", desc: "Obtiens 18 en Maths", criteria: "grades" },
    { id: 3, name: "Assidu", icon: "🔥", desc: "Connecte-toi 3 jours de suite", criteria: "login" },
    { id: 4, name: "Scientifique", icon: "🔬", desc: "Termine 5 cours de sciences", criteria: "courses" },
    { id: 5, name: "Bilingue", icon: "🇬🇧", desc: "Moyenne > 16 en Anglais", criteria: "grades" }
];

export default function ProfilePage() {
  const { user, darkMode } = useUser();
  const { courses, grades, dashboardStats } = useClasse();
  const [showSettings, setShowSettings] = useState(false);

  // ÉCRAN DE CHARGEMENT : Sécurité vitale car les données arrivent de l'API avec un délai
  if (!user) {
      return (
          <div className="flex-1 flex items-center justify-center min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
              <div className="animate-pulse flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-500 font-medium">Chargement de ton profil...</p>
              </div>
          </div>
      );
  }

  // Calculs dynamiques basés sur les vraies données de l'API
  const completedCount = courses?.filter(c => c.progress === 100).length || 0;

  // Adaptation aux champs Django (username, first_name, email)
  const displayName = user.first_name || user.username || "Étudiant";
  const userEmail = user.email || `${displayName.toLowerCase().replace(/\s/g, '')}@edukator.fr`;
  
  // Si l'utilisateur n'a pas d'avatar dans la BDD, on en génère un joli
  const avatarUrl = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}&backgroundColor=b6e3f4`;

  // Logique d'obtention des badges
  const checkUnlock = (badge) => {
    switch(badge.id) {
        case 1: return completedCount >= 1;
        case 2: return grades?.some(g => g.subject === 'Maths' && g.score >= 18);
        case 3: return true; // TODO: Logique de connexion consécutive
        case 4: return courses?.filter(c => (['SVT', 'Physique', 'Sciences'].includes(c.subject)) && c.progress === 100).length >= 5;
        case 5: 
            const angGrades = grades?.filter(g => g.subject === 'Anglais') || [];
            return angGrades.length > 0 && (angGrades.reduce((a, b) => a + (b.score || 0), 0) / angGrades.length) > 16;
        default: return badge.criteria === 'courses' ? completedCount >= 5 : false;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 p-4 md:p-10 bg-[#F8FAFC] dark:bg-slate-950 min-h-screen transition-colors"
    >
      <AnimatePresence>
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      </AnimatePresence>

      <header className="mb-10 flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Mon Portail</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Vue d'ensemble de tes performances.</p>
        </div>
        <button
         onClick={() => setShowSettings(true)}
         className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-100 transition-all shadow-sm">
          <Settings size={20} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* COLONNE GAUCHE */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm text-center transition-colors">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <img 
                src={avatarUrl} 
                alt="Profil" 
                className="w-full h-full rounded-full bg-indigo-50 dark:bg-slate-700 border-4 border-white dark:border-slate-700 shadow-lg object-cover"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full border-4 border-white dark:border-slate-800 hover:scale-110 transition-transform">
                <Camera size={16} />
              </button>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{displayName}</h2>
            <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-6 uppercase tracking-wider">
              {user.level || "Niveau 1"}
            </p>
            
            <div className="flex flex-col gap-3 text-left border-t border-slate-50 dark:border-slate-700 pt-6">
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
                <Mail size={16} /> <span>{userEmail}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
                <MapPin size={16} /> <span>{user.location || "Burkina, Bobo-Dioulasso"}</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 dark:bg-indigo-950 rounded-[2.5rem] p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-indigo-300" />
              <h3 className="font-bold">Statut du compte</h3>
            </div>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Ton compte est sécurisé. Tu as validé <strong>{completedCount} cours</strong> jusqu'à présent.
            </p>
          </div>
        </div>

        {/* COLONNE DROITE */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* STATS */}
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Performances</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StatCard label="Cours" value={dashboardStats?.courseProgress || "0%"} icon={BookCheck} color="bg-indigo-500" />
                <StatCard 
                    label="Moyenne" 
                    value={dashboardStats?.average || "0/20"} 
                    icon={GraduationCap} 
                    color="bg-emerald-500"
                    chartData={user?.stats?.gradeHistory || [10, 12, 14, 13, 15]} // Données par défaut pour le graph si vide
                    chartColor="#10b981"
                />
                <StatCard label="Devoirs" value={dashboardStats?.homeworksCount || 0} icon={PenTool} color="bg-orange-500" />
                <StatCard label="Temps" value={dashboardStats?.studyTime || "0h"} icon={Timer} color="bg-purple-500" />
            </div>
          </div>

          {/* RÉCOMPENSES */}
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-700 shadow-sm flex-1 transition-colors">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Mes Récompenses</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {AVAILABLE_BADGES.map(badge => (
                <RewardBadge 
                  key={badge.id} 
                  badge={badge} 
                  isUnlocked={checkUnlock(badge)} 
                />
              ))}
            </div>

            {/* Barre de progression */}
            <div className="mt-12 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 text-center">Prochain Objectif : Diplômé</h4>
                <div className="flex items-center gap-4 justify-center">
                    <span className="text-3xl grayscale opacity-50 dark:invert">🎓</span>
                    <div className="flex-1 max-w-xs">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1">
                            <span>Progression</span>
                            <span>{Math.min(completedCount * 10, 100)}%</span>
                        </div>
                        <div className="w-full h-2 bg-white dark:bg-slate-700 rounded-full overflow-hidden border border-slate-100 dark:border-slate-600">
                            <div 
                                className="bg-indigo-500 h-full transition-all duration-1000" 
                                style={{ width: `${Math.min((completedCount/10)*100, 100)}%` }} 
                            />
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}