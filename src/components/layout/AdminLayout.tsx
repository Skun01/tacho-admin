import { Outlet, useLocation } from 'react-router'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard':               'Dashboard',
  '/cards':                   'Quản lý Thẻ',
  '/cards/new':               'Tạo thẻ mới',
  '/decks':                   'Quản lý Bộ thẻ',
  '/decks/new':               'Tạo bộ thẻ mới',
  '/examples':                'Thư viện Câu ví dụ',
  '/comments':                'Kiểm duyệt Bình luận',
  '/notifications/system':    'Thông báo Hệ thống',
  '/users':                   'Quản lý Người dùng',
}

export function AdminLayout() {
  const { pathname: currentPath } = useLocation()

  const editMatch = currentPath.match(/^\/cards\/(.+)\/edit$/)
  const deckEditMatch = currentPath.match(/^\/decks\/(.+)\/edit$/)
  const userMatch = currentPath.match(/^\/users\/(.+)$/)

  const title =
    editMatch       ? 'Chỉnh sửa Thẻ'      :
    deckEditMatch   ? 'Chỉnh sửa Bộ thẻ'   :
    userMatch       ? 'Chi tiết Người dùng' :
    ROUTE_TITLES[currentPath] ?? ''

  const backPath =
    editMatch || currentPath === '/cards/new'   ? '/cards'  :
    deckEditMatch || currentPath === '/decks/new' ? '/decks' :
    undefined

  const backLabel =
    backPath === '/cards'  ? 'Quản lý Thẻ'    :
    backPath === '/decks'  ? 'Quản lý Bộ thẻ' :
    undefined

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={title} backPath={backPath} backLabel={backLabel} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
