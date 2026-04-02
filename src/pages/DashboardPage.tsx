export function DashboardPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--surface)' }}
    >
      <div className="text-center">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: 'var(--on-surface-variant)' }}
        >
          Tacho Admin
        </p>
        <h1
          className="font-heading-vn text-3xl font-bold"
          style={{ color: 'var(--on-surface)' }}
        >
          Dashboard
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--on-surface-variant)' }}>
          Placeholder — sẽ được xây dựng trong các phase tiếp theo.
        </p>
      </div>
    </div>
  )
}