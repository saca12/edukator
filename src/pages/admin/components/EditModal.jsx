import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, AlertCircle } from 'lucide-react';

export default function EditModal({ item, type, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...item });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (formData.title.trim().length < 5) newErrors.title = "Titre trop court.";
    if (type === 'cours' && (formData.progress < 0 || formData.progress > 100)) newErrors.progress = "Progression invalide.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) { onSave(item.id, formData); onClose(); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-colors">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-transparent dark:border-slate-800">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Édition Rapide</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 ml-1">Titre du contenu</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`w-full mt-2 px-5 py-4 border rounded-2xl outline-none transition-all ${errors.title ? 'border-red-500 bg-red-50/30' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500'}`} />
          </div>

          {type === 'cours' && (
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 ml-1">Progression (%)</label>
              <input type="number" value={formData.progress} onChange={(e) => setFormData({...formData, progress: e.target.value})} className="w-full mt-2 px-5 py-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-indigo-500" />
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 font-black text-slate-400 dark:text-slate-500 transition-colors">Annuler</button>
            <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 dark:shadow-none transition-all hover:bg-indigo-700">
              <Save size={18} /> Confirmer
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}