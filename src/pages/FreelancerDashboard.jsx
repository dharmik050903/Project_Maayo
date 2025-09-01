import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import Button from '../components/Button'
import { logout, getUserData } from '../utils/auth'

export default function FreelancerDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  
  // Get user data from localStorage
  const userData = getUserData()
  
  // Mock data - in real app this would come from API
  const freelancerData = {
    name: userData?.personName || userData?.first_name || "Priya Sharma",
    country: userData?.country || "India",
    profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    education: "B.Tech Computer Science, IIT Delhi",
    totalHours: 1247,
    summary: "Experienced full-stack developer with 5+ years specializing in React, Node.js, and Python. Passionate about creating scalable web applications and mentoring junior developers.",
    skills: ["React", "Node.js", "Python", "MongoDB", "AWS", "Docker", "TypeScript", "GraphQL"],
    certifications: [
      { name: "AWS Certified Developer", issuer: "Amazon", year: "2023" },
      { name: "MongoDB Certified Developer", issuer: "MongoDB Inc", year: "2022" },
      { name: "Google Cloud Professional", issuer: "Google", year: "2021" }
    ],
    workHistory: [
      {
        project: "E-commerce Platform Development",
        client: "TechCorp India",
        duration: "3 months",
        amount: "₹2,50,000",
        status: "completed",
        rating: 5
      },
      {
        project: "Mobile App Backend API",
        client: "StartupXYZ",
        duration: "2 months",
        amount: "₹1,80,000",
        status: "completed",
        rating: 4
      },
      {
        project: "Data Analytics Dashboard",
        client: "Finance Solutions Ltd",
        duration: "4 months",
        amount: "₹3,20,000",
        status: "in-progress",
        rating: null
      }
    ],
    earnings: {
      thisMonth: 85000,
      lastMonth: 72000,
      total: 1250000
    },
    activeProposals: 8,
    completedProjects: 24
  }

  return (
    <div className="min-h-screen bg-brand-gradient">
      {/* Header */}
      <header className="w-full fixed top-0 left-0 z-50 bg-white/95 backdrop-blur-sm shadow-soft border-b border-white/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
                     <Logo theme="dark" />
          <nav className="hidden md:flex gap-6 font-medium text-graphite">
            <Link to="/browse" className="hover:text-violet">Find Work</Link>
            <Link to="/messages" className="hover:text-violet">Messages</Link>
            <Link to="/earnings" className="hover:text-violet">Earnings</Link>
          </nav>
                     <div className="flex items-center gap-4">
             <div className="relative">
               <div className="w-3 h-3 bg-coral rounded-full absolute -top-1 -right-1"></div>
               <svg className="w-6 h-6 text-graphite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
               </svg>
             </div>
             <img src={freelancerData.profilePic} alt="Profile" className="w-10 h-10 rounded-full" />
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
              <h1 className="text-2xl font-bold text-graphite">Welcome back, {freelancerData.name}! 👋</h1>
              <p className="text-coolgray">Here's what's happening with your freelance career</p>
            </div>
            <Button variant="accent">View Profile</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coolgray text-sm">This Month's Earnings</p>
                <p className="text-2xl font-bold text-graphite">₹{freelancerData.earnings.thisMonth.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-mint/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coolgray text-sm">Total Working Hours</p>
                <p className="text-2xl font-bold text-graphite">{freelancerData.totalHours}</p>
              </div>
              <div className="w-12 h-12 bg-violet/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coolgray text-sm">Active Proposals</p>
                <p className="text-2xl font-bold text-graphite">{freelancerData.activeProposals}</p>
              </div>
              <div className="w-12 h-12 bg-coral/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coolgray text-sm">Completed Projects</p>
                <p className="text-2xl font-bold text-graphite">{freelancerData.completedProjects}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="card">
          <div className="border-b border-[#E9ECF2]">
            <nav className="flex space-x-8 px-6">
              {['overview', 'work-history', 'skills', 'certifications', 'ai-tools'].map((tab) => (
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
                {/* Profile Section */}
                <div className="md:col-span-1">
                  <div className="card p-6">
                    <div className="text-center mb-6">
                      <img src={freelancerData.profilePic} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-graphite">{freelancerData.name}</h3>
                      <p className="text-coolgray">📍 {freelancerData.country}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-graphite mb-2">Education</h4>
                        <p className="text-sm text-coolgray">{freelancerData.education}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-graphite mb-2">Summary</h4>
                        <p className="text-sm text-coolgray">{freelancerData.summary}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Tools & Smart Features */}
                <div className="md:col-span-2">
                  <div className="card p-6 mb-6">
                    <h3 className="text-lg font-semibold text-graphite mb-4">🤖 AI-Powered Tools</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-r from-violet/5 to-mint/5 rounded-lg border border-violet/20">
                        <h4 className="font-medium text-graphite mb-2">Smart Proposal Writer</h4>
                        <p className="text-sm text-coolgray mb-3">AI-powered proposal writing assistant</p>
                        <Button variant="primary" size="sm">Try Now</Button>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-coral/5 to-violet/5 rounded-lg border border-coral/20">
                        <h4 className="font-medium text-graphite mb-2">Job Matching</h4>
                        <p className="text-sm text-coolgray mb-3">Get matched with perfect projects</p>
                        <Button variant="accent" size="sm">Find Matches</Button>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-graphite mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-mint/5 rounded-lg">
                        <div className="w-2 h-2 bg-mint rounded-full"></div>
                        <span className="text-sm text-graphite">New proposal submitted for "E-commerce Platform"</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-violet/5 rounded-lg">
                        <div className="w-2 h-2 bg-violet rounded-full"></div>
                        <span className="text-sm text-graphite">Payment received: ₹45,000 from TechCorp India</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-coral/5 rounded-lg">
                        <div className="w-2 h-2 bg-coral rounded-full"></div>
                        <span className="text-sm text-graphite">New review received: 5 stars from StartupXYZ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'work-history' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-graphite">Work History</h3>
                  <Button variant="accent">Export History</Button>
                </div>
                <div className="space-y-4">
                  {freelancerData.workHistory.map((project, index) => (
                    <div key={index} className="card p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-graphite">{project.project}</h4>
                          <p className="text-coolgray text-sm">Client: {project.client}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-coolgray">Duration: {project.duration}</span>
                            <span className="text-sm text-coolgray">Amount: {project.amount}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              project.status === 'completed' 
                                ? 'bg-mint/10 text-mint' 
                                : 'bg-violet/10 text-violet'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                        </div>
                        {project.rating && (
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < project.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-graphite">Skills & Expertise</h3>
                  <Button variant="accent">Add Skill</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card p-6">
                    <h4 className="font-medium text-graphite mb-4">Technical Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {freelancerData.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-violet/10 text-violet rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="card p-6">
                    <h4 className="font-medium text-graphite mb-4">Soft Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Communication', 'Project Management', 'Problem Solving', 'Team Leadership', 'Time Management'].map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-mint/10 text-mint rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'certifications' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-graphite">Certifications</h3>
                  <Button variant="accent">Add Certification</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {freelancerData.certifications.map((cert, index) => (
                    <div key={index} className="card p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-graphite">{cert.name}</h4>
                          <p className="text-coolgray text-sm">Issued by {cert.issuer}</p>
                          <p className="text-coolgray text-sm">Year: {cert.year}</p>
                        </div>
                        <div className="w-12 h-12 bg-mint/10 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ai-tools' && (
              <div>
                <h3 className="text-lg font-semibold text-graphite mb-6">AI-Powered Marketplace Features</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card p-6">
                    <h4 className="font-semibold text-graphite mb-4">🎯 Smart Job Matching</h4>
                    <p className="text-coolgray mb-4">Our AI analyzes your skills, experience, and preferences to find the perfect projects for you.</p>
                    <Button variant="primary">Find Matches</Button>
                  </div>
                  
                  <div className="card p-6">
                    <h4 className="font-semibold text-graphite mb-4">✍️ Proposal Assistant</h4>
                    <p className="text-coolgray mb-4">AI-powered tool that helps you write compelling proposals tailored to each project.</p>
                    <Button variant="accent">Write Proposal</Button>
                  </div>
                  
                  <div className="card p-6">
                    <h4 className="font-semibold text-graphite mb-4">💰 Milestone Tracking</h4>
                    <p className="text-coolgray mb-4">Track project milestones and payments with automated reminders and progress updates.</p>
                    <Button variant="primary">View Milestones</Button>
                  </div>
                  
                  <div className="card p-6">
                    <h4 className="font-semibold text-graphite mb-4">🤝 Dispute Resolution</h4>
                    <p className="text-coolgray mb-4">AI-mediated dispute resolution system to handle conflicts professionally and fairly.</p>
                    <Button variant="accent">Learn More</Button>
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
