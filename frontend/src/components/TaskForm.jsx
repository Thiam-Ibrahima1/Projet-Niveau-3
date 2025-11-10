import { useState, useEffect } from 'react';

export default function TaskForm({ onAddTask, loading, existingTasks, taskToEdit, onCloseEditForm }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Effet pour pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (taskToEdit) {
      setTaskTitle(taskToEdit.title);
      setTaskDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate || '');
      setPriority(taskToEdit.priority || 'medium');
    } else {
      // Réinitialisation en mode ajout
      setTaskTitle('');
      setTaskDescription('');
      setDueDate('');
      setPriority('');
    }
  }, [taskToEdit]);

  // Validation et soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation : titre obligatoire
    if (!taskTitle.trim()) {
      setError(' Le titre est obligatoire !');
      return;
    }

    // Validation : date d'échéance obligatoire
    if (!dueDate) {
      setError(' La date d\'échéance est obligatoire !');
      return;
    }

    // Validation : priorité obligatoire
    if (!priority) {
      setError(' La priorité est obligatoire !');
      return;
    }

    // Vérification doublon uniquement en mode ajout
    if (!taskToEdit) {
      const taskExists = existingTasks.some(
        task => task.title.toLowerCase().trim() === taskTitle.toLowerCase().trim()
      );
      
      if (taskExists) {
        setError(' Une tâche avec ce titre existe déjà !');
        return;
      }
    }

    // Création de l'objet tâche
    const taskData = {
      _id: taskToEdit ? taskToEdit._id : Date.now().toString(),
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      dueDate: dueDate,
      priority: priority,
      completed: taskToEdit ? taskToEdit.completed : false
    };

    // Appel de la fonction parent
    onAddTask(taskData);

    // Réinitialisation uniquement en mode ajout
    if (!taskToEdit) {
      setTaskTitle('');
      setTaskDescription('');
      setDueDate('');
      setPriority('');
    }
    
    // MESSAGE DE SUCCÈS
    setSuccess(taskToEdit ? ' Tâche modifiée avec succès !' : ' Tâche ajoutée avec succès !');
    setTimeout(() => {
      setSuccess('');
      if (taskToEdit) {
        onCloseEditForm();
      }
    }, 3000);
  };

  // Rendu du formulaire
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      {/* Titre du formulaire */}
      {!taskToEdit && (
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#667eea',
          marginBottom: '1.5rem',
          margin: '0 0 1.5rem 0'
        }}>
          Ajouter une Tâche
        </h2>
      )}

      {/* Zone d'affichage des erreurs */}
      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontWeight: '600'
        }}>
          {error}
        </div>
      )}

      {/* Zone d'affichage des succès */}
      {success && (
        <div style={{
          background: '#d1fae5',
          border: '1px solid #a7f3d0',
          color: '#059669',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontWeight: '600',
          animation: 'fadeIn 0.5s ease-in'
        }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Champ titre - obligatoire */}
        <div>
          <label style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#333'
          }}>
            Titre * <span style={{color: '#e74c3c'}}>(obligatoire)</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Faire les courses..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            disabled={loading}
            required
          />
        </div>

        {/* Champ description - optionnel */}
        <div>
          <label style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#333'
          }}>
            Description
          </label>
          <textarea
            placeholder="Détails optionnels..."
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            rows="3"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              boxSizing: 'border-box',
              fontFamily: 'inherit'
            }}
            disabled={loading}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Date d'échéance - obligatoire */}
          <div>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              Date d'échéance * <span style={{color: '#e74c3c'}}>(obligatoire)</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              disabled={loading}
              required
            />
          </div>

          {/* Priorité - obligatoire */}
          <div>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              Priorité * <span style={{color: '#e74c3c'}}>(obligatoire)</span>
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              disabled={loading}
              required
            >
              <option value="">-- Sélectionner --</option>
              <option value="low">🟢 Basse</option>
              <option value="medium">🟡 Moyenne</option>
              <option value="high">🔴 Haute</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? '#999' : '#667eea',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s'
          }}
        >
          {loading ? ' En cours...' : (taskToEdit ? ' Modifier' : ' Ajouter')}
        </button>
      </form>
    </div>
  );
}