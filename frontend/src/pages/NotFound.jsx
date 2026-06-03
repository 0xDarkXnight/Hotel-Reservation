import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Hotel } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="w-32 h-32 bg-dark-700 card-border rounded-3xl flex items-center justify-center mx-auto mb-12">
          <Hotel className="h-16 w-16 text-gold-500/40" />
        </div>
        <h1 className="text-9xl font-extrabold gold-gradient-text mb-6">404</h1>
        <h2 className="heading-subsection mb-4">Page Not Found</h2>
        <p className="text-body mb-14">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/"><Button variant="primary" size="lg" icon={Home}>Go Home</Button></Link>
          <Link to="/hotels"><Button variant="secondary" size="lg" icon={ArrowLeft}>Browse Hotels</Button></Link>
        </div>
      </div>
    </motion.div>
  );
}
