import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Trophy, Upload, Loader2 } from 'lucide-react'
import { topperApi } from '@/api/topper.api'

export const ImageUploader = ({
  value,
  onChange,
}: {
  value?: string
  onChange: (url: string) => void
}) => {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await topperApi.uploadImage(file)
      onChange(url)
    } catch {
      // handle silently
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <img
          src={value}
          alt="Preview"
          className="size-14 rounded-full object-cover border border-border"
        />
      ) : (
        <div className="size-14 rounded-full bg-muted flex items-center justify-center border border-border">
          <Trophy className="size-6 text-muted-foreground" />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 text-xs h-7"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading
            ? <Loader2 className="size-3.5 animate-spin" />
            : <Upload className="size-3.5" />
          }
          {uploading ? 'Uploading...' : 'Upload photo'}
        </Button>
        {value && (
          <button
            type="button"
            className="text-xs text-destructive hover:underline text-left"
            onClick={() => onChange('')}
          >
            Remove
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </div>
  )
}
