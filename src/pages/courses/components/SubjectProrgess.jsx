import { motion } from 'framer-motion';

export const SubjectProgress = ({ subject, percentage, color }) => (
  <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-none flex-1 min-w-[200px] transition-colors">
    <div className="flex justify-between items-center mb-3">
      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{subject}</span>
      <span className={`text-xs font-black px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-700/50 ${color.text}`}>
        {percentage}%
      </span>
    </div>
    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full rounded-full ${color.bg}`}
      />
    </div>
  </div>
);