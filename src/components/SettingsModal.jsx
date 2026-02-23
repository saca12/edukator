import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Bell, Shield, LogOut, Save, Moon, Sun, Smartphone, Settings, Mail, GraduationCap } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function SettingsModal({ onClose }) {
  const { user, updateUser, darkMode, toggleDarkMode } = useUser();
  const navigate = useNavigate();
  
  // 1. AJOUT : On intègre le niveau (level) dans le state initial
  const [formData, setFormData] = useState({
    name: user?.name || user?.first_name || '',
    email: user?.email || 'etudiant@edukator.fr',
    level: user?.level || user?.classe || '2nde',
    notifications: true,
  });

  const availableLevels = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'];

  const handleSave = async () => {
    try {
        // 2. AJOUT : On envoie le niveau dans la mise à jour
        await updateUser({ 
            name: formData.name, 
            email: formData.email,
            level: formData.level // Assure-toi que c'est le bon nom de champ pour ton backend (level ou classe)
        });
        
        toast.success("Profil mis à jour avec succès !");
        onClose();
        
        // On force le rechargement pour que les cours s'actualisent avec le nouveau niveau
        window.location.reload(); 
    } catch (error) {
        toast.error("Erreur lors de la sauvegarde.");
        console.error(error);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-colors">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-transparent dark:border-slate-800 transition-colors"
      >
        {/* En-tête */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 transition-colors">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 italic uppercase tracking-tighter">
            <Settings className="text-indigo-600" size={24} /> Paramètres
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Corps du formulaire (Défilable) */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Section : Mon Compte */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1">Compte</h3>
            <div className="space-y-4">
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1 transition-colors">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={18} />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 text-slate-900 dark:text-white transition-all"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1 transition-colors">Adresse Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={18} />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 text-slate-900 dark:text-white transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 3. AJOUT : Section Niveau Scolaire */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
                <GraduationCap size={14} /> Niveau Scolaire
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableLevels.map((lvl) => (
                    <button
                        key={lvl}
                        onClick={() => setFormData({...formData, level: lvl})}
                        className={`py-3 px-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                            formData.level === lvl
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 shadow-sm'
                            : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-indigo-200 dark:hover:border-slate-700'
                        }`}
                    >
                        {lvl}
                    </button>
                ))}
            </div>
          </section>

          {/* Section : Apparence & Thème */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1">Préférences visuelles</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => darkMode && toggleDarkMode()}
                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${
                  !darkMode 
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10' 
                  : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <Sun className={!darkMode ? 'text-indigo-600' : 'text-slate-400'} size={28} />
                <span className={`text-sm font-black ${!darkMode ? 'text-indigo-900 dark:text-indigo-400' : 'text-slate-500'}`}>Mode Clair</span>
              </button>

              <button 
                onClick={() => !darkMode && toggleDarkMode()}
                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${
                  darkMode 
                  ? 'border-indigo-600 bg-indigo-500/10' 
                  : 'border-slate-100 dark:border-slate-200 bg-white'
                }`}
              >
                <Moon className={darkMode ? 'text-indigo-400' : 'text-slate-400'} size={28} />
                <span className={`text-sm font-black ${darkMode ? 'text-indigo-400' : 'text-slate-500'}`}>Mode Sombre</span>
              </button>
            </div>
          </section>

          {/* Section : Notifications */}
          <section>
            <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[2rem] transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-indigo-600 dark:text-indigo-400">
                  <Bell size={20} />
                </div>
                <div>
                  <p className="font-black text-slate-800 dark:text-white leading-tight">Notifications Push</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Rappels de cours et devoirs</p>
                </div>
              </div>
              <button 
                onClick={() => setFormData({...formData, notifications: !formData.notifications})}
                className={`w-14 h-8 rounded-full p-1 transition-colors relative ${formData.notifications ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <motion.div 
                  animate={{ x: formData.notifications ? 24 : 0 }}
                  className="w-6 h-6 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          </section>

          {/* Section : Zone de danger */}
          <section className="pt-4">
             <button 
                onClick={handleLogout}
                className="w-full p-5 border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all active:scale-95 shadow-sm"
             >
                <LogOut size={20} /> Déconnexion du compte
             </button>
          </section>

        </div>

        {/* Pied de page Actions */}
        <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex gap-4 transition-colors">
          <button 
            onClick={onClose} 
            className="flex-1 py-4 font-black text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            Annuler
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 hover:bg-indigo-700 dark:hover:bg-indigo-500 hover:-translate-y-1 transition-all"
          >
            <Save size={20} /> Sauvegarder
          </button>
        </div>
      </motion.div>
    </div>
  );
}