import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Hotel, LogOut, User, LayoutDashboard, CalendarDays, Shield } from 'lucide-react';
import Button from '../ui/Button';
import { getInitials } from '../../utils/helpers';
import { APP_NAME } from '../../utils/constants';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); setMobileOpen(false); };
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/hotels', label: 'Hotels', icon: Hotel },
    { to: '/bookings', label: 'My Bookings', icon: CalendarDays },
  ];
  if (isAdmin) navLinks.push({ to: '/admin', label: 'Admin', icon: Shield });

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 glass border-b border-white/[0.06]"
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/20">
              <Hotel className="h-5 w-5 text-dark-950" />
            </div>
            <span className="text-lg font-bold text-slate-50 tracking-tight">{APP_NAME}</span>
          </Link>

          {/* Desktop nav — centered */}
          <div className="hidden md:flex items-center gap-1.5">
            {isAuthenticated && navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-gold-400 bg-gold-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                }`}
                style={{ padding: '12px 24px', margin: '0 4px' }}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer"
                  style={{ padding: '10px 20px', marginLeft: '12px' }}
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center text-dark-950 text-xs font-bold">
                    {getInitials(user?.firstName, user?.lastName)}
                  </div>
                  <span className="text-sm font-medium text-slate-300 max-w-[110px] truncate">{user?.firstName}</span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 mt-3 w-60 bg-dark-700 rounded-2xl shadow-2xl shadow-black/50 card-border py-2 z-20"
                      >
                        <div className="px-5 py-3 border-b border-white/[0.06]">
                          <p className="text-sm font-semibold text-slate-100">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
                        </div>
                        {[
                          { to: '/profile', icon: User, label: 'Profile' },
                          { to: '/bookings', icon: CalendarDays, label: 'My Bookings' },
                          ...(isAdmin ? [{ to: '/admin', icon: LayoutDashboard, label: 'Admin Dashboard' }] : []),
                        ].map((item) => (
                          <Link key={item.to} to={item.to} onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-5 py-2.5 text-sm text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] transition-colors">
                            <item.icon className="h-4 w-4" /> {item.label}
                          </Link>
                        ))}
                        <hr className="my-1.5 border-white/[0.06]" />
                        <button onClick={handleLogout} className="flex items-center gap-2.5 px-5 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full cursor-pointer">
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="md" onClick={() => navigate('/login')}>Sign In</Button>
                <Button variant="primary" size="md" onClick={() => navigate('/register')}>Get Started</Button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2.5 rounded-xl text-slate-400 hover:bg-white/[0.04] cursor-pointer">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/[0.06] overflow-hidden"
          >
            <div className="px-5 py-5 space-y-1.5 bg-dark-800/90 backdrop-blur-xl">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3.5 px-4 py-4 mb-3 bg-dark-600/50 rounded-xl card-border">
                    <div className="w-11 h-11 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center text-dark-950 text-sm font-bold">
                      {getInitials(user?.firstName, user?.lastName)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                  {navLinks.map((link) => (
                    <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium ${isActive(link.to) ? 'text-gold-400 bg-gold-500/10' : 'text-slate-400'}`}>
                      <link.icon className="h-4 w-4" /> {link.label}
                    </Link>
                  ))}
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-slate-400">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <hr className="my-2 border-white/[0.06]" />
                  <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-red-400 w-full cursor-pointer">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Button variant="ghost" onClick={() => { navigate('/login'); setMobileOpen(false); }}>Sign In</Button>
                  <Button variant="primary" onClick={() => { navigate('/register'); setMobileOpen(false); }}>Get Started</Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
