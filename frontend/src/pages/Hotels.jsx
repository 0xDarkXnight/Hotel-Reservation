import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronLeft, ChevronRight, Hotel } from 'lucide-react';
import { getHotels } from '../api/api';
import HotelCard from '../components/HotelCard';
import Button from '../components/ui/Button';
import { PageLoader } from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import Alert from '../components/ui/Alert';

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [rating, setRating] = useState(0);
  const limit = 12;

  useEffect(() => { fetchHotels(); }, [page, rating]);

  const fetchHotels = async () => {
    setLoading(true); setError('');
    try {
      const data = await getHotels(page, limit, rating);
      setHotels(data.data || []); setTotalResults(data.result || 0);
    } catch (err) { setError(err.message || 'Failed to load hotels'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-container py-12 sm:py-16 lg:py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

        {/* Page header */}
        <div className="text-center" style={{ marginBottom: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 className="heading-section">Explore Hotels</h1>
          <p className="text-body max-w-xl" style={{ textAlign: 'center', marginTop: '20px', width: '100%', maxWidth: '36rem' }}>
            Discover premium stays from our curated collection worldwide.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mb-10 lg:mb-12">
          <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
            <span className="text-supporting flex items-center gap-1.5"><Filter className="h-4 w-4" /> Rating:</span>
            {[0, 1, 2, 3, 4, 5].map((r) => (
              <button key={r} onClick={() => { setRating(r); setPage(1); }}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  rating === r
                    ? 'bg-gold-500 text-dark-950 shadow-lg shadow-gold-500/20'
                    : 'bg-dark-600 text-slate-400 border border-white/[0.06] hover:border-white/[0.12]'
                }`}>{r === 0 ? 'All' : `${r}★`}</button>
            ))}
          </div>
          {!loading && <span className="text-supporting">Showing {hotels.length} hotels</span>}
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-8" />}

        {loading ? <PageLoader /> : hotels.length === 0 ? (
          <EmptyState icon={Hotel} title="No hotels found"
            description={rating > 0 ? `No hotels with a ${rating}-star rating.` : 'No hotels available.'}
            action={rating > 0 ? <Button variant="secondary" onClick={() => setRating(0)}>Clear Filter</Button> : null} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7">
              {hotels.map((hotel, i) => <HotelCard key={hotel.id} hotel={hotel} index={i} />)}
            </div>
            <div className="flex items-center justify-center gap-4 mt-16">
              <Button variant="secondary" size="md" icon={ChevronLeft} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
              <span className="px-6 py-3 bg-dark-600 rounded-xl text-sm font-medium text-slate-400 card-border">Page {page}</span>
              <Button variant="secondary" size="md" onClick={() => setPage((p) => p + 1)} disabled={totalResults < limit}>Next <ChevronRight className="h-5 w-5" /></Button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
