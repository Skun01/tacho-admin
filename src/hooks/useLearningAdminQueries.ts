import { useQuery } from '@tanstack/react-query'
import { learningAdminService } from '@/services/learningAdminService'
import type {
  LearningAdminIssuesQuery,
  LearningPreviewQuery,
} from '@/types/learningAdmin'

export const LEARNING_ADMIN_QUERY_KEYS = {
  all: ['admin', 'learning'] as const,
  cardConfig: (cardId: string) => [...LEARNING_ADMIN_QUERY_KEYS.all, 'card-config', cardId] as const,
  issues: (query: LearningAdminIssuesQuery) => [...LEARNING_ADMIN_QUERY_KEYS.all, 'issues', query] as const,
  deckCoverage: (deckId: string) => [...LEARNING_ADMIN_QUERY_KEYS.all, 'deck-coverage', deckId] as const,
  overview: () => [...LEARNING_ADMIN_QUERY_KEYS.all, 'overview'] as const,
  deckAnalytics: (deckId: string) => [...LEARNING_ADMIN_QUERY_KEYS.all, 'deck-analytics', deckId] as const,
  cardAnalytics: (cardId: string) => [...LEARNING_ADMIN_QUERY_KEYS.all, 'card-analytics', cardId] as const,
  userProgress: (userId: string) => [...LEARNING_ADMIN_QUERY_KEYS.all, 'user-progress', userId] as const,
  cardPreview: (cardId: string, query: LearningPreviewQuery) =>
    [...LEARNING_ADMIN_QUERY_KEYS.all, 'card-preview', cardId, query] as const,
}

export function useLearningCardConfig(cardId: string, enabled = true) {
  return useQuery({
    queryKey: LEARNING_ADMIN_QUERY_KEYS.cardConfig(cardId),
    queryFn: () => learningAdminService.getCardConfig(cardId),
    enabled: enabled && Boolean(cardId),
  })
}

export function useLearningIssues(query: LearningAdminIssuesQuery) {
  return useQuery({
    queryKey: LEARNING_ADMIN_QUERY_KEYS.issues(query),
    queryFn: () => learningAdminService.getIssues(query),
  })
}

export function useDeckCoverage(deckId: string, enabled = true) {
  return useQuery({
    queryKey: LEARNING_ADMIN_QUERY_KEYS.deckCoverage(deckId),
    queryFn: () => learningAdminService.getDeckCoverage(deckId),
    enabled: enabled && Boolean(deckId),
  })
}

export function useLearningOverview() {
  return useQuery({
    queryKey: LEARNING_ADMIN_QUERY_KEYS.overview(),
    queryFn: () => learningAdminService.getOverview(),
  })
}

export function useDeckAnalytics(deckId: string, enabled = true) {
  return useQuery({
    queryKey: LEARNING_ADMIN_QUERY_KEYS.deckAnalytics(deckId),
    queryFn: () => learningAdminService.getDeckAnalytics(deckId),
    enabled: enabled && Boolean(deckId),
  })
}

export function useCardAnalytics(cardId: string, enabled = true) {
  return useQuery({
    queryKey: LEARNING_ADMIN_QUERY_KEYS.cardAnalytics(cardId),
    queryFn: () => learningAdminService.getCardAnalytics(cardId),
    enabled: enabled && Boolean(cardId),
  })
}

export function useUserProgress(userId: string, enabled = true) {
  return useQuery({
    queryKey: LEARNING_ADMIN_QUERY_KEYS.userProgress(userId),
    queryFn: () => learningAdminService.getUserProgress(userId),
    enabled: enabled && Boolean(userId),
  })
}

export function useCardPreview(cardId: string, query: LearningPreviewQuery, enabled = true) {
  return useQuery({
    queryKey: LEARNING_ADMIN_QUERY_KEYS.cardPreview(cardId, query),
    queryFn: () => learningAdminService.getCardPreview(cardId, query),
    enabled: enabled && Boolean(cardId),
  })
}
