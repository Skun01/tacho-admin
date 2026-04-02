export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2
          className="font-heading-vn text-2xl font-bold"
          style={{ color: 'var(--on-surface)' }}
        >
          Dashboard
        </h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--on-surface-variant)' }}>
          Tổng quan hệ thống — nội dung sẽ được xây dựng khi backend sẵn sàng.
        </p>
      </div>

      {/* Bento grid placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Người dùng', 'Bộ thẻ', 'Bài học', 'Hoạt động'].map((label) => (
          <div
            key={label}
            className="rounded-lg p-6"
            style={{ backgroundColor: 'var(--surface-container-lowest)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--on-surface-variant)' }}>
              {label}
            </p>
            <div
              className="h-8 w-16 rounded"
              style={{ backgroundColor: 'var(--surface-container-high)' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}