import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, updateUser } = useAuth();
  const [logoSrc, setLogoSrc] = useState('');
  const [fileInputRef, setFileInputRef] = useState(null);
  const [avatarFileInputRef, setAvatarFileInputRef] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: '', email: '', newPassword: '', confirmPassword: '', avatar: '' });
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const modalRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null); 

  // État responsive
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Chargement logo (styles généreux)
  useEffect(() => {
    const savedLogo = localStorage.getItem('appLogo');
    setLogoSrc(savedLogo || '');
  }, []);

  // Chargement avatar personnalisé pour affichage Navbar
  const getUserAvatar = () => {
    if (!user?.email) return null;
    const userData = JSON.parse(localStorage.getItem(`user_${user.email}`)) || {};
    return userData.avatar || null;
  };

  //  Gestion body overflow
  useEffect(() => {
    if (showProfileModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showProfileModal]);

  // Fermeture menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowProfileModal(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowProfileModal(false);
        setShowMobileMenu(false);
        setShowUserMenu(false);
      }
    };
    if (showProfileModal || showMobileMenu || showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showProfileModal, showMobileMenu, showUserMenu]);

  // Ouverture profil 
  const openProfileModal = () => {
    if (!user?.email) return;
    const userData = JSON.parse(localStorage.getItem(`user_${user.email}`)) || {};
    setProfileForm({
      fullName: userData.fullName || '',
      email: user.email,
      newPassword: '',
      confirmPassword: '',
      avatar: userData.avatar || ''
    });
    setProfileError('');
    setProfileSuccess('');
    setShowProfileModal(true);
  };

  // Upload avatar 
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileError(' Seules les images sont acceptées (jpg, png, etc.)');
      e.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setProfileError(' L\'image est trop grande (max 2MB)');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setProfileForm({ ...profileForm, avatar: base64 });
      setProfileSuccess(' Avatar uploadé ! (Sauvegardez pour confirmer)');
      setTimeout(() => setProfileSuccess(''), 3000);
      e.target.value = '';
    };
    reader.onerror = () => {
      setProfileError(' Erreur lors de l\'upload de l\'avatar');
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  // Soumission profil
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    const { fullName, email, newPassword, confirmPassword, avatar } = profileForm;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setProfileError(' Email invalide !');
      return;
    }
    if (newPassword && (newPassword !== confirmPassword || newPassword.length < 6)) {
      setProfileError(' Mots de passe invalides (min 6, identiques) !');
      return;
    }

    try {
      const currentEmail = user.email;
      let userData = JSON.parse(localStorage.getItem(`user_${currentEmail}`)) || { tasks: [] };

      userData.fullName = fullName;
      if (newPassword) userData.password = newPassword;
      if (avatar) userData.avatar = avatar;

      if (email !== currentEmail) {
        localStorage.removeItem(`user_${currentEmail}`);
        localStorage.setItem(`user_${email}`, JSON.stringify(userData));
        localStorage.setItem('currentUser', email);
      } else {
        localStorage.setItem(`user_${email}`, JSON.stringify(userData));
      }

      if (updateUser) {
        updateUser({ ...user, email, fullName });
      } else {
        window.location.reload();
      }

      setProfileSuccess(' Profil mis à jour (avatar inclus) !');
      setTimeout(() => setShowProfileModal(false), 2000);
    } catch (error) {
      setProfileError(' Erreur lors de la mise à jour.');
    }
  };

  //  Fonctions logo
 
  const getEmailInitial = (email) => (!email ? 'U' : email.charAt(0).toUpperCase());

  const handleLogoClick = (e) => {
    e.stopPropagation();
    if (fileInputRef) fileInputRef.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
      setUploadMessage(' Image invalide (images seulement, max 2MB).');
      setTimeout(() => setUploadMessage(''), 3000);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      localStorage.setItem('appLogo', base64);
      setLogoSrc(base64);
      setUploadMessage(' Logo uploadé !');
      setTimeout(() => setUploadMessage(''), 2000);
    };
    reader.readAsDataURL(file);
  };

  // Nouvelles fonctions pour menu utilisateur
  const handleNavigate = () => {
    setShowUserMenu(false);
    if (isAuthenticated) navigate('/dashboard');
    else navigate('/');
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
    setShowMobileMenu(false);
  };
 
  const handleSupport = () => {
    setShowUserMenu(false);
    alert('Support : Contactez-nous à ibou22200@gmail.com pour assistance !');
  };

  const handleHelp = () => {
    setShowUserMenu(false);
    alert('Aide : Consultez la FAQ ou contactez le support pour plus d\'infos.');
  };

  const handleLogout = () => {
    setShowUserMenu(false); 
    logout();
    navigate('/login');
  };

  // Styles responsive  pour menu
  
  const navPadding = isMobile ? '1rem' : '1rem 2rem';
  const logoSize = isMobile ? '40px' : '48px';
  const avatarSize = isMobile ? '35px' : '45px';
  const hamburgerSize = isMobile ? '35px' : '40px'; //Taille pour bouton menu

  const buttonStyle = {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontSize: '0.95rem'
  };

  const registerStyle = {
    ...buttonStyle,
    background: 'white',
    color: '#667eea',
    border: 'none',
    fontWeight: '600'
  };

  // Style pour bouton menu
  const hamburgerStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.2rem', 
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '4px',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: hamburgerSize,
    height: hamburgerSize,
    flexShrink: 0
  };

  // Image ou initiale pour le menu)
  
  const userAvatar = getUserAvatar();
  const showAvatarImage = userAvatar && userAvatar.startsWith('data:image/');

  return (
    <>
      <nav style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: navPadding,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Logo : Marge gauche */}
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem', flexShrink: 0 }}>
          <button
            onClick={handleLogoClick}
            onDoubleClick={handleNavigate}
            style={{
              width: logoSize,
              height: logoSize,
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '700%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.3)'; e.target.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.2)'; e.target.style.transform = 'scale(1)'; }}
            title="Changer logo (double-clic: naviguer)"
            aria-label="Logo app"
          >
            {logoSrc.startsWith('data:image/') || logoSrc.startsWith('http') ? (
              <img src={logoSrc} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} onError={() => setLogoSrc(' ')} />
            ) : (
              <span style={{ fontSize: '1.5rem' }}>{logoSrc}</span>
            )}
          </button>
        </div>

        <input ref={(el) => setFileInputRef(el)} type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />

        
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0' : '2rem', flex: 1, justifyContent: 'center' }}>
          {!isMobile && !isAuthenticated && (
            <>
              <button onClick={() => navigate('/login')} style={buttonStyle} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.target.style.background = 'none'}>Connexion</button>
              <button onClick={() => navigate('/register')} style={registerStyle} onMouseEnter={(e) => e.target.style.background = '#f0f9ff'} onMouseLeave={(e) => e.target.style.background = 'white'}>Inscription</button>
            </>
          )}
          {isMobile && ( 
            <button
              onClick={isAuthenticated ? handleUserMenuToggle : () => setShowMobileMenu(!showMobileMenu)}
              style={{
                ...hamburgerStyle,
                onMouseEnter: (e) => { e.target.style.background = 'rgba(255,255,255,0.2)'; },
                onMouseLeave: (e) => { e.target.style.background = 'none'; }
              }}
              aria-label="Menu"
              title="Menu principal"
            >
              ☰ 
            </button>
          )}
        </div>

        {/* Section droite */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginRight: '1rem', flexShrink: 0 }}>
          {isAuthenticated && user && (
            <>
              {/* Avatar personnalisé ou initiale */}
              <div
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  background: showAvatarImage ? 'transparent' : '#667eea',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(255,255,255,0.3)',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  overflow: 'hidden' 
                }}
                onClick={openProfileModal}
                onMouseEnter={(e) => { 
                  e.target.style.background = showAvatarImage ? 'rgba(0,0,0,0.1)' : '#5a67d8'; 
                  e.target.style.transform = 'scale(1.05)'; 
                }}
                onMouseLeave={(e) => { 
                  e.target.style.background = showAvatarImage ? 'transparent' : '#667eea'; 
                  e.target.style.transform = 'scale(1)'; 
                }}
                title={user.email}
                aria-label="Modifier profil"
              >
                {showAvatarImage ? (
                  <img 
                    src={userAvatar} 
                    alt="Avatar utilisateur" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      borderRadius: '50%' 
                    }}
                    onError={() => { }}
                  />
                ) : (
                  getEmailInitial(user.email)
                )}
              </div>
              {/* Bouton menu à droite de l'avatar */}
              {!isMobile && (
                <button
                  onClick={handleUserMenuToggle}
                  style={hamburgerStyle}
                  aria-label="Menu utilisateur"
                  title="Menu (Support, Déconnexion)"
                  onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.2)'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'none'; }}
                >
                  ☰
                </button>
              )}
            </>
          )}
        </div>
      </nav>

      {/* Toast upload (généreux, inchangé) */}
      {uploadMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '1rem',
          background: uploadMessage.includes('') ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          fontSize: '0.9rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1100,
          animation: 'fadeIn 0.3s ease',
          maxWidth: '90vw'
        }}>
          {uploadMessage}
        </div>
      )}

      {/* Dropdown menu non-connectés pour mobile seulement */}
      {isMobile && !isAuthenticated && showMobileMenu && (
        <div ref={mobileMenuRef} style={{
          position: 'fixed',
          top: '70px',
          left: 0,
          right: 0,
          background: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: '0 0 12px 12px',
          zIndex: 1001,
          animation: 'slideDown 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem'
        }}>
          <button onClick={() => { navigate('/login'); setShowMobileMenu(false); }} style={{ padding: '0.75rem', textAlign: 'left', border: 'none', background: 'none', color: '#333', cursor: 'pointer' }}>Connexion</button>
          <button onClick={() => { navigate('/register'); setShowMobileMenu(false); }} style={{ padding: '0.75rem', textAlign: 'left', border: 'none', background: 'none', color: '#333', cursor: 'pointer' }}>Inscription</button>
        </div>
      )}

      {/* menu utilisateur connectés */}
      {isAuthenticated && (showUserMenu || (isMobile && showMobileMenu)) && (
        <div ref={userMenuRef} style={{
          position: 'fixed',
          top: isMobile ? '70px' : '60px', 
          left: isMobile ? 0 : 'auto', 
          right: isMobile ? 0 : '1rem',
          width: isMobile ? '100%' : '200px', 
          background: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: isMobile ? '0 0 12px 12px' : '8px',
          zIndex: 1001,
          animation: 'slideDown 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          padding: isMobile ? '1rem' : '0.5rem 0',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          <button onClick={() => { handleNavigate(); }} style={{ padding: '0.75rem', textAlign: 'left', border: 'none', background: 'none', color: '#333', cursor: 'pointer', fontSize: '0.95rem' }}>Dashboard</button>
        
          <button onClick={handleSupport} style={{ padding: '0.75rem', textAlign: 'left', border: 'none', background: 'none', color: '#333', cursor: 'pointer', fontSize: '0.95rem' }}>Support</button>
          <button onClick={handleHelp} style={{ padding: '0.75rem', textAlign: 'left', border: 'none', background: 'none', color: '#333', cursor: 'pointer', fontSize: '0.95rem' }}>Aide</button>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0.5rem 0' }} /> {/* Séparateur avant logout */}
          <button onClick={handleLogout} style={{ padding: '0.75rem', textAlign: 'left', border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: '0.95rem', borderRadius: '4px' }}>Déconnexion</button>
        </div>
      )}

      {/* profil : Taille augmentée */}
      {showProfileModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: isMobile ? '0.5rem' : '2rem' 
        }}>
          <div ref={modalRef} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem', 
            width: isMobile ? '95%' : 'auto', 
            maxWidth: isMobile ? '400px' : '450px', 
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            margin: '0 auto',
            boxSizing: 'border-box',
            fontFamily: 'inherit'
          }}>
            <h3 style={{ 
              fontSize: isMobile ? '1.3rem' : '1.6rem',
              color: '#667eea', 
              marginBottom: '1.25rem',
              textAlign: 'center',
              fontWeight: 'bold' 
            }}>Modifier Profil</h3>
            {profileError && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{profileError}</div>}
            {profileSuccess && <div style={{ background: '#d1fae5', color: '#059669', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{profileSuccess}</div>}
            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}> {}
              
              {/* Champs existants */}
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '1rem' }}>Nom complet</label>
                <input type="text" placeholder="Votre Prénom et Nom" value={profileForm.fullName} onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })} style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '10px', boxSizing: 'border-box', fontSize: '1rem' }} />
              </div>
    
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '1rem' }}>Nouveau mot de passe (optionnel)</label>
                <input type="password" placeholder="Laissez vide" value={profileForm.newPassword} onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })} style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '10px', boxSizing: 'border-box', fontSize: '1rem' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '1rem' }}>Confirmer</label>
                <input type="password" placeholder="Confirmez" value={profileForm.confirmPassword} onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })} style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '10px', boxSizing: 'border-box', fontSize: '1rem' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setShowProfileModal(false)} style={{ padding: '0.85rem 1.2rem', border: '1px solid #ddd', borderRadius: '8px', background: 'none', cursor: 'pointer', fontSize: '1rem' }}>Annuler</button>
                <button type="submit" style={{ padding: '0.85rem 1.2rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}>Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}