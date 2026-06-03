export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function getInitials(firstName, lastName) {
  return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase();
}

export function daysBetween(from, to) {
  const a = new Date(from);
  const b = new Date(to);
  const diff = Math.abs(b - a);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function toISODate(date) {
  // Returns date in YYYY-MM-DD format for input[type=date]
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

export function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toISODate(d);
}

export function dayAfterTomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return toISODate(d);
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function getHotelImage(hotelName) {
  if (!hotelName) return null;
  const name = hotelName.toLowerCase();
  if (name.includes('elysee')) return '/images/hotels/elysee.webp';
  if (name.includes('taj')) return '/images/hotels/taj.webp';
  if (name.includes('yellow')) return '/images/hotels/yellow.webp';
  if (name.includes('mariott') || name.includes('marriott')) return '/images/hotels/marriott.webp';
  return null;
}

export function getRoomImage(hotelName, roomSize) {
  if (!hotelName || !roomSize) return null;
  const hName = hotelName.toLowerCase();
  const rSize = roomSize.toLowerCase();
  
  let base = '';
  if (hName.includes('elysee')) base = 'elysee';
  else if (hName.includes('taj')) base = 'taj';
  else if (hName.includes('yellow')) base = 'yellow';
  else if (hName.includes('mariott') || hName.includes('marriott')) base = 'marriott';
  
  if (!base) return null;

  if (rSize.includes('small')) return `/images/hotels/${base}Small.webp`;
  if (rSize.includes('medium')) return `/images/hotels/${base}Medium.webp`;
  if (rSize.includes('king') || rSize.includes('big')) return `/images/hotels/${base}Big.webp`;
  
  return `/images/hotels/${base}.webp`;
}
