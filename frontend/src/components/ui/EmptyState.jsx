export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-dark-600 card-border flex items-center justify-center mb-5">
          <Icon className="h-7 w-7 text-slate-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-200 mb-1.5">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
