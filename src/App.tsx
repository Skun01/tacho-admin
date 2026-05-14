import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router'
import { HelmetProvider } from '@dr.pogodin/react-helmet'
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
import { AdminVocabularyEditorPage } from './pages/AdminVocabularyEditorPage'
import { AdminSentencesPage } from './pages/AdminSentencesPage'
import AdminGrammarPage from './pages/AdminGrammarPage'
import AdminGrammarEditorPage from './pages/AdminGrammarEditorPage'
import AdminKanjiPage from './pages/AdminKanjiPage'
import { AdminDecksPage } from './pages/AdminDecksPage'
import { AdminDeckEditorPage } from './pages/AdminDeckEditorPage'
import { AdminDeckTypesPage } from './pages/AdminDeckTypesPage'
import { AdminDeckCoveragePage } from './pages/AdminDeckCoveragePage'
import { AdminLearningPage } from './pages/AdminLearningPage'
import { AdminShadowingPage } from './pages/AdminShadowingPage'
import { AdminShadowingTopicPage } from './pages/AdminShadowingTopicPage'
import { AdminJlptExamsPage } from './pages/AdminJlptExamsPage'
import { AdminJlptExamDetailPage } from './pages/AdminJlptExamDetailPage'
import { AdminJlptAiQuestionsPage } from './pages/AdminJlptAiQuestionsPage'
import { AdminUsersPage } from './pages/AdminUsersPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
    mutations: { retry: 0 },
  },
})

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        element={(
          <AppInit>
            <NProgressBar />
            <Outlet />
          </AppInit>
        )}
      >
        <Route element={<GuestRoute />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin/vocabulary" element={<AdminVocabularyPage />} />
            <Route path="/admin/vocabulary/create" element={<AdminVocabularyEditorPage />} />
            <Route path="/admin/vocabulary/:id/edit" element={<AdminVocabularyEditorPage />} />
            <Route path="/admin/grammar" element={<AdminGrammarPage />} />
            <Route path="/admin/grammar/create" element={<AdminGrammarEditorPage />} />
            <Route path="/admin/grammar/:id/edit" element={<AdminGrammarEditorPage />} />
            <Route path="/admin/kanji" element={<AdminKanjiPage />} />
            <Route path="/admin/sentences" element={<AdminSentencesPage />} />
            <Route path="/admin/decks" element={<AdminDecksPage />} />
            <Route path="/admin/decks/create" element={<AdminDeckEditorPage />} />
            <Route path="/admin/decks/:id/edit" element={<AdminDeckEditorPage />} />
            <Route path="/admin/deck-types" element={<AdminDeckTypesPage />} />
            <Route path="/admin/learning" element={<AdminLearningPage />} />
            <Route path="/admin/decks/:id/coverage" element={<AdminDeckCoveragePage />} />
            <Route path="/admin/shadowing" element={<AdminShadowingPage />} />
            <Route path="/admin/shadowing/:id" element={<AdminShadowingTopicPage />} />
            <Route path="/admin/jlpt/exams" element={<AdminJlptExamsPage />} />
            <Route path="/admin/jlpt/exams/:id" element={<AdminJlptExamDetailPage />} />
            <Route path="/admin/jlpt/ai-questions" element={<AdminJlptAiQuestionsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>
        </Route>
      </Route>
    </>,
  ),
)

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <GooeyToaster position="top-right" />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  )
}

export default App
