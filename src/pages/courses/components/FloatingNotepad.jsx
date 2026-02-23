import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, X, ChevronDown, Save } from 'lucide-react';
import { useUser } from '../../../context/UserContext';

export const FloatingNotepad = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notes, handleNoteChange } = useUser();

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-[2rem] w-80 overflow-hidden"
                    >
                        {/* Header du bloc-notes */}
                        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <StickyNote size={18} />
                                <span className="font-bold text-sm">Mes Notes</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg">
                                <ChevronDown size={20} />
                            </button>
                        </div>

                        {/* Zone d'édition */}
                        <div className="p-4">
                            <textarea
                                value={notes}
                                onChange={(e) => handleNoteChange(e.target.value)}
                                placeholder="Note ici ce qui est important..."
                                className="w-full h-64 bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-4 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/30 outline-none resize-none"
                            />
                            <div className="mt-3 flex justify-between items-center">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Sauvegarde automatique</span>
                                <Save size={14} className="text-emerald-500" />
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="bg-indigo-600 text-white p-5 rounded-full shadow-xl shadow-indigo-200 dark:shadow-none"
                    >
                        <StickyNote size={28} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};