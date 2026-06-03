import { classNames } from '../../utils/helpers';

export default function Input({ label, error, icon: Icon, className = '', id, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={classNames('w-full', className)}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          className={classNames(
            'w-full rounded-xl bg-dark-600/80 text-sm text-slate-100',
            'placeholder:text-slate-500 transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500/50',
            error
              ? 'border border-danger/40 focus:ring-danger/20 focus:border-danger/60'
              : 'border border-white/[0.08] hover:border-white/[0.14]'
          )}
          style={{ height: '56px', paddingRight: '16px', paddingLeft: Icon ? '44px' : '16px' }}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
