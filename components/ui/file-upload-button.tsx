import { type ChangeEvent, useRef } from 'react'
import { Button } from '@/components/ui/button'
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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    if (disabled || !fileInputRef.current) return
    fileInputRef.current.value = ''
    fileInputRef.current.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFileSelect(event.target.files?.[0] ?? null)
  }

  return (
    <>
      <input
        id={id}
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <Button
        type="button"
        onClick={handleButtonClick}
        disabled={disabled}
        className={className}
      >
        <HiUpload className="mr-2 h-4 w-4" />
        {label}
      </Button>
    </>
  )
}
