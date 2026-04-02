import { Link } from 'react-router'

export function BrandLogo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group w-fit">
      <img
        src="/projectLogo.png"
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
      </div>
    </Link>
  )
}
