import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { useEffect, useCallback, useRef } from 'react'
import {
  TextBolderIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const RICH_TEXT_COLORS = [
  { value: 'red', label: 'Đỏ', hex: '#dc2626' },
  { value: 'blue', label: 'Xanh dương', hex: '#2563eb' },
  { value: 'green', label: 'Xanh lá', hex: '#16a34a' },
  { value: 'yellow', label: 'Vàng', hex: '#ca8a04' },
  { value: 'orange', label: 'Cam', hex: '#ea580c' },
  { value: 'purple', label: 'Tím', hex: '#9333ea' },
  { value: 'gray', label: 'Xám', hex: '#6b7280' },
] as const

interface RichTextEditorProps {
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  maxLength?: number
  disabled?: boolean
  onEditorReady?: (editor: Editor | null) => void
}

/**
 * Chuyển đổi custom rich text format sang HTML cho TipTap.
 * Custom tags: {u}...{/u}, {red}...{/red}, **bold**, *italic*, ~~strike~~
 * TipTap đã hỗ trợ markdown bold/italic/strike nên chỉ cần convert custom tags.
 */
function customFormatToHtml(text: string): string {
  if (!text) return ''
  let html = text
  // Convert {u}...{/u} → <u>...</u>
  html = html.replace(/\{u\}(.*?)\{\/u\}/g, '<u>$1</u>')
  // Convert {color}...{/color} → <span style="color:...">...</span>
  for (const color of RICH_TEXT_COLORS) {
    const regex = new RegExp(`\\{${color.value}\\}(.*?)\\{\\/${color.value}\\}`, 'g')
    html = html.replace(regex, `<span style="color:${color.hex}">$1</span>`)
  }
  // Markdown-like: **bold** → <strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  // *italic* → <em> (nhưng không match ** đã convert)
  html = html.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
  // ~~strikethrough~~ → <s>
  html = html.replace(/~~(.*?)~~/g, '<s>$1</s>')
  // Newlines → <br> (nếu TipTap dùng paragraphs thì wrap)
  html = html.replace(/\n/g, '<br>')
  return html ? `<p>${html}</p>` : ''
}

/**
 * Chuyển đổi HTML output từ TipTap trở lại custom rich text format.
 */
function htmlToCustomFormat(html: string): string {
  if (!html) return ''
  let text = html
  // Remove wrapping <p> tags
  text = text.replace(/<p>/g, '').replace(/<\/p>/g, '\n')
  // <strong> → **bold**
  text = text.replace(/<strong>(.*?)<\/strong>/g, '**$1**')
  // <em> → *italic*
  text = text.replace(/<em>(.*?)<\/em>/g, '*$1*')
  // <s> → ~~strike~~
  text = text.replace(/<s>(.*?)<\/s>/g, '~~$1~~')
  // <u> → {u}...{/u}
  text = text.replace(/<u>(.*?)<\/u>/g, '{u}$1{/u}')
  // <span style="color:..."> → {color}...{/color}
  for (const color of RICH_TEXT_COLORS) {
    const regex = new RegExp(`<span style="color:\\s*${color.hex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*">(.*?)<\\/span>`, 'g')
    text = text.replace(regex, `{${color.value}}$1{/${color.value}}`)
  }
  // Cleanup remaining HTML
  text = text.replace(/<br\s*\/?>/g, '\n')
  text = text.replace(/<[^>]+>/g, '')
  text = text.replace(/\n+$/, '')
  return text
}

export function RichTextEditor({ value, onChange, placeholder, disabled, onEditorReady }: RichTextEditorProps) {
  const latestOnEditorReadyRef = useRef(onEditorReady)

  useEffect(() => {
    latestOnEditorReadyRef.current = onEditorReady
  }, [onEditorReady])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        listItem: false,
      }),
      Underline,
      TextStyle,
      Color,
    ],
    content: customFormatToHtml(value ?? ''),
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const isEmpty = editor.isEmpty
      const custom = isEmpty ? null : htmlToCustomFormat(html)
      onChange(custom)
    },
    editorProps: {
      attributes: {
        class: 'rich-text-editor-content min-h-[120px] outline-none px-3 py-2 text-sm',
        ...(placeholder ? { 'data-placeholder': placeholder } : {}),
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    const currentHtml = editor.getHTML()
    const currentCustom = editor.isEmpty ? null : htmlToCustomFormat(currentHtml)
    if (currentCustom !== (value ?? null)) {
      editor.commands.setContent(customFormatToHtml(value ?? ''))
    }
  }, [value, editor])

  useEffect(() => {
    latestOnEditorReadyRef.current?.(editor)

    return () => {
      latestOnEditorReadyRef.current?.(null)
    }
  }, [editor])

  const setColor = useCallback(
    (hex: string) => {
      if (!editor) return
      editor.chain().focus().setColor(hex).run()
    },
    [editor],
  )

  const clearColor = useCallback(() => {
    if (!editor) return
    editor.chain().focus().unsetColor().run()
  }, [editor])

  if (!editor) return null

  return (
    <div
      className="overflow-hidden rounded-md border transition-colors focus-within:border-[var(--primary)]"
      style={{ borderColor: 'var(--outline-variant)', background: 'var(--surface-container-low)' }}
    >
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-1 border-b px-2 py-1.5"
        style={{ borderColor: 'var(--outline-variant)', background: 'var(--surface-container-high)' }}
      >
        <Button
          type="button"
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size="icon"
          className="h-7 w-7"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
        >
          <TextBolderIcon size={16} />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size="icon"
          className="h-7 w-7"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
        >
          <TextItalicIcon size={16} />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('strike') ? 'default' : 'ghost'}
          size="icon"
          className="h-7 w-7"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={disabled}
        >
          <TextStrikethroughIcon size={16} />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('underline') ? 'default' : 'ghost'}
          size="icon"
          className="h-7 w-7"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={disabled}
        >
          <TextUnderlineIcon size={16} />
        </Button>

        <div className="mx-1 h-5 w-px" style={{ background: 'var(--outline-variant)' }} />

        <Select
          value=""
          onValueChange={(hex) => {
            if (hex === 'clear') {
              clearColor()
            } else {
              setColor(hex)
            }
          }}
        >
          <SelectTrigger className="h-7 w-[100px] text-xs">
            <SelectValue placeholder="Màu chữ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clear">Mặc định</SelectItem>
            {RICH_TEXT_COLORS.map((c) => (
              <SelectItem key={c.value} value={c.hex}>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ background: c.hex }} />
                  {c.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Editor body */}
      <EditorContent editor={editor} />
    </div>
  )
}
