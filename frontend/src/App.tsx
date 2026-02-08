import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Surveys from './pages/Surveys'
import SurveyBuilder from './pages/SurveyBuilder'
import QuestionBank from './pages/QuestionBank'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/surveys"
          element={
            <ProtectedRoute>
              <Surveys />
            </ProtectedRoute>
          }
        />
        <Route
          path="/surveys/new"
          element={
            <ProtectedRoute>
              <SurveyBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/surveys/:id/edit"
          element={
            <ProtectedRoute>
              <SurveyBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/question-bank"
          element={
            <ProtectedRoute>
              <QuestionBank />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
