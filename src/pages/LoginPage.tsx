import { Helmet } from '@dr.pogodin/react-helmet'
import { BrandLogo } from '@/components/auth/BrandLogo'
import { LoginForm } from '@/components/auth/LoginForm'
import { AUTH_LOGIN_COPY } from '@/constants/auth'

export function LoginPage() {
  return (
    <>
      <Helmet>
        <title>Tacho Admin — Đăng nhập</title>
        <meta name="description" content="Hệ thống quản trị nội dung học tiếng Nhật Tacho." />
      </Helmet>
      <div className="min-h-screen flex" style={{ backgroundColor: 'var(--surface)' }}>

      {/* Left: Decorative panel */}
      <div
        className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ backgroundColor: 'var(--primary)' }}
      >
        {/* Texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 40px,
              var(--primary-foreground) 40px,
              var(--primary-foreground) 41px
            )`,
          }}
        />

        {/* Top: Logo trên nền đỏ */}
        <div className="relative z-10 flex items-center gap-2.5">
          <img src="/projectLogo.png" alt="Tacho logo" className="w-9 h-9 object-contain brightness-0 invert" />
          <span
            className="text-xl font-bold tracking-wide"
            style={{ color: 'var(--on-primary)' }}
          >Tacho</span>
        </div>

        {/* Bottom: Text "The Digital Kanso" editorial */}
        <div className="relative z-10">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-4"
            style={{ color: 'var(--on-primary-dim)' }}
          >
            Tacho Management System
          </p>
          <h1
            className="font-heading-vn text-4xl xl:text-5xl font-bold leading-tight"
            style={{ color: 'var(--on-primary)' }}
          >
            The Digital<br />Kanso
          </h1>
          <p
            className="mt-4 text-sm leading-relaxed max-w-xs"
            style={{ color: 'var(--on-primary-muted)' }}
          >
            Hệ thống quản trị nội dung học tiếng Nhật — phong cách editorial, không nhiễu loạn.
          </p>
        </div>
      </div>

      {/* Right: Form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-sm">

          {/* Mobile only logo */}
          <div className="mb-8 lg:hidden">
            <BrandLogo />
          </div>

          <div className="mb-8">
            <h2
              className="font-heading-vn text-2xl font-bold"
              style={{ color: 'var(--on-surface)' }}
            >
              {AUTH_LOGIN_COPY.heading}
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {AUTH_LOGIN_COPY.subheading}
            </p>
          </div>

          <LoginForm />

        </div>
      </div>

    </div>
  </>
  )
}