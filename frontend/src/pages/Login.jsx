import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import { APP_NAME } from '../utils/constants';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('All fields are required'); return; }
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/hotels');
    } catch (err) { setError(err.message || 'Login failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] relative flex items-center justify-center p-6 py-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-dark-900" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gold-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[540px] relative z-10"
      >
        <div className="text-center" style={{ marginBottom: '64px' }}>
          <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-6 text-gold-500">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight mb-4">Welcome back</h1>
          <p className="text-lg text-slate-400">Sign in to your {APP_NAME} account to continue.</p>
        </div>

        <div className="card-border bg-dark-800/60 p-8 sm:p-10 rounded-2xl shadow-2xl backdrop-blur-xl">
          {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}
          <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: '24px' }}>
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} placeholder="you@example.com" disabled={loading} required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} icon={Lock} placeholder="••••••••" disabled={loading} required />
            
            <div className="flex items-center justify-end">
              <Link to="#" className="text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors">Forgot password?</Link>
            </div>

            <Button type="submit" variant="primary" size="xl" className="w-full mt-2" loading={loading} icon={ArrowRight}>
              Sign In
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/[0.08] text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-gold-400 font-semibold hover:text-gold-300 hover:underline transition-all">Create one</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
