import { BrowserRouter, Route, Routes } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GooeyToaster } from './components/ui/goey-toaster'
import { AppInit } from './components/auth/AppInit'
import { GuestRoute } from './components/auth/GuestRoute'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AdminLayout } from './components/layout/AdminLayout'
import { NProgressBar } from './components/layout/NProgressBar'
import { LoginPage } from './pages/LoginPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProfilePage } from './pages/ProfilePage'
import { AdminVocabularyPage } from './pages/AdminVocabularyPage'
import { AdminSentencesPage } from './pages/AdminSentencesPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
    mutations: { retry: 0 },
  },
})

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <GooeyToaster position="top-right" />
        <BrowserRouter>
          <AppInit>
            <NProgressBar />
            <Routes>

              {/* Guest-only */}
              <Route element={<GuestRoute />}>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Route>

              {/* Protected */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route element={<AdminLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/admin/vocabulary" element={<AdminVocabularyPage />} />
                  <Route path="/admin/sentences" element={<AdminSentencesPage />} />
                </Route>
              </Route>

            </Routes>
          </AppInit>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  )
}

export default App
