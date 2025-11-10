/**
 * Fichier tailwind.config.js - Configuration de Tailwind CSS.
 * Définit les fichiers à surveiller pour les classes utilitaires.
 */
export default {
  // Fichiers à surveiller pour les classes Tailwind
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  // Thème personnalisé (vide pour l'instant)
  theme: {
    extend: {},
  },
  // Plugins Tailwind (aucun plugin utilisé pour l'instant)
  plugins: [],
}