import { Outlet } from 'react-router'
import { Sidebar } from './Sidebar'
import { AdminTopbar } from './AdminTopbar'
import { useSidebarStore } from '@/stores/sidebarStore'

export function AdminLayout() {
  const isCollapsed = useSidebarStore((s) => s.isCollapsed)

  return (
    <div className="flex h-screen overflow-hidden bg-surface">

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area — offset theo sidebar width */}
      <div
        className={`
          flex flex-col flex-1 min-w-0 transition-all duration-300
          ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
        `}
      >
        <AdminTopbar />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-[1440px] mx-auto w-full">
          <Outlet />
        </main>
      </div>

    </div>
  )
}
