import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n/i18nContext'
import { HiUpload } from 'react-icons/hi'

type FileUploadButtonProps = {
  id: string
  accept: string
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

  const handleButtonClick = () => {
    if (disabled || !fileInputRef.current) return
    fileInputRef.current.value = ''
    fileInputRef.current.click()
  }

  const matchesAccept = (file: File) => {
    if (!accept.trim()) return true

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
  }

  const processFile = (file: File | null) => {
    if (!file || disabled || !matchesAccept(file)) return
    onFileSelect(file)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    processFile(event.target.files?.[0] ?? null)
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
  }, [disabled])

  return (
    <div className={cn("mt-2", className)}>
      <input
        id={id}
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleButtonClick}
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
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleButtonClick()
          }
        }}
        aria-disabled={disabled}
        className={cn(
          "cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all",
          isDragOver
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-muted p-4">
            <HiUpload className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium">{t('common.uploadZone.pasteHint')}</p>
          <p className="text-sm text-muted-foreground">{t('common.uploadZone.dragDropHint')}</p>
          <Button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              handleButtonClick()
            }}
            disabled={disabled}
            variant="outline"
            className="mt-2 shadow-sm"
          >
            <HiUpload className="mr-2 h-5 w-5" />
            {label}
          </Button>
        </div>
      </div>
    </div>
  )
}
