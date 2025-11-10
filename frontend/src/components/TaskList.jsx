import TaskItem from './TaskItem';

export default function TaskList({
  tasks,
  filter,
  searchTerm,
  onUpdate,
  onDelete,
  onToggleComplete
}) {
  // Filtrage des tâches
  let filteredTasks = tasks;

  // Application du filtre
  if (filter === 'active') {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (filter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  }

  // Application de la recherche
  if (searchTerm) {
    filteredTasks = filteredTasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#667eea',
        margin: '0 0 1.5rem 0'
      }}>
        {/* Titre dynamique pour le filtre */}
        {filter === 'all' && ' Toutes les Tâches'}
        {filter === 'active' && ' Tâches Actives'}
        {filter === 'completed' && ' Tâches Complétées'}
      </h2>

      {/* Message si aucune tâche n'est trouvée */}
      {filteredTasks.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          color: '#999'
        }}>
          <p style={{ fontSize: '1.2rem', margin: 0 }}>
            {filter === 'all' && 'Aucune tâche. Commencez à en ajouter ! '}
            {filter === 'active' && 'Aucune tâche active. Vous êtes à jour ! '}
            {filter === 'completed' && 'Aucune tâche complétée encore.'}
          </p>
        </div>
      ) : (
        // Affichage de la liste des tâches
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredTasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}