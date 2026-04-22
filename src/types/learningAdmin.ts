// ────────────────────────────────────────────────
// Enums / union types
// ────────────────────────────────────────────────

export const CARD_TYPE_OPTIONS = ['Vocab', 'Grammar', 'Kanji'] as const
export type CardType = (typeof CARD_TYPE_OPTIONS)[number]

export const STUDY_MODE_OPTIONS = ['FillInBlank', 'MultipleChoice', 'Flashcard'] as const
export type StudyMode = (typeof STUDY_MODE_OPTIONS)[number]

export const LEARNING_ISSUE_TYPE_OPTIONS = [
  'MissingSummary',
  'MissingSentence',
  'MissingAnswerList',
  'BlankWordNotFoundInSentence',
  'DuplicateSentencePosition',
  'UnsupportedCardTypeForMode',
] as const
export type LearningIssueType = (typeof LEARNING_ISSUE_TYPE_OPTIONS)[number]

export const MULTIPLE_CHOICE_QUESTION_TYPE_OPTIONS = ['TitleToSummary', 'SummaryToTitle'] as const
export type MultipleChoiceQuestionType = (typeof MULTIPLE_CHOICE_QUESTION_TYPE_OPTIONS)[number]

export const FLASHCARD_CONTENT_TYPE_OPTIONS = ['Title', 'Summary'] as const
export type FlashcardContentType = (typeof FLASHCARD_CONTENT_TYPE_OPTIONS)[number]

// ────────────────────────────────────────────────
// Vietnamese label maps
// ────────────────────────────────────────────────

export const CARD_TYPE_LABELS: Record<CardType, string> = {
  Vocab: 'Từ vựng',
  Grammar: 'Ngữ pháp',
  Kanji: 'Hán tự',
}

export const STUDY_MODE_LABELS: Record<StudyMode, string> = {
  FillInBlank: 'Điền vào chỗ trống',
  MultipleChoice: 'Trắc nghiệm',
  Flashcard: 'Flashcard',
}

export const LEARNING_ISSUE_TYPE_LABELS: Record<LearningIssueType, string> = {
  MissingSummary: 'Thiếu tóm tắt',
  MissingSentence: 'Thiếu câu ví dụ',
  MissingAnswerList: 'Thiếu danh sách đáp án',
  BlankWordNotFoundInSentence: 'Từ trống không có trong câu',
  DuplicateSentencePosition: 'Vị trí câu bị trùng',
  UnsupportedCardTypeForMode: 'Loại thẻ không hỗ trợ mode',
}

export const MULTIPLE_CHOICE_QUESTION_TYPE_LABELS: Record<MultipleChoiceQuestionType, string> = {
  TitleToSummary: 'Từ tiêu đề sang tóm tắt',
  SummaryToTitle: 'Từ tóm tắt sang tiêu đề',
}

export const FLASHCARD_CONTENT_TYPE_LABELS: Record<FlashcardContentType, string> = {
  Title: 'Tiêu đề',
  Summary: 'Tóm tắt',
}

// ────────────────────────────────────────────────
// 15.3 / 15.4  Card config
// ────────────────────────────────────────────────

export interface LearningAdminCardIssueItemResponse {
  type: LearningIssueType
  message: string
  sentenceId: string | null
}

export interface LearningAdminCardSentenceConfigResponse {
  sentenceId: string
  position: number
  jp: string
  en: string
  audioUrl: string | null
  level: string | null
  blankWord: string | null
  hint: string | null
  answerList: string[]
}

export interface LearningAdminCardConfigResponse {
  cardId: string
  cardType: CardType
  title: string
  summary: string
  isFillInBlankReady: boolean
  isMultipleChoiceReady: boolean
  isFlashcardReady: boolean
  availableModes: StudyMode[]
  issues: LearningAdminCardIssueItemResponse[]
  sentences: LearningAdminCardSentenceConfigResponse[]
}

// ────────────────────────────────────────────────
// 15.4  Update card config payload
// ────────────────────────────────────────────────

export interface CardConfigSentenceInput {
  sentenceId: string
  position: number
  blankWord?: string | null
  hint?: string | null
  answerList?: string[]
}

export interface UpdateCardConfigPayload {
  summary: string
  sentences: CardConfigSentenceInput[]
}

// ────────────────────────────────────────────────
// 15.5  Attach sentence payload
// ────────────────────────────────────────────────

export interface AttachSentencePayload {
  sentenceId: string
  position: number
  blankWord?: string | null
  hint?: string | null
  answerList?: string[]
}

// ────────────────────────────────────────────────
// 15.6  Update sentence relation payload
// ────────────────────────────────────────────────

