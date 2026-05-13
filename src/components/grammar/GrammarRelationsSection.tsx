import { useState, useCallback } from 'react'
import { PlusIcon, TrashIcon, MagnifyingGlassIcon, SpinnerGapIcon } from '@phosphor-icons/react'
import { type UseFieldArrayReturn, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ADMIN_GRAMMAR_CONTENT } from '@/constants/adminContent'
import { grammarAdminService } from '@/services/grammarAdminService'
import {
  GRAMMAR_RELATION_TYPE_LABELS,
  GRAMMAR_RELATION_TYPE_OPTIONS,
  type GrammarAdminItem,
  type GrammarRelationType,
} from '@/types/grammarAdmin'
import type { GrammarUpsertInput } from '@/lib/validations/grammarAdmin'

interface GrammarRelationsSectionProps {
  form: UseFormReturn<GrammarUpsertInput>
  relationFieldArray: UseFieldArrayReturn<GrammarUpsertInput, 'relations'>
  currentCardId?: string
}

export function GrammarRelationsSection({ form, relationFieldArray, currentCardId }: GrammarRelationsSectionProps) {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchResults, setSearchResults] = useState<GrammarAdminItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const handleSearch = useCallback(async (keyword: string) => {
    setSearchKeyword(keyword)
    if (!keyword.trim()) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    try {
      setIsSearching(true)
      const { data } = await grammarAdminService.search({
        q: keyword.trim(),
        page: 1,
        pageSize: 8,
      })
      setSearchResults(data.data ?? [])
      setShowDropdown(true)
    } catch {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const addRelation = (item: GrammarAdminItem, relationType: GrammarRelationType) => {
    // Không cho tự tham chiếu
    if (currentCardId && item.id === currentCardId) return

    // Không thêm trùng
    const existing = form.getValues('relations')
    if (existing.some((r) => r.relatedId === item.id)) return

    relationFieldArray.append({
      relatedId: item.id,
      relationType,
      title: item.title,
      summary: item.summary,
    })
    setSearchKeyword('')
    setSearchResults([])
    setShowDropdown(false)
  }

  return (
    <div className="space-y-4">

      {/* Inline typeahead search */}
      <div className="relative">
        <div className="relative">
          <MagnifyingGlassIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--on-surface-variant)' }}
          />
          <Input
            value={searchKeyword}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={ADMIN_GRAMMAR_CONTENT.form.fields.relatedIdPlaceholder}
            className="pl-9"
            onFocus={() => {
              if (searchResults.length > 0) setShowDropdown(true)
            }}
            onBlur={() => {
              // Delay để click vào dropdown item không bị mất
              setTimeout(() => setShowDropdown(false), 200)
            }}
          />
          {isSearching && <SpinnerGapIcon size={16} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin" />}
        </div>

        {/* Dropdown results */}
        {showDropdown && (
          <div
            className="absolute z-20 mt-1 w-full rounded-md border shadow-lg"
            style={{ background: 'var(--surface-container-lowest)', borderColor: 'var(--outline-variant)' }}
          >
            {searchResults.length === 0 ? (
              <p className="px-3 py-2 text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                {isSearching
                  ? ADMIN_GRAMMAR_CONTENT.form.searchGrammarLoadingLabel
                  : ADMIN_GRAMMAR_CONTENT.form.searchGrammarNoResultLabel}
              </p>
            ) : (
              <ul className="max-h-48 overflow-y-auto py-1">
                {searchResults.map((item) => {
                  const alreadyAdded = form.getValues('relations').some((r) => r.relatedId === item.id)
                  const isSelf = currentCardId === item.id
                  return (
                    <li key={item.id}>
                      <div className="flex items-center justify-between gap-2 px-3 py-2 hover:bg-[var(--surface-container-low)]">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{item.title}</p>
                          <p className="truncate text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                            {item.summary}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {GRAMMAR_RELATION_TYPE_OPTIONS.map((type) => (
                            <Button
                              key={type}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-6 text-[10px] px-1.5"
                              disabled={alreadyAdded || isSelf}
                              onClick={() => addRelation(item, type)}
                            >
                              <PlusIcon size={10} />
                              {GRAMMAR_RELATION_TYPE_LABELS[type]}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Current relations */}
      {relationFieldArray.fields.length === 0 && (
        <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
          {ADMIN_GRAMMAR_CONTENT.form.noRelationsLabel}
        </p>
      )}

      {relationFieldArray.fields.map((field, index) => {
        const relation = form.watch(`relations.${index}`)
        return (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">
                {ADMIN_GRAMMAR_CONTENT.form.sections.relationItemLabel(index + 1)}
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => relationFieldArray.remove(index)}
              >
                <TrashIcon size={14} />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{relation.title || relation.relatedId}</p>
                  {relation.summary && (
                    <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                      {relation.summary}
                    </p>
                  )}
                </div>
                <Select
                  value={relation.relationType}
                  onValueChange={(value) => {
                    form.setValue(`relations.${index}.relationType`, value as GrammarRelationType, {
                      shouldDirty: true,
                    })
                  }}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GRAMMAR_RELATION_TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type} value={type}>
                        <Badge variant="secondary">{GRAMMAR_RELATION_TYPE_LABELS[type]}</Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
