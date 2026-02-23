import { motion } from 'framer-motion';
import { Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export const HomeworkCard = ({ task, onStart }) => {
  const isUrgent = task.priority === "High";
  const isDone = task.status === "Terminé";

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border shadow-sm dark:shadow-none flex flex-col justify-between h-full transition-all ${
        isUrgent ? 'border-orange-200 dark:border-orange-500/30 bg-orange-50/10 dark:bg-orange-500/5' : 'border-slate-100 dark:border-slate-700'
      }`}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            isDone ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
          }`}>
            {task.subject}
          </span>
          {isUrgent && !isDone && (
            <div className="flex items-center gap-1 text-orange-500 dark:text-orange-400 animate-pulse">
              <AlertCircle size={14} />
              <span className="text-[10px] font-bold uppercase">Urgent</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-black text-slate-800 dark:text-white leading-tight mb-2">{task.title}</h3>
        
        <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500 mb-6">
          <div className="flex items-center gap-1 text-xs font-bold">
            <Clock size={14} /> {task.type || "Devoir"}
          </div>
          <div className="flex items-center gap-1 text-xs font-bold">
            <Calendar size={14} /> {task.deadline}
          </div>
        </div>
      </div>

      <button 
        onClick={onStart}
        className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${
        isDone 
        ? 'bg-emerald-500 dark:bg-emerald-600 text-white cursor-default' 
        : 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-indigo-600 dark:hover:bg-indigo-500'
      }`}>
        {isDone ? 'Terminé' : 'Commencer le devoir'}
      </button>
    </motion.div>
  );
};