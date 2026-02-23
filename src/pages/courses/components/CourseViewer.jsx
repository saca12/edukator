import { motion } from 'framer-motion';
import { useUser } from '../../../context/UserContext';
import { useClasse } from '../../../context/ClasseContext';
import { triggerConfetti } from '../../../utilitaires/celebration';
import { ChevronLeft, CheckCircle, FileText, Video, MessageCircle, Maximize2, Minimize2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { FloatingNotepad } from './FloatingNotepad';

export default function CourseViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFocusMode, toggleFocusMode } = useUser();
  const { courses, completeCourse } = useClasse();
  
  const course = courses.find(c => c.id === parseInt(id)) || courses[0];

  const handleFinish = () => {
    completeCourse(course.id);
    triggerConfetti();
  };

  return (
    <div className={`min-h-screen transition-all ${isFocusMode ? 'bg-slate-900' : 'bg-white dark:bg-slate-950'} flex flex-col`}>
      <header className={`h-16 border-b flex items-center justify-between px-6 sticky top-0 z-30 backdrop-blur-md ${
        isFocusMode 
        ? 'bg-slate-900/90 border-slate-800 text-white' 
        : 'bg-white/80 dark:bg-slate-900/80 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white'
      }`}>
        <button onClick={() => navigate('/cours')} className="flex items-center gap-2 hover:text-indigo-500 transition-colors">
          <ChevronLeft size={20} />
          {!isFocusMode && "Retour aux cours"}
        </button>

        <div className="flex items-center gap-4">
          <h2 className="font-black truncate max-w-[200px] md:max-w-none">
            {course.title}
          </h2>
          <button 
            onClick={toggleFocusMode}
            className={`p-2 rounded-xl transition-all ${
              isFocusMode ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
            title={isFocusMode ? "Quitter le mode focus" : "Mode focus"}
          >
            {isFocusMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>

        <button 
            onClick={handleFinish} 
            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Terminer
        </button>
      </header>

      <div className="flex flex-1">
        {/* ZONE DE LECTURE */}
        <div className={`flex-1 p-12 transition-all duration-700 ${isFocusMode ? 'max-w-4xl mx-auto' : ''}`}>
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-slate dark:prose-invert lg:prose-xl max-w-none"
          >
            <span className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-sm">{course.subject}</span>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white mt-2 mb-8">{course.title}</h1>
            
            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 mb-8">
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "Bienvenue dans ce module. Aujourd'hui, nous allons explorer les concepts fondamentaux de {course.title}. Prenez des notes, un quiz vous attend à la fin."
                </p>
            </div>

            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg mb-6">
                Le contenu du cours s'affiche ici. En mode Focus, les marges s'élargissent pour une lecture sans fatigue oculaire, simulant l'expérience d'un livre ou d'une liseuse.
            </p>
            
            <div className="aspect-video bg-slate-900 rounded-[2.5rem] mb-10 flex items-center justify-center text-white overflow-hidden group cursor-pointer relative shadow-lg">
                <Video size={60} className="group-hover:scale-110 transition-transform text-indigo-400" />
                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase">Vidéo de cours incluse</span>
                </div>
            </div>
          </motion.article>

          <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-center">
            <button 
                onClick={handleFinish}
                disabled={course.progress === 100}
                className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black text-lg transition-all shadow-xl ${
                    course.progress === 100 
                    ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-default' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95'
                }`}
            >
              <CheckCircle size={24} />
              {course.progress === 100 ? 'Cours validé !' : 'J\'ai terminé ce cours'}
            </button>
          </div>
        </div>

        {/* BARRE LATÉRALE RESSOURCES */}
        {!isFocusMode && (
          <aside className="w-80 border-l border-slate-100 dark:border-slate-800 p-8 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
            <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter text-sm">Ressources</h4>
            <div className="flex flex-col gap-4">
              <button className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:shadow-sm transition-all text-left">
                <FileText className="text-indigo-500" size={20} />
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Support PDF</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">2.4 MB</span>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:shadow-sm transition-all text-left">
                <MessageCircle className="text-indigo-500" size={20} />
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Poser une question</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">Réponse sous 24h</span>
                </div>
              </button>
            </div>
          </aside>
        )}
      </div>
      <FloatingNotepad />
    </div>
  );
}