"use client"

import { useState } from "react"
import { AssessmentScores, parseAdvancedText } from "@/utils/text-parser"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface TemplateEditorProps {
  initialText?: string
  scores: AssessmentScores
  onSave?: (text: string) => void
}

export function TemplateEditor({ initialText = "", scores, onSave }: TemplateEditorProps) {
  const [template, setTemplate] = useState(initialText)
  const [preview, setPreview] = useState("")
  
  const handlePreview = () => {
    setPreview(parseAdvancedText(template, scores))
  }
  
  return (
    <div className="space-y-4">
      <Textarea 
        value={template} 
        onChange={(e) => setTemplate(e.target.value)}
        placeholder="Use templates with placeholders like [[field_name]] or [[field_name:property]]."
        className="min-h-[150px]"
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handlePreview}>Preview</Button>
        {onSave && (
          <Button onClick={() => onSave(template)}>Save</Button>
        )}
      </div>
      {preview && (
        <Card className="p-4 mt-4">
          <h3 className="font-medium mb-2">Preview:</h3>
          <div>{preview}</div>
        </Card>
      )}
    </div>
  )
}
