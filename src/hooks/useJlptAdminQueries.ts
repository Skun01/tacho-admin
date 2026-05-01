import { useQuery } from '@tanstack/react-query'
import { jlptExamAdminService } from '@/services/jlptExamAdminService'
import { jlptQuestionAdminService } from '@/services/jlptQuestionAdminService'
import { jlptAiQuestionAdminService } from '@/services/jlptAiQuestionAdminService'
import type { SearchAiQuestionsQuery, SearchExamsQuery, SearchQuestionsQuery } from '@/types/jlptAdmin'

// ── Query Keys ─────────────────────────────────────────────────────────────────

export const JLPT_ADMIN_QUERY_KEYS = {
  all: ['jlpt-admin'] as const,
  exams: (query?: SearchExamsQuery) => [...JLPT_ADMIN_QUERY_KEYS.all, 'exams', query] as const,
  examDetail: (id: string) => [...JLPT_ADMIN_QUERY_KEYS.all, 'exam', id] as const,
  questions: (query?: SearchQuestionsQuery) => [...JLPT_ADMIN_QUERY_KEYS.all, 'questions', query] as const,
  questionDetail: (id: string) => [...JLPT_ADMIN_QUERY_KEYS.all, 'question', id] as const,
  aiQuestions: (query?: SearchAiQuestionsQuery) => [...JLPT_ADMIN_QUERY_KEYS.all, 'ai-questions', query] as const,
  aiQuestionDetail: (id: string) => [...JLPT_ADMIN_QUERY_KEYS.all, 'ai-question', id] as const,
}

// ── Exam Queries ──────────────────────────────────────────────────────────────

export function useJlptExamSearch(query: SearchExamsQuery, enabled = true) {
  return useQuery({
    queryKey: JLPT_ADMIN_QUERY_KEYS.exams(query),
    queryFn: () => jlptExamAdminService.searchExams(query),
    enabled,
  })
}

export function useJlptExamDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: JLPT_ADMIN_QUERY_KEYS.examDetail(id),
    queryFn: () => jlptExamAdminService.getExamDetail(id),
    enabled: enabled && Boolean(id),
  })
}

// ── Question Queries ──────────────────────────────────────────────────────────

export function useJlptQuestionSearch(query: SearchQuestionsQuery, enabled = true) {
  return useQuery({
    queryKey: JLPT_ADMIN_QUERY_KEYS.questions(query),
    queryFn: () => jlptQuestionAdminService.searchQuestions(query),
    enabled,
  })
}

export function useJlptQuestionDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: JLPT_ADMIN_QUERY_KEYS.questionDetail(id),
    queryFn: () => jlptQuestionAdminService.getQuestion(id),
    enabled: enabled && Boolean(id),
  })
}

// ── AI Question Queries ───────────────────────────────────────────────────────

export function useJlptAiQuestionSearch(query: SearchAiQuestionsQuery, enabled = true) {
  return useQuery({
    queryKey: JLPT_ADMIN_QUERY_KEYS.aiQuestions(query),
    queryFn: () => jlptAiQuestionAdminService.searchAiQuestions(query),
    enabled,
  })
}

export function useJlptAiQuestionDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: JLPT_ADMIN_QUERY_KEYS.aiQuestionDetail(id),
    queryFn: () => jlptAiQuestionAdminService.getAiQuestion(id),
    enabled: enabled && Boolean(id),
  })
}
