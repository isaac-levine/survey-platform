import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Question } from '@/types'

interface QuestionListProps {
  questions: Question[]
  onEdit: (question: Question) => void
  onDelete: (id: string) => void
  onReorder?: (questions: Question[]) => void
}

export default function QuestionList({
  questions,
  onEdit,
  onDelete,
  onReorder,
}: QuestionListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newQuestions = [...questions]
    const draggedQuestion = newQuestions[draggedIndex]
    newQuestions.splice(draggedIndex, 1)
    newQuestions.splice(index, 0, draggedQuestion)

    setDraggedIndex(index)
    onReorder?.(newQuestions)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'multipleChoice':
        return 'secondary'
      case 'rating':
        return 'outline'
      default:
        return 'default'
    }
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-600">No questions yet. Add your first question!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <Card
          key={question.id}
          draggable={!!onReorder}
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={draggedIndex === index ? 'opacity-50' : ''}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                {onReorder && (
                  <div className="cursor-move text-gray-400 hover:text-gray-600">
                    ⋮⋮
                  </div>
                )}
                <Badge variant={getTypeBadgeVariant(question.type)}>
                  {question.type}
                </Badge>
                <span className="text-sm text-gray-500">#{index + 1}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(question)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(question.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{question.text}</p>
            {question.type === 'multipleChoice' && question.options?.options && (
              <div className="mt-2 text-xs text-gray-500">
                Options: {question.options.options.join(', ')}
              </div>
            )}
            {question.type === 'rating' && question.options && (
              <div className="mt-2 text-xs text-gray-500">
                Scale: {question.options.min} - {question.options.max}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
