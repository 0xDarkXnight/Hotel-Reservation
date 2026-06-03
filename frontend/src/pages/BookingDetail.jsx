import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, ArrowLeft, XCircle, Clock, Hash } from 'lucide-react';
import { getBooking, cancelBooking } from '../api/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { PageLoader } from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import { formatDate, daysBetween } from '../utils/helpers';

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelModal, setCancelModal] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => { fetchBooking(); }, [id]);
  const fetchBooking = async () => {
    setLoading(true); setError('');
    try { setBooking(await getBooking(id)); } catch (err) { setError(err.message || 'Failed to load booking'); }
    finally { setLoading(false); }
  };
  const handleCancel = async () => {
    setCanceling(true);
    try { await cancelBooking(id); setBooking(p => ({ ...p, canceled: true })); setCancelSuccess(true); setCancelModal(false); }
    catch (err) { setError(err.message || 'Failed to cancel'); setCancelModal(false); } finally { setCanceling(false); }
  };

  if (loading) return <PageLoader />;
  if (error && !booking) return (
    <div className="page-container-narrow py-16">
      <Alert type="error" message={error} />
      <div className="mt-6"><Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/bookings')}>Back</Button></div>
    </div>
  );
  if (!booking) return null;

  const isCanceled = booking.canceled;
  const isPast = new Date(booking.tillDate) < new Date();
  const isActive = !isCanceled && !isPast;
  const nights = daysBetween(booking.fromDate, booking.tillDate);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="page-container-narrow py-12 sm:py-16 lg:py-20">

      <Link to="/bookings" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-gold-400 transition-colors mb-10">
        <ArrowLeft className="h-4 w-4" /> Back to Bookings
      </Link>

      {cancelSuccess && <Alert type="success" message="Booking canceled successfully." className="mb-8" autoClose={5000} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-8" />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10 lg:mb-12">
        <div>
          <h1 className="heading-section mb-2">Booking Details</h1>
          <p className="text-caption font-mono flex items-center gap-1"><Hash className="h-3 w-3" /> {booking.id}</p>
        </div>
        <Badge variant={isCanceled ? 'danger' : isActive ? 'success' : 'default'} size="lg" dot>
          {isCanceled ? 'Canceled' : isActive ? 'Active' : 'Completed'}
        </Badge>
      </div>

      <Card className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
          <div className="space-y-8">
            {[
              { label: 'Check-in', value: formatDate(booking.fromDate), icon: Calendar, color: 'bg-gold-500/10 text-gold-400' },
              { label: 'Check-out', value: formatDate(booking.tillDate), icon: Calendar, color: 'bg-cyan-500/10 text-cyan-400' },
            ].map((item) => (
              <div key={item.label}>
                <label className="text-caption">{item.label}</label>
                <div className="flex items-center gap-3 mt-2.5">
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center`}><item.icon className="h-5 w-5" /></div>
                  <span className="text-xl font-semibold text-slate-100">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-8">
            <div>
              <label className="text-caption">Duration</label>
              <div className="flex items-center gap-3 mt-2.5">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center"><Clock className="h-5 w-5" /></div>
                <span className="text-xl font-semibold text-slate-100">{nights} {nights === 1 ? 'night' : 'nights'}</span>
              </div>
            </div>
            <div>
              <label className="text-caption">Guests</label>
              <div className="flex items-center gap-3 mt-2.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center"><Users className="h-5 w-5" /></div>
                <span className="text-xl font-semibold text-slate-100">{booking.numPersons} {booking.numPersons === 1 ? 'person' : 'people'}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="mb-8">
        <h3 className="text-caption mb-6">Reference IDs</h3>
        <div className="divide-y divide-white/[0.04]">
          {[['Booking ID', booking.id], ['Room ID', booking.roomID], ['User ID', booking.userID]].map(([l, v]) => (
            <div key={l} className="flex items-center justify-between py-4 text-sm">
              <span className="text-slate-500">{l}</span>
              <span className="font-mono text-slate-300 text-xs">{v}</span>
            </div>
          ))}
        </div>
      </Card>

      {isActive && (
        <div className="flex justify-end"><Button variant="danger" size="lg" icon={XCircle} onClick={() => setCancelModal(true)}>Cancel Booking</Button></div>
      )}

      <Modal isOpen={cancelModal} onClose={() => setCancelModal(false)} title="Cancel Booking" size="sm">
        <div className="text-center py-6">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
            <XCircle className="h-12 w-12 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-3">Are you sure?</h3>
          <p className="text-body-sm mb-10">This action cannot be undone.</p>
          <div className="flex gap-4 justify-center">
            <Button variant="secondary" size="lg" onClick={() => setCancelModal(false)}>Keep Booking</Button>
            <Button variant="danger" size="lg" onClick={handleCancel} loading={canceling}>Yes, Cancel</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
