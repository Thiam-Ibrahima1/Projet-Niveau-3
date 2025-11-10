/**
 * Composant StatCard - Affiche une carte de statistique avec un titre et une valeur.
 */
export default function StatCard({ title, value, icon, color }) {
  // Définit les classes de couleur
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    purple: 'text-purple-600 bg-purple-50'
  };

  return (
    <div className={`rounded-lg shadow-md p-6 ${colorClasses[color] || colorClasses.blue} fade-in`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 font-semibold text-sm">{title}</p>
          <p className="text-4xl font-bold mt-2">{value}</p>
        </div>
        {/* Affichage de l'icône avec une transparence */}
        <div className="text-5xl opacity-20">{icon}</div>
      </div>
    </div>
  );
}