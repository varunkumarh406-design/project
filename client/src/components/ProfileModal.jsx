import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { X, LogOut, Mail, User, ShieldCheck, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const ProfileModal = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    onClose();
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl border border-white/20">
        {/* Header/Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-xl transition-all flex items-center justify-center backdrop-blur-md border border-white/20"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-10 pb-10 relative">
          {/* Avatar Area */}
          <div className="flex justify-between items-end -mt-12 mb-8">
            <div className="relative">
              <img 
                src={user.avatar} 
                className="w-32 h-32 rounded-[2.5rem] border-8 border-white shadow-xl bg-white" 
                alt={user.name} 
              />
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
              {user.avatar?.includes('googleusercontent.com') && (
                <div className="absolute -top-2 -right-2 bg-white px-2 py-1 rounded-lg shadow-sm border border-slate-100 flex items-center space-x-1">
                  <img src="https://www.google.com/favicon.ico" className="w-3 h-3" alt="Google" />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Synced</span>
                </div>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl font-black text-sm flex items-center space-x-2 transition-all"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>

          {/* User Info */}
          <div className="mb-10">
            <div className="flex items-center space-x-2 mb-1">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{user.name}</h2>
              <ShieldCheck size={24} className="text-blue-500" />
            </div>
            <p className="text-slate-400 font-medium flex items-center space-x-2">
              <Mail size={16} />
              <span>{user.email}</span>
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 text-center group hover:bg-blue-50 hover:border-blue-100 transition-all cursor-default">
              <p className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">₹{user.virtualBalance?.toLocaleString('en-IN')}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Balance</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 text-center group hover:bg-blue-50 hover:border-blue-100 transition-all cursor-default">
              <p className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{user.followers?.length || 0}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Followers</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 text-center group hover:bg-blue-50 hover:border-blue-100 transition-all cursor-default">
              <p className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{user.following?.length || 0}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Following</p>
            </div>
          </div>

          {/* Bio & Details */}
          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">About</h4>
              <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {user.bio || "Passionate about trading and social markets. This user hasn't added a bio yet."}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-400 font-bold px-2 pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>Joined {format(new Date(user.createdAt || Date.now()), 'MMMM yyyy')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span className="text-blue-600">Pro Member</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
