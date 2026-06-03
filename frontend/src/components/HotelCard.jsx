import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, DoorOpen } from 'lucide-react';
import StarRating from './StarRating';
import Badge from './ui/Badge';
import { RATING_LABELS } from '../utils/constants';
import { getHotelImage } from '../utils/helpers';

export default function HotelCard({ hotel, index = 0 }) {
  const ratingLabel = RATING_LABELS[hotel.rating] || 'Standard';
  const roomCount = hotel.rooms?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="group bg-dark-700/50 rounded-2xl card-border card-border-hover card-glow overflow-hidden transition-all duration-300 hover:-translate-y-1.5">
        {/* Image area — taller */}
        <div className="h-56 sm:h-60 relative overflow-hidden">
          {getHotelImage(hotel.name) ? (
            <img 
              src={getHotelImage(hotel.name)} 
              alt={hotel.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-dark-600 via-dark-700 to-dark-800" />
              <div className="absolute inset-0">
                <div className="absolute top-8 right-8 w-36 h-36 border border-gold-500/10 rounded-full" />
                <div className="absolute bottom-6 left-8 w-24 h-24 border border-white/[0.04] rounded-full" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl font-extrabold text-white/[0.04] uppercase tracking-widest select-none">
                  {hotel.name?.[0] || 'H'}
                </span>
              </div>
            </>
          )}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-dark-700/90 to-transparent" />
          <div className="absolute top-4 right-4">
            <Badge variant="primary" size="sm">{ratingLabel}</Badge>
          </div>
        </div>

        {/* Content — more padding and spacing */}
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-slate-50 group-hover:text-gold-400 transition-colors duration-300 leading-tight pr-3">
              {hotel.name}
            </h3>
            <StarRating rating={hotel.rating} size="sm" />
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-5">
            <MapPin className="h-3.5 w-3.5 text-gold-600 flex-shrink-0" />
            <span>{hotel.location}</span>
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-white/[0.06]">
            <span className="text-caption flex items-center gap-1.5">
              <DoorOpen className="h-3.5 w-3.5" />
              {roomCount} {roomCount === 1 ? 'room' : 'rooms'}
            </span>
            <Link
              to={`/hotels/${hotel.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-500 hover:text-gold-400 transition-colors group/link"
            >
              View Details
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
