import { createContext, useContext, useState, useEffect } from 'react';

const apiUrl = 'http://127.0.0.1:8000/api'; 
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

   useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            const refreshToken = localStorage.getItem('refresh_token');

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // 1. On tente d'utiliser l'access_token actuel
                let response = await fetch(`${apiUrl}/auth/me`, { 
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // 2. Si le token est expiré (401) et qu'on a un refresh_token, on le renouvelle
                if (response.status === 401 && refreshToken) {
                    const refreshRes = await fetch(`${apiUrl}/auth/refresh-token`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refresh: refreshToken })
                    });

                    if (refreshRes.ok) {
                        const refreshData = await refreshRes.json();
                        const newAccessToken = refreshData.access || refreshData.token;
                        
                        // On sauvegarde le nouveau token
                        localStorage.setItem('access_token', newAccessToken);
                        
                        // On refait la requête vers /auth/me avec le NOUVEAU token
                        response = await fetch(`${apiUrl}/auth/me`, {
                            headers: { 'Authorization': `Bearer ${newAccessToken}` }
                        });
                    } else {
                        // Le refresh_token est aussi expiré ou invalide
                        logout();
                        setLoading(false);
                        return;
                    }
                }

                // 3. On traite la réponse finale (la première si elle était bonne, ou la deuxième après le refresh)
                if (response.ok) {
                    const data = await response.json();
                    setUser({ ...data.user, ...data.student });
                    setIsAuthenticated(true);
                } else {
                    logout(); 
                }
            } catch (error) {
                console.error("Erreur de vérification du token:", error);
                logout(); // Par sécurité en cas de crash réseau sévère
            } finally {
                // On signale à l'application que la vérification est terminée
                setLoading(false);
            }
        };
        
        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // CORRECTION : Django attend "email", on mappe donc credentials.username sur email
                body: JSON.stringify({ 
                    email: credentials.email, 
                    password: credentials.password 
                }) 
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.access || data.token);
                if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
                
                setIsAuthenticated(true);
                
                const profileRes = await fetch(`${apiUrl}/auth/me`, {
                    headers: { 'Authorization': `Bearer ${data.access || data.token}` }
                });
                
                const profileData = await profileRes.json();
                // CORRECTION : On fusionne à nouveau
                setUser({ ...profileData.user, ...profileData.student });
                return true;
            } else {
                console.error("Identifiants refusés par Django");
                return false;
            }
        } catch (error) {
            console.error("Erreur réseau lors de la connexion:", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = async (newUserData) => {
        setUser(prev => ({ ...prev, ...newUserData }));
        try {
            // VRAI slash final ajouté ici : /users/profile/
            await fetch(`${apiUrl}/users/profile`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify(newUserData)
            });
        } catch (error) {
            console.error("Erreur de mise à jour du profil:", error);
        }
    };

    const isAdmin = user?.is_staff === true;

    const [notes, setNotes] = useState(localStorage.getItem('edukator_notes') || "");
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [notifications, setNotifications] = useState([]); 
    const [chatHistory, setChatHistory] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(prev => !prev);
    const toggleFocusMode = () => setIsFocusMode(!isFocusMode);
    
    const updateNotes = (content) => {
        setNotes(content);
        localStorage.setItem('edukator_notes', content);
    };

    const clearNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const sendMessage = async (message) => {
        // 1. On ajoute le message de l'utilisateur à l'UI
        setChatHistory(prev => [...prev, { role: 'user', content: message }]);

        try {
            const token = localStorage.getItem('access_token');
            
            // 2. Appel à l'API (sans le slash final, comme dans ton urls.py)
            const response = await fetch(`${apiUrl}/ai/explain`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                // CORRECTION MAJEURE : On envoie les clés exigées par AIExplainRequestSerializer
                body: JSON.stringify({ 
                    question_text: message,
                    student_answer: "Je pose une question générale" // Valeur factice pour satisfaire le serializer
                }) 
            });

            // Si Django renvoie une erreur (ex: 400 Bad Request ou 401 Unauthorized)
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erreur renvoyée par Django:", errorData);
                throw new Error("Erreur lors de la requête API");
            }

            const data = await response.json();
            console.log("Réponse de Django:", data);
            
            // 3. Construction de la réponse à afficher
            // On récupère "explanation" et on ajoute les "steps" (étapes) s'il y en a
            let aiResponse = data.explanation || "Je n'ai pas d'explication.";
            
            if (data.steps && data.steps.length > 0) {
                aiResponse += "\n\nÉtapes recommandées :\n- " + data.steps.join("\n- ");
            }
            
            // 4. On ajoute la réponse de l'IA à l'UI
            setChatHistory(prev => [...prev, { 
                role: 'assistant', 
                content: aiResponse 
            }]);

        } catch (error) {
            console.error("Erreur IA:", error);
            setChatHistory(prev => [...prev, { 
                role: 'assistant', 
                content: "Désolé, je n'ai pas pu contacter le serveur. Vérifie ta console." 
            }]);
        }
    };

    return (
        <UserContext.Provider value={{ 
            user, isAuthenticated, loading, login, logout, updateUser, isAdmin,
            notes, updateNotes, 
            isFocusMode, toggleFocusMode, 
            notifications, clearNotification,
            chatHistory, sendMessage,
            isMobileMenuOpen, setIsMobileMenuOpen,
            darkMode, toggleDarkMode
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);