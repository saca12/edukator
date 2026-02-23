import { motion } from 'framer-motion';
import { Sparkline } from './Sparkline';
import { useNavigate } from 'react-router-dom';

export function StatCard({ label, value, icon: Icon, color, bgLight, chartData, chartColor }) {
  const navigate = useNavigate();
  
  const handleCardClick = (label) => {
    const path = label === "Cours" ? label.toLowerCase() 
      : label.toLowerCase() === "moyenne" ? "notes" 
      : label.toLowerCase() === "devoirs" ? "devoirs" 
      : "profil";
    navigate(`/${path}`);
  }

  return (
    <motion.div 
      onClick={() => handleCardClick(label)}
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-none hover:shadow-md cursor-pointer flex flex-col gap-4 transition-colors"
    >
      <div className="flex items-center gap-4">
        {/* L'icône garde sa couleur mais l'ombre est retirée en dark mode pour éviter l'effet 'sale' */}
        <div className={`p-3 rounded-2xl ${color} shadow-lg shadow-indigo-100 dark:shadow-none`}>
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
        </div>
      </div>
      
      {chartData && (
        <div className="flex items-end justify-between mt-2 pt-4 border-t border-slate-50 dark:border-slate-700/50">
          <Sparkline data={chartData} color={chartColor} />
          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg border border-transparent dark:border-emerald-500/20">
            +12%
          </span>
        </div>
      )}
    </motion.div>
  );
}