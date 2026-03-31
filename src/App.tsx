import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'
import { useAuthStore } from './stores/authStore'
import { GooeyToaster } from './components/ui/goey-toaster'
import { GuestRoute } from './components/auth/GuestRoute'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { RoleRoute } from './components/auth/RoleRoute'
import { AdminLayout } from './components/layout/AdminLayout'
import { LoginPage } from './pages/LoginPage'
import { ForbiddenPage } from './pages/ForbiddenPage'
import { DashboardPage } from './pages/DashboardPage'
import { CardListPage } from './pages/cards/CardListPage'
import { CardCreatePage } from './pages/cards/CardCreatePage'
import { CardEditPage } from './pages/cards/CardEditPage'
import { DeckListPage } from './pages/decks/DeckListPage'
import { DeckCreatePage } from './pages/decks/DeckCreatePage'
import { DeckEditPage } from './pages/decks/DeckEditPage'
import { CommentsPage } from './pages/CommentsPage'
import { SystemNotifPage } from './pages/SystemNotifPage'
import { UserListPage } from './pages/users/UserListPage'
import { UserDetailPage } from './pages/users/UserDetailPage'
import { ExamplesPage } from './pages/examples/ExamplesPage'

function App() {
  const init = useAuthStore((s) => s.init)
  useEffect(() => { init() }, [])

  return (
    <>
      <GooeyToaster position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* redirect root */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* forbidden */}
          <Route path="/forbidden" element={<ForbiddenPage />} />

          {/* guest only */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* protected: editor + admin */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/cards" element={<CardListPage />} />
              <Route path="/cards/new" element={<CardCreatePage />} />
              <Route path="/cards/:id/edit" element={<CardEditPage />} />
              <Route path="/examples" element={<ExamplesPage />} />
              <Route path="/decks" element={<DeckListPage />} />
              <Route path="/decks/new" element={<DeckCreatePage />} />
              <Route path="/decks/:id/edit" element={<DeckEditPage />} />
              <Route path="/comments" element={<CommentsPage />} />
              <Route path="/notifications/system" element={<SystemNotifPage />} />

              {/* admin only */}
              <Route element={<RoleRoute requiredRole="admin" />}>
                <Route path="/users" element={<UserListPage />} />
                <Route path="/users/:id" element={<UserDetailPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
