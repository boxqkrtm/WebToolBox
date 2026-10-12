import { type ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n/i18nContext'
import { HiUpload } from 'react-icons/hi'

type FileUploadButtonProps = {
  id: string
  accept?: string
  onFileSelect: (file: File | null) => void
  label: string
  disabled?: boolean
  className?: string
}

export function FileUploadButton({
  id,
  accept,
  onFileSelect,
  label,
  disabled = false,
  className,
}: FileUploadButtonProps) {
  const { t } = useI18n()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleLabelClick = () => {
    if (disabled || !fileInputRef.current) return
    fileInputRef.current.value = ''
  }

  const matchesAccept = useCallback(
    (file: File) => {
      if (!accept?.trim()) return true

      return accept
        .split(',')
        .map((entry) => entry.trim())
        .some((rule) => {
          if (!rule) return false
          if (rule.startsWith('.')) {
            return file.name.toLowerCase().endsWith(rule.toLowerCase())
          }
          if (rule.endsWith('/*')) {
            return file.type.startsWith(rule.slice(0, -1))
          }
          return file.type === rule
        })
    },
    [accept]
  )

  const processFile = useCallback(
    (file: File | null) => {
      if (!file || disabled || !matchesAccept(file)) return
      onFileSelect(file)
    },
    [disabled, matchesAccept, onFileSelect]
  )

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    processFile(event.target.files?.[0] ?? null)
    // Android keeps the picked file in the input and swallows the next
    // picker open; clear it right after selection so the picker reopens.
    event.target.value = ''
  }

  useEffect(() => {
    if (disabled) return

    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items
      if (!items) return

      for (const item of items) {
        const file = item.getAsFile?.() ?? null
        if (file && matchesAccept(file)) {
          event.preventDefault()
          processFile(file)
          break
        }
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [disabled, matchesAccept, processFile])

  return (
    <div className={cn("mt-2", className)}>
      <input
        id={id}
        ref={fileInputRef}
        type="file"
        accept={accept}
        aria-hidden="true"
        tabIndex={-1}
        className="sr-only"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <label
        htmlFor={id}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        onClick={handleLabelClick}
        onKeyDown={(event) => {
          if (disabled || (event.key !== 'Enter' && event.key !== ' ')) return
          event.preventDefault()
          handleLabelClick()
          fileInputRef.current?.click()
        }}
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled) {
            setIsDragOver(true)
          }
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setIsDragOver(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragOver(false)
          processFile(event.dataTransfer.files?.[0] ?? null)
        }}
        aria-disabled={disabled}
        className={cn(
          "block cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isDragOver
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <span className="flex flex-col items-center gap-3">
          <span className="rounded-full bg-muted p-4">
            <HiUpload className="h-8 w-8 text-muted-foreground" />
          </span>
          <span className="text-lg font-medium">{t('common.uploadZone.pasteHint')}</span>
          <span className="text-sm text-muted-foreground">{t('common.uploadZone.dragDropHint')}</span>
          <span className={cn(buttonVariants({ variant: "outline" }), "mt-2 shadow-sm")}>
            <HiUpload className="mr-2 h-5 w-5" />
            {label}
          </span>
        </span>
      </label>
    </div>
  )
}
