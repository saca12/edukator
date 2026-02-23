import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import { SideBar } from './components/SideBar';
import LoadingScreen from './components/LoadingScreen';
import { Toaster } from 'react-hot-toast';
import { Menu } from 'lucide-react';
import { Theme } from "@radix-ui/themes";
import { useEffect, useState } from 'react';

// Pages Élèves
import Login from './components/Login';
import Courses from './pages/courses/Courses';
import HomeworkPage from './pages/homework/HomeworkPage';
import GradesPage from './pages/grade/Grade';
import ProfilePage from './pages/profile/ProfilePage';
import AITutor from './pages/tutor/AITutor';
import Subscribe from './components/Subscribe';

// Pages Admin
import AdminDashboard from './pages/admin/components/AdminDashboard';
import AdminPage from './pages/admin/AdminPage';

export default function App() {
  // CORRECTION 1 : On utilise 'loading' (comme défini dans UserContext) et pas 'isLoading'
  const { user, isAdmin, loading, isFocusMode, setIsMobileMenuOpen, darkMode } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isLoginPage, setIsLoginPage] = useState(
    location.pathname === '/login' || location.pathname === '/subscribe'
  );

  // CORRECTION 2 : Le useEffect doit TOUJOURS être avant le return conditionnel (LoadingScreen)
  useEffect(() => {
    // Si l'application est encore en train de vérifier le token, on NE FAIT RIEN.
    if (loading) return;

    const isAuthRoute = location.pathname === '/login' || location.pathname === '/subscribe' || location.pathname === '/';
    
    setIsLoginPage(isAuthRoute || !user);

    // Si pas d'utilisateur, que le chargement est terminé, et qu'on n'est pas sur une page publique -> redirection
    if (!user && !isAuthRoute) {
      navigate("/login");
    }
  }, [location.pathname, user, loading, navigate]); // On ajoute 'loading' et 'navigate' aux dépendances

  // GESTION DU CHARGEMENT
  // On affiche l'écran de chargement tant que checkAuth() n'a pas fini dans le UserContext
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Theme appearance={darkMode ? "dark" : "light"} accentColor="indigo" grayColor="slate" radius="large">
      <div className={darkMode ? "dark" : ""}>
        <div className="flex min-h-screen dark:bg-slate-900 max-h-screen overflow-hidden">
        <Toaster position="top-right" reverseOrder={false} />
        
        {/* Affichage conditionnel de la Sidebar */}
        {!isLoginPage && !isFocusMode && <SideBar />}
        
        <main className={`flex-1 transition-all duration-300 overflow-y-auto`}>
          {/* Bouton Hamburger Mobile */}
          {!isFocusMode && (
            <div className="lg:hidden p-4 dark:bg-slate-800  border-b dark:border-slate-900 bg-slate-100 border-slate-200 flex justify-between items-center sticky top-0 z-30">
                <span className="font-black text-indigo-600">EDUKATOR</span>
                <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 bg-slate-50 dark:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300"
                >
                    <Menu size={24} />
                </button>
            </div>
          )}
          
          <Routes>
            {/* ROUTES PUBLIQUES */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/subscribe" element={<Subscribe />} /> 
            
            {/* ROUTES ÉLÈVES */}
            <Route path="/cours" element={<Courses />} />
            <Route path="/devoirs" element={<HomeworkPage />} />
            <Route path="/notes" element={<GradesPage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/tuteur" element={<AITutor />} />

            {/* ROUTES ADMIN */}
            {isAdmin ? (
              <>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/manage" element={<AdminPage />} />
              </>
            ) : (
              <Route path="/admin/*" element={<Navigate to="/profil" />} />
            )}
          </Routes>
        </main>
      </div>
      </div>
    </Theme>
  );
}