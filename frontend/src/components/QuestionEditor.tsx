import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Question, QuestionType, QuestionBankQuestion } from '@/types'

interface QuestionEditorProps {
  question?: Question | QuestionBankQuestion | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (question: Partial<Question>) => void | Promise<void>
}

export default function QuestionEditor({
  question,
  open,
  onOpenChange,
  onSave,
}: QuestionEditorProps) {
  const [text, setText] = useState('')
  const [type, setType] = useState<QuestionType>('text')
  const [options, setOptions] = useState<any>(null)

  useEffect(() => {
    if (question) {
      setText(question.text)
      setType(question.type)
      setOptions(question.options || null)
    } else {
      setText('')
      setType('text')
      setOptions(null)
    }
  }, [question, open])

  const handleSave = () => {
    if (!text.trim()) return

    const questionData: Partial<Question> = {
      text: text.trim(),
      type,
      options: type === 'multipleChoice' || type === 'rating' ? options : undefined,
    }

    if (question?.id) {
      questionData.id = question.id
    }

    onSave(questionData)
    onOpenChange(false)
  }

  const handleAddOption = () => {
    const newOptions = options?.options || []
    setOptions({
      ...options,
      options: [...newOptions, ''],
    })
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = options?.options || []
    newOptions[index] = value
    setOptions({
      ...options,
      options: newOptions,
    })
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = options?.options || []
    newOptions.splice(index, 1)
    setOptions({
      ...options,
      options: newOptions,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {question ? 'Edit Question' : 'Add Question'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="question-text">Question Text</Label>
            <Textarea
              id="question-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your question..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-type">Question Type</Label>
            <Select
              id="question-type"
              value={type}
              onChange={(e) => {
                const newType = e.target.value as QuestionType
                setType(newType)
                if (newType === 'multipleChoice') {
                  setOptions({ options: ['', ''] })
                } else if (newType === 'rating') {
                  setOptions({ min: 1, max: 5 })
                } else {
                  setOptions(null)
                }
              }}
            >
              <option value="text">Text</option>
              <option value="multipleChoice">Multiple Choice</option>
              <option value="rating">Rating Scale</option>
            </Select>
          </div>

          {type === 'multipleChoice' && (
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                {(options?.options || []).map((option: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveOption(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                >
                  Add Option
                </Button>
              </div>
            </div>
          )}

          {type === 'rating' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating-min">Minimum</Label>
                <Input
                  id="rating-min"
                  type="number"
                  value={options?.min || 1}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      min: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating-max">Maximum</Label>
                <Input
                  id="rating-max"
                  type="number"
                  value={options?.max || 5}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      max: parseInt(e.target.value) || 5,
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!text.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
