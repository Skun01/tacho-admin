import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Cards, Stack, Users, ChatTeardropText, ArrowRight } from '@phosphor-icons/react'
import { StatCard } from '@/components/dashboard/StatCard'
import { dashboardService } from '@/services/dashboardService'
import { useAuthStore } from '@/stores/authStore'
import { DASHBOARD_COPY, JLPT_COLORS } from '@/constants/dashboard'
import type { AdminDashboard } from '@/types/dashboard'

const MOCK_DATA: AdminDashboard = {
  stats: {
    totalCards: 1240,
    vocabCards: 890,
    grammarCards: 350,
    totalDecks: 48,
    appDecks: 32,
    textbookDecks: 16,
    totalUsers: 3820,
    activeUsersLast30d: 1240,
    totalComments: 562,
  },
  jlptDistribution: [
    { level: 'N5', vocab: 220, grammar: 80 },
    { level: 'N4', vocab: 310, grammar: 90 },
    { level: 'N3', vocab: 180, grammar: 70 },
    { level: 'N2', vocab: 120, grammar: 60 },
    { level: 'N1', vocab: 60, grammar: 50 },
  ],
  dailyActiveUsers: [],
}

const QUICK_LINKS = [
  { label: 'Thêm thẻ mới', path: '/cards/new', icon: Cards, color: 'text-primary', bg: 'bg-primary-container' },
  { label: 'Thêm bộ thẻ', path: '/decks/new', icon: Stack, color: 'text-secondary', bg: 'bg-secondary-container' },
  { label: 'Bình luận', path: '/comments', icon: ChatTeardropText, color: 'text-warning', bg: 'bg-warning-container' },
]

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [data, setData] = useState<AdminDashboard>(MOCK_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService.getDashboard()
      .then((res) => setData(res.data.data))
      .catch(() => setData(MOCK_DATA))
      .finally(() => setLoading(false))
  }, [])

  const { stats, jlptDistribution } = data
  const maxJlpt = Math.max(...jlptDistribution.map((d) => d.vocab + d.grammar))

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2
          className="text-2xl font-bold tracking-tight text-on-surface"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}
        >
          {loading ? 'Đang tải...' : `Xin chào, ${user?.displayName ?? 'Admin'}`}
        </h2>
        <p className="mt-1 text-[14px] text-outline">{DASHBOARD_COPY.statsSection}</p>
      </div>

      {/* Stat cards */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="TỔNG SỐ THẺ"
          value={stats.totalCards}
          delta={`${stats.vocabCards} từ vựng · ${stats.grammarCards} ngữ pháp`}
          color="primary"
        />
        <StatCard
          label="BỘ THẺ HỆ THỐNG"
          value={stats.totalDecks}
          delta={`${stats.appDecks} app · ${stats.textbookDecks} textbook`}
          color="secondary"
        />
        <StatCard
          label="NGƯỜI DÙNG"
          value={stats.totalUsers}
          delta={`${stats.activeUsersLast30d.toLocaleString('vi-VN')} hoạt động / 30 ngày`}
          color="primary"
        />
        <StatCard
          label="BÌNH LUẬN"
          value={stats.totalComments}
          delta="Tổng cộng"
          color="secondary"
        />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* JLPT Distribution chart */}
        <section className="col-span-2 rounded-2xl bg-card p-6">
          <h3
            className="mb-6 text-[15px] font-semibold text-on-surface"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {DASHBOARD_COPY.jlptSection}
          </h3>

          <div className="space-y-4">
            {jlptDistribution.map((d) => {
              const vocabPct = maxJlpt > 0 ? (d.vocab / maxJlpt) * 100 : 0
              const grammarPct = maxJlpt > 0 ? (d.grammar / maxJlpt) * 100 : 0
              return (
                <div key={d.level} className="flex items-center gap-4">
                  <span className="w-7 shrink-0 text-[12px] font-bold text-on-surface">{d.level}</span>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 rounded-full" style={{ width: `${vocabPct}%`, minWidth: 4, background: JLPT_COLORS.vocab }} />
                      <span className="text-[11px] text-outline">{d.vocab}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 rounded-full" style={{ width: `${grammarPct}%`, minWidth: 4, background: JLPT_COLORS.grammar }} />
                      <span className="text-[11px] text-outline">{d.grammar}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-5 flex items-center gap-4 border-t border-surface-container-high pt-4">
            <span className="flex items-center gap-1.5 text-[12px] text-on-surface-variant">
              <span className="h-2 w-4 rounded-full" style={{ background: JLPT_COLORS.vocab }} />
              Từ vựng
            </span>
            <span className="flex items-center gap-1.5 text-[12px] text-on-surface-variant">
              <span className="h-2 w-4 rounded-full" style={{ background: JLPT_COLORS.grammar }} />
              Ngữ pháp
            </span>
          </div>
        </section>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Card type donut-style */}
          <section className="rounded-2xl bg-card p-6">
            <h3
              className="mb-4 text-[15px] font-semibold text-on-surface"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {DASHBOARD_COPY.cardTypeSection}
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Từ vựng', value: stats.vocabCards, total: stats.totalCards, color: 'bg-primary-container', text: 'text-primary' },
                { label: 'Ngữ pháp', value: stats.grammarCards, total: stats.totalCards, color: 'bg-secondary-container', text: 'text-secondary' },
              ].map((item) => {
                const pct = stats.totalCards > 0 ? Math.round((item.value / stats.totalCards) * 100) : 0
                return (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[13px] text-on-surface-variant">{item.label}</span>
                      <span className={`text-[13px] font-semibold ${item.text}`}>{pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: item.text === 'text-primary' ? JLPT_COLORS.vocab : JLPT_COLORS.grammar }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Quick links */}
          <section className="rounded-2xl bg-card p-6">
            <h3
              className="mb-4 text-[15px] font-semibold text-on-surface"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Truy cập nhanh
            </h3>
            <div className="space-y-2">
              {QUICK_LINKS.map(({ label, path, icon: Icon, color, bg }) => (
                <Link
                  key={path}
                  to={path}
                  className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-surface-container-low"
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                    <Icon size={16} weight="duotone" className={color} />
                  </span>
                  <span className="flex-1 text-[13px] text-on-surface">{label}</span>
                  <ArrowRight size={14} className="text-outline-variant" />
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link
                  to="/users"
                  className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-surface-container-low"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-tertiary-container">
                    <Users size={16} weight="duotone" className="text-tertiary" />
                  </span>
                  <span className="flex-1 text-[13px] text-on-surface">Người dùng</span>
                  <ArrowRight size={14} className="text-outline-variant" />
                </Link>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}