import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { LayoutDashboard, TrendingUp, Users, LogOut, Briefcase } from 'lucide-react';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent flex items-center space-x-2">
          <TrendingUp className="text-primary" />
          <span>StockSocial</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2 text-secondary hover:text-white transition-colors">
            <LayoutDashboard size={18} />
            <span className="text-sm font-medium">Market</span>
          </Link>
          <Link to="/social" className="flex items-center space-x-2 text-secondary hover:text-white transition-colors">
            <Users size={18} />
            <span className="text-sm font-medium">Social</span>
          </Link>
          <Link to="/portfolio" className="flex items-center space-x-2 text-secondary hover:text-white transition-colors">
            <Briefcase size={18} />
            <span className="text-sm font-medium">Portfolio</span>
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <Link to="/portfolio" className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] text-secondary uppercase font-bold tracking-widest">Balance</span>
            <span className="text-sm font-bold text-success">${user.virtualBalance?.toLocaleString()}</span>
          </Link>
          
          <div className="h-8 w-px bg-border mx-2" />

          <img 
            src={user.avatar} 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-border" 
          />

          <button onClick={handleLogout} className="text-secondary hover:text-danger transition-colors p-2">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
