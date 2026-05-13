import { PauseIcon, SpeakerHighIcon, TrashIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SHADOWING_ADMIN_CONTENT } from '@/constants/shadowingAdmin'
import { resolveApiMediaUrl } from '@/lib/mediaUrl'
import type { ShadowingTopicDetailResponse } from '@/types/shadowingAdmin'

interface ShadowingTopicSentencesSectionProps {
  topic: ShadowingTopicDetailResponse
  isRemoving: boolean
  playingAudioUrl: string | null
  onPlayAudio: (audioUrl?: string | null) => void
  onAddSentence: () => void
  onDeleteSentence: (sentenceId: string) => void
}

export function ShadowingTopicSentencesSection({
  topic,
  isRemoving,
  playingAudioUrl,
  onPlayAudio,
  onAddSentence,
  onDeleteSentence,
}: ShadowingTopicSentencesSectionProps) {
  const sentences = [...topic.sentences].sort((a, b) => a.position - b.position)

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>{SHADOWING_ADMIN_CONTENT.sentencesSectionTitle}</CardTitle>
        <Button type="button" onClick={onAddSentence}>
          {SHADOWING_ADMIN_CONTENT.addSentenceLabel}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">{SHADOWING_ADMIN_CONTENT.sentencePositionColumn}</TableHead>
                <TableHead>{SHADOWING_ADMIN_CONTENT.sentenceTextColumn}</TableHead>
                <TableHead className="hidden md:table-cell">{SHADOWING_ADMIN_CONTENT.sentenceMeaningColumn}</TableHead>
                <TableHead className="hidden md:table-cell">{SHADOWING_ADMIN_CONTENT.sentenceLevelColumn}</TableHead>
                <TableHead className="text-right">{SHADOWING_ADMIN_CONTENT.sentenceActionsColumn}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sentences.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {SHADOWING_ADMIN_CONTENT.emptyTopicSentencesLabel}
                      </p>
                      <Button type="button" variant="outline" onClick={onAddSentence}>
                        {SHADOWING_ADMIN_CONTENT.addSentenceLabel}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sentences.map((sentence) => {
                  const resolvedUrl = resolveApiMediaUrl(sentence.audioUrl)
                  const isPlaying = Boolean(resolvedUrl && playingAudioUrl === resolvedUrl)

                  return (
                    <TableRow key={sentence.sentenceId}>
                      <TableCell>{sentence.position}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {resolvedUrl && (
                            <Button
                              type="button"
                              variant={isPlaying ? 'default' : 'ghost'}
                              size="icon-sm"
                              onClick={() => onPlayAudio(sentence.audioUrl)}
                            >
                              {isPlaying ? <PauseIcon size={16} /> : <SpeakerHighIcon size={16} />}
                            </Button>
                          )}
                          <span className="font-medium">{sentence.text}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{sentence.meaning}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {sentence.level ? (
                          <Badge variant="outline">{sentence.level}</Badge>
                        ) : (
                          SHADOWING_ADMIN_CONTENT.noneSymbol
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={isRemoving}
                          onClick={() => onDeleteSentence(sentence.sentenceId)}
                        >
                          <TrashIcon size={20} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
