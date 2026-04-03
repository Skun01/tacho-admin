import * as React from "react"
import { Image as ImageIcon, X, Camera } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface ImageUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: File | null
  onChange?: (file: File | null) => void
  onRemove?: () => void
  isAvatar?: boolean
  defaultPreview?: string | null
}

const ImageUpload = React.forwardRef<HTMLInputElement, ImageUploadProps>(
  ({ className, value, onChange, onRemove, isAvatar = false, defaultPreview, ...props }, ref) => {
    const [preview, setPreview] = React.useState<string | null>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
      if (value) {
        const objectUrl = URL.createObjectURL(value)
        setPreview(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
      } else {
        setPreview(defaultPreview || null)
      }
    }, [value, defaultPreview])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null
      onChange?.(file)
      // Reset value to allow uploading the same file again after removing
      e.target.value = ""
    }

    const setRefs = React.useCallback(
      (node: HTMLInputElement) => {
        inputRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref]
    )

    const handleRemove = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onChange?.(null)
      onRemove?.()
      if (inputRef.current) inputRef.current.value = ""
    }

    if (isAvatar) {
      return (
        <div className={cn("flex flex-col items-center gap-5 sm:flex-row sm:items-start", className)}>
          <div className="relative group shrink-0">
            <Avatar className="w-20 h-20 ring-1 ring-black/5 shadow-sm transition-all group-hover:ring-primary/20">
              <AvatarImage src={preview || ""} className="object-cover bg-white" />
              <AvatarFallback className="bg-muted">
                <ImageIcon size={28} weight="regular" className="text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
              <Camera size={24} weight="regular" className="text-white" />
            </div>

            <label className="absolute inset-0 w-full h-full cursor-pointer rounded-full z-10" aria-label="Tải ảnh lên">
              <input
                {...props}
                ref={setRefs}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-sm font-medium px-4 py-1.5 rounded-md transition-colors shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Thay đổi
              </button>
              {(preview && (value || defaultPreview)) && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-sm font-medium px-4 py-1.5 rounded-md transition-colors text-destructive hover:bg-destructive/10"
                >
                  Gỡ ảnh
                </button>
              )}
            </div>
            <p className="text-[13px] text-muted-foreground text-center sm:text-left">
              Khuyên dùng file JPG, PNG, WEBP (tối đa 2MB).
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className={cn("relative flex flex-col items-center justify-center w-full", className)}>
        {preview ? (
          <div className="relative w-full aspect-video rounded-md overflow-hidden border bg-muted/50 group">
            <img src={preview} alt="Upload preview" className="w-full h-full object-contain" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md p-1.5 shadow-sm transition-opacity opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-muted/20 hover:bg-muted/50 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-2">
              <div className="p-2 bg-background rounded-full shadow-sm">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Nhấp để tải lên</span> hoặc kéo thả
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (Ví dụ: 800x400px)</p>
            </div>
            <input
              {...props}
              ref={setRefs}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    )
  }
)
ImageUpload.displayName = "ImageUpload"

export { ImageUpload }
