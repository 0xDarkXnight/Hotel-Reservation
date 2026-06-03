import { useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, ArrowLeft, CheckCircle, Waves, Maximize2 } from 'lucide-react';
import { bookRoom } from '../api/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import { ROOM_SIZE_LABELS } from '../utils/constants';
import { formatCurrency, tomorrowISO, dayAfterTomorrowISO, daysBetween } from '../utils/helpers';

export default function BookRoom() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const room = location.state?.room;
  const hotelName = location.state?.hotelName;

  const [form, setForm] = useState({ fromDate: tomorrowISO(), tillDate: dayAfterTomorrowISO(), numPersons: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const nights = form.fromDate && form.tillDate ? Math.max(1, daysBetween(form.fromDate, form.tillDate)) : 1;
  const totalPrice = room ? room.price * nights : 0;

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const result = await bookRoom(roomId, { fromDate: new Date(form.fromDate).toISOString(), tillDate: new Date(form.tillDate).toISOString(), numPersons: parseInt(form.numPersons) });
      setBookingId(result.id); setSuccess(true);
    } catch (err) { setError(err.message || 'Booking failed.'); } finally { setLoading(false); }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="page-container-narrow py-28 text-center">
        <div className="w-28 h-28 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-500/20">
          <CheckCircle className="h-14 w-14 text-emerald-400" />
        </div>
        <h1 className="heading-section mb-4">Booking Confirmed!</h1>
        <p className="text-body mb-14 max-w-md mx-auto">Your reservation has been made. View and manage it from your bookings page.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" onClick={() => navigate(`/bookings/${bookingId}`)}>View Booking</Button>
          <Button variant="secondary" size="lg" onClick={() => navigate('/hotels')}>Browse More Hotels</Button>
        </div>
      </motion.div>
    );
  }

  const sizeLabel = room ? (ROOM_SIZE_LABELS[room.size] || room.size) : 'Room';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="page-container-narrow py-12 sm:py-16 lg:py-20">
      <Link to={room?.hotelID ? `/hotels/${room.hotelID}` : '/hotels'} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-gold-400 transition-colors mb-10">
        <ArrowLeft className="h-4 w-4" /> Back to Rooms
      </Link>

      <h1 className="heading-section text-center mb-10 lg:mb-12">Complete Your Booking</h1>

      {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-8" />}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
        <div className="lg:col-span-3">
          <Card>
            <h2 className="text-xl font-bold text-slate-100 mb-8">Reservation Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input label="Check-in Date" type="date" icon={Calendar} value={form.fromDate} min={tomorrowISO()} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} required />
                <Input label="Check-out Date" type="date" icon={Calendar} value={form.tillDate} min={form.fromDate || tomorrowISO()} onChange={(e) => setForm({ ...form, tillDate: e.target.value })} required />
              </div>
              <Input label="Number of Guests" type="number" icon={Users} min={1} max={10} value={form.numPersons} onChange={(e) => setForm({ ...form, numPersons: e.target.value })} required />

              <div className="pt-6 border-t border-white/[0.06]">
                <div className="flex justify-between items-center mb-3 text-sm">
                  <span className="text-slate-500">{formatCurrency(room?.price || 0)} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                  <span className="font-medium text-slate-200">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-slate-100">Total</span>
                  <span className="gold-gradient-text text-2xl">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <Button type="submit" size="xl" className="w-full" loading={loading}>Confirm Booking — {formatCurrency(totalPrice)}</Button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="sticky top-[96px]">
            <h3 className="text-caption mb-6">Room Summary</h3>
            <div className="h-40 bg-gradient-to-br from-dark-500 to-dark-600 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative card-border">
              <Maximize2 className="h-14 w-14 text-white/[0.05]" />
              {room?.seaside && <div className="absolute top-3 right-3"><Badge variant="info" size="sm"><Waves className="h-3 w-3" /> Seaside</Badge></div>}
            </div>
            <h4 className="text-xl font-bold text-slate-100 mb-1">{sizeLabel} Room</h4>
            {hotelName && <p className="text-sm text-slate-500 mb-6">{hotelName}</p>}
            <div className="space-y-4 text-sm divide-y divide-white/[0.04]">
              {[['Room Type', sizeLabel], ['View', room?.seaside ? 'Ocean View' : 'Standard']].map(([l, v]) => (
                <div key={l} className="flex justify-between pt-4 first:pt-0"><span className="text-slate-500">{l}</span><span className="text-slate-200 font-medium">{v}</span></div>
              ))}
              <div className="flex justify-between pt-4"><span className="text-slate-500">Price</span><span className="font-bold gold-gradient-text text-lg">{formatCurrency(room?.price || 0)}/night</span></div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
