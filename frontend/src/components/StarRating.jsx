import { Star } from 'lucide-react';

export default function StarRating({ rating, max = 5, size = 'md' }) {
  const s = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' };
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star key={i} className={`${s[size]} ${i < rating ? 'fill-gold-500 text-gold-500' : 'fill-dark-500 text-dark-500'}`} />
      ))}
    </div>
  );
}
