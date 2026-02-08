import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useOrganization } from '@clerk/clerk-react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import QuestionList from '@/components/QuestionList'
import QuestionEditor from '@/components/QuestionEditor'
import type { Survey, Question, Property, QuestionBankQuestion, Organization } from '@/types'

export default function SurveyBuilder() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { organization } = useOrganization()
  const isNew = !id

  const [survey, setSurvey] = useState<Partial<Survey>>({
    title: '',
    description: '',
    propertyId: '',
  })
  const [questions, setQuestions] = useState<Question[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [bankQuestions, setBankQuestions] = useState<QuestionBankQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [bankOpen, setBankOpen] = useState(false)
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null)

  useEffect(() => {
    if (organization?.id) {
      loadOrganization()
    } else if (!organization) {
      // No organization context - can't proceed
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization?.id])

  useEffect(() => {
    if (currentOrg?.id) {
      loadProperties()
      if (!isNew && id) {
        loadSurvey()
      } else {
        setLoading(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrg?.id, id, isNew])

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

  const loadProperties = async () => {
    if (!currentOrg?.id) return
    try {
      const data = await api.get<Property[]>(`/properties`)
      // Filter by organization (backend should handle this, but filter client-side too)
      setProperties(data.filter(p => p.organizationId === currentOrg.id))
    } catch (error) {
      console.error('Failed to load properties:', error)
    }
  }

  const loadSurvey = async () => {
    if (!id) return
    try {
      setLoading(true)
      const data = await api.get<Survey>(`/surveys/${id}`)
      setSurvey(data)
      setQuestions(data.questions || [])
    } catch (error) {
      console.error('Failed to load survey:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBankQuestions = async () => {
    if (!currentOrg?.id) return
    try {
      const data = await api.get<QuestionBankQuestion[]>(
        `/question-bank-questions?organizationId=${currentOrg.id}`
      )
      setBankQuestions(data)
    } catch (error) {
      console.error('Failed to load bank questions:', error)
    }
  }

  const handleSave = async () => {
    if (!survey.title?.trim() || !survey.propertyId) {
      alert('Please fill in title and select a property')
      return
    }

    try {
      setSaving(true)
      if (isNew) {
        // Create the survey first
        const newSurvey = await api.post<Survey>('/surveys', {
          ...survey,
          propertyId: survey.propertyId!,
        })
        
        // Then create all the questions that were added locally
        if (questions.length > 0) {
          await Promise.all(
            questions.map((q, index) =>
              api.post('/questions', {
                text: q.text,
                type: q.type,
                options: q.options,
                surveyId: newSurvey.id,
                order: index,
              })
            )
          )
        }
        
        navigate(`/surveys/${newSurvey.id}/edit`)
      } else {
        // Only send fields that are allowed in UpdateSurveyDto
        await api.patch(`/surveys/${id}`, {
          title: survey.title,
          description: survey.description,
          propertyId: survey.propertyId,
        })
        alert('Survey saved!')
      }
    } catch (error) {
      console.error('Failed to save survey:', error)
      alert('Failed to save survey. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleQuestionSave = async (questionData: Partial<Question>) => {
    // For new surveys, add to local state
    if (isNew || !id) {
      if (editingQuestion) {
        // Update existing question in local state
        setQuestions(questions.map(q => 
          q.id === editingQuestion.id 
            ? { ...q, ...questionData }
            : q
        ))
      } else {
        // Add new question to local state
        const nextOrder = questions.length > 0 
          ? Math.max(...questions.map(q => q.order || 0)) + 1 
          : 0
        const newQuestion: Question = {
          id: `temp-${Date.now()}`, // Temporary ID for local state
          text: questionData.text,
          type: questionData.type,
          options: questionData.options,
          order: nextOrder,
          surveyId: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setQuestions([...questions, newQuestion])
      }
      setEditorOpen(false)
      setEditingQuestion(null)
      return
    }

    // For existing surveys, save to backend
    try {
      if (editingQuestion) {
        await api.patch(`/questions/${editingQuestion.id}`, {
          ...questionData,
          surveyId: id,
          order: editingQuestion.order,
        })
      } else {
        const nextOrder = questions.length > 0 
          ? Math.max(...questions.map(q => q.order || 0)) + 1 
          : 0
        await api.post('/questions', {
          ...questionData,
          surveyId: id,
          order: nextOrder,
        })
      }
      await loadSurvey()
      setEditorOpen(false)
      setEditingQuestion(null)
    } catch (error) {
      console.error('Failed to save question:', error)
      alert('Failed to save question. Please try again.')
    }
  }

  const handleQuestionDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    // For new surveys, just remove from local state
    if (isNew || !id) {
      setQuestions(questions.filter(q => q.id !== questionId))
      return
    }

    // For existing surveys, delete from backend
    try {
      await api.delete(`/questions/${questionId}`)
      await loadSurvey()
    } catch (error) {
      console.error('Failed to delete question:', error)
      alert('Failed to delete question. Please try again.')
    }
  }

  const handleAddFromBank = async (bankQuestionId: string) => {
    if (!id) {
      alert('Please save the survey first')
      return
    }

    try {
      await api.post(`/question-bank-questions/${bankQuestionId}/add-to-survey/${id}`)
      await loadSurvey()
      setBankOpen(false)
    } catch (error) {
      console.error('Failed to add question from bank:', error)
      alert('Failed to add question. Please try again.')
    }
  }

  const handleReorder = async (reorderedQuestions: Question[]) => {
    // Update order values
    const updates = reorderedQuestions.map((q, index) => ({
      ...q,
      order: index,
    }))

    try {
      // Update all questions with new order
      await Promise.all(
        updates.map((q) =>
          api.patch(`/questions/${q.id}`, { order: q.order })
        )
      )
      setQuestions(updates)
    } catch (error) {
      console.error('Failed to reorder questions:', error)
      await loadSurvey() // Reload on error
    }
  }

  // Show loading only if we're editing an existing survey and haven't loaded it yet
  if (loading && !isNew) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/surveys')}
            className="text-2xl font-bold text-indigo-900 hover:text-indigo-700 transition"
          >
            Cendara
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isNew ? 'Create Survey' : 'Edit Survey'}
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/surveys')}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Survey'}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Survey Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={survey.title || ''}
                    onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
                    placeholder="Survey title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={survey.description || ''}
                    onChange={(e) => setSurvey({ ...survey, description: e.target.value })}
                    placeholder="Survey description (optional)"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property">Property</Label>
                  <Select
                    id="property"
                    value={survey.propertyId || ''}
                    onChange={(e) => setSurvey({ ...survey, propertyId: e.target.value })}
                  >
                    <option value="">Select a property</option>
                    {properties.map((prop) => (
                      <option key={prop.id} value={prop.id}>
                        {prop.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Questions</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        loadBankQuestions()
                        setBankOpen(true)
                      }}
                    >
                      Add from Bank
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingQuestion(null)
                        setEditorOpen(true)
                      }}
                    >
                      Add Question
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <QuestionList
                  questions={questions}
                  onEdit={(q) => {
                    setEditingQuestion(q)
                    setEditorOpen(true)
                  }}
                  onDelete={handleQuestionDelete}
                  onReorder={handleReorder}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <QuestionEditor
          question={editingQuestion}
          open={editorOpen}
          onOpenChange={setEditorOpen}
          onSave={handleQuestionSave}
        />

        {bankOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={() => setBankOpen(false)} />
            <Card className="relative z-50 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Add Question from Bank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {bankQuestions.length === 0 ? (
                    <p className="text-gray-600">No questions in your bank yet.</p>
                  ) : (
                    bankQuestions.map((q) => (
                      <div
                        key={q.id}
                        className="flex justify-between items-center p-3 border rounded"
                      >
                        <div>
                          <p className="font-medium">{q.text}</p>
                          <p className="text-sm text-gray-500">{q.type}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddFromBank(q.id)}
                        >
                          Add
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
