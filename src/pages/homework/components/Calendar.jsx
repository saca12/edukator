import { motion } from 'framer-motion';

export const Calendar = () => {
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const currentDate = new Date().getDate();
  const dates = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-none transition-colors">
      <div className="flex justify-between items-center mb-4">
        <span className="font-black text-slate-900 dark:text-white text-sm italic">Février 2026</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-600" />
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days.map(d => (
          <span key={d} className="text-[10px] font-bold text-slate-400 dark:text-slate-500 text-center">{d}</span>
        ))}
        {dates.map(date => (
          <div 
            key={date}
            className={`text-xs p-2 rounded-lg flex items-center justify-center font-bold transition-all ${
              date === currentDate 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {date}
          </div>
        ))}
      </div>
    </div>
  );
};