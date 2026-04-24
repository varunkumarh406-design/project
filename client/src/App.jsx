import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from './pages/Dashboard';
import SocialFeed from './pages/SocialFeed';
import Portfolio from './pages/Portfolio';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/social" element={<ProtectedRoute><SocialFeed /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        <Route path="/user/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
