import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  //  Vérification de auth + chargement initial des tâches
 
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirige si non connecté
    } else {
      loadTasks();
    }
  }, [isAuthenticated, navigate]);

  // Fonction pour charger les tâches 
  const loadTasks = () => {
    try {
      const userEmail = localStorage.getItem('currentUser');
      if (!userEmail) {
        console.warn('Aucun utilisateur connecté trouvé');
        return;
      }
      
      const userData = JSON.parse(localStorage.getItem(`user_${userEmail}`));
      if (userData && userData.tasks) {
        // Met à jour l'état avec les tâches trouvées
        setTasks(userData.tasks);
        console.log(`Tâches chargées : ${userData.tasks.length}`);
      } else {
        setTasks([]);
        console.log('Aucune tâche trouvée, tableau vide');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tâches :', error);
      setTasks([]);
    }
  };

  // Fonction pour sauvegarder les tâches
  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    try {
      const userEmail = localStorage.getItem('currentUser');
      if (!userEmail) return;
      
      const userData = JSON.parse(localStorage.getItem(`user_${userEmail}`));
      userData.tasks = updatedTasks;
      localStorage.setItem(`user_${userEmail}`, JSON.stringify(userData));
      console.log(`Tâches sauvegardées : ${updatedTasks.length}`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des tâches :', error);
    }
  };

  // Ajout d'une nouvelle tâche
  const handleAddTask = async (taskData) => {
    setLoading(true);
    const newTask = {
      _id: Date.now().toString(),
      ...taskData
    };
    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    setLoading(false);
  };

  // 5. Mise à jour d'une tâche existante
  const handleUpdateTask = async (taskId, updatedData) => {
    const updatedTasks = tasks.map(task =>
      task._id === taskId ? { ...task, ...updatedData } : task
    );
    saveTasks(updatedTasks);
  };

  // Suppression d'une tâche avec confirmation
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      const updatedTasks = tasks.filter(task => task._id !== taskId);
      saveTasks(updatedTasks);
    }
  };

  // Basculer l'état complété d'une tâche
  const handleToggleComplete = async (taskId) => {
    const updatedTasks = tasks.map(task =>
      task._id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  // Gestion du clic sur "Modifier" (navigation vers la page d'édition)
  // Cette fonction est passée à TaskList comme onUpdate, puis à TaskItem.
  // TaskItem l'appelle avec l'objet task pour déclencher la navigation.
  const handleEditTask = (task) => {
    navigate(`/edit/${task._id}`, { state: { title: task.title } });
  };

  
  // Fermeture du formulaire d'édition
  const handleCloseEditForm = () => {
    setTaskToEdit(null);
  };

  // Calcul des statistiques en temps réel (basé sur l'état tasks)
  // Ces stats se mettent à jour automatiquement quand tasks change
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length
  };

  
  // Rendu complet de la page Dashboard
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f4f5f9ff',
      padding: '6rem 1rem'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '2rem', 
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        {/* Section des statistiques */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <StatCard title=" Total" value={stats.total} color="blue" />
          <StatCard title=" Actives" value={stats.active} color="yellow" />
          <StatCard title=" Complétées" value={stats.completed} color="green" />
        </div>

        {/* Formulaire d'ajout de nouvelle tâcheS */}
        <TaskForm
          onAddTask={handleAddTask}
          loading={loading}
          existingTasks={tasks}
          taskToEdit={taskToEdit}
          onCloseEditForm={handleCloseEditForm}
        />

        {/* Barre de recherche */}
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="🔍 Rechercher une tâche..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Filtres de tâches */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {[
            { key: 'all', label: ' Toutes', icon: '' },
            { key: 'active', label: ' Actives', icon: '' },
            { key: 'completed', label: ' Complétées', icon: '' }
          ].map(btn => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                background: filter === btn.key ? '#667eea' : '#ddd',
                color: filter === btn.key ? 'white' : '#333',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>

        {/* Liste des tâches */}
        <TaskList
          tasks={tasks} 
          filter={filter} 
          searchTerm={searchTerm} 
          onUpdate={handleEditTask} 
          onDelete={handleDeleteTask} 
          onToggleComplete={handleToggleComplete}
        />
      </div>
    </div>
  );
}


// Composant StatCard local 
function StatCard({ title, value, color }) {
  const colors = {
    blue: { bg: '#e0e7ff', text: '#667eea' },
    yellow: { bg: '#fef3c7', text: '#f59e0b' },
    green: { bg: '#d1fae5', text: '#10b981' }
  };

  return (
    <div style={{
      background: colors[color].bg,
      borderRadius: '12px',
      padding: '1.5rem',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <p style={{
        color: '#666',
        fontSize: '0.9rem',
        fontWeight: '600',
        margin: '0 0 0.5rem 0'
      }}>
        {title}
      </p>
      <p style={{
        color: colors[color].text,
        fontSize: '2rem',
        fontWeight: 'bold',
        margin: 0
      }}>
        {value}
      </p>
    </div>
  );
}