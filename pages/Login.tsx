import React, { useState } from 'react';
import { User } from '../types';
import { mockStore } from '../services/mockStore';
import { ArrowRight, Lock, Mail, Shield } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const user = await mockStore.login(email);
      onLogin(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { label: 'HOD', email: 'hod@stacknova.edu' },
    { label: 'Teacher', email: 'teacher@stacknova.edu' },
    { label: 'CR', email: 'cr@stacknova.edu' },
    { label: 'Student', email: 'student@stacknova.edu' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-3xl"></div>
         <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-200/30 rounded-full blur-3xl"></div>
         <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md p-6 relative z-10 animate-fade-in">
        <div className="bg-white p-10 rounded-[2rem] shadow-2xl shadow-indigo-100 border border-white">
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
              <span className="text-3xl font-bold text-white">S</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500">Sign in to access your STACKNOVA dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">University Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 outline-none transition-all font-medium"
                  placeholder="name@university.edu"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-100 animate-pulse">
                <Shield size={16} />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xl shadow-indigo-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 text-center uppercase tracking-wider mb-4">Demo Accounts</p>
            <div className="flex flex-wrap justify-center gap-2">
              {demoAccounts.map(acc => (
                <button 
                  key={acc.email}
                  onClick={() => setEmail(acc.email)}
                  className="px-4 py-2 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-semibold text-slate-600 transition-all shadow-sm"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-400 text-sm">
          &copy; 2024 STACKNOVA University Systems
        </p>
      </div>
    </div>
  );
};

export default Login;