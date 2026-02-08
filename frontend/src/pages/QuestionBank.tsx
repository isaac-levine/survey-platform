import { useState, useEffect } from 'react'
import { useOrganization } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import QuestionEditor from '@/components/QuestionEditor'
import type { QuestionBankQuestion, Organization } from '@/types'

export default function QuestionBank() {
  const { organization } = useOrganization()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<QuestionBankQuestion[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionBankQuestion[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingQuestion, setEditingQuestion] = useState<QuestionBankQuestion | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null)

  useEffect(() => {
    if (organization?.id) {
      loadOrganization()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization])

  useEffect(() => {
    if (currentOrg?.id) {
      loadQuestions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrg])

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredQuestions(
        questions.filter((q) =>
          q.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredQuestions(questions)
    }
  }, [searchQuery, questions])

  const loadOrganization = async () => {
    if (!organization?.id) return
    
    try {
      // Use ensure endpoint to find or create the organization
      const org = await api.get<Organization>(
        `/organizations/clerk/${organization.id}/ensure?name=${encodeURIComponent(organization.name || 'My Organization')}`
      )
      setCurrentOrg(org)
    } catch (error) {
      console.error('Failed to load/create organization:', error)
      setLoading(false)
      alert('Failed to load organization. Please refresh the page.')
    }
  }

  const loadQuestions = async () => {
    if (!currentOrg?.id) return
    try {
      setLoading(true)
      const data = await api.get<QuestionBankQuestion[]>(
        `/question-bank-questions?organizationId=${currentOrg.id}`
      )
      setQuestions(data)
    } catch (error) {
      console.error('Failed to load questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingQuestion(null)
    setEditorOpen(true)
  }

  const handleEdit = (question: QuestionBankQuestion) => {
    setEditingQuestion(question)
    setEditorOpen(true)
  }

  const handleSave = async (questionData: Partial<QuestionBankQuestion>) => {
    if (!currentOrg?.id) return

    try {
      if (editingQuestion) {
        await api.patch(`/question-bank-questions/${editingQuestion.id}`, {
          ...questionData,
          organizationId: currentOrg.id,
        })
      } else {
        await api.post('/question-bank-questions', {
          ...questionData,
          organizationId: currentOrg.id,
        })
      }
      await loadQuestions()
    } catch (error) {
      console.error('Failed to save question:', error)
      alert('Failed to save question. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    try {
      await api.delete(`/question-bank-questions/${id}`)
      await loadQuestions()
    } catch (error) {
      console.error('Failed to delete question:', error)
      alert('Failed to delete question. Please try again.')
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-2xl font-bold text-indigo-900 hover:text-indigo-700 transition"
          >
            Cendara
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Question Bank</h1>
            {currentOrg && (
              <p className="text-gray-600 mt-1">{currentOrg.name}</p>
            )}
          </div>
          <Button onClick={handleCreate}>Create Question</Button>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading questions...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">
                {searchQuery
                  ? 'No questions found matching your search.'
                  : 'No questions in your bank yet. Create your first question!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuestions.map((question) => (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant={getTypeBadgeVariant(question.type)}>
                      {question.type}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(question)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(question.id)}
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
                      {question.options.options.length} options
                    </div>
                  )}
                  {question.type === 'rating' && question.options && (
                    <div className="mt-2 text-xs text-gray-500">
                      {question.options.min} - {question.options.max} scale
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <QuestionEditor
          question={editingQuestion}
          open={editorOpen}
          onOpenChange={setEditorOpen}
          onSave={handleSave}
        />
      </main>
    </div>
  )
}
