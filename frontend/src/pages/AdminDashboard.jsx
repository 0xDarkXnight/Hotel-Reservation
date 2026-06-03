import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, Users, XCircle, CheckCircle, Clock, Search } from 'lucide-react';
import { getAdminBookings } from '../api/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { PageLoader } from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import Alert from '../components/ui/Alert';
import { formatDate } from '../utils/helpers';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }) };

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchBookings(); }, []);
  const fetchBookings = async () => {
    setLoading(true); setError('');
    try { setBookings((await getAdminBookings()) || []); }
    catch (err) { setError(err.message || 'Failed to load bookings'); } finally { setLoading(false); }
  };

  const active = bookings.filter(b => !b.canceled && new Date(b.tillDate) >= new Date());
  const canceled = bookings.filter(b => b.canceled);
  const completed = bookings.filter(b => !b.canceled && new Date(b.tillDate) < new Date());

  const filtered = bookings.filter(b => {
    if (!search) return true;
    const q = search.toLowerCase();
    return b.id?.toLowerCase().includes(q) || b.userID?.toLowerCase().includes(q) || b.roomID?.toLowerCase().includes(q);
  });

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'from-gold-500/20 to-gold-600/5', iconColor: 'text-gold-400', valueColor: 'text-gold-400' },
    { label: 'Active', value: active.length, icon: CheckCircle, color: 'from-emerald-500/20 to-emerald-600/5', iconColor: 'text-emerald-400', valueColor: 'text-emerald-400' },
    { label: 'Completed', value: completed.length, icon: Clock, color: 'from-cyan-500/20 to-cyan-600/5', iconColor: 'text-cyan-400', valueColor: 'text-cyan-400' },
    { label: 'Canceled', value: canceled.length, icon: XCircle, color: 'from-red-500/20 to-red-600/5', iconColor: 'text-red-400', valueColor: 'text-red-400' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="page-container py-12 sm:py-16 lg:py-20">

      {/* Header — centered */}
      <div className="text-center" style={{ marginBottom: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="w-14 h-14 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center shadow-lg shadow-gold-500/20 mb-5">
          <LayoutDashboard className="h-7 w-7 text-dark-950" />
        </div>
        <h1 className="heading-section">Admin Dashboard</h1>
        <p className="text-body max-w-xl" style={{ textAlign: 'center', marginTop: '20px', width: '100%', maxWidth: '36rem' }}>
          Manage and monitor all bookings across the platform.
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-8" />}

      {/* Stats */}
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7 mb-12 lg:mb-16">
        {stats.map((s, i) => (
          <motion.div key={s.label} variants={fadeUp} custom={i}>
            <Card className="!p-7 sm:!p-8">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                  <s.icon className={`h-6 w-6 ${s.iconColor}`} />
                </div>
                <div>
                  <p className={`text-4xl font-extrabold ${s.valueColor}`}>{s.value}</p>
                  <p className="text-supporting mt-1">{s.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
        <input type="text" placeholder="Search by booking, user, or room ID..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-13 pr-5 py-4 rounded-2xl bg-dark-600/80 text-base text-slate-200 placeholder:text-slate-600 border border-white/[0.08] hover:border-white/[0.14] focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500/50 transition-all" />
      </div>

      {/* Table */}
      {loading ? <PageLoader /> : filtered.length === 0 ? (
        <EmptyState icon={Calendar} title="No bookings found" description={search ? 'No bookings match your search.' : 'No bookings yet.'} />
      ) : (
        <Card padding={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-dark-600/50 border-b border-white/[0.06]">
                  {['Booking ID', 'User ID', 'Room ID', 'Check-in', 'Check-out', 'Guests', 'Status'].map((h) => (
                    <th key={h} className="text-left py-5 px-6 text-caption">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((b) => {
                  const c = b.canceled; const p = new Date(b.tillDate) < new Date(); const a = !c && !p;
                  return (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-5 px-6 font-mono text-xs text-slate-300">{b.id?.slice(-8)}</td>
                      <td className="py-5 px-6 font-mono text-xs text-slate-500">{b.userID?.slice(-8)}</td>
                      <td className="py-5 px-6 font-mono text-xs text-slate-500">{b.roomID?.slice(-8)}</td>
                      <td className="py-5 px-6 text-slate-300">{formatDate(b.fromDate)}</td>
                      <td className="py-5 px-6 text-slate-300">{formatDate(b.tillDate)}</td>
                      <td className="py-5 px-6 text-slate-300"><div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-slate-500" />{b.numPersons}</div></td>
                      <td className="py-5 px-6"><Badge variant={c ? 'danger' : a ? 'success' : 'default'} size="sm" dot>{c ? 'Canceled' : a ? 'Active' : 'Completed'}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </motion.div>
  );
}
