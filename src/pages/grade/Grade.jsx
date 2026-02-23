import { motion } from 'framer-motion';
import { useClasse } from '../../context/ClasseContext';
import { TrendingUp, FileSpreadsheet, Award } from 'lucide-react';

export default function GradesPage() {
    const { grades } = useClasse();
    
    // SÉCURITÉ API
    const safeGrades = grades || [];
    console.log("Safe grades array:", safeGrades); // Debug : vérifier que c'est bien un tableau
    
    // Calcul de la moyenne sécurisé (évite division par 0)
    const average = safeGrades.length > 0 
        ? (safeGrades.reduce((acc, curr) => acc + (curr.score || 0), 0) / safeGrades.length).toFixed(1)
        : "0.0";

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 p-4 md:p-10 bg-[#F8FAFC] dark:bg-slate-950 min-h-screen transition-colors"
        >
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Mes Notes</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Analyse tes performances.</p>
                </div>
                {/* Carte moyenne */}
                <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 w-full md:w-auto">
                    <div className="bg-emerald-100 dark:bg-emerald-500/20 p-3 rounded-2xl text-emerald-600 dark:text-emerald-400">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Moyenne</p>
                        <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{average}/20</p>
                    </div>
                </div>
            </header>

            {/* Tableau des notes */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                            <th className="p-4 md:p-6 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Évaluation</th>
                            <th className="p-4 md:p-6 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Matière</th>
                            <th className="p-4 md:p-6 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                            <th className="p-4 md:p-6 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Note</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                        {safeGrades.length > 0 ? (
                            safeGrades.map((grade) => (
                                <motion.tr 
                                    key={grade.id}
                                    whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.05)' }}
                                    className="transition-colors group hover:bg-slate-50 dark:hover:bg-slate-750"
                                >
                                    <td className="p-4 md:p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-indigo-50 dark:bg-indigo-500/10 p-2 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                <FileSpreadsheet size={18} />
                                            </div>
                                            <span className="font-bold text-slate-800 dark:text-slate-200">{grade.title || 'Devoir'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 md:p-6">
                                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold">
                                            {grade.subject}
                                        </span>
                                    </td>
                                    <td className="p-4 md:p-6 text-sm text-slate-400 dark:text-slate-500">{grade.date || 'Non défini'}</td>
                                    <td className="p-4 md:p-6 text-right">
                                        <span className={`text-lg font-black ${(grade.score || 0) >= 15 ? 'text-emerald-500 dark:text-emerald-400' : 'text-orange-500 dark:text-orange-400'}`}>
                                            {grade.score || 0}
                                        </span>
                                        <span className="text-slate-400 dark:text-slate-600 font-bold">/{grade.total || 20}</span>
                                    </td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center p-8 text-slate-500">Aucune note disponible pour le moment.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Carte motivation */}
            <div className="mt-8 bg-indigo-600 dark:bg-indigo-900 rounded-[2rem] p-8 text-white flex items-center justify-between overflow-hidden relative shadow-lg">
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2 text-white">Continue comme ça !</h3>
                    <p className="text-indigo-100 dark:text-indigo-200">Ta progression est excellente.</p>
                </div>
                <Award size={80} className="absolute right-10 opacity-20 rotate-12" />
            </div>
        </motion.div>
    );
}