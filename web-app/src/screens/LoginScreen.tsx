import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail, ShieldAlert } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password);
    if (!success) {
      setError('Invalid email or password. Please check your credentials.');
    }
  };

  const fillDealer = () => {
    setEmail('dealer1@gmail.com');
    setPassword('Dealer@1');
  };

  const fillConsultant = () => {
    setEmail('consultant1@gmail.com');
    setPassword('Consultant@1');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 selection:bg-orange-500 selection:text-white">
      {/* Background ambient glowing nodes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-xl mb-4 shadow-lg shadow-orange-500/20">
            <ShieldAlert className="w-8 h-8 text-slate-950" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Auto Tech Consult
          </h2>
          <p className="text-slate-400 mt-2 font-medium">Enterprise Management Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-800/60 rounded-xl text-red-400 text-sm font-medium flex items-start gap-3">
            <span className="mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter email address"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Key className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
          >
            <LogIn className="w-5 h-5" />
            Authenticate Access
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
            Quick-Login Credentials
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={fillDealer}
              className="py-2.5 px-3 bg-slate-950 hover:bg-slate-800/50 border border-slate-800 rounded-lg text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
            >
              💼 Dealer Login
            </button>
            <button
              onClick={fillConsultant}
              className="py-2.5 px-3 bg-slate-950 hover:bg-slate-800/50 border border-slate-800 rounded-lg text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              🔧 Specialist Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
