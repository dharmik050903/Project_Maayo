import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import Button from '../components/Button'
import { logout, getUserData } from '../utils/auth'

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  
  // Get user data from localStorage
  const userData = getUserData()
  
  // Mock data - in real app this would come from API
  const clientData = {
    name: userData?.personName || userData?.first_name || "Rajesh Kumar",
    company: "TechCorp India",
    country: userData?.country || "India",
    profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    industry: "Technology",
    summary: "Leading technology company specializing in digital transformation solutions for Indian businesses.",
    projects: [
      {
        id: 1,
        title: "E-commerce Platform Development",
        description: "Building a modern e-commerce platform with React and Node.js",
        budget: "₹5,00,000",
        status: "active",
        proposals: 12,
        hiredFreelancer: "Priya Sharma",
        progress: 75,
        deadline: "2024-02-15"
      },
      {
        id: 2,
        title: "Mobile App UI/UX Design",
        description: "Designing user interface for a fintech mobile application",
        budget: "₹2,50,000",
        status: "completed",
        proposals: 8,
        hiredFreelancer: "Amit Patel",
        progress: 100,
        deadline: "2024-01-20"
      },
      {
        id: 3,
        title: "Data Analytics Dashboard",
        description: "Creating business intelligence dashboard for sales analytics",
        budget: "₹3,20,000",
        status: "active",
        proposals: 15,
        hiredFreelancer: "Neha Singh",
        progress: 45,
        deadline: "2024-03-10"
      }
    ],
    activeFreelancers: 5,
    totalSpent: 850000,
    completedProjects: 12,
    averageRating: 4.8,
    paymentMethods: [
      { type: "UPI", id: "rajesh.kumar@okicici" },
      { type: "Bank Transfer", id: "HDFC Bank - 1234567890" },
      { type: "Credit Card", id: "**** **** **** 1234" }
    ]
  }

  return (
    <div className="min-h-screen bg-brand-gradient">
      {/* Header */}
      <header className="w-full fixed top-0 left-0 z-50 bg-white/95 backdrop-blur-sm shadow-soft border-b border-white/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
                     <Logo theme="dark" />
          <nav className="hidden md:flex gap-6 font-medium text-graphite">
            <Link to="/post-project" className="hover:text-violet">Post Project</Link>
            <Link to="/find-freelancers" className="hover:text-violet">Find Talent</Link>
            <Link to="/messages" className="hover:text-violet">Messages</Link>
            <Link to="/payments" className="hover:text-violet">Payments</Link>
          </nav>
                     <div className="flex items-center gap-4">
             <div className="relative">
               <div className="w-3 h-3 bg-coral rounded-full absolute -top-1 -right-1"></div>
               <svg className="w-6 h-6 text-graphite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
               </svg>
             </div>
             <img src={clientData.profilePic} alt="Profile" className="w-10 h-10 rounded-full" />
             <button 
               onClick={logout}
               className="text-graphite hover:text-violet text-sm font-medium"
             >
               Logout
             </button>
           </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 pt-28">
        {/* Welcome Section */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-graphite">Welcome back, {clientData.name}! 👋</h1>
              <p className="text-coolgray">Manage your projects and find the perfect talent for your business</p>
            </div>
            <Button variant="accent">Post New Project</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coolgray text-sm">Active Projects</p>
                <p className="text-2xl font-bold text-graphite">{clientData.projects.filter(p => p.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 bg-violet/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coolgray text-sm">Active Freelancers</p>
                <p className="text-2xl font-bold text-graphite">{clientData.activeFreelancers}</p>
              </div>
              <div className="w-12 h-12 bg-mint/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coolgray text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-graphite">₹{clientData.totalSpent.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-coral/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coolgray text-sm">Average Rating</p>
                <p className="text-2xl font-bold text-graphite">{clientData.averageRating}/5</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="card">
          <div className="border-b border-[#E9ECF2]">
            <nav className="flex space-x-8 px-6">
              {['overview', 'projects', 'freelancers', 'payments', 'ai-tools'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-violet text-violet'
                      : 'border-transparent text-coolgray hover:text-graphite'
                  }`}
                >
                  {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-3 gap-6">
                {/* Company Profile Section */}
                <div className="md:col-span-1">
                  <div className="card p-6">
                    <div className="text-center mb-6">
                      <img src={clientData.profilePic} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-graphite">{clientData.name}</h3>
                      <p className="text-coolgray">{clientData.company}</p>
                      <p className="text-coolgray">📍 {clientData.country}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-graphite mb-2">Industry</h4>
                        <p className="text-sm text-coolgray">{clientData.industry}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-graphite mb-2">About</h4>
                        <p className="text-sm text-coolgray">{clientData.summary}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-graphite mb-2">Payment Methods</h4>
                        <div className="space-y-2">
                          {clientData.paymentMethods.map((method, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <span className="text-coolgray">{method.type}:</span>
                              <span className="text-graphite font-medium">{method.id}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Tools & Smart Features */}
                <div className="md:col-span-2">
                  <div className="card p-6 mb-6">
                    <h3 className="text-lg font-semibold text-graphite mb-4">🤖 AI-Powered Hiring Tools</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-r from-violet/5 to-mint/5 rounded-lg border border-violet/20">
                        <h4 className="font-medium text-graphite mb-2">Smart Freelancer Matching</h4>
                        <p className="text-sm text-coolgray mb-3">AI finds the perfect freelancers for your projects</p>
                        <Button variant="primary" size="sm">Find Talent</Button>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-coral/5 to-violet/5 rounded-lg border border-coral/20">
                        <h4 className="font-medium text-graphite mb-2">Project Scope Analyzer</h4>
                        <p className="text-sm text-coolgray mb-3">AI analyzes and estimates project requirements</p>
                        <Button variant="accent" size="sm">Analyze Project</Button>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-graphite mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-mint/5 rounded-lg">
                        <div className="w-2 h-2 bg-mint rounded-full"></div>
                        <span className="text-sm text-graphite">New proposal received for "E-commerce Platform" from Priya Sharma</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-violet/5 rounded-lg">
                        <div className="w-2 h-2 bg-violet rounded-full"></div>
                        <span className="text-sm text-graphite">Payment milestone completed: ₹1,25,000 to Amit Patel</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-coral/5 rounded-lg">
                        <div className="w-2 h-2 bg-coral rounded-full"></div>
                        <span className="text-sm text-graphite">Project "Mobile App UI/UX Design" marked as completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-graphite">Project Management</h3>
                  <Button variant="accent">Create New Project</Button>
                </div>
                <div className="space-y-6">
                  {clientData.projects.map((project) => (
                    <div key={project.id} className="card p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-graphite">{project.title}</h4>
                          <p className="text-coolgray mt-1">{project.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            project.status === 'active' 
                              ? 'bg-violet/10 text-violet' 
                              : 'bg-mint/10 text-mint'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-coolgray text-sm">Budget</p>
                          <p className="font-semibold text-graphite">{project.budget}</p>
                        </div>
                        <div>
                          <p className="text-coolgray text-sm">Proposals</p>
                          <p className="font-semibold text-graphite">{project.proposals}</p>
                        </div>
                        <div>
                          <p className="text-coolgray text-sm">Hired Freelancer</p>
                          <p className="font-semibold text-graphite">{project.hiredFreelancer}</p>
                        </div>
                        <div>
                          <p className="text-coolgray text-sm">Deadline</p>
                          <p className="font-semibold text-graphite">{new Date(project.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-coolgray">Progress</span>
                          <span className="text-sm font-medium text-graphite">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-violet h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button variant="primary" size="sm">View Details</Button>
                        <Button variant="accent" size="sm">Manage Milestones</Button>
                        <Button variant="primary" size="sm">Message Freelancer</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'freelancers' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-graphite">Hired Freelancers</h3>
                  <Button variant="accent">Find New Talent</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face" alt="Priya Sharma" className="w-16 h-16 rounded-full" />
                      <div>
                        <h4 className="font-semibold text-graphite">Priya Sharma</h4>
                        <p className="text-coolgray text-sm">Full-Stack Developer</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-sm text-coolgray ml-1">(4.9)</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-coolgray text-sm">Current Project:</span>
                        <span className="text-graphite text-sm">E-commerce Platform</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-coolgray text-sm">Hourly Rate:</span>
                        <span className="text-graphite text-sm">₹1,200/hr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-coolgray text-sm">Total Earned:</span>
                        <span className="text-graphite text-sm">₹3,75,000</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm">Message</Button>
                      <Button variant="accent" size="sm">View Profile</Button>
                    </div>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" alt="Amit Patel" className="w-16 h-16 rounded-full" />
                      <div>
                        <h4 className="font-semibold text-graphite">Amit Patel</h4>
                        <p className="text-coolgray text-sm">UI/UX Designer</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-sm text-coolgray ml-1">(4.7)</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-coolgray text-sm">Current Project:</span>
                        <span className="text-graphite text-sm">Mobile App Design</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-coolgray text-sm">Hourly Rate:</span>
                        <span className="text-graphite text-sm">₹800/hr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-coolgray text-sm">Total Earned:</span>
                        <span className="text-graphite text-sm">₹2,00,000</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm">Message</Button>
                      <Button variant="accent" size="sm">View Profile</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-graphite">Payment Management</h3>
                  <Button variant="accent">Add Payment Method</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card p-6">
                    <h4 className="font-semibold text-graphite mb-4">Payment Methods</h4>
                    <div className="space-y-3">
                      {clientData.paymentMethods.map((method, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-violet/10 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-graphite">{method.type}</p>
                              <p className="text-sm text-coolgray">{method.id}</p>
                            </div>
                          </div>
                          <Button variant="primary" size="sm">Edit</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="card p-6">
                    <h4 className="font-semibold text-graphite mb-4">Recent Transactions</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-mint/5 rounded-lg">
                        <div>
                          <p className="font-medium text-graphite">Payment to Priya Sharma</p>
                          <p className="text-sm text-coolgray">E-commerce Platform - Milestone 2</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-graphite">₹1,25,000</p>
                          <p className="text-sm text-coolgray">2 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-violet/5 rounded-lg">
                        <div>
                          <p className="font-medium text-graphite">Payment to Amit Patel</p>
                          <p className="text-sm text-coolgray">Mobile App Design - Final Payment</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-graphite">₹2,50,000</p>
                          <p className="text-sm text-coolgray">1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai-tools' && (
              <div>
                <h3 className="text-lg font-semibold text-graphite mb-6">AI-Powered Client Features</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card p-6">
                    <h4 className="font-semibold text-graphite mb-4">🎯 Smart Freelancer Matching</h4>
                    <p className="text-coolgray mb-4">Our AI analyzes your project requirements and matches you with the most suitable freelancers based on skills, experience, and availability.</p>
                    <Button variant="primary">Find Perfect Match</Button>
                  </div>
                  
                  <div className="card p-6">
                    <h4 className="font-semibold text-graphite mb-4">📊 Project Scope Analyzer</h4>
                    <p className="text-coolgray mb-4">AI-powered tool that analyzes your project description and provides accurate time estimates and budget recommendations.</p>
                    <Button variant="accent">Analyze Project</Button>
                  </div>
                  
                  <div className="card p-6">
                    <h4 className="font-semibold text-graphite mb-4">💰 Milestone Payment Tracking</h4>
                    <p className="text-coolgray mb-4">Automated milestone tracking with UPI integration for seamless payments and progress monitoring.</p>
                    <Button variant="primary">View Milestones</Button>
                  </div>
                  
                  <div className="card p-6">
                    <h4 className="font-semibold text-graphite mb-4">🤝 Dispute Resolution</h4>
                    <p className="text-coolgray mb-4">AI-mediated dispute resolution system with support for Hindi and regional languages for better communication.</p>
                    <Button variant="accent">Learn More</Button>
                  </div>

                  <div className="card p-6">
                    <h4 className="font-semibold text-graphite mb-4">🏢 Team/Agency Management</h4>
                    <p className="text-coolgray mb-4">Manage multiple freelancers as a team, assign roles, and track collective progress on complex projects.</p>
                    <Button variant="primary">Manage Team</Button>
                  </div>

                  <div className="card p-6">
                    <h4 className="font-semibold text-graphite mb-4">⭐ Review & Rating System</h4>
                    <p className="text-coolgray mb-4">Comprehensive review system with detailed feedback options and performance analytics.</p>
                    <Button variant="accent">View Reviews</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
