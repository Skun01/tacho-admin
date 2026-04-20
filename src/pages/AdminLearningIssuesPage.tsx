import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { MagnifyingGlassIcon, GearIcon, ChartBarIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AdminTableSection } from '@/components/shared/AdminTableSection'
import { CardConfigDrawer } from '@/components/learning/CardConfigDrawer'
import { CardAnalyticsDrawer } from '@/components/learning/CardAnalyticsDrawer'
import { IssuesBadge } from '@/components/learning/IssuesBadge'
import { ReadinessBadges } from '@/components/learning/ReadinessBadges'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { useAdminLearningIssuesPageState } from '@/hooks/useAdminLearningIssuesPageState'
import {
  CARD_TYPE_LABELS,
  CARD_TYPE_OPTIONS,
  LEARNING_ISSUE_TYPE_LABELS,
  LEARNING_ISSUE_TYPE_OPTIONS,
  STUDY_MODE_LABELS,
  STUDY_MODE_OPTIONS,
} from '@/types/learningAdmin'
import type { CardType, LearningIssueType, StudyMode } from '@/types/learningAdmin'

const C = ADMIN_LEARNING_CONTENT.issues

export function AdminLearningIssuesPage() {
  const state = useAdminLearningIssuesPageState()
  const [configCardId, setConfigCardId] = useState<string | null>(null)
  const [analyticsCardId, setAnalyticsCardId] = useState<string | null>(null)

  return (
    <>
      <Helmet>
        <title>{C.pageTitle}</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2
            className="font-heading-vn text-2xl font-bold"
            style={{ color: 'var(--on-surface)' }}
          >
            {C.heading}
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            {C.description}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px] max-w-xs">
            <Input
              value={state.keywordInput}
              onChange={(e) => state.setKeywordInput(e.target.value)}
              placeholder={C.searchPlaceholder}
              onKeyDown={(e) => e.key === 'Enter' && state.handleSearch()}
            />
          </div>

          <Select
            value={state.cardTypeInput ?? '__all__'}
            onValueChange={(v) => state.setCardTypeInput(v === '__all__' ? undefined : (v as CardType))}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder={C.cardTypeLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">{C.cardTypeLabel}</SelectItem>
              {CARD_TYPE_OPTIONS.map((t) => (
                <SelectItem key={t} value={t}>{CARD_TYPE_LABELS[t]}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={state.modeInput ?? '__all__'}
            onValueChange={(v) => state.setModeInput(v === '__all__' ? undefined : (v as StudyMode))}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder={C.modeLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">{C.modeLabel}</SelectItem>
              {STUDY_MODE_OPTIONS.map((m) => (
                <SelectItem key={m} value={m}>{STUDY_MODE_LABELS[m]}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={state.issueTypeInput ?? '__all__'}
            onValueChange={(v) => state.setIssueTypeInput(v === '__all__' ? undefined : (v as LearningIssueType))}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder={C.issueTypeLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">{C.issueTypeLabel}</SelectItem>
              {LEARNING_ISSUE_TYPE_OPTIONS.map((t) => (
                <SelectItem key={t} value={t}>{LEARNING_ISSUE_TYPE_LABELS[t]}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="button" size="sm" onClick={state.handleSearch}>
            <MagnifyingGlassIcon size={16} className="mr-1" />
            {C.applyFilterLabel}
          </Button>

          <Button type="button" variant="ghost" size="sm" onClick={state.handleReset}>
            {C.clearFilterLabel}
          </Button>
        </div>

        {/* Result count */}
        {state.totalItems > 0 && (
          <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
            {C.resultCountLabel(state.totalItems)}
          </p>
        )}

        {/* Table */}
        <AdminTableSection
          title={C.tableTitle}
          isLoading={state.isLoading}
          isFetching={state.isFetching}
          hasItems={state.items.length > 0}
          currentPage={state.currentPage}
          totalPage={state.totalPage}
          previousPageLabel={C.previousPageLabel}
          nextPageLabel={C.nextPageLabel}
          emptyTitle={C.emptyTitle}
          emptyDescription={C.emptyDescription}
          onPageChange={state.handlePageChange}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{C.columns.title}</TableHead>
                <TableHead>{C.columns.cardType}</TableHead>
                <TableHead>{C.columns.availableModes}</TableHead>
                <TableHead>{C.columns.issues}</TableHead>
                <TableHead className="text-right">{C.columns.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.items.map((item) => (
                <TableRow key={item.cardId}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      {item.summary && (
                        <p className="text-xs mt-0.5 truncate max-w-xs" style={{ color: 'var(--on-surface-variant)' }}>
                          {item.summary}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {CARD_TYPE_LABELS[item.cardType]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ReadinessBadges modes={item.availableModes} />
                  </TableCell>
                  <TableCell>
                    <IssuesBadge issues={item.issues} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setConfigCardId(item.cardId)}
                            >
                              <GearIcon size={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{C.actions.viewConfig}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setAnalyticsCardId(item.cardId)}
                            >
                              <ChartBarIcon size={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{C.actions.viewAnalytics}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminTableSection>
      </div>

      {/* Drawers */}
      <CardConfigDrawer
        cardId={configCardId}
        open={Boolean(configCardId)}
        onOpenChange={(open) => { if (!open) setConfigCardId(null) }}
      />
      <CardAnalyticsDrawer
        cardId={analyticsCardId}
        open={Boolean(analyticsCardId)}
        onOpenChange={(open) => { if (!open) setAnalyticsCardId(null) }}
      />
    </>
  )
}
