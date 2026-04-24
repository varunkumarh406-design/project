import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserProfile, followUser } from '../services/userService';
import { getPostsByUser } from '../services/socialService';
import Navbar from '../components/Navbar';
import PostCard from '../components/social/PostCard';
import Skeleton from '../components/Skeleton';
import { ShieldCheck, Mail, Users, Briefcase, Calendar, UserPlus, UserCheck, ArrowLeft, AtSign } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';

const UserProfile = () => {
  const { id } = useParams();
  const { user: currentUser } = useSelector(state => state.auth);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: profile } = await getUserProfile(id);
      const { data: userPosts } = await getPostsByUser(id);
      setUser(profile);
      setPosts(userPosts);
    } catch (err) {
      console.error(err);
      setError('User not found or connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await followUser(id);
      fetchProfile(); // Refresh to update followers count
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4">
        <Skeleton className="h-64 w-full rounded-[3rem] mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4"><Skeleton className="h-96 w-full rounded-[2.5rem]" /></div>
          <div className="lg:col-span-8 space-y-6"><Skeleton className="h-64 w-full rounded-[2.5rem]" /><Skeleton className="h-64 w-full rounded-[2.5rem]" /></div>
        </div>
      </div>
    </div>
  );

  if (error || !user) return (
    <div className="min-h-screen bg-slate-50 pt-28 flex flex-col items-center justify-center">
      <Navbar />
      <div className="text-center p-10 glass-card rounded-[3rem] max-w-md">
        <h2 className="text-3xl font-black text-slate-900 mb-4">Oops!</h2>
        <p className="text-slate-400 font-medium mb-8">{error || "Something went wrong"}</p>
        <Link to="/" className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg">
          <ArrowLeft size={18} />
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  );

  const isFollowing = user.followers?.some(f => f._id === currentUser?._id);
  const isMe = user._id === currentUser?._id;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4">
        {/* Cover & Profile Header */}
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-slate-100 mb-8">
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative"></div>
          <div className="px-10 pb-10 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between -mt-16 mb-8 gap-6">
              <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-8">
                <div className="relative">
                  <img 
                    src={user.avatar} 
                    className="w-40 h-40 rounded-[3rem] border-8 border-white shadow-2xl bg-white" 
                    alt={user.name} 
                  />
                  <div className="absolute bottom-3 right-3 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full"></div>
                </div>
                <div className="pb-2">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user.name}</h1>
                    <ShieldCheck size={28} className="text-blue-500" />
                  </div>
                  <div className="flex flex-wrap gap-4 text-slate-400 font-bold text-sm">
                    <span className="flex items-center space-x-1.5"><Mail size={16} /> <span>{user.email}</span></span>
                    <span className="flex items-center space-x-1.5"><Calendar size={16} /> <span>Joined {format(new Date(user.createdAt), 'MMM yyyy')}</span></span>
                  </div>
                </div>
              </div>
              
              {!isMe && (
                <button 
                  onClick={handleFollow}
                  className={clsx(
                    "px-10 py-4 rounded-2xl font-black text-lg flex items-center justify-center space-x-3 transition-all shadow-xl",
                    isFollowing ? "bg-slate-100 text-slate-600" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30"
                  )}
                >
                  {isFollowing ? <UserCheck size={24} /> : <UserPlus size={24} />}
                  <span>{isFollowing ? "Following" : "Follow"}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-100">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                  <Users size={12} /> <span>Followers</span>
                </p>
                <p className="text-3xl font-black text-slate-900">{user.followers?.length || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                  <Users size={12} /> <span>Following</span>
                </p>
                <p className="text-3xl font-black text-slate-900">{user.following?.length || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                  <Briefcase size={12} /> <span>Portfolio</span>
                </p>
                <p className="text-3xl font-black text-slate-900">₹{user.virtualBalance?.toLocaleString('en-IN')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                  <AtSign size={12} /> <span>Rank</span>
                </p>
                <p className="text-3xl font-black text-blue-600">Top 1%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: About */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-6">About Trader</h3>
              <p className="text-slate-500 font-medium leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100">
                {user.bio || `${user.name} is a dedicated member of the StockSocial trading community.`}
              </p>
            </div>
            
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center justify-between">
                <span>Recent Followers</span>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">LIVE</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {user.followers?.slice(0, 8).map(f => (
                  <Link key={f._id} to={`/user/${f._id}`} title={f.name}>
                    <img src={f.avatar} className="w-12 h-12 rounded-2xl border-2 border-white shadow-md hover:scale-110 transition-all" alt={f.name} />
                  </Link>
                ))}
                {user.followers?.length === 0 && <p className="text-xs text-slate-400 font-bold uppercase py-4">No followers yet</p>}
              </div>
            </div>
          </div>

          {/* Right: Posts */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Community Activity</h2>
              <span className="text-sm font-bold text-slate-400">{posts.length} Posts</span>
            </div>

            {posts.length > 0 ? (
              posts.map(post => <PostCard key={post._id} post={post} />)
            ) : (
              <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
                <AtSign size={48} className="text-slate-100 mx-auto mb-6" />
                <h3 className="text-xl font-black text-slate-900 mb-2">Silent Observer</h3>
                <p className="text-slate-400 font-medium">This user hasn't shared any market analysis yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
