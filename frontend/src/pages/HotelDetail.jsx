import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Bed } from 'lucide-react';
import { getHotel, getHotelRooms } from '../api/api';
import RoomCard from '../components/RoomCard';
import StarRating from '../components/StarRating';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { PageLoader } from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import Alert from '../components/ui/Alert';
import { RATING_LABELS } from '../utils/constants';
import { getHotelImage } from '../utils/helpers';

export default function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchData(); }, [id]);
  const fetchData = async () => {
    setLoading(true); setError('');
    try { const [h, r] = await Promise.all([getHotel(id), getHotelRooms(id)]); setHotel(h); setRooms(r || []); }
    catch (err) { setError(err.message || 'Failed to load hotel'); } finally { setLoading(false); }
  };

  if (loading) return <PageLoader />;
  if (error) return (
    <div className="page-container py-16"><Alert type="error" message={error} /><div className="mt-6"><Link to="/hotels"><Button variant="secondary" icon={ArrowLeft}>Back to Hotels</Button></Link></div></div>
  );
  if (!hotel) return null;

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative h-80 sm:h-[420px] overflow-hidden">
        {getHotelImage(hotel.name) ? (
          <>
            <img 
              src={getHotelImage(hotel.name)} 
              alt={hotel.name} 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-dark-900/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-dark-700 via-dark-800 to-dark-900" />
            <div className="absolute inset-0">
              <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gold-500/[0.04] rounded-full blur-[100px]" />
              <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-cyan-500/[0.03] rounded-full blur-[60px]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[180px] sm:text-[260px] font-extrabold text-white/[0.02] select-none">{hotel.name?.[0]}</span>
              </div>
            </div>
          </>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0 flex items-end">
          <div className="page-container w-full pb-12 sm:pb-16">
            <Link to="/hotels" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-gold-400 transition-colors mb-8">
              <ArrowLeft className="h-4 w-4" /> Back to Hotels
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="primary" size="lg">{RATING_LABELS[hotel.rating] || 'Standard'}</Badge>
                  <StarRating rating={hotel.rating} />
                </div>
                <h1 className="heading-section">{hotel.name}</h1>
                <div className="flex items-center gap-2 text-slate-400 mt-3">
                  <MapPin className="h-5 w-5 text-gold-500" /> <span className="text-body-sm">{hotel.location}</span>
                </div>
              </div>
              <p className="text-supporting">{rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} available</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Rooms */}
      <div className="page-container py-12 sm:py-16 lg:py-20">
        <h2 className="heading-subsection mb-10 lg:mb-12">Available Rooms</h2>
        {rooms.length === 0 ? (
          <EmptyState icon={Bed} title="No rooms available" description="This hotel currently has no rooms listed." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7">
            {rooms.map((room, i) => <RoomCard key={room.id} room={room} hotelName={hotel.name} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
