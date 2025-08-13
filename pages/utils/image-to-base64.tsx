'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import UtilsLayout from '@/components/layout/UtilsLayout'

export default function ImageToBase64() {
  const [base64Data, setBase64Data] = useState('')
  const [fileName, setFileName] = useState('')
  const [mimeType, setMimeType] = useState('')

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setMimeType(file.type)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        // The result from FileReader includes the data URL prefix, so we need to remove it.
        const base64 = result.split(',')[1]
        setBase64Data(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <UtilsLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Image to Base64 Converter</h1>
        <div className="space-y-2">
          <Label htmlFor="image-upload">Upload an image</Label>
          <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} />
        </div>

        {base64Data && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="base64-output">Base64 Output</Label>
              <Textarea
                id="base64-output"
                readOnly
                value={base64Data}
                className="h-48"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => copyToClipboard(base64Data)}>Copy Base64</Button>
              <Button onClick={() => copyToClipboard(`data:${mimeType};base64,${base64Data}`)}>Copy for &lt;img&gt; src</Button>
              <Button onClick={() => copyToClipboard(`url("data:${mimeType};base64,${base64Data}")`)}>Copy for CSS url()</Button>
            </div>
          </div>
        )}
      </div>
    </UtilsLayout>
  )
}
