import { motion } from 'framer-motion';
import { triggerConfetti } from '../../../utilitaires/celebration';

export function RewardBadge ({ badge, isUnlocked }) {
  const handleBadgeClick = () => {
      if (isUnlocked) {
          triggerConfetti();
      }
  };

  return (
    <motion.div 
      onClick={handleBadgeClick}
      whileTap={{ scale: 0.9 }}
      whileHover={isUnlocked ? { scale: 1.1, rotate: 5 } : {}}
      className={`relative group flex flex-col items-center p-4 rounded-3xl transition-all duration-300 border-2 ${
          isUnlocked 
          ? 'bg-white dark:bg-slate-800 border-indigo-100 dark:border-indigo-500/20 shadow-md cursor-pointer' 
          : 'bg-slate-100 dark:bg-slate-900 border-dashed border-slate-200 dark:border-slate-800 opacity-60'
      }`}
    >
      <div className={`text-4xl mb-2 ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
        {badge.icon}
      </div>
      <span className={`text-[10px] font-extrabold uppercase tracking-tighter text-center ${
          isUnlocked ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'
      }`}>
        {isUnlocked ? badge.name : 'Verrouillé'}
      </span>

      {/* Tooltip sombre */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-slate-700 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20 shadow-xl">
        {badge.desc}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45"></div>
      </div>
    </motion.div>
  );
}