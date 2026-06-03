import { classNames } from '../../utils/helpers';

export default function Card({ children, className = '', hover = false, padding = true, glow = false, ...props }) {
  return (
    <div
      className={classNames(
        'bg-dark-700/60 rounded-2xl card-border',
        hover && 'transition-all duration-300 card-border-hover hover:-translate-y-1',
        glow && 'card-glow',
        padding && 'p-7 sm:p-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={classNames('mb-5', className)}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={classNames('text-xl font-semibold text-slate-50', className)}>{children}</h3>;
}

export function CardDescription({ children, className = '' }) {
  return <p className={classNames('text-sm text-slate-400 mt-1.5 leading-relaxed', className)}>{children}</p>;
}
