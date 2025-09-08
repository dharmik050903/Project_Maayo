import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Button from '../components/Button'
import { authenticatedFetch, isAuthenticated, getCurrentUser, clearAuth } from '../utils/api'

export default function ProjectCreate() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [skillsList, setSkillsList] = useState([])
  const [selectedSkills, setSelectedSkills] = useState([])
  const [skillsSearchTerm, setSkillsSearchTerm] = useState('')
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    duration: '',
    durationUnit: 'days',
    skills_required: []
  })

  const [calendarDates, setCalendarDates] = useState({
    startDate: '',
    endDate: ''
  })

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
      fetchSkills()
    }
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSkillsList(data.data || [])
      } else {
        // Fallback skills list if API fails
        setSkillsList(getFallbackSkills())
      }
    } catch (error) {
      console.error('Error fetching skills:', error)
      setSkillsList(getFallbackSkills())
    }
  }

  const getFallbackSkills = () => {
    return [
      { _id: '1', skill: 'JavaScript', category: 'Programming' },
      { _id: '2', skill: 'React', category: 'Frontend' },
      { _id: '3', skill: 'Node.js', category: 'Backend' },
      { _id: '4', skill: 'Python', category: 'Programming' },
      { _id: '5', skill: 'HTML/CSS', category: 'Frontend' },
      { _id: '6', skill: 'MongoDB', category: 'Database' },
      { _id: '7', skill: 'Express.js', category: 'Backend' },
      { _id: '8', skill: 'Vue.js', category: 'Frontend' },
      { _id: '9', skill: 'Angular', category: 'Frontend' },
      { _id: '10', skill: 'PHP', category: 'Programming' },
      { _id: '11', skill: 'Laravel', category: 'Backend' },
      { _id: '12', skill: 'MySQL', category: 'Database' },
      { _id: '13', skill: 'PostgreSQL', category: 'Database' },
      { _id: '14', skill: 'AWS', category: 'Cloud' },
      { _id: '15', skill: 'Docker', category: 'DevOps' },
      { _id: '16', skill: 'Git', category: 'Version Control' },
      { _id: '17', skill: 'UI/UX Design', category: 'Design' },
      { _id: '18', skill: 'Figma', category: 'Design' },
      { _id: '19', skill: 'Photoshop', category: 'Design' },
      { _id: '20', skill: 'Illustrator', category: 'Design' }
    ]
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill._id) 
        ? prev.filter(id => id !== skill._id)
        : [...prev, skill._id]
    )
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getMaxEndDate = () => {
    if (calendarDates.startDate) {
      return calendarDates.startDate
    }
    return getMinDate()
  }

  const handleCalendarChange = (field, value) => {
    setCalendarDates(prev => ({
      ...prev,
      [field]: value
    }))

    // Calculate duration when both dates are selected
    if (field === 'endDate' && calendarDates.startDate && value) {
      const start = new Date(calendarDates.startDate)
      const end = new Date(value)
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays > 0) {
        setForm(prev => ({
          ...prev,
          duration: diffDays.toString()
        }))
      }
    } else if (field === 'startDate' && calendarDates.endDate && value) {
      const start = new Date(value)
      const end = new Date(calendarDates.endDate)
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays > 0) {
        setForm(prev => ({
          ...prev,
          duration: diffDays.toString()
        }))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setLoading(true)

    try {
      // Convert duration to days based on selected unit
      let durationInDays = parseInt(form.duration) || 0
      if (form.durationUnit === 'weeks') {
        durationInDays = durationInDays * 7
      } else if (form.durationUnit === 'months') {
        durationInDays = durationInDays * 30
      }

      const projectData = {
        title: form.title,
        description: form.description,
        budget: parseFloat(form.budget),
        duration: durationInDays,
        skills_required: selectedSkills.map(skillId => {
          const skill = skillsList.find(s => s._id === skillId)
          return {
            skill: skill.skill,
            skill_id: skillId
          }
        })
      }

      const response = await authenticatedFetch('http://localhost:5000/api/project/create', {
        method: 'POST',
        body: JSON.stringify(projectData)
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Project created successfully! 🎉' })
        // Reset form
        setForm({
          title: '',
          description: '',
          budget: '',
          duration: '',
          durationUnit: 'days',
          skills_required: []
        })
        setSelectedSkills([])
        setCalendarDates({
          startDate: '',
          endDate: ''
        })
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.message || 'Failed to create project' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearAuth()
    window.location.href = '/'
  }

  if (loading && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-gradient">
        <div className="text-white text-xl">Loading...</div>
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
      <main className="flex-1 max-w-4xl mx-auto px-6 pt-28 pb-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Create New <span className="text-mint">Project</span>
          </h1>
          <p className="text-lg text-white/80 mt-4">
            Post your project and find the perfect freelancer
          </p>
        </div>

        <div className="card p-8 bg-white/95">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-graphite mb-2">Project Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Build a React E-commerce Website"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet text-graphite"
                required
              />
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-graphite mb-2">Project Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your project in detail..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet text-graphite resize-none"
                required
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-graphite mb-2">Budget ($)</label>
              <input
                type="number"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                placeholder="Enter your budget"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet text-graphite"
                required
              />
            </div>

            {/* Project Timeline - Calendar Duration Selector */}
            <div>
              <label className="block text-sm font-medium text-graphite mb-2">Project Timeline</label>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-graphite mb-2">Start Date</label>
                    <input
                      type="date"
                      value={calendarDates.startDate}
                      onChange={(e) => handleCalendarChange('startDate', e.target.value)}
                      min={getMinDate()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet text-graphite"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-graphite mb-2">End Date</label>
                    <input
                      type="date"
                      value={calendarDates.endDate}
                      onChange={(e) => handleCalendarChange('endDate', e.target.value)}
                      min={calendarDates.startDate || getMinDate()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet text-graphite"
                    />
                  </div>
                </div>

                {/* Duration Display and Manual Override */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-graphite">Calculated Duration:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        name="duration"
                        value={form.duration}
                        onChange={handleChange}
                        placeholder="0"
                        min="1"
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet text-graphite text-center"
                      />
                      <span className="text-sm text-coolgray">days</span>
                    </div>
                  </div>
                  
                  {calendarDates.startDate && calendarDates.endDate && (
                    <div className="text-sm text-coolgray">
                      <p>📅 From {new Date(calendarDates.startDate).toLocaleDateString()} to {new Date(calendarDates.endDate).toLocaleDateString()}</p>
                      <p className="mt-1">
                        {form.duration > 0 ? (
                          <span className="text-mint font-medium">
                            Total: {form.duration} {form.duration === '1' ? 'day' : 'days'}
                          </span>
                        ) : (
                          <span className="text-coral">Please select valid dates</span>
                        )}
                      </p>
                    </div>
                  )}
                  
                  <p className="text-xs text-coolgray mt-2">
                    💡 Select start and end dates above, or manually enter duration
                  </p>
                </div>
              </div>
            </div>


            {/* Required Skills */}
            <div>
              <label className="block text-sm font-medium text-graphite mb-2">Required Skills</label>
              {skillsList.length === 0 ? (
                <div className="p-4 text-center text-coolgray border border-gray-300 rounded-lg">
                  <p>Loading skills...</p>
                  <button 
                    onClick={() => setSkillsList(getFallbackSkills())}
                    className="mt-2 px-3 py-1 bg-violet text-white rounded text-sm hover:bg-violet/80"
                  >
                    Load Sample Skills
                  </button>
                </div>
              ) : (
                <>
                  {/* Skills Search Input */}
                  <input
                    type="text"
                    placeholder="Search skills..."
                    value={skillsSearchTerm}
                    onChange={(e) => setSkillsSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-graphite bg-white focus:outline-none focus:ring-2 focus:ring-violet/50 focus:border-violet mb-3"
                  />
                  
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {skillsList
                      .filter(skill => 
                        skill.skill.toLowerCase().includes(skillsSearchTerm.toLowerCase()) ||
                        skill.category.toLowerCase().includes(skillsSearchTerm.toLowerCase())
                      )
                      .map((skill) => (
                        <label key={skill._id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedSkills.includes(skill._id)}
                            onChange={() => handleSkillToggle(skill)}
                            className="rounded border-gray-300 text-violet focus:ring-violet"
                          />
                          <span className="text-sm text-graphite">{skill.skill}</span>
                          <span className="text-xs text-coolgray">({skill.category})</span>
                        </label>
                      ))}
                    
                    {/* No skills found message */}
                    {skillsList.filter(skill => 
                      skill.skill.toLowerCase().includes(skillsSearchTerm.toLowerCase()) ||
                      skill.category.toLowerCase().includes(skillsSearchTerm.toLowerCase())
                    ).length === 0 && skillsSearchTerm && (
                      <div className="p-4 text-center text-coolgray">
                        <p>No skills found matching "{skillsSearchTerm}"</p>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {selectedSkills.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-coolgray mb-2">Selected Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map(skillId => {
                      const skill = skillsList.find(s => s._id === skillId)
                      return skill ? (
                        <span key={skillId} className="px-3 py-1 bg-mint/20 text-mint rounded-full text-sm font-medium">
                          {skill.skill}
                        </span>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-mint/20 text-mint border border-mint/30' 
                  : 'bg-coral/20 text-coral border border-coral/30'
              }`}>
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Link to="/client-dashboard" className="flex-1">
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit" 
                variant="accent" 
                loading={loading}
                className="flex-1 text-graphite"
              >
                {loading ? 'Creating Project...' : 'Post Project'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