export interface UpdateSentenceRelationPayload {
  position: number
  blankWord?: string | null
  hint?: string | null
  answerList?: string[]
}

// ────────────────────────────────────────────────
// 15.8  Reorder sentences payload
// ────────────────────────────────────────────────

export interface ReorderSentenceItem {
  sentenceId: string
  position: number
}

export interface ReorderSentencesPayload {
  items: ReorderSentenceItem[]
}

// ────────────────────────────────────────────────
// 15.9  Issues list
// ────────────────────────────────────────────────

export interface LearningAdminIssueListItemResponse {
  cardId: string
  cardType: CardType
  title: string
  summary: string
  availableModes: StudyMode[]
  issues: LearningAdminCardIssueItemResponse[]
}

export interface LearningAdminIssuesQuery {
  page?: number
  pageSize?: number
  cardType?: CardType
  mode?: StudyMode
  issueType?: LearningIssueType
  q?: string
  deckId?: string
}

// ────────────────────────────────────────────────
// 15.10  Deck coverage
// ────────────────────────────────────────────────

export interface DeckCoverageCardTypeBreakdown {
  cardType: CardType
  total: number
  fillInBlankReady: number
  multipleChoiceReady: number
  flashcardReady: number
}

export interface DeckCoverageResponse {
  deckId: string
  deckTitle: string
  totalCards: number
  fillInBlankReadyCount: number
  multipleChoiceReadyCount: number
  flashcardReadyCount: number
  issueCount: number
  cardsByType: DeckCoverageCardTypeBreakdown[]
}

// ────────────────────────────────────────────────
// 15.11  Learning overview
// ────────────────────────────────────────────────

export interface LearningOverviewResponse {
  activeUsersToday: number
  sessionsToday: number
  completedSessionsToday: number
  submissionsToday: number
  dueCardsNow: number
  averageAccuracy: number
}

// ────────────────────────────────────────────────
// 15.12  Deck analytics
// ────────────────────────────────────────────────

export interface DeckLearningModeAnalyticsResponse {
  mode: StudyMode
  sessionCount: number
  completedSessionCount: number
  submissionCount: number
  averageAccuracy: number
}

export interface DeckAnalyticsResponse {
  deckId: string
  deckTitle: string
  sessionCount: number
  completedSessionCount: number
  submissionCount: number
  averageAccuracy: number
  trackedCards: number
  masteredCards: number
  dueCards: number
  modeBreakdown: DeckLearningModeAnalyticsResponse[]
}

// ────────────────────────────────────────────────
// 15.13  Card analytics
// ────────────────────────────────────────────────

export interface CardLearningSrsDistributionResponse {
  srsLevel: string
  userCount: number
}

export interface CardLearningDeckUsageResponse {
  deckId: string
  deckTitle: string
}

export interface CardAnalyticsResponse {
  cardId: string
  cardType: CardType
  title: string
  summary: string
  includedSessionCount: number
  includedCompletedSessionCount: number
  trackedUsers: number
  masteredUsers: number
  dueUsers: number
  averageSrsLevel: number
  averageConsecutiveCorrect: number
  lastReviewedAt: string | null
  srsDistribution: CardLearningSrsDistributionResponse[]
  decks: CardLearningDeckUsageResponse[]
}

// ────────────────────────────────────────────────
// 15.14  User progress
// ────────────────────────────────────────────────

export interface UserLearningSrsDistributionResponse {
  srsLevel: string
  cardCount: number
}

export interface UserLearningDeckProgressResponse {
  deckId: string
  deckTitle: string
  trackedCards: number
  masteredCards: number
  dueCards: number
}

export interface UserProgressResponse {
  userId: string
  username: string
  email: string
  totalTrackedCards: number
  masteredCards: number
  dueCards: number
  averageSrsLevel: number
  averageConsecutiveCorrect: number
  lastReviewedAt: string | null
  recentSessionCount: number
  srsDistribution: UserLearningSrsDistributionResponse[]
  decks: UserLearningDeckProgressResponse[]
}

// ────────────────────────────────────────────────
// 15.15  Card preview
// ────────────────────────────────────────────────

export interface LearningPreviewOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface LearningPreviewResponse {
  cardId: string
  mode: StudyMode
  prompt: string
  questionText: string | null
  secondaryText: string | null
  hint: string | null
  frontText: string | null
  backText: string | null
  allowsMultipleSelection: boolean
  options: LearningPreviewOption[]
  warnings: string[]
}

export interface LearningPreviewQuery {
  mode: StudyMode
  multipleChoiceQuestion?: MultipleChoiceQuestionType
  flashcardFront?: FlashcardContentType
  flashcardBack?: FlashcardContentType
  shuffleOptions?: boolean
}
