import { Helmet } from '@dr.pogodin/react-helmet'
import { BrandLogo } from '@/components/auth/BrandLogo'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { AUTH_FORGOT_PASSWORD_COPY } from '@/constants/auth'

export function ForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title>Tacho Admin — Quên mật khẩu</title>
      </Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
        style={{ backgroundColor: 'var(--surface)' }}
      >
      <div className="w-full max-w-sm">

        <div className="mb-8">
          <BrandLogo />
        </div>

        <div className="mb-8">
          <h1
            className="font-heading-vn text-2xl font-bold"
            style={{ color: 'var(--on-surface)' }}
          >
            {AUTH_FORGOT_PASSWORD_COPY.heading}
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            {AUTH_FORGOT_PASSWORD_COPY.subheading}
          </p>
        </div>

        <ForgotPasswordForm />

      </div>
      </div>
    </>
  )
}
