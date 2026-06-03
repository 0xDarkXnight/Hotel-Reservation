import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { classNames } from '../../utils/helpers';

const config = {
  success: { icon: CheckCircle, bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-300', iconColor: 'text-emerald-400' },
  error:   { icon: AlertCircle, bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-300', iconColor: 'text-red-400' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-300', iconColor: 'text-amber-400' },
  info:    { icon: Info, bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-300', iconColor: 'text-cyan-400' },
};

export default function Alert({ type = 'info', title, message, onClose, autoClose = 0, className = '' }) {
  const [visible, setVisible] = useState(true);
  const c = config[type];
  const Icon = c.icon;

  useEffect(() => {
    if (autoClose > 0) {
      const t = setTimeout(() => { setVisible(false); onClose?.(); }, autoClose);
      return () => clearTimeout(t);
    }
  }, [autoClose, onClose]);

  if (!visible) return null;

  return (
    <div className={classNames('flex items-start gap-3 p-4 rounded-xl border', c.bg, c.border, c.text, className)} role="alert">
      <Icon className={classNames('h-5 w-5 flex-shrink-0 mt-0.5', c.iconColor)} />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm">{title}</p>}
        <p className="text-sm opacity-90">{message}</p>
      </div>
      {onClose && (
        <button onClick={() => { setVisible(false); onClose(); }} className="p-0.5 rounded hover:bg-white/5 transition-colors cursor-pointer">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
