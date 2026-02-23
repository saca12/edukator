import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';
import { useUser } from '../context/UserContext'; // Ajuste le chemin selon ton arborescence

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser(); // Récupération de la fonction login depuis le Context

  // États pour les champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Appel à la fonction login du Context (qui gère l'appel API Django)
    const success = await login({ email, password });

    if (success) {
      navigate('/profil'); // Ou '/profil' selon ta route principale
    } else {
      setError("Identifiant ou mot de passe incorrect.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* CÔTÉ GAUCHE : VISUEL & MESSAGE */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-400 rounded-full blur-3xl opacity-50" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-12">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <GraduationCap size={32} />
            </div>
            <span className="text-3xl font-black tracking-tighter">Edukator</span>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-black text-white leading-tight"
          >
            L'école de demain, <br /> 
            <span className="text-indigo-200">entre tes mains.</span>
          </motion.h1>
        </div>

        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-[2rem] border border-white/20 inline-flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-400 flex items-center justify-center">
              <ShieldCheck className="text-white" />
            </div>
            <p className="text-white font-medium">
              Plateforme sécurisée et conforme au programme national.
            </p>
          </div>
        </div>
      </div>

      {/* CÔTÉ DROIT : FORMULAIRE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <h2 className="text-4xl font-black text-slate-900 mb-2">Bon retour !</h2>
          <p className="text-slate-500 mb-8 font-medium">Connecte-toi pour retrouver tes cours et tes badges.</p>

          {/* Affichage des erreurs */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: alexandre.dupont@univ.fr"
                required
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Mot de passe</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`mt-4 w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700 hover:-translate-y-1 active:scale-95'}`}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-400 text-sm font-medium">
              Pas encore de compte ? 
              <Link to="/subscribe" className="text-indigo-600 font-black hover:underline ml-1">S'inscrire gratuitement</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}