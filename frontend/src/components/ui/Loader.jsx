export default function Loader({ size = 'md', text = '' }) {
  const s = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-14 w-14' };
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative">
        <div className={`${s[size]} rounded-full border-2 border-dark-500`} />
        <div className={`${s[size]} rounded-full border-2 border-transparent border-t-gold-500 animate-spin absolute top-0 left-0`} />
      </div>
      {text && <p className="text-sm text-slate-500 font-medium">{text}</p>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader size="lg" text="Loading..." />
    </div>
  );
}

export function InlineLoader() {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-slate-500">
      <div className="h-4 w-4 rounded-full border-2 border-dark-500 border-t-gold-500 animate-spin" />
      <span>Loading...</span>
    </div>
  );
}
