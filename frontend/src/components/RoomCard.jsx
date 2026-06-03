import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Waves, Maximize2 } from 'lucide-react';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { ROOM_SIZE_LABELS } from '../utils/constants';
import { formatCurrency, getRoomImage } from '../utils/helpers';

export default function RoomCard({ room, hotelName, index = 0 }) {
  const navigate = useNavigate();
  const sizeLabel = ROOM_SIZE_LABELS[room.size] || room.size;

  const gradients = {
    small: 'from-blue-600/20 to-cyan-600/10',
    normal: 'from-emerald-600/20 to-teal-600/10',
    large: 'from-purple-600/20 to-violet-600/10',
    kingsize: 'from-gold-600/20 to-amber-600/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      <div className="group bg-dark-700/50 rounded-2xl card-border card-border-hover card-glow overflow-hidden transition-all duration-300 hover:-translate-y-1.5">
        <div className={`h-40 bg-gradient-to-br ${gradients[room.size] || gradients.small} relative overflow-hidden`}>
          {getRoomImage(hotelName, room.size) ? (
            <img 
              src={getRoomImage(hotelName, room.size)} 
              alt={`${sizeLabel} Room`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Maximize2 className="h-14 w-14 text-white/[0.05]" />
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Badge variant="default" size="sm">{sizeLabel}</Badge>
          </div>
          {room.seaside && (
            <div className="absolute top-4 right-4">
              <Badge variant="info" size="sm"><Waves className="h-3 w-3 mr-0.5" /> Seaside</Badge>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-7">
          <div className="flex items-baseline justify-between mb-2">
            <h4 className="text-lg font-bold text-slate-50">{sizeLabel} Room</h4>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold gold-gradient-text">{formatCurrency(room.price)}</span>
              <span className="text-xs text-slate-600">/night</span>
            </div>
          </div>

          {hotelName && <p className="text-sm text-slate-500 mb-4">{hotelName}</p>}

          <div className="flex items-center gap-4 mb-6 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <Maximize2 className="h-3.5 w-3.5" />
              <span>{sizeLabel}</span>
            </div>
            {room.seaside && (
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Waves className="h-3.5 w-3.5" />
                <span>Ocean View</span>
              </div>
            )}
          </div>

          <Button variant="primary" className="w-full" onClick={() => navigate(`/book/${room.id}`, { state: { room, hotelName } })}>
            Book Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
