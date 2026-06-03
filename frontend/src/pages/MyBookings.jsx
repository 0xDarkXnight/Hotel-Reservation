import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserBookings } from '../api/api';
import BookingCard from '../components/BookingCard';
import { PageLoader } from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { if (user?.id) fetchBookings(); }, [user?.id]);
  const fetchBookings = async () => {
    setLoading(true); setError('');
    try { setBookings((await getUserBookings(user.id)) || []); }
    catch (err) { setError(err.message || 'Failed to load bookings'); } finally { setLoading(false); }
  };

  const filtered = bookings.filter((b) => {
    if (filter === 'active') return !b.canceled && new Date(b.tillDate) >= new Date();
    if (filter === 'canceled') return b.canceled;
    if (filter === 'past') return !b.canceled && new Date(b.tillDate) < new Date();
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="page-container-narrow py-12 sm:py-16 lg:py-20">

      <div className="text-center" style={{ marginBottom: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 className="heading-section">My Bookings</h1>
        <p className="text-body max-w-xl" style={{ textAlign: 'center', marginTop: '20px', width: '100%', maxWidth: '36rem' }}>
          View and manage your hotel reservations.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
        {['all', 'active', 'past', 'canceled'].map((key) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer capitalize ${
              filter === key ? 'bg-gold-500 text-dark-950 shadow-lg shadow-gold-500/20' : 'bg-dark-600 text-slate-400 border border-white/[0.06] hover:border-white/[0.12]'
            }`}>{key}</button>
        ))}
      </div>

      <div className="flex justify-end mb-8">
        <Button variant="primary" size="lg" onClick={() => navigate('/hotels')}>Book a Room</Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-8" />}

      {loading ? <PageLoader /> : filtered.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No bookings found"
          description={filter !== 'all' ? 'No bookings match this filter.' : 'You haven\'t made any reservations yet.'}
          action={<Button variant="primary" size="lg" onClick={() => navigate('/hotels')}>Browse Hotels</Button>} />
      ) : (
        <div className="space-y-5">{filtered.map((b, i) => <BookingCard key={b.id} booking={b} index={i} />)}</div>
      )}
    </motion.div>
  );
}
