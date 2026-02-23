import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ArrowRight, HelpCircle } from 'lucide-react';
import { useClasse } from '../../../context/ClasseContext';

export const QuizMode = ({ homework, onExit }) => {
  const { submitHomework } = useClasse();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({}); 

  const questions = homework.questions || [];
  const currentQuestion = questions[currentStep]; 

  const handleFinish = () => {
    // On formate intelligemment selon le type de question
    const formattedAnswers = questions.map(q => {
        const isQCM = q.answers && q.answers.length > 0;
        return {
            question_id: q.id,
            // Si c'est un QCM, on envoie l'ID du choix. Sinon, null.
            answer_id: isQCM ? answers[q.id] : null,
            // Si c'est du texte libre, on envoie le texte. Sinon, vide.
            response_text: isQCM ? "" : (answers[q.id] || "")
        };
    });

    submitHomework(homework.id, formattedAnswers);
    onExit();
  };

  // Sécurité si aucune question n'est chargée
  if (!currentQuestion) return null;

  // Détecte si la question actuelle possède des choix de réponses
  const isQCM = currentQuestion.answers && currentQuestion.answers.length > 0;

  return (
    <div className="fixed inset-0 bg-slate-50 dark:bg-slate-900 z-50 flex flex-col transition-colors">
      <div className="p-6 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <HelpCircle size={24} />
          </div>
          <h2 className="font-black text-xl text-slate-900 dark:text-white">{homework.title}</h2>
        </div>
        <button onClick={onExit} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
          <X size={28} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-slate-800 p-12 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-700"
            >
              <span className="text-indigo-500 dark:text-indigo-400 font-black text-xs uppercase tracking-widest">
                Question {currentStep + 1} / {questions.length}
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-4 mb-8">
                {currentQuestion.question || "Pas de question définie"}
              </h3>
              
              {/* AFFICHAGE CONDITIONNEL : QCM ou TEXTE */}
              {isQCM ? (
                <div className="flex flex-col gap-3">
                    {currentQuestion.answers.map((ans) => (
                        <button
                            key={ans.id}
                            onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: ans.id }))}
                            className={`w-full p-4 text-left rounded-2xl border-2 font-bold transition-all ${
                                answers[currentQuestion.id] === ans.id 
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' 
                                : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-200 dark:hover:border-indigo-500/50'
                            }`}
                        >
                            {ans.choice_text}
                        </button>
                    ))}
                </div>
              ) : (
                <textarea 
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                    className="w-full h-40 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-700 dark:text-slate-200 font-medium resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    placeholder="Écris ta réponse ici..."
                />
              )}

              <div className="mt-10 flex justify-end">
                {currentStep < questions.length - 1 ? (
                  <button 
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl font-black hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all"
                  >
                    Suivant <ArrowRight size={20} />
                  </button>
                ) : (
                  <button 
                    onClick={handleFinish}
                    className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-lg shadow-emerald-100 dark:shadow-none"
                  >
                    Envoyer le devoir <CheckCircle size={20} />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};