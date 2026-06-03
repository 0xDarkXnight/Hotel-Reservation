import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Sparkles, Globe, Shield, Clock, CreditCard, Star, Quote, MapPin, Building2, Users, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import { APP_NAME } from '../utils/constants';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    { icon: Globe, title: 'Global Selection', desc: 'Handpicked hotels from premier destinations worldwide, curated for excellence and unmatched comfort.', color: 'from-cyan-500/20 to-cyan-600/5', iconColor: 'text-cyan-400' },
    { icon: Shield, title: 'Secure Booking', desc: 'Enterprise-grade security protects every reservation you make. Your data and payments are always safe.', color: 'from-emerald-500/20 to-emerald-600/5', iconColor: 'text-emerald-400' },
    { icon: Clock, title: 'Instant Confirmation', desc: 'Real-time availability checks with immediate booking confirmation — no waiting, no uncertainty.', color: 'from-gold-500/20 to-gold-600/5', iconColor: 'text-gold-400' },
    { icon: CreditCard, title: 'Transparent Pricing', desc: 'Competitive rates with full transparency across every booking. What you see is what you pay.', color: 'from-purple-500/20 to-purple-600/5', iconColor: 'text-purple-400' },
  ];

  const stats = [
    { value: '100+', label: 'Premium Hotels', icon: Building2, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { value: '500+', label: 'Curated Rooms', icon: Star, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { value: '10K+', label: 'Happy Guests', icon: Users, color: 'text-gold-400', bg: 'bg-gold-500/10' },
    { value: '4.9', label: 'Average Rating', icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  const testimonials = [
    { name: 'Sarah Mitchell', role: 'Travel Blogger', text: 'InnCore transformed how I book hotels. The interface is stunning and the entire process feels seamless from start to finish. Absolutely love it.' },
    { name: 'James Rodriguez', role: 'Business Executive', text: 'Premium quality service throughout. Every hotel I\'ve booked through InnCore has exceeded my expectations — both in quality and convenience.' },
    { name: 'Emily Chen', role: 'Frequent Traveler', text: 'The attention to detail in both the platform and the hotel selection is absolutely remarkable. This is how hotel booking should feel.' },
  ];

  return (
    <div>

      {/* ═══════════════════════════════════════════
          HERO — Centered, full viewport
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-dark-900" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gold-500/[0.03] rounded-full blur-[160px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/[0.025] rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/5 w-[350px] h-[350px] bg-purple-500/[0.02] rounded-full blur-[100px]" />
        </div>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        <div className="relative w-full" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px' }}>
          <div style={{ textAlign: 'center', maxWidth: '960px', margin: '0 auto' }}>
            <motion.div initial="hidden" animate="visible" variants={stagger}>

              {/* Badge */}
              <motion.div variants={fadeUp} custom={0}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '9999px', fontSize: '14px', fontWeight: 500, color: '#dbb978', backgroundColor: 'rgba(200,165,94,0.1)', border: '1px solid rgba(200,165,94,0.2)' }}>
                  <Sparkles style={{ height: '16px', width: '16px' }} /> Premium Hotel Reservations
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1 variants={fadeUp} custom={1} style={{ fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#f0f2f7', marginTop: '48px', marginBottom: '32px' }}>
                Experience{' '}
                <span className="gold-gradient-text">Luxury</span>
                <br />
                Like Never Before
              </motion.h1>

              {/* Subtitle */}
              <motion.p variants={fadeUp} custom={2} style={{ fontSize: '20px', lineHeight: 1.7, color: '#8b92a8', maxWidth: '640px', margin: '0 auto 56px auto', textAlign: 'center' }}>
                Discover a curated collection of the world's finest hotels. Book with confidence, complete transparency, and effortless ease.
              </motion.p>

              {/* CTA buttons */}
              <motion.div variants={fadeUp} custom={3} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                <Button size="hero" variant="accent" onClick={() => navigate(isAuthenticated ? '/hotels' : '/register')} className="gold-glow">
                  {isAuthenticated ? 'Browse Hotels' : 'Get Started Free'}
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="hero" variant="secondary" onClick={() => navigate(isAuthenticated ? '/bookings' : '/login')}>
                  {isAuthenticated ? 'My Bookings' : 'Sign In'}
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats — full width cards */}
          <motion.div
            initial="hidden" animate="visible" variants={stagger}
            style={{ marginTop: '128px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', borderRadius: '16px', backgroundColor: 'rgba(20,26,46,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <div style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em' }} className={stat.color}>{stat.value}</div>
                  <div style={{ fontSize: '14px', color: '#6e7694', marginTop: '2px' }}>{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          FEATURES
          ═══════════════════════════════════════════ */}
      <section style={{ paddingTop: 'clamp(112px, 10vw, 192px)', paddingBottom: 'clamp(112px, 10vw, 192px)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,19,34,0.3)' }} />
        <div style={{ position: 'relative', maxWidth: '1440px', margin: '0 auto', padding: '0 48px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(56px, 5vw, 80px)' }}>
            <h2 className="heading-section" style={{ marginBottom: '20px' }}>
              Why Choose <span className="gold-gradient-text">{APP_NAME}</span>
            </h2>
            <p style={{ fontSize: '18px', lineHeight: 1.7, color: '#8b92a8', maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
              Every feature designed to make your booking experience exceptional.
            </p>
          </div>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '28px' }}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group card-border card-border-hover card-glow"
                style={{ padding: '40px 32px', borderRadius: '16px', backgroundColor: 'rgba(20,26,46,0.4)', transition: 'all 0.3s' }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center`} style={{ marginBottom: '28px', transition: 'transform 0.3s' }}>
                  <f.icon className={`h-6 w-6 ${f.iconColor}`} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#e2e5ed', marginBottom: '12px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#6e7694' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════ */}
      <section style={{ paddingTop: 'clamp(112px, 10vw, 192px)', paddingBottom: 'clamp(112px, 10vw, 192px)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px' }}>

          <div style={{ textAlign: 'center', marginBottom: 'clamp(56px, 5vw, 80px)' }}>
            <h2 className="heading-section" style={{ marginBottom: '20px' }}>
              How It <span className="gold-gradient-text">Works</span>
            </h2>
            <p style={{ fontSize: '18px', lineHeight: 1.7, color: '#8b92a8', maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
              Book your dream stay in three simple steps.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { step: '01', title: 'Browse Hotels', desc: 'Explore our curated collection of premium hotels filtered by rating and location across the globe.', icon: MapPin },
              { step: '02', title: 'Choose Your Room', desc: 'Select from various room types — from standard to luxury king suites, with ocean views available.', icon: Star },
              { step: '03', title: 'Book Instantly', desc: 'Confirm your reservation in seconds with real-time availability and instant booking confirmation.', icon: Sparkles },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="card-border card-border-hover card-glow group"
                style={{ padding: '48px 36px', borderRadius: '16px', backgroundColor: 'rgba(20,26,46,0.4)', textAlign: 'center', transition: 'all 0.3s' }}
              >
                <div style={{ fontSize: 'clamp(4rem, 5vw, 5rem)', fontWeight: 800, color: 'rgba(33,42,69,0.7)', marginBottom: '32px', lineHeight: 1, userSelect: 'none' }}>{s.step}</div>
                <div style={{ width: '56px', height: '56px', borderRadius: '12px', backgroundColor: 'rgba(200,165,94,0.1)', border: '1px solid rgba(200,165,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                  <s.icon style={{ height: '24px', width: '24px', color: '#dbb978' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#e2e5ed', marginBottom: '12px' }}>{s.title}</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#6e7694', maxWidth: '280px', margin: '0 auto' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════ */}
      <section style={{ paddingTop: 'clamp(112px, 10vw, 192px)', paddingBottom: 'clamp(112px, 10vw, 192px)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,19,34,0.3)' }} />
        <div style={{ position: 'relative', maxWidth: '1440px', margin: '0 auto', padding: '0 48px' }}>

          <div style={{ textAlign: 'center', marginBottom: 'clamp(56px, 5vw, 80px)' }}>
            <h2 className="heading-section" style={{ marginBottom: '20px' }}>
              Loved by <span className="gold-gradient-text">Travelers</span>
            </h2>
            <p style={{ fontSize: '18px', lineHeight: 1.7, color: '#8b92a8', maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
              What our guests say about their experience with {APP_NAME}.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card-border card-border-hover"
                style={{ padding: '40px', borderRadius: '16px', backgroundColor: 'rgba(20,26,46,0.4)', display: 'flex', flexDirection: 'column', transition: 'all 0.3s' }}
              >
                <Quote style={{ height: '40px', width: '40px', color: 'rgba(200,165,94,0.2)', marginBottom: '24px', flexShrink: 0 }} />
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#a3abbe', marginBottom: '32px', flex: 1 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(200,165,94,0.2), rgba(166,133,64,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dbb978', fontSize: '14px', fontWeight: 700, border: '1px solid rgba(200,165,94,0.2)', flexShrink: 0 }}>
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#e2e5ed' }}>{t.name}</p>
                    <p style={{ fontSize: '12px', color: '#545c75', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginTop: '2px' }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════ */}
      <section style={{ paddingTop: 'clamp(112px, 10vw, 192px)', paddingBottom: 'clamp(112px, 10vw, 192px)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="card-border"
            style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(166,133,64,0.2), rgba(200,165,94,0.1), rgba(15,19,34,1))' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: '384px', height: '384px', background: 'rgba(200,165,94,0.08)', borderRadius: '50%', filter: 'blur(100px)', transform: 'translate(25%, -33%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '288px', height: '288px', background: 'rgba(200,165,94,0.05)', borderRadius: '50%', filter: 'blur(80px)', transform: 'translate(-25%, 33%)' }} />

            <div style={{ position: 'relative', textAlign: 'center', padding: 'clamp(64px, 8vw, 144px) clamp(32px, 5vw, 64px)' }}>
              <h2 className="heading-section" style={{ marginBottom: '24px' }}>
                Ready to Find Your{' '}
                <span className="gold-gradient-text">Perfect Stay</span>?
              </h2>
              <p style={{ fontSize: '20px', lineHeight: 1.7, color: '#8b92a8', maxWidth: '640px', margin: '0 auto 56px auto', textAlign: 'center' }}>
                Join thousands of travelers who trust {APP_NAME} for premium hotel reservations worldwide.
              </p>
              <Button size="hero" variant="accent" onClick={() => navigate(isAuthenticated ? '/hotels' : '/register')} className="gold-glow">
                {isAuthenticated ? 'Explore Hotels' : 'Create Free Account'}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
