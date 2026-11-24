import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PatientsPage from './pages/PatientsPage'
import PatientDetailPage from './pages/PatientDetailPage'
import { useEffect } from 'react'

function App() {
  // Проверка авторизации при загрузке
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
    }
  }, [])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<PatientsPage />} />
        <Route path="patients/:id" element={<PatientDetailPage />} />
      </Route>
    </Routes>
  )
}

export default App
