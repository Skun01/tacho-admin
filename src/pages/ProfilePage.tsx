import { Helmet } from '@dr.pogodin/react-helmet'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { UpdateProfileForm } from '@/components/auth/UpdateProfileForm'
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm'
import { AUTH_PROFILE_COPY } from '@/constants/auth'

export function ProfilePage() {
  return (
    <>
      <Helmet>
        <title>Trang cá nhân | Tacho Admin</title>
      </Helmet>
      <div
        className="min-h-screen"
        style={{ backgroundColor: 'var(--surface)' }}
      >
      <div className="mx-auto max-w-2xl px-6 py-10">

        {/* Header: back button + avatar + tên + role */}
        <ProfileHeader />

        {/* Divider tonal — no-line rule: dùng spacing + background shift */}
        <div className="mt-10 flex flex-col gap-10">

          {/* ── Section: Thông tin tài khoản ─────────────────────────── */}
          <section
            className="rounded-lg p-6"
            style={{ backgroundColor: 'var(--surface-container-lowest)' }}
          >
            <h2
              className="font-heading-vn text-base font-semibold mb-5"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              {AUTH_PROFILE_COPY.profileSection}
            </h2>
            <UpdateProfileForm />
          </section>

          {/* ── Section: Bảo mật ─────────────────────────────────────── */}
          <section
            className="rounded-lg p-6"
            style={{ backgroundColor: 'var(--surface-container-lowest)' }}
          >
            <h2
              className="font-heading-vn text-base font-semibold mb-5"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              {AUTH_PROFILE_COPY.securitySection}
            </h2>
            <ChangePasswordForm />
          </section>

        </div>
      </div>
      </div>
    </>
  )
}
