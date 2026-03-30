import { LoginForm } from '@/components/auth/LoginForm'
import { AUTH_LOGIN_COPY } from '@/constants/auth'

export function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left branding panel */}
      <div
        className="relative hidden flex-col justify-between overflow-hidden bg-surface-container-low p-16 lg:flex lg:w-[480px] xl:w-[540px]"
      >
        {/* Ambient blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: -80,
            right: -60,
            width: 360,
            height: 360,
            background: 'radial-gradient(ellipse, rgba(197,241,131,0.22) 0%, transparent 65%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            bottom: -20,
            left: 40,
            width: 280,
            height: 200,
            background: 'radial-gradient(ellipse, rgba(151,222,252,0.18) 0%, transparent 65%)',
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-2">
          <span
            className="text-2xl font-medium text-primary"
            style={{ fontFamily: "'Kiwi Maru', serif" }}
          >
            太
          </span>
          <span
            className="text-xl font-semibold tracking-wide text-on-surface"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Tacho
          </span>
        </div>

        {/* Center content */}
        <div className="relative">
          <span className="mb-4 inline-block rounded-full bg-primary-container px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-on-primary-container">
            {AUTH_LOGIN_COPY.badge}
          </span>
          <h2
            className="text-4xl font-bold leading-tight tracking-tight text-on-surface"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}
          >
            Quản trị
            <br />
            <span className="text-primary">nội dung</span>
            <br />
            Tacho
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-on-surface-variant">
            Tạo và quản lý thẻ từ vựng, ngữ pháp, bộ thẻ — tất cả trong một nơi.
          </p>
        </div>

        {/* Bottom feature pills */}
        <div className="relative flex flex-wrap gap-2">
          {['Quản lý thẻ', 'Bộ thẻ hệ thống', 'Kiểm duyệt', 'Người dùng'].map((f) => (
            <span
              key={f}
              className="rounded-full bg-surface-container-lowest px-3 py-1.5 text-[12px] font-medium text-on-surface-variant"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-16">
        {/* Mobile logo */}
        <div className="mb-10 flex items-center gap-2 lg:hidden">
          <span
            className="text-xl font-medium text-primary"
            style={{ fontFamily: "'Kiwi Maru', serif" }}
          >
            太
          </span>
          <span
            className="text-lg font-semibold tracking-wide text-on-surface"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Tacho
          </span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1
              className="text-2xl font-bold tracking-tight text-on-surface"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}
            >
              {AUTH_LOGIN_COPY.heading}
            </h1>
            <p className="mt-1.5 text-[14px] text-outline">
              {AUTH_LOGIN_COPY.subheading}
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}