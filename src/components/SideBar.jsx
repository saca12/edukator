import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ClipboardList, BarChart3, User, GraduationCap, Sparkles, Settings, X } from 'lucide-react';
import { useUser } from '../context/UserContext';

const menuItems = [
    { label: 'Mon profil', icon: User, path: '/profil' },
    { label: 'Mes cours', icon: BookOpen, path: '/cours' },
    { label: 'Mes devoirs', icon: ClipboardList, path: '/devoirs' },
    { label: 'Mes notes', icon: BarChart3, path: '/notes' },
    { label: 'Tuteur IA', icon: Sparkles, path: '/tuteur' },
];

export function SideBar() {
    const { user, notifications, isAdmin, isMobileMenuOpen, setIsMobileMenuOpen } = useUser();
    const unreadCount = notifications.length;

    return (
        <> 
            {/* Overlay sombre mobile */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
            
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-full sm:w-80 
                bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
                transform transition-transform duration-300 ease-in-out flex flex-col
                lg:relative lg:translate-x-0 lg:w-[20vw]
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-8 flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                        <GraduationCap className="text-white" size={24} />
                    </div>
                    <div className='flex justify-between w-full items-center'>
                        <span className="text-2xl text-slate-900 dark:text-white font-bold tracking-tight">Edukator</span>
                        <button 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <nav className="flex flex-col gap-2 px-4 mt-4">
                    {isAdmin && (
                        <NavLink to="/admin" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) => `
                                relative group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 overflow-hidden
                                ${isActive ? '' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}
                            `}>
                            <motion.div 
                                layoutId="activeTab"
                                className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 border-r-4 border-indigo-600"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                            <Settings size={20} className="relative z-10 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500" />
                            <span className="relative z-10 font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">Console Admin</span>
                        </NavLink>
                    )}

                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => `
                                    relative group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 overflow-hidden
                                    ${isActive ? '' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}
                                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <motion.div 
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 border-r-4 border-indigo-600"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}

                                        {item.label === 'Mes devoirs' && unreadCount > 0 && (
                                            <span className="absolute right-2 top-2 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white dark:border-slate-900">
                                                {unreadCount}
                                            </span>
                                        )}

                                        <Icon 
                                            className={`relative z-10 transition-colors ${
                                                isActive 
                                                ? 'text-indigo-600 dark:text-indigo-400' 
                                                : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400'
                                            }`} 
                                            size={20} 
                                        />
                                        
                                        <span className={`relative z-10 font-medium transition-colors ${
                                            isActive 
                                            ? 'text-indigo-700 dark:text-indigo-300' 
                                            : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                                        }`}>
                                            {item.label}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        {/* CORRECTION : Ajout d'un fallback si user.avatar est vide et object-cover pour éviter l'écrasement */}
                        <img 
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || user?.first_name || 'Eleve'}&background=e0e7ff&color=4f46e5&bold=true`} 
                            alt="Avatar" 
                            className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-slate-800 object-cover" 
                        />
                        <div className="flex flex-col">
                            {/* CORRECTION : Assurer l'affichage du nom même si la clé s'appelle first_name */}
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {user?.name || user?.first_name || 'Utilisateur'}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {user?.level || user?.classe || 'Élève'}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}