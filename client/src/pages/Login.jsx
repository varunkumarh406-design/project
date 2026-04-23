import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login as loginApi } from '../services/authService';
import { setCredentials } from '../store/authSlice';
import { LogIn } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogin as googleLoginApi } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginApi({ email, password });
      dispatch(setCredentials({ user: data, token: data.token }));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const { data } = await googleLoginApi(response.credential);
      dispatch(setCredentials({ user: data, token: data.token }));
      navigate('/');
    } catch (err) {
      setError('Google login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-secondary">Enter your credentials to access StockSocial</p>
        </div>

        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="bg-danger/10 border border-danger/50 text-danger px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                className="input-field"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Password</label>
              <input 
                type="password" 
                required 
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? "Signing in..." : (
                <>
                  <LogIn size={20} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">OR</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin 
              onSuccess={handleGoogleSuccess} 
              onError={() => setError('Google login failed')}
              useOneTap
              theme="outline"
              shape="pill"
            />
          </div>

          <div className="mt-8 text-center text-sm">
            <span className="text-secondary">Don't have an account? </span>
            <Link to="/register" className="text-primary font-bold hover:underline">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
