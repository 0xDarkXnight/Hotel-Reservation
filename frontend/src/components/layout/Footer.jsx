import { Link } from 'react-router-dom';
import { Hotel, Heart } from 'lucide-react';
import { APP_NAME } from '../../utils/constants';

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-white/[0.04] mt-auto">
      <div className="page-container" style={{ padding: '32px 0' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center">
                <Hotel className="h-5 w-5 text-dark-950" />
              </div>
              <span className="text-lg font-bold text-slate-100">{APP_NAME}</span>
            </Link>
            <p className="text-supporting max-w-sm leading-relaxed">
              Your premium hotel reservation platform. Discover extraordinary stays at handpicked hotels worldwide with seamless booking experiences.
            </p>
          </div>

          <div>
            <h4 className="text-caption mb-5">Quick Links</h4>
            <ul className="space-y-3.5">
              <li><Link to="/hotels" className="text-sm text-slate-500 hover:text-gold-400 transition-colors">Browse Hotels</Link></li>
              <li><Link to="/bookings" className="text-sm text-slate-500 hover:text-gold-400 transition-colors">My Bookings</Link></li>
              <li><Link to="/profile" className="text-sm text-slate-500 hover:text-gold-400 transition-colors">Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-caption mb-5">Support</h4>
            <ul className="space-y-3.5">
              <li><span className="text-sm text-slate-500">support@inncore.com</span></li>
              <li><span className="text-sm text-slate-500">+1 (555) 123-4567</span></li>
              <li><span className="text-sm text-slate-500">24/7 Customer Service</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p className="text-xs text-slate-600 flex items-center gap-1">Made with <Heart className="h-3 w-3 text-red-400 fill-red-400" /> for hoteliers</p>
        </div>
      </div>
    </footer>
  );
}
