/**
 * Permet à l'utilisateur de se connecter à l'application.
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  // Détection responsive
  const isMobile = window.innerWidth < 768;
  
  // Méthode d'authentification
  const { login } = useAuth();

  /**
   * Gère la soumission du formulaire de connexion.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Récupère les données de l'utilisateur depuis le localStorage
    const userData = localStorage.getItem(`user_${email}`);

    if (!userData) {
      setError(' Email ou mot de passe incorrect');
      setLoading(false);
      return;
    }

    const user = JSON.parse(userData);

    // Vérifie le mot de passe
    if (user.password !== password) {
      setError(' Email ou mot de passe incorrect');
      setLoading(false);
      return;
    }

    // Connecte l'utilisateur
    login(email, user);
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dedfe3ff)',
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
        maxWidth: '420px'
      }}>
        
        {/* Header bienvenue : Description générale */}
        <div style={{ marginBottom: '1rem' }}>
          <h1 style={{
            fontSize: isMobile ? '1.5rem' : '2rem',
            color: '#627cf1ff',
            margin: '0 0 0.66rem 0',
            fontWeight: 'bold',
            lineHeight: '1.3'
          }}>
            Bienvenue dans mon application Tawfékh
          </h1>
          <p style={{
            color: '#64748b', // Gris subtil
            fontSize: '1rem',
            margin: 18,
            lineHeight: '1.4'
          }}>
            <i>Connectez-vous pour gérer vos tâches et organiser votre quotidien.</i>
          </p>
        </div>

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

        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          {/* Bouton de soumission */}
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
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.background = '#5568d3')}
            onMouseLeave={(e) => !loading && (e.target.style.background = '#667eea')}
          >
            {loading ? ' Connexion...' : ' Se Connecter'}
          </button>
        </form>

        {/* Lien vers la page d'inscription */}
        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.95rem'
        }}>
          Pas encore inscrit ?{' '}
          <Link to="/register" style={{
            color: '#667eea',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}