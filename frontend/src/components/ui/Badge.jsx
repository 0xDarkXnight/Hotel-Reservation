import { classNames } from '../../utils/helpers';

const variants = {
  default: 'bg-white/[0.06] text-slate-300 border-white/[0.06]',
  primary: 'bg-gold-500/10 text-gold-400 border-gold-500/20',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

const sizes = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export default function Badge({ children, variant = 'default', size = 'md', dot = false, className = '' }) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span className={classNames(
          'w-1.5 h-1.5 rounded-full',
          variant === 'success' ? 'bg-emerald-400' :
          variant === 'danger' ? 'bg-red-400' :
          variant === 'warning' ? 'bg-amber-400' :
          variant === 'primary' ? 'bg-gold-400' :
          variant === 'info' ? 'bg-cyan-400' :
          'bg-slate-400'
        )} />
      )}
      {children}
    </span>
  );
}
