import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Button from '../components/Button'
import { isAuthenticated, getCurrentUser, clearAuth } from '../utils/api'

export default function FreelancerHome() {
  const [userData, setUserData] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [projects, setProjects] = useState([])
  const [projectSearchTerm, setProjectSearchTerm] = useState('')
  const [showProjectSearch, setShowProjectSearch] = useState(false)

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
    
    // Get profile data from localStorage
    const savedProfile = localStorage.getItem('freelancer_profile_data')
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile))
    }
    
    // Fetch available projects
    fetchAvailableProjects()
  }, [])

  const fetchAvailableProjects = async () => {
    try {
      // Since there's no project API in backend yet, we'll simulate the data
      // In a real implementation, this would call an API like:
      // const response = await authenticatedFetch('http://localhost:5000/api/projects', {
      //   method: 'GET'
      // })
      
      // For now, we'll use sample data
      const sampleProjects = [
        {
          _id: '1',
          title: 'E-commerce Website Development',
          description: 'Build a modern e-commerce platform with React and Node.js. Looking for experienced full-stack developer.',
          budget: 5000,
          duration: 30,
          status: 'open',
          skills_required: ['React', 'Node.js', 'MongoDB', 'Express'],
          client_name: 'TechCorp Inc.',
          createdAt: '2024-01-15',
          proposals_count: 12
        },
        {
          _id: '2',
          title: 'Mobile App UI/UX Design',
          description: 'Design user interface for a food delivery mobile app. Need creative designer with mobile app experience.',
          budget: 2500,
          duration: 14,
          status: 'open',
          skills_required: ['UI/UX Design', 'Figma', 'Adobe XD', 'Mobile Design'],
          client_name: 'FoodieApp',
          createdAt: '2024-01-20',
          proposals_count: 8
        },
        {
          _id: '3',
          title: 'Database Optimization',
          description: 'Optimize existing MySQL database for better performance. Need database expert with MySQL experience.',
          budget: 1500,
          duration: 7,
          status: 'open',
          skills_required: ['MySQL', 'Database Optimization', 'SQL', 'Performance Tuning'],
          client_name: 'DataSolutions',
          createdAt: '2024-01-10',
          proposals_count: 5
        },
        {
          _id: '4',
          title: 'API Integration',
          description: 'Integrate third-party payment APIs into existing system. Need developer with API integration experience.',
          budget: 3000,
          duration: 21,
          status: 'open',
          skills_required: ['API Integration', 'JavaScript', 'Payment Gateway', 'REST APIs'],
          client_name: 'PayTech',
          createdAt: '2024-01-25',
          proposals_count: 15
        },
        {
          _id: '5',
          title: 'Content Management System',
          description: 'Develop a custom CMS for a news website. Looking for PHP developer with WordPress experience.',
          budget: 4000,
          duration: 28,
          status: 'open',
          skills_required: ['PHP', 'WordPress', 'Content Management', 'MySQL'],
          client_name: 'NewsPortal',
          createdAt: '2024-01-18',
          proposals_count: 9
        },
        {
          _id: '6',
          title: 'React Native Mobile App',
          description: 'Build a cross-platform mobile app using React Native. Need experienced mobile developer.',
          budget: 6000,
          duration: 45,
          status: 'open',
          skills_required: ['React Native', 'JavaScript', 'Mobile Development', 'Firebase'],
          client_name: 'MobileFirst',
          createdAt: '2024-01-22',
          proposals_count: 18
        }
      ]
      
      setProjects(sampleProjects)
      console.log('Available projects fetched:', sampleProjects.length)
    } catch (error) {
      console.error('Error fetching available projects:', error)
      setProjects([])
    }
  }

  const handleLogout = () => {
    clearAuth()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-gradient text-white">
      <Header 
        userType="freelancer" 
        onLogout={handleLogout} 
        userData={userData}
      />
      
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Personalized Welcome */}
          {userData && (
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                Welcome back, <span className="text-mint">{userData.first_name}!</span>
              </h1>
              <p className="text-lg text-white/80 mb-6">
                {profileData ? `Ready to find your next ${profileData.experience_level?.toLowerCase() || 'exciting'} project?` : 'Ready to find your next exciting project?'}
              </p>
            </div>
          )}
          
          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            Find Your Next <span className="text-mint">Project</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            Connect with clients worldwide and build your freelance career with Maayo
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/freelancer-dashboard">
              <Button variant="accent" size="lg" className="px-8 py-4 text-lg">
                Manage Profile
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-graphite"
              onClick={() => setShowProjectSearch(!showProjectSearch)}
            >
              {showProjectSearch ? 'Hide Projects' : 'Browse Projects'}
            </Button>
          </div>

          {/* Profile Quick Stats */}
          {profileData && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              <div className="card p-6 bg-white/95 text-center">
                <div className="text-2xl font-bold text-mint mb-1">${profileData.hourly_rate || '0'}</div>
                <div className="text-sm text-coolgray">Hourly Rate</div>
              </div>
              <div className="card p-6 bg-white/95 text-center">
                <div className="text-2xl font-bold text-coral mb-1">{profileData.skills?.length || 0}</div>
                <div className="text-sm text-coolgray">Skills</div>
              </div>
              <div className="card p-6 bg-white/95 text-center">
                <div className="text-2xl font-bold text-violet mb-1">{profileData.certification?.length || 0}</div>
                <div className="text-sm text-coolgray">Certifications</div>
              </div>
              <div className="card p-6 bg-white/95 text-center">
                <div className="text-2xl font-bold text-mint mb-1 capitalize">{profileData.availability || 'Not Set'}</div>
                <div className="text-sm text-coolgray">Availability</div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-mint mb-2">10K+</div>
              <div className="text-white/70">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-coral mb-2">$2M+</div>
              <div className="text-white/70">Earned by Freelancers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-violet mb-2">5K+</div>
              <div className="text-white/70">Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Search Section */}
      {showProjectSearch && (
        <section className="py-16 px-6 bg-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Available <span className="text-mint">Projects</span>
            </h2>
            
            {/* Project Search Input */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search projects by title, description, skills, or client..."
                value={projectSearchTerm}
                onChange={(e) => setProjectSearchTerm(e.target.value)}
                className="w-full max-w-2xl mx-auto block px-4 py-3 border border-white/20 rounded-lg text-graphite bg-white/95 focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint"
              />
            </div>

            {/* Projects List */}
            <div className="space-y-6">
              {projects
                .filter(project => 
                  project.title.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
                  project.description.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
                  project.client_name.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
                  project.skills_required.some(skill => 
                    skill.toLowerCase().includes(projectSearchTerm.toLowerCase())
                  )
                )
                .map((project) => (
                <div key={project._id} className="card p-6 bg-white/95 hover:bg-white transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-graphite mb-2">{project.title}</h3>
                      <p className="text-coolgray mb-3">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.skills_required.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-mint/10 text-mint rounded-full text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-coolgray">
                        <div className="flex space-x-6">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            ${project.budget.toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {project.duration} days
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {project.client_name}
                          </span>
                        </div>
                        <span>Posted: {new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="ml-6 text-right">
                      <div className="mb-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-coolgray mb-3">
                        {project.proposals_count} proposals
                      </div>
                      <Button 
                        variant="accent" 
                        size="sm" 
                        className="px-6 py-2"
                        onClick={() => {
                          // In a real app, this would navigate to project details or proposal form
                          alert(`Apply to "${project.title}" - This would open the proposal form in a real application.`)
                        }}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {projects.filter(project => 
                project.title.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
                project.client_name.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
                project.skills_required.some(skill => 
                  skill.toLowerCase().includes(projectSearchTerm.toLowerCase())
                )
              ).length === 0 && projectSearchTerm && (
                <div className="text-center py-12 text-white/70">
                  <svg className="w-16 h-16 mx-auto mb-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg">No projects found matching "{projectSearchTerm}"</p>
                  <p className="text-sm mt-2">Try different keywords or browse all projects</p>
                </div>
              )}
              
              {projects.length === 0 && (
                <div className="text-center py-12 text-white/70">
                  <svg className="w-16 h-16 mx-auto mb-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg">No projects available at the moment</p>
                  <p className="text-sm mt-2">Check back later for new opportunities</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions Section */}
      <section className="py-16 px-6 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Quick <span className="text-mint">Actions</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/freelancer-dashboard" className="card p-6 bg-white/95 hover:bg-white transition-colors group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-mint/20 rounded-lg flex items-center justify-center group-hover:bg-mint/30 transition-colors">
                  <svg className="w-6 h-6 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-graphite">Update Profile</h3>
                  <p className="text-sm text-coolgray">Manage your skills and rates</p>
                </div>
              </div>
            </Link>
            
            <div 
              className="card p-6 bg-white/95 hover:bg-white transition-colors group cursor-pointer"
              onClick={() => setShowProjectSearch(!showProjectSearch)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-coral/20 rounded-lg flex items-center justify-center group-hover:bg-coral/30 transition-colors">
                  <svg className="w-6 h-6 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-graphite">Find Projects</h3>
                  <p className="text-sm text-coolgray">Browse available opportunities</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6 bg-white/95 hover:bg-white transition-colors group cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-violet/20 rounded-lg flex items-center justify-center group-hover:bg-violet/30 transition-colors">
                  <svg className="w-6 h-6 text-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-graphite">View Analytics</h3>
                  <p className="text-sm text-coolgray">Track your performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why Choose <span className="text-mint">Maayo</span>?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8 bg-white/95 text-center">
              <div className="w-16 h-16 bg-mint/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-graphite mb-4">Smart Matching</h3>
              <p className="text-coolgray">
                Our AI-powered system matches you with projects that fit your skills and preferences perfectly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8 bg-white/95 text-center">
              <div className="w-16 h-16 bg-coral/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-graphite mb-4">Secure Payments</h3>
              <p className="text-coolgray">
                Get paid securely with milestone-based payments and escrow protection for every project.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8 bg-white/95 text-center">
              <div className="w-16 h-16 bg-violet/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-graphite mb-4">AI Tools</h3>
              <p className="text-coolgray">
                Access AI-powered proposal writing, project management, and productivity tools to boost your success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            How It <span className="text-mint">Works</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-mint rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Profile</h3>
              <p className="text-white/70 text-sm">Set up your profile with skills, portfolio, and rates</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-coral rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Find Projects</h3>
              <p className="text-white/70 text-sm">Browse and apply to projects that match your expertise</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-violet rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Hired</h3>
              <p className="text-white/70 text-sm">Submit proposals and get selected by clients</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-mint rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Paid</h3>
              <p className="text-white/70 text-sm">Complete work and receive secure milestone payments</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your <span className="text-mint">Freelance Journey</span>?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of successful freelancers on Maayo and take control of your career.
          </p>
          <Link to="/freelancer-dashboard">
            <Button variant="accent" size="lg" className="px-12 py-4 text-xl">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
