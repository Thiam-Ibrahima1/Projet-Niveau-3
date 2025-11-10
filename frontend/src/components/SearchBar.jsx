export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="mb-6 fade-in">
      <input
        type="text"
        placeholder=" Rechercher une tâche..."
        value={searchTerm}
        // Met à jour le terme de recherche à chaque saisie
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
      />
    </div>
  );
}