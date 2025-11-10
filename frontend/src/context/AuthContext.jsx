/**
 * Context AuthContext - Gère l'authentification de l'application.
 * Fournit les méthodes de connexion, déconnexion, inscription et mise à jour du profil.
 */
import { createContext, useContext, useState, useEffect } from 'react';

// Création du contexte
const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupère l'utilisateur depuis le localStorage au montage
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(
        localStorage.getItem(`user_${currentUser}`)
      );
      if (userData) {
        setUser(userData);
      }
    }
    setLoading(false);
  }, []);

  /**
   * Connecte un utilisateur.
   * Stocke les données dans le localStorage
   */
  const login = (email, userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', email);
    localStorage.setItem(`user_${email}`, JSON.stringify(userData));
  };

  /**
   * Déconnecte l'utilisateur.
   * Supprime les données du localStorage.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  /**
   * Inscrit un nouvel utilisateur.
   * Appelle la méthode login après l'inscription.
   */
  const register = (email, userData) => {
    login(email, userData);
  };

  /**
   * Met à jour les données de l'utilisateur.
   * Met à jour le localStorage et l'état du contexte.
   */
  const updateUser = (updatedData) => {
    const userEmail = localStorage.getItem('currentUser');
    const userData = JSON.parse(localStorage.getItem(`user_${userEmail}`));
    const updatedUser = { ...userData, ...updatedData };
    localStorage.setItem(`user_${userEmail}`, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // Fournit le contexte avec les valeurs
  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, updateUser, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}