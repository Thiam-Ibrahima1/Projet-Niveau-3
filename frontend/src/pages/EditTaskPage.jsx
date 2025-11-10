import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';

// Page dédiée à la modification d'une tâche
export default function EditTaskPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Récupération des identifiants de la tâche
  const taskId = location.pathname.split('/').pop();
  const { title: stateTitle } = location.state || { title: null };
  const [dynamicTitle, setDynamicTitle] = useState(stateTitle);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérification de l'authentification et chargement des données
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadTaskData = () => {
      setLoading(true);
      const userEmail = localStorage.getItem('currentUser');
      const userData = JSON.parse(localStorage.getItem(`user_${userEmail}`));

      if (userData && userData.tasks) {
        const foundTask = userData.tasks.find(t => t._id === taskId);
        if (foundTask) {
          setTask(foundTask);
          if (!stateTitle) {
            setDynamicTitle(foundTask.title);
          }
        } else {
          console.error("Tâche non trouvée avec l'ID:", taskId);
          navigate('/dashboard');
        }
      } else {
        console.error("Données utilisateur ou tâches non trouvées.");
        navigate('/dashboard');
      }
      setLoading(false);
    };

    loadTaskData();
  }, [isAuthenticated, navigate, taskId, stateTitle]);

  // Gestion de la mise à jour de la tâche
  const handleUpdateTask = async (updatedData) => {
    if (!task || !updatedData) return;

    const userEmail = localStorage.getItem('currentUser');
    const userData = JSON.parse(localStorage.getItem(`user_${userEmail}`));
    const updatedTasks = userData.tasks.map(t =>
      t._id === taskId ? { ...t, ...updatedData } : t
    );
    userData.tasks = updatedTasks;
    localStorage.setItem(`user_${userEmail}`, JSON.stringify(userData));
    
    navigate('/dashboard');
  };

  // Rendu de la page
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f3f4f6',
      padding: '6rem 1rem' 
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        {/* Titre stylisé : "Modification de la tâche [titre]" */}
        <div style={{
          background: '#e0e7ff',
          border: '2px solid #c7d2fe',
          borderRadius: '16px',
          padding: '1.5rem 2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          fontFamily: 'Georgia, serif'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <span style={{
              fontSize: '2.5rem',
              color: '#667eea'
            }}>
              
            </span>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#4563e7ff',
              margin: 0,
              lineHeight: '1.3',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              Modification de la tâche{' '}
              <span style={{
                fontWeight: '600',
                color: '#4d46dfff'
              }}>
                {dynamicTitle || '...'}
              </span>
            </h2>
          </div>
        </div>

        {/* Affichage du formulaire seulement si la tâche est chargée */}
        {loading && <p style={{ textAlign: 'center', color: '#666' }}>Chargement de la tâche...</p>}
        {!loading && !task && <p style={{ textAlign: 'center', color: '#dc2626' }}>Erreur : impossible de charger la tâche.</p>}
        {!loading && task && (
          <TaskForm
            onAddTask={handleUpdateTask}
            loading={false}
            existingTasks={[]}
            taskToEdit={task}
            onCloseEditForm={() => navigate('/dashboard')}
          />
        )}
      </div>
    </div>
  );
}