import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { LayoutDashboard, TrendingUp, Users, LogOut, Briefcase, Bell } from 'lucide-react';
import ProfileModal from './ProfileModal';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black text-slate-900 flex items-center space-x-2 tracking-tight">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <TrendingUp className="text-white" size={24} />
            </div>
            <span>StockSocial</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl">
            <Link to="/" className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-slate-600 hover:text-blue-600 transition-all font-semibold text-sm">
              <LayoutDashboard size={18} />
              <span>Market</span>
            </Link>
            <Link to="/social" className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-slate-600 hover:text-blue-600 transition-all font-semibold text-sm">
              <Users size={18} />
              <span>Social</span>
            </Link>
            <Link to="/portfolio" className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-slate-600 hover:text-blue-600 transition-all font-semibold text-sm">
              <Briefcase size={18} />
              <span>Portfolio</span>
            </Link>
          </div>

          <div className="flex items-center space-x-5">
            <button className="p-3 text-slate-400 hover:text-blue-600 transition-colors relative">
              <Bell size={22} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-200" />

            <div className="flex items-center space-x-3 pl-2 group cursor-pointer" onClick={() => setIsProfileOpen(true)}>
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Balance</p>
                <p className="text-sm font-bold text-slate-900">₹{user.virtualBalance?.toLocaleString('en-IN')}</p>
              </div>
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-11 h-11 rounded-2xl border-2 border-white shadow-md group-hover:border-blue-500 transition-all" 
              />
            </div>

            <button onClick={handleLogout} className="p-3 text-slate-400 hover:text-red-500 transition-colors">
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </nav>

      {isProfileOpen && <ProfileModal user={user} onClose={() => setIsProfileOpen(false)} />}
    </>
  );
};

export default Navbar;
