export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem 2rem',
      color: 'white',
      textAlign: 'center',
      
      // Positionnement fixe en bas de la page
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      
      zIndex: 40
    }}>
      {/* Texte de copyright */}
      <p>&copy; 2025 Task Manager - FEVEO 2050. All rights reserved.</p>
    </footer>
  );
}