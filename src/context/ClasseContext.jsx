import { createContext, useContext, useEffect, useState } from 'react';
import { triggerConfetti } from '../utilitaires/celebration';
import { useUser } from './UserContext';

const apiUrl = import.meta.env.VITE_API_URL;
const ClasseContext = createContext();

export const ClasseProvider = ({ children }) => {
    // 1. Données dynamiques
    const [courses, setCourses] = useState([]);
    const [homeworks, setHomeworks] = useState([]);
    const [grades, setGrades] = useState([]);
    const { isAuthenticated } = useUser(); // Récupérer l'état de connexion
    const [subjects, setSubjects] = useState([]); // Pour stocker [{id: "...", name: "Maths"}, ...]

    // 2. UI States for CMS
    const [editingId, setEditingId] = useState(null);
    const [activeTab, setActiveTab] = useState("cours"); 
    const [selectedClass, setSelectedClass] = useState("2nde A");
    const [contentData, setContentData] = useState({
        title: '', subject: 'Maths', sections: []
    });

    // Helper pour générer les headers avec le Token JWT
    const getAuthHeaders = () => {
        const token = localStorage.getItem('access_token');
        return token 
            ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            : { 'Content-Type': 'application/json' };
    };

    // Charger les données initiales depuis l'API
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!isAuthenticated || !token) return;
        // Récupérer les cours (avec slash final et sécurité Array)
        // --- DANS ClasseContext.jsx ---

        const fetchData = async () => {
            try {
                const [coursesRes, subjectsRes, exercisesRes, gradesRes] = await Promise.all([
                    fetch(`${apiUrl}/lessons`, { headers: getAuthHeaders() }),
                    fetch(`${apiUrl}/subjects`, { headers: getAuthHeaders() }),
                    fetch(`${apiUrl}/exercises`, { headers: getAuthHeaders() }),
                    fetch(`${apiUrl}/exercises/my-grades`, { headers: getAuthHeaders() })
                ]);

                // 1. GESTION DES COURS ET MATIÈRES (Reste inchangé)
                let subjectsData = [];
                if (coursesRes.ok && subjectsRes.ok) {
                    const rawCourses = await coursesRes.json();
                    const rawSubjects = await subjectsRes.json();
                    
                    const coursesData = Array.isArray(rawCourses) ? rawCourses : (rawCourses.results || []);
                    subjectsData = Array.isArray(rawSubjects) ? rawSubjects : (rawSubjects.results || []);

                    setSubjects(subjectsData);

                    const mappedCourses = coursesData.map(course => {
                        const subjectObj = subjectsData.find(s => s.id === course.subject_id);
                        return {
                            ...course,
                            subject: subjectObj ? subjectObj.name : (course.chapter_title?.split(':')[0]?.trim() || "Général"),
                            progress: course.is_completed ? 100 : 0,
                            content: course.content?.rich_text_content 
                                ? [{ subtitle: course.title, text: course.content.rich_text_content }]
                                : [{ subtitle: "Introduction", text: "Contenu en cours de chargement..." }]
                        };
                    });
                    setCourses(mappedCourses);
                }

                // 2. GESTION DES NOTES (On le fait AVANT les devoirs maintenant)
                let gradesData = [];
                if (gradesRes.ok) {
                    const rawGrades = await gradesRes.json();
                    gradesData = Array.isArray(rawGrades) ? rawGrades : (rawGrades.results || []);
                    setGrades(gradesData);
                }

                // 3. GESTION DES DEVOIRS
                if (exercisesRes.ok) {
                    const rawExo = await exercisesRes.json();
                    const exoData = Array.isArray(rawExo) ? rawExo : (rawExo.results || []);

                    const mappedHomeworks = exoData.map(exo => {
                        const subjectObj = subjectsData.find(s => s.id === exo.subject_id);
                        
                        // LA MAGIE EST ICI : On cherche si l'exercice existe dans le tableau des notes
                        const hasBeenCompleted = gradesData.some(grade => grade.id === exo.id);

                        return {
                            ...exo,
                            subject: subjectObj ? subjectObj.name : "Général", 
                            deadline: exo.due_date || "Sans date", 
                            // Si on a trouvé une note correspondante, c'est "Terminé", sinon "A faire"
                            status: hasBeenCompleted ? 'Terminé' : 'A faire', 
                            priority: exo.priority || "Normal",
                            questions: (exo.questions || []).map(q => ({
                                ...q,
                                question: q.question_text 
                            })),
                            type: "Exercice"
                        };
                    });

                    setHomeworks(mappedHomeworks);
                }

            } catch (err) {
                console.error("Erreur lors du mappage des données :", err);
            }
        };

        fetchData();
    }, [isAuthenticated]);

    console.log("Cours chargés :", courses);
    console.log("Matières chargées :", subjects);
    console.log("Devoirs chargés :", homeworks);

    // --- ACTIONS SUR LES COURS ---
    const addCourse = async (newCourse) => {
        try {
            const res = await fetch(`${apiUrl}/lessons`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(newCourse)
            });
            if (res.ok) {
                const data = await res.json();
                setCourses(prev => [...prev, data]);
            }
        } catch (error) {
            console.error("Erreur ajout cours:", error);
        }
    };

    const updateCourse = async (id, updatedFields) => {
        setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
        try {
            await fetch(`${apiUrl}/lessons/${id}/`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(updatedFields)
            });
        } catch (error) { console.error("Erreur modification cours:", error); }
    };

    const deleteCourse = async (id) => {
        setCourses(prev => prev.filter(c => c.id !== id));
        try {
            await fetch(`${apiUrl}/lessons/${id}/`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
        } catch (error) { console.error("Erreur suppression cours:", error); }
    };

    const updateCourseProgress = async (courseId, newProgress) => {
        setCourses(prev => prev.map(c => c.id === courseId ? { ...c, progress: newProgress } : c));
        if (newProgress === 100) {
            triggerConfetti();
            try {
                await fetch(`${apiUrl}/lessons/${courseId}/complete`, {
                    method: 'POST',
                    headers: getAuthHeaders()
                });
            } catch (error) { console.error("Erreur validation cours:", error); }
        }
    };

    // --- ACTIONS SUR LES DEVOIRS ---
    const addHomework = async (newHomework) => {
        try {
            const res = await fetch(`${apiUrl}/exercises`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(newHomework)
            });
            if (res.ok) {
                const data = await res.json();
                setHomeworks(prev => [...prev, data]);
            }
        } catch (error) { console.error("Erreur ajout devoir:", error); }
    };

    const updateHomework = async (id, updatedFields) => {
        setHomeworks(prev => prev.map(h => h.id === id ? { ...h, ...updatedFields } : h));
        try {
            await fetch(`${apiUrl}/exercises/${id}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(updatedFields)
            });
        } catch (error) { console.error("Erreur modification devoir:", error); }
    };

    const deleteHomework = async (id) => {
        setHomeworks(prev => prev.filter(h => h.id !== id));
        try {
            await fetch(`${apiUrl}/exercises/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
        } catch (error) { console.error("Erreur suppression devoir:", error); }
    };

 const submitHomework = async (homeworkId, studentAnswers = []) => {
    // 1. Mise à jour locale (optimiste) du statut du devoir
    setHomeworks(prev => prev.map(h => h.id === homeworkId ? { ...h, status: "Terminé" } : h));
    
    try {
        // 2. Envoi des réponses au backend
        const res = await fetch(`${apiUrl}/exercises/${homeworkId}/submit`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ answers: studentAnswers }) 
        });

        // 3. NOUVEAU : Si la soumission a réussi, on rafraîchit les notes !
        if (res.ok) {
            const gradesRes = await fetch(`${apiUrl}/exercises/my-grades`, { 
                headers: getAuthHeaders() 
            });
            if (gradesRes.ok) {
                const rawGrades = await gradesRes.json();
                const gradesData = Array.isArray(rawGrades) ? rawGrades : (rawGrades.results || []);
                setGrades(gradesData); // Met à jour l'affichage dans Grade.jsx
            }
        }
    } catch (error) { 
        console.error("Erreur soumission devoir:", error); 
    }
};

    // --- UTILS CMS ---
    const loadIntoCMS = (item, type) => {
        setActiveTab(type);
        setEditingId(item.id);
        setSelectedClass(item.classId);
        setContentData({
            title: item.title || item.name || '',
            subject: item.subject || '',
            sections: type === "cours" ? (item.content || []) : (item.questions || [])
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- CALCULS DES STATISTIQUES SÉCURISÉS ---
    // Sécurité : On s'assure que c'est bien un tableau avant de faire un map/reduce/filter
    const safeCourses = Array.isArray(courses) ? courses : [];
    const safeHomeworks = Array.isArray(homeworks) ? homeworks : [];
    const safeGrades = Array.isArray(grades) ? grades : [];

    // --- DANS ClasseContext.jsx (Remplacez la section des stats) ---

// 1. On crée le dashboard à partir des MATIÈRES (les 8 reçues) et non des COURS
// --- CALCULS DES STATISTIQUES (ClasseContext.jsx) ---

const globalProgress = subjects.map(sub => {
    // On lie les cours à la matière par ID ou par nom pour plus de sécurité
    const subjectCourses = safeCourses.filter(c => 
        c.subject_id === sub.id || c.subject === sub.name
    );
    
    const total = subjectCourses.reduce((acc, c) => acc + (c.progress || 0), 0);
    
    // Dictionnaire des couleurs correspondant exactement aux noms de seed_data.py
    const subjectStyles = {
        'Mathématiques': { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-100' },
        'Physique-Chimie': { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-100' },
        'SVT': { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-100' },
        'Français': { bg: 'bg-rose-500', text: 'text-rose-600', border: 'border-rose-100' },
        'Histoire-Géo': { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-100' },
        'Anglais': { bg: 'bg-violet-500', text: 'text-violet-600', border: 'border-violet-100' },
        'Philosophie': { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-100' },
    };

    return {
        ...sub,
        progress: subjectCourses.length > 0 ? Math.round(total / subjectCourses.length) : 0,
        count: subjectCourses.length,
        // On applique la couleur définie ou une couleur grise par défaut
        color: subjectStyles[sub.name] || { bg: 'bg-slate-500', text: 'text-slate-600', border: 'border-slate-100' }
    };
});

    const averageGrade = safeGrades.length > 0
        ? (safeGrades.reduce((acc, g) => acc + (g.score || 0), 0) / safeGrades.length).toFixed(1)
        : "0.0";

    const pendingHomeworks = safeHomeworks.filter(h => h.status !== "Terminé").length;
    
    const dashboardStats = {
        courseProgress: `${globalProgress.reduce((acc, sub) => acc + sub.progress, 0) / globalProgress.length || 0}%`,
        average: `${averageGrade}/20`,
        homeworksCount: pendingHomeworks,
        studyTime: `${(Math.round((safeCourses.reduce((acc, c) => acc + (c.progress || 0), 0) / safeCourses.length || 0) * 10)) / 10}h` 
    };

    return (
        <ClasseContext.Provider value={{ 
            courses, homeworks, grades, globalProgress, dashboardStats, 
            updateCourseProgress, submitHomework,
            addCourse, deleteCourse, updateCourse,
            addHomework, updateHomework, deleteHomework,
            editingId, setEditingId, activeTab, setActiveTab,
            loadIntoCMS, contentData, setContentData,
            selectedClass, setSelectedClass
        }}>
            {children}
        </ClasseContext.Provider>
    );
};

export const useClasse = () => useContext(ClasseContext);