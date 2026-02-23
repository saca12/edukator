import { useState } from 'react';
import { useClasse } from '../../context/ClasseContext';
import { 
  PlusCircle, BookOpen, Trash2, Edit2, 
  Type, AlignLeft, ArrowRight, X, Save,
  ClipboardList, HelpCircle, MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { setEditingId, courses, homeworks, addCourse, deleteCourse, updateCourse, updateHomework, addHomework, deleteHomework, activeTab, setActiveTab, selectedClass, setSelectedClass, editingId, contentData, setContentData, loadIntoCMS } = useClasse();
  
  const addBlock = () => {
    const newBlock = activeTab === "cours" 
      ? { subtitle: '', text: '' } 
      : { question: '', answer: '' };
    setContentData({ ...contentData, sections: [...contentData.sections, newBlock] });
  };

  const updateBlock = (index, field, value) => {
    const updated = [...contentData.sections];
    updated[index][field] = value;
    setContentData({ ...contentData, sections: updated });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setContentData({ title: '', subject: 'Maths', sections: [] });
  }

  const handlePublish = (e) => {
    e.preventDefault();
    if (contentData.sections.length === 0) return toast.error("Ajoutez au moins un contenu !");

    const payload = {
      title: contentData.title,
      subject: contentData.subject,
      classId: selectedClass,
      [activeTab === "cours" ? "content" : "questions"]: contentData.sections
    };

    if (activeTab === "cours") {
      editingId ? updateCourse(editingId, payload) : addCourse(payload);
    } else {
      editingId ? updateHomework(editingId, payload) : (addHomework ? addHomework(payload) : null);
    }

    toast.success(editingId ? "Mise à jour réussie" : "Publication réussie");
    setEditingId(null);
    setContentData({ title: '', subject: 'Maths', sections: [] });
  };

  return (
    <div className="flex-1 p-10 bg-slate-50 dark:bg-slate-950 min-h-screen font-sans transition-colors">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Studio Admin</h1>
            <div className="flex gap-4 mt-4 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-2xl w-fit transition-colors">
              <button 
                onClick={() => { setActiveTab("cours"); setEditingId(null); }}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${activeTab === "cours" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
              >
                <BookOpen size={18} /> Cours
              </button>
              <button 
                onClick={() => { setActiveTab("devoirs"); setEditingId(null); }}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${activeTab === "devoirs" ? "bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
              >
                <ClipboardList size={18} /> Devoirs
              </button>
            </div>
          </div>

          <div className="flex gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            {["2nde A", "2nde B", "1ère S1"].map(c => (
              <button key={c} onClick={() => setSelectedClass(c)} className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${selectedClass === c ? "bg-slate-900 dark:bg-indigo-600 text-white" : "text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                {c}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <form onSubmit={handlePublish} className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-none transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-2xl ${activeTab === "cours" ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600" : "bg-orange-50 dark:bg-orange-500/10 text-orange-600"}`}>
                  {activeTab === "cours" ? <BookOpen size={24} /> : <ClipboardList size={24} />}
                </div>
                <input 
                  type="text"
                  placeholder={activeTab === "cours" ? "Titre de la leçon..." : "Titre du devoir..."}
                  className="w-full text-2xl font-black border-none outline-none placeholder:text-slate-200 dark:placeholder:text-slate-700 bg-transparent text-slate-900 dark:text-white"
                  value={contentData.title}
                  onChange={(e) => setContentData({...contentData, title: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-6">
                {contentData.sections.map((block, index) => (
                  <div key={index} className="relative p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700 group transition-all hover:bg-white dark:hover:bg-slate-800">
                    <button type="button" onClick={() => setContentData({...contentData, sections: contentData.sections.filter((_, i) => i !== index)})} className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={14} />
                    </button>

                    {activeTab === "cours" ? (
                      <div className="space-y-4">
                        <div className="flex gap-3 items-center text-slate-900 dark:text-slate-100">
                          <Type size={18} className="text-indigo-400" />
                          <input placeholder="Grand point (ex: I. Introduction)" className="w-full bg-transparent font-bold outline-none" value={block.subtitle} onChange={(e) => updateBlock(index, 'subtitle', e.target.value)} />
                        </div>
                        <div className="flex gap-3 items-start">
                          <AlignLeft size={18} className="text-slate-300 dark:text-slate-600 mt-1" />
                          <textarea placeholder="Contenu du paragraphe..." rows={3} className="w-full bg-transparent text-slate-600 dark:text-slate-300 outline-none resize-none" value={block.text} onChange={(e) => updateBlock(index, 'text', e.target.value)} />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex gap-3 items-center text-slate-900 dark:text-slate-100">
                          <HelpCircle size={18} className="text-orange-400" />
                          <input placeholder="Énoncé de la question..." className="w-full bg-transparent font-bold outline-none" value={block.question} onChange={(e) => updateBlock(index, 'question', e.target.value)} />
                        </div>
                        <div className="flex gap-3 items-start">
                          <MessageCircle size={18} className="text-emerald-400 mt-1" />
                          <textarea placeholder="Réponse attendue / Correction..." rows={2} className="w-full bg-transparent text-slate-600 dark:text-slate-300 outline-none resize-none border-l-2 border-emerald-100 dark:border-emerald-800 pl-4" value={block.answer} onChange={(e) => updateBlock(index, 'answer', e.target.value)} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addBlock} className="w-full py-5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] text-slate-400 dark:text-slate-500 font-bold hover:border-indigo-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-2">
                  <PlusCircle size={20} /> {activeTab === "cours" ? "Ajouter un paragraphe" : "Ajouter une question"}
                </button>
              </div>
            </div>

            <button type="submit" className={`w-full py-6 rounded-[2.5rem] font-black text-xl shadow-2xl dark:shadow-none transition-all flex items-center justify-center gap-3 ${activeTab === 'cours' ? 'bg-indigo-600' : 'bg-orange-600'} text-white`}>
              {editingId ? <Save size={24} /> : <ArrowRight size={24} />}
              {editingId ? "Enregistrer les modifications" : `Publier le ${activeTab}`}
            </button>
            {editingId && <div onClick={handleCancelEdit} className="text-center text-slate-500 dark:text-slate-400 mt-2 cursor-pointer hover:underline">Annuler les modifications</div>}
          </form>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 transition-colors">
              <h3 className="font-black text-slate-800 dark:text-white mb-4">Paramètres</h3>
              <select value={contentData.subject} onChange={(e) => setContentData({...contentData, subject: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold outline-none border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
                <option>Maths</option><option>Histoire</option><option>Sciences</option><option>Anglais</option>
              </select>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 min-h-[400px] transition-colors">
              <h3 className="font-black text-slate-800 dark:text-white mb-4">{activeTab === "cours" ? "Cours en ligne" : "Devoirs créés"}</h3>
              <div className="space-y-3">
                {(activeTab === "cours" ? courses : homeworks).filter(item => item.classId === selectedClass).map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl group hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all">
                      <div className="truncate pr-2">
                        <p className="text-sm font-black text-slate-700 dark:text-slate-200 truncate">{item.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{item.subject}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => loadIntoCMS(item, activeTab)} className="p-2 text-slate-300 dark:text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => { if(window.confirm("Supprimer ?")) { activeTab === "cours" ? deleteCourse(item.id) : deleteHomework(item.id); toast.success("Supprimé"); }}} className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}