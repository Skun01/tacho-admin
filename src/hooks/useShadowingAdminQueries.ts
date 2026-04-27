import { useQuery } from '@tanstack/react-query'
import { shadowingAdminService } from '@/services/shadowingAdminService'
import type { SearchAvailableSentencesQuery, SearchShadowingTopicsQuery } from '@/types/shadowingAdmin'

// ── Query Keys ─────────────────────────────────────────────────────────────────

export const SHADOWING_ADMIN_QUERY_KEYS = {
  all: ['shadowing-admin'] as const,
  topics: (query?: SearchShadowingTopicsQuery) =>
    [...SHADOWING_ADMIN_QUERY_KEYS.all, 'topics', query] as const,
  topicDetail: (topicId: string) => [...SHADOWING_ADMIN_QUERY_KEYS.all, 'topic', topicId] as const,
  availableSentences: (topicId: string, query?: SearchAvailableSentencesQuery) =>
    [...SHADOWING_ADMIN_QUERY_KEYS.all, 'available-sentences', topicId, query] as const,
  topicAnalytics: (topicId: string) => [...SHADOWING_ADMIN_QUERY_KEYS.all, 'analytics', topicId] as const,
  sentenceAnalytics: (topicId: string) =>
    [...SHADOWING_ADMIN_QUERY_KEYS.all, 'sentence-analytics', topicId] as const,
}

// ── Topic Queries ──────────────────────────────────────────────────────────────

export function useShadowingTopicSearch(query: SearchShadowingTopicsQuery, enabled = true) {
  return useQuery({
    queryKey: SHADOWING_ADMIN_QUERY_KEYS.topics(query),
    queryFn: () => shadowingAdminService.searchTopics(query),
    enabled,
  })
}

export function useShadowingTopicDetail(topicId: string, enabled = true) {
  return useQuery({
    queryKey: SHADOWING_ADMIN_QUERY_KEYS.topicDetail(topicId),
    queryFn: () => shadowingAdminService.getTopicDetail(topicId),
    enabled: enabled && Boolean(topicId),
  })
}

// ── Available Sentences Query ────────────────────────────────────────────────

export function useAvailableSentences(
  topicId: string,
  query: SearchAvailableSentencesQuery,
  enabled = true,
) {
  return useQuery({
    queryKey: SHADOWING_ADMIN_QUERY_KEYS.availableSentences(topicId, query),
    queryFn: () => shadowingAdminService.searchAvailableSentences(topicId, query),
    enabled: enabled && Boolean(topicId),
  })
}

// ── Analytics Queries ─────────────────────────────────────────────────────────

export function useTopicAnalytics(topicId: string, enabled = true) {
  return useQuery({
    queryKey: SHADOWING_ADMIN_QUERY_KEYS.topicAnalytics(topicId),
    queryFn: () => shadowingAdminService.getTopicAnalytics(topicId),
    enabled: enabled && Boolean(topicId),
  })
}

export function useSentenceAnalytics(topicId: string, enabled = true) {
  return useQuery({
    queryKey: SHADOWING_ADMIN_QUERY_KEYS.sentenceAnalytics(topicId),
    queryFn: () => shadowingAdminService.getSentenceAnalytics(topicId),
    enabled: enabled && Boolean(topicId),
  })
}
