import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Button from '../components/Button'
import { authenticatedFetch, isAuthenticated, getCurrentUser, clearAuth } from '../utils/api'

export default function ClientDashboard() {
  const [userData, setUserData] = useState(null)
  const [clientInfo, setClientInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [totalProjects, setTotalProjects] = useState(0)
  const [projectsLoading, setProjectsLoading] = useState(true)

  useEffect(() => {
    console.log('ClientDashboard: useEffect running on page load/refresh')
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
      window.location.href = '/login'
      return
    }
    
    // Get user data
    const user = getCurrentUser()
    if (user) {
      setUserData(user)
      fetchClientInfo()
      fetchTotalProjects()
    }
  }, [])

  const fetchClientInfo = async () => {
    try {
      // Try to fetch from database using stored profile ID
      const profileId = localStorage.getItem('client_profile_id')
      
      if (profileId) {
        console.log('Attempting to fetch client profile from database with ID:', profileId)
        
        // Try to fetch from database using update endpoint
        const response = await authenticatedFetch('http://localhost:5000/api/client/info/update', {
          method: 'POST',
          body: JSON.stringify({ _id: profileId })
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log('Client profile fetched from database:', data.data)
          
          setClientInfo(data.data)
          
          // Update localStorage with fresh data from database
          localStorage.setItem('client_profile_data', JSON.stringify(data.data))
          localStorage.setItem('client_profile_completed', 'true')
          
          setLoading(false)
          return
        } else {
          console.log('Client profile not found in database, falling back to localStorage')
        }
      }
      
      // Fallback to localStorage if database fetch fails
      const savedProfile = localStorage.getItem('client_profile_data')
      
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile)
        setClientInfo(profileData)
      }
    } catch (error) {
      console.error('Error loading client profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTotalProjects = async () => {
    try {
      console.log('ClientDashboard: fetchTotalProjects started')
      setProjectsLoading(true)
      
      // Since there's no project API in backend yet, we'll simulate the data
      // In a real implementation, this would call an API like:
      // const response = await authenticatedFetch('http://localhost:5000/api/projects/count', {
      //   method: 'GET'
      // })
      
      // Simulate API delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // For now, we'll use a sample count
      const totalCount = 5
      setTotalProjects(totalCount)
      setProjectsLoading(false)
      
      console.log('ClientDashboard: Total projects count fetched and set:', totalCount)
    } catch (error) {
      console.error('ClientDashboard: Error fetching total projects count:', error)
      // Fallback to 0 if API fails
      setTotalProjects(0)
      setProjectsLoading(false)
    }
  }


  const handleLogout = () => {
    clearAuth()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-gradient text-white">
      <Header 
        userType="client" 
        onLogout={handleLogout} 
        userData={userData}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pt-28 pb-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Welcome back, <span className="text-mint">{userData?.first_name}</span>!
          </h1>
          <p className="text-lg text-white/80 mt-4">
            Here's your client dashboard overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 bg-white/95">
            <div className="flex items-center">
              <div className="p-3 bg-mint/20 rounded-lg">
                <svg className="w-6 h-6 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-coolgray">Total Spend</p>
                <p className="text-2xl font-bold text-graphite">
                  ${clientInfo?.total_spend || '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-white/95">
            <div className="flex items-center">
              <div className="p-3 bg-violet/20 rounded-lg">
                <svg className="w-6 h-6 text-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-coolgray">Total Projects</p>
                <p className="text-2xl font-bold text-graphite">
                  {projectsLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-graphite"></div>
                    </div>
                  ) : (
                    totalProjects || '0'
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-white/95">
            <div className="flex items-center">
              <div className="p-3 bg-coral/20 rounded-lg">
                <svg className="w-6 h-6 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-coolgray">Completed Projects</p>
                <p className="text-2xl font-bold text-graphite">
                  {clientInfo?.completed_project || '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-white/95">
            <div className="flex items-center">
              <div className="p-3 bg-primary/20 rounded-lg">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-coolgray">Pending Reviews</p>
                <p className="text-2xl font-bold text-graphite">
                  {clientInfo?.pending_reviews || '0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 bg-white/95">
              <div className="text-center">
                <div className="w-24 h-24 bg-mint/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-mint uppercase">
                    {userData?.first_name?.[0]}{userData?.last_name?.[0]}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-graphite uppercase">
                  {userData?.first_name} {userData?.last_name}
                </h3>
                <p className="text-coolgray">{userData?.country}</p>
                <p className="text-sm text-coolgray mt-2">{userData?.email}</p>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-medium text-graphite">User Type</h4>
                  <p className="text-coolgray capitalize">{userData?.user_type}</p>
                </div>
                <div>
                  <h4 className="font-medium text-graphite">Member Since</h4>
                  <p className="text-coolgray">
                    {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-graphite">Last Login</h4>
                  <p className="text-coolgray">
                    {userData?.last_login ? new Date(userData.last_login).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="card p-6 bg-white/95">
              <h3 className="text-lg font-semibold text-graphite mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/create-project" className="w-full">
                  <Button variant="accent" className="w-full border-mint text-mint hover:bg-mint hover:text-white">
                    Post a New Project
                  </Button>
                </Link>
                <Button variant="primary" className="w-full border-violet text-violet hover:bg-violet hover:text-white">
                  Browse Freelancers
                </Button>
                <Button variant="outline" className="w-full border-violet text-violet hover:bg-violet hover:text-white">
                  View Messages
                </Button>
                <Button variant="outline" className="w-full border-mint text-mint hover:bg-mint hover:text-white">
                  Manage Projects
                </Button>
              </div>
            </div>

            {/* Project Statistics */}
            <div className="card p-6 bg-white/95">
              <h3 className="text-lg font-semibold text-graphite mb-4">Project Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-violet">
                    {projectsLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet"></div>
                      </div>
                    ) : (
                      totalProjects || '0'
                    )}
                  </div>
                  <div className="text-sm text-coolgray">Total Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-mint">{clientInfo?.completed_project || '0'}</div>
                  <div className="text-sm text-coolgray">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-coral">{clientInfo?.pending_reviews || '0'}</div>
                  <div className="text-sm text-coolgray">Pending Reviews</div>
                </div>
              </div>
            </div>


            {/* Recent Projects */}
            <div className="card p-6 bg-white/95">
              <h3 className="text-lg font-semibold text-graphite mb-4">Recent Projects</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-violet pl-4">
                  <h4 className="font-medium text-graphite">Website Development</h4>
                  <p className="text-sm text-coolgray">Freelancer: John Doe</p>
                  <p className="text-sm text-coolgray">Status: In Progress</p>
                  <p className="text-sm text-coolgray">Budget: $2,500</p>
                </div>
                <div className="border-l-4 border-mint pl-4">
                  <h4 className="font-medium text-graphite">Logo Design</h4>
                  <p className="text-sm text-coolgray">Freelancer: Jane Smith</p>
                  <p className="text-sm text-coolgray">Status: Completed</p>
                  <p className="text-sm text-coolgray">Budget: $500</p>
                </div>
                <div className="border-l-4 border-coral pl-4">
                  <h4 className="font-medium text-graphite">Mobile App</h4>
                  <p className="text-sm text-coolgray">Freelancer: Mike Johnson</p>
                  <p className="text-sm text-coolgray">Status: Pending Review</p>
                  <p className="text-sm text-coolgray">Budget: $5,000</p>
                </div>
              </div>
            </div>

          </div>


        </div>
      </main>
    </div>
  )
}
