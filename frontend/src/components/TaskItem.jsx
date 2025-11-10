import { useNavigate } from 'react-router-dom';

export default function TaskItem({ task, onUpdate, onDelete, onToggleComplete }) {
  const navigate = useNavigate();

  const handleEditClick = () => {
    onUpdate(task);
  };

  return (
    <div style={{
      padding: '1.5rem',
      border: '2px solid #ddd',
      borderRadius: '12px',
      background: task.completed ? '#f9fafb' : '#fff',
      transition: 'all 0.3s',
      marginBottom: '1rem'
    }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {/* Checkbox pour marquer la tâche comme complétée/active */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task._id)}
          style={{
            width: '24px',
            height: '24px',
            cursor: 'pointer',
            marginTop: '0.2rem'
          }}
        />

        {/* Contenu principal de la tâche */}
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            margin: '0 0 0.5rem 0',
            color: task.completed ? '#999' : '#333',
            textDecoration: task.completed ? 'line-through' : 'none' // Barré si complétée
          }}>
            {task.title} {/* Affichage du titre */}
          </h3>

          {/* Description optionnelle */}
          {task.description && (
            <p style={{
              color: '#666',
              fontSize: '0.95rem',
              margin: '0 0 1rem 0'
            }}>
              {task.description}
            </p>
          )}

          {/* Badges d'information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {task.priority && (
              <span style={{
                background: getPriorityColor(task.priority).bg,
                color: getPriorityColor(task.priority).text,
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'inline-block',
                alignSelf: 'flex-start' 
              }}>
                {getPriorityLabel(task.priority)}
              </span>
            )}

            {/* Date d'échéance en dessous de la priorité */}
            {task.dueDate && (
              <span style={{
                background: '#e0e7ff',
                color: '#667eea',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'inline-block', 
                alignSelf: 'flex-start' // Aligné à gauche, en dessous
              }}>
                 {new Date(task.dueDate).toLocaleDateString('fr-FR')} {/* Affichage formaté de la date */}
              </span>
            )}

            {/* Statut complétée : En dessous si applicable */}
            {task.completed && (
              <span style={{
                background: '#d1fae5',
                color: '#059669',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'inline-block',
                alignSelf: 'flex-start'
              }}>
                 Complétée
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Boutons d'action : Modifier et Supprimer */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button
          onClick={handleEditClick}
          style={{
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#d97706'}
          onMouseLeave={(e) => e.target.style.background = '#f59e0b'}
        >
           Modifier
        </button>
        <button
          onClick={() => onDelete(task._id)}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#dc2626'}
          onMouseLeave={(e) => e.target.style.background = '#ef4444'}
        >
           Supprimer
        </button>
      </div>
    </div>
  );
}

//  Fonctions utilitaires pour obtenir les couleurs et labels des priorités
function getPriorityColor(priority) {
  const colors = {
    low: { bg: '#d1fae5', text: '#059669' },
    medium: { bg: '#fef3c7', text: '#d97706' },
    high: { bg: ' #fee2e2', text: '#dc2626' }
  };
  return colors[priority] || { bg: '#f3f4f6', text: '#6b7280' };
}

function getPriorityLabel(priority) {
  const labels = {
    low: '🟢 Basse',
    medium: '🟡 Moyenne',
    high: '🔴 Haute'
  };
  return labels[priority] || priority;
}