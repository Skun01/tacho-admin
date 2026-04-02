import { Link } from 'react-router'

/**
 * BrandLogo cho admin auth pages.
 * Logo Tacho + badge "Admin" — clickable về trang chủ.
 */
export function BrandLogo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group w-fit">
      <img
        src="/kitsune.svg"
        alt="Tacho logo"
        className="w-8 h-8 object-contain"
      />
      <div className="flex items-baseline gap-1.5">
        <span
          className="text-lg font-bold tracking-wide"
          style={{ color: 'var(--on-surface)' }}
        >
          Tacho
        </span>
        <span
          className="text-xs font-semibold px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
          }}
        >
          Admin
        </span>
      </div>
    </Link>
  )
}
