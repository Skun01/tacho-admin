import { BrowserRouter, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GooeyToaster } from './components/ui/goey-toaster'
import { AppInit } from './components/auth/AppInit'
import { GuestRoute } from './components/auth/GuestRoute'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProfilePage } from './pages/ProfilePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
    mutations: { retry: 0 },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GooeyToaster position="top-right" />
      <BrowserRouter>
        <AppInit>
          <Routes>

            {/* Guest-only — redirect /dashboard nếu đã đăng nhập */}
            <Route element={<GuestRoute />}>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>

            {/* Protected — yêu cầu đăng nhập + role editor/admin */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

          </Routes>
        </AppInit>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
