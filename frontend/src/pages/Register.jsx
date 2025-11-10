/**
 * Permet à l'utilisateur de s'inscrire à l'application.
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  // États pour les champs du formulaire
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: ''
  });
  
  // États pour les messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  // Méthode d'authentification
  const { register } = useAuth();

  /**
   * Met à jour les champs du formulaire.
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Gère la soumission du formulaire d'inscription.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation des champs requis
    if (!formData.username || !formData.email || !formData.password) {
      setError(' Veuillez remplir tous les champs requis');
      setLoading(false);
      return;
    }

    // Validation des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError(' Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    // Validation de la longueur du mot de passe
    if (formData.password.length < 6) {
      setError(' Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    // Vérifie si l'email est déjà utilisé
    const existingUser = localStorage.getItem(`user_${formData.email}`);
    if (existingUser) {
      setError(' Cet email est déjà utilisé');
      setLoading(false);
      return;
    }

    // Crée les données de l'utilisateur
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      address: formData.address || 'Non spécifiée',
      tasks: [],
      createdAt: new Date().toISOString()
    };

    // Inscrit l'utilisateur
    register(formData.email, userData);
    setSuccess(' Inscription réussie !');

    // Redirige vers le tableau de bord après 1.5 secondes
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dedfe3ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '3rem',
        width: '100%',
        maxWidth: '480px'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#667eea',
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
           Création de compte
        </h2>

        {/* Affichage du message d'erreur */}
        {error && (
          <div style={{
            background: '#fee',
            border: '1px solid #fcc',
            color: '#c33',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.95rem'
          }}>
            {error}
          </div>
        )}

        {/* Affichage du message de succès */}
        {success && (
          <div style={{
            background: '#efe',
            border: '1px solid #cfc',
            color: '#3c3',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.95rem'
          }}>
            {success}
          </div>
        )}

        {/* Formulaire d'inscription */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Champ Nom d'utilisateur */}
          <div>
            <label style={{
              display: 'block',
              color: '#333',
              fontWeight: '600',
              marginBottom: '0.5rem',
              fontSize: '0.95rem'
            }}>
              Nom d'utilisateur *
            </label>
            <input
              type="text"
              name="username"
              placeholder="Ex: Babacar Diop"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
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

          {/* Champ Email */}
          <div>
            <label style={{
              display: 'block',
              color: '#333',
              fontWeight: '600',
              marginBottom: '0.5rem',
              fontSize: '0.95rem'
            }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
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

          {/* Champ Adresse */}
          <div>
            <label style={{
              display: 'block',
              color: '#333',
              fontWeight: '600',
              marginBottom: '0.5rem',
              fontSize: '0.95rem'
            }}>
              Adresse
            </label>
            <input
              type="text"
              name="address"
              placeholder="123 Rue Wakhinane, Pikine"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
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

          {/* Champ Mot de passe */}
          <div>
            <label style={{
              display: 'block',
              color: '#333',
              fontWeight: '600',
              marginBottom: '0.5rem',
              fontSize: '0.95rem'
            }}>
              Mot de passe *
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
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

          {/* Champ Confirmation du mot de passe */}
          <div>
            <label style={{
              display: 'block',
              color: '#333',
              fontWeight: '600',
              marginBottom: '0.5rem',
              fontSize: '0.95rem'
            }}>
              Confirmer le mot de passe *
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
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

          {/* Bouton d'inscription */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#999' : '#667eea',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem'
            }}
          >
            {loading ? ' Inscription...' : ' S\'inscrire'}
          </button>
        </form>

        {/* Lien vers la page de connexion */}
        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.95rem'
        }}>
          Déjà inscrit ?{' '}
          <Link to="/login" style={{
            color: '#667eea',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}