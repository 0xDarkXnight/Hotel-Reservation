import { classNames } from '../../utils/helpers';

const variants = {
  primary:
    'bg-gradient-to-r from-gold-500 to-gold-400 text-dark-950 font-bold shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 hover:shadow-xl hover:brightness-110',
  secondary:
    'bg-dark-600 text-slate-100 border-2 border-white/[0.10] hover:border-white/[0.20] hover:bg-dark-500',
  accent:
    'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 text-dark-950 font-extrabold shadow-xl shadow-gold-500/30 hover:shadow-gold-500/50 hover:shadow-2xl hover:brightness-110',
  danger:
    'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 font-semibold',
  ghost:
    'text-slate-300 hover:text-slate-50 hover:bg-white/[0.06] font-medium',
  outline:
    'border-2 border-gold-500/40 text-gold-400 hover:bg-gold-500/10 hover:border-gold-500/60 font-semibold',
};

const sizeStyles = {
  sm: { height: '44px', padding: '0 28px', fontSize: '14px', gap: '8px', borderRadius: '12px' },
  md: { height: '56px', padding: '0 36px', fontSize: '15px', gap: '10px', borderRadius: '12px' },
  lg: { height: '64px', padding: '0 44px', fontSize: '16px', gap: '12px', borderRadius: '14px' },
  xl: { height: '72px', padding: '0 56px', fontSize: '17px', gap: '12px', borderRadius: '16px' },
  hero: { height: '80px', padding: '0 72px', fontSize: '18px', gap: '16px', borderRadius: '16px' },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  ...props
}) {
  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center font-medium transition-all duration-300 cursor-pointer whitespace-nowrap',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none',
        'active:scale-[0.97]',
        variants[variant],
        className
      )}
      style={{ ...sizeStyles[size], ...props.style }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon className="h-5 w-5 flex-shrink-0" />
      ) : null}
      {children}
    </button>
  );
}
