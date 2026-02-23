import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 10, -10, 0],
          opacity: 1 
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-2xl shadow-indigo-200 mb-6"
      >
        <GraduationCap size={48} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Edukator</h2>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">
          Préparation de ton espace de travail...
        </p>
      </motion.div>
    </div>
  );
}