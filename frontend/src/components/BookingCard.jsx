import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Eye } from 'lucide-react';
import Badge from './ui/Badge';
import { formatDate, daysBetween } from '../utils/helpers';

export default function BookingCard({ booking, index = 0 }) {
  const isCanceled = booking.canceled;
  const isPast = new Date(booking.tillDate) < new Date();
  const isActive = !isCanceled && !isPast;
  const nights = daysBetween(booking.fromDate, booking.tillDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <div className="bg-dark-700/50 rounded-2xl card-border card-border-hover overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
        <div className="flex flex-col sm:flex-row">
          <div className={`w-full sm:w-1.5 h-1.5 sm:h-auto flex-shrink-0 ${
            isCanceled ? 'bg-red-500' : isActive ? 'bg-emerald-500' : 'bg-dark-400'
          }`} />

          <div className="flex-1 p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <h4 className="text-base font-semibold text-slate-100">Booking</h4>
                  <Badge variant={isCanceled ? 'danger' : isActive ? 'success' : 'default'} size="sm" dot>
                    {isCanceled ? 'Canceled' : isActive ? 'Active' : 'Completed'}
                  </Badge>
                </div>
                <p className="text-caption font-mono">ID: {booking.id?.slice(-8)}</p>
              </div>
              <Link to={`/bookings/${booking.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-500 hover:text-gold-400 transition-colors">
                <Eye className="h-3.5 w-3.5" /> View Details
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { label: 'Check-in', value: formatDate(booking.fromDate), icon: Calendar, color: 'bg-gold-500/10 text-gold-500' },
                { label: 'Check-out', value: formatDate(booking.tillDate), icon: Calendar, color: 'bg-cyan-500/10 text-cyan-400' },
                { label: 'Stay', value: `${booking.numPersons} guests · ${nights} nights`, icon: Users, color: 'bg-emerald-500/10 text-emerald-400' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-caption">{item.label}</span>
                    <p className="text-slate-200 font-medium text-sm mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
