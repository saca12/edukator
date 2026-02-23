import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, User, Lock, CheckCircle2, Ungroup } from 'lucide-react';

// Assure-toi que cette URL correspond à celle de tes Contexts
const apiUrl = import.meta.env.VITE_API_URL;

export default function Subscribe() {
  const navigate = useNavigate();

  // États du formulaire
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Appel à ton API Django pour l'inscription
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Adapte ces clés selon ce que ton Django (Serializer) attend !
          last_name: last_name, 
          password: password,
          email: email,
          first_name: first_name, // Optionnel, selon ton backend
        }),
      });

      if (response.ok) {
        // Inscription réussie : on redirige vers le login
        navigate('/login', { state: { message: "Inscription réussie ! Connecte-toi." } });
      } else {
        const data = await response.json();
        // Affichage des erreurs renvoyées par Django (ex: "Ce nom d'utilisateur existe déjà")
        const errorMessage = data.detail || data.username?.[0] || "Une erreur est survenue lors de l'inscription.";
        setError(errorMessage);
      }
    } catch (err) {
      setError("Impossible de contacter le serveur. Vérifie ta connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* CÔTÉ GAUCHE : VISUEL & AVANTAGES */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-5%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-5%] right-[-10%] w-96 h-96 bg-indigo-400 rounded-full blur-3xl opacity-50" />

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
            transition={{ delay: 0.2 }}
            className="text-6xl font-black text-white leading-tight mb-6"
          >
            Commence ton <br/> voyage vers <br/> <span className="text-indigo-200">l'excellence.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-indigo-100 text-lg font-medium max-w-md"
          >
            Rejoins des milliers d'étudiants qui utilisent l'IA pour booster leurs notes et comprendre leurs cours plus vite.
          </motion.p>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative z-10 bg-indigo-700/30 backdrop-blur-sm p-6 rounded-3xl border border-indigo-500/30"
        >
            <h3 className="text-white font-bold mb-4">Ce qui t'attend :</h3>
            <ul className="space-y-3">
                {['Tuteur IA disponible 24/7', 'Suivi de progression détaillé', 'Quiz interactifs personnalisés'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-indigo-100 text-sm font-medium">
                        <CheckCircle2 size={18} className="text-emerald-400" />
                        {item}
                    </li>
                ))}
            </ul>
        </motion.div>
      </div>

      {/* CÔTÉ DROIT : FORMULAIRE D'INSCRIPTION */}
      <div className="flex-1 flex flex-col justify-center items-center p-2 lg:p-24 relative">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h2 className="text-4xl font-black text-slate-900 mb-3">Créer un compte</h2>
            <p className="text-slate-500 font-medium">Remplis tes informations pour démarrer.</p>
          </motion.div>

          {/* Affichage des erreurs d'inscription */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubscribe} className="flex flex-col gap-5">
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Nom</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Dupont"
                    required
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Prenom</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Alexandre"
                    required
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Adresse email</label>
              <div className="relative">
                <Ungroup className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: alexandre.dupont@univ.fr"
                    required
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 caractères"
                    required
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`mt-4 w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700 hover:-translate-y-1 active:scale-95'}`}
            >
              {isLoading ? 'Création en cours...' : "S'inscrire"}
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-400 text-sm font-medium">
              Tu as déjà un compte ?{' '}
              <Link to="/login" className="text-indigo-600 font-black hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}