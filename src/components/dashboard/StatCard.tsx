interface StatCardProps {
  label: string
  value: number | string
  delta?: string
  color?: 'primary' | 'secondary'
}

export function StatCard({ label, value, delta, color = 'primary' }: StatCardProps) {
  const valueColor = color === 'primary' ? 'text-primary' : 'text-secondary'

  return (
    <div className="rounded-2xl bg-card px-4 py-3.5">
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.06em] text-outline-variant"
      >
        {label}
      </p>
      <p
        className={`mt-1 font-['Plus_Jakarta_Sans'] text-3xl font-bold tracking-tight ${valueColor}`}
        style={{ letterSpacing: '-0.02em' }}
      >
        {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
      </p>
      {delta && (
        <p className="mt-1 text-[12px] text-outline">{delta}</p>
      )}
    </div>
  )
}
