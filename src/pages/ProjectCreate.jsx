import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import ProjectForm from '../components/ProjectForm'
import { PageShimmer } from '../components/Shimmer'
import { isAuthenticated, getCurrentUser, clearAuth } from '../utils/api'

export default function ProjectCreate() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      window.location.href = '/login'
      return
    }
    
    // Get user data
    const user = getCurrentUser()
    if (user) {
      setUserData(user)
    }
    
    // Simulate page loading
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSuccess = (project) => {
    // Redirect to project detail page
    navigate(`/project/${project._id}`)
  }

  const handleCancel = () => {
    // Go back to projects list
    navigate('/projects')
  }

  if (pageLoading) {
    return <PageShimmer />
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-gradient text-white">
      <Header userType={userData?.user_type} userData={userData} onLogout={clearAuth} />
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <ProjectForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
                    />
                  </div>
    </div>
  )
}
