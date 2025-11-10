/**
 * Permet à l'utilisateur de modifier son profil.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
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
  
  // Accès au contexte d'authentification
  const { user, updateUser } = useAuth();

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
   * Gère la soumission du formulaire - de mise à jour du profil.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation des mots de passe
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError(' Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      // Met à jour le profil de l'utilisateur
      await updateUser(formData);
      setSuccess(' Profil mis à jour avec succès');
      // Redirige vers le tableau de bord après 1.5 secondes
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(' Une erreur est survenue lors de la mise à jour du profil');
    }

    setLoading(false);
  };

  // Initialise le formulaire avec les données de l'utilisateur
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        address: user.address || ''
      });
    }
  }, [user]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
           Mon Profil
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

        {/* Formulaire de mise à jour du profil */}
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
              Nom d'utilisateur
            </label>
            <input
              type="text"
              name="username"
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
              Email
            </label>
            <input
              type="email"
              name="email"
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
              Mot de passe
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
              Confirmer le mot de passe
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

          {/* Bouton de mise à jour */}
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
            {loading ? ' Mise à jour...' : 'Mettre à jour le Profil'}
          </button>
        </form>
      </div>
    </div>
  );
}