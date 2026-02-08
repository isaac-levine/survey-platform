import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import type { Survey, Property } from '@/types'

export default function Surveys() {
  const navigate = useNavigate()
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [filterPropertyId, setFilterPropertyId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSurveys()
    loadProperties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    loadSurveys()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterPropertyId])

  const loadSurveys = async () => {
    try {
      setLoading(true)
      const url = filterPropertyId
        ? `/surveys?propertyId=${filterPropertyId}`
        : '/surveys'
      const data = await api.get<Survey[]>(url)
      setSurveys(data)
    } catch (error) {
      console.error('Failed to load surveys:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProperties = async () => {
    try {
      const data = await api.get<Property[]>('/properties')
      setProperties(data)
    } catch (error) {
      console.error('Failed to load properties:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this survey?')) return

    try {
      await api.delete(`/surveys/${id}`)
      await loadSurveys()
    } catch (error) {
      console.error('Failed to delete survey:', error)
      alert('Failed to delete survey. Please try again.')
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
          <h1 className="text-3xl font-bold text-gray-900">Surveys</h1>
          <Button onClick={() => navigate('/surveys/new')}>
            Create Survey
          </Button>
        </div>

        <div className="mb-6">
          <Select
            value={filterPropertyId}
            onChange={(e) => setFilterPropertyId(e.target.value)}
            className="max-w-xs"
          >
            <option value="">All Properties</option>
            {properties.map((prop) => (
              <option key={prop.id} value={prop.id}>
                {prop.name}
              </option>
            ))}
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading surveys...</p>
          </div>
        ) : surveys.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">
                No surveys yet. Create your first survey!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {surveys.map((survey) => (
              <Card key={survey.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{survey.title}</CardTitle>
                  {survey.property && (
                    <p className="text-sm text-gray-500 mt-1">
                      {survey.property.name}
                    </p>
                  )}
                  {survey.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {survey.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {survey.questions?.length || 0} questions
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/surveys/${survey.id}/edit`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(survey.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
