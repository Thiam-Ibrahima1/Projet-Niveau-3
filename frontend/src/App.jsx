import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Footer from './components/Footer';
import EditTaskPage from './pages/EditTaskPage';

// Composant Layout : Englobe les routes nécessitant Navbar et Footer
function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider> {/* Fournit le contexte d'authentification à toute l'application */}
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Routes protégées (nécessitent une authentification) */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
  
            <Route path="/edit/:id" element={<EditTaskPage />} />
          </Route>

          {/* Redirection pour toutes les autres routes inconnues */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}