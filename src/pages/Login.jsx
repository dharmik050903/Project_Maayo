import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import Input from '../components/Input'
import Button from '../components/Button'
import { authenticatedFetch } from '../utils/api'

// Function to check if freelancer profile exists in database
const checkFreelancerProfileExists = async (userId) => {
  try {
    console.log('🔍 Checking freelancer profile for userId:', userId)
    
    // Store user _id in localStorage
    localStorage.setItem('current_user_id', userId)
    console.log('📝 Stored user _id:', userId)
    
    // Check localStorage for existing profile
    const profileCompleted = localStorage.getItem('freelancer_profile_completed')
    const profileData = localStorage.getItem('freelancer_profile_data')
    const profileId = localStorage.getItem('freelancer_profile_id')
    
    console.log('📝 localStorage check:', {
      profileCompleted,
      profileData: profileData ? 'exists' : 'null',
      profileId,
      allKeys: Object.keys(localStorage).filter(key => key.includes('freelancer'))
    })
    
    // Also log all localStorage items
    console.log('🔍 All localStorage items:', {
      freelancer_profile_completed: localStorage.getItem('freelancer_profile_completed'),
      freelancer_profile_data: localStorage.getItem('freelancer_profile_data'),
      freelancer_profile_id: localStorage.getItem('freelancer_profile_id'),
      freelancer_personId: localStorage.getItem('freelancer_personId'),
      current_user_id: localStorage.getItem('current_user_id'),
      token: localStorage.getItem('token'),
      _id: localStorage.getItem('_id'),
      userRole: localStorage.getItem('userRole'),
      userEmail: localStorage.getItem('userEmail')
    })
    
    // If profile is completed and we have data, profile exists
    if (profileCompleted === 'true' && profileData) {
      console.log('✅ Profile exists in localStorage - returning true')
      return true
    }
    
    // If we have profile ID, try to verify it exists in database
    if (profileId) {
      console.log('📝 Found profile ID, verifying in database...')
      try {
        console.log('🔍 Making API call to verify profile:', {
          url: 'http://localhost:5000/api/freelancer/info/update',
          profileId,
          headers: {
            'token': localStorage.getItem('token'),
            '_id': localStorage.getItem('_id'),
            'user_role': localStorage.getItem('userRole'),
            'user_email': localStorage.getItem('userEmail')
          }
        })
        
        const response = await fetch('http://localhost:5000/api/freelancer/info/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token'),
            '_id': localStorage.getItem('_id'),
            'user_role': localStorage.getItem('userRole'),
            'user_email': localStorage.getItem('userEmail')
          },
          body: JSON.stringify({ 
            _id: profileId,
            title: "verification_check"
          })
        })
        
        console.log('🔍 API response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Profile exists in database - storing completion flag')
          localStorage.setItem('freelancer_profile_completed', 'true')
          localStorage.setItem('freelancer_profile_data', JSON.stringify(data.data))
          return true
        } else {
          const errorData = await response.json()
          console.log('❌ Profile not found in database:', {
            status: response.status,
            error: errorData
          })
          // Don't clear localStorage on API error - just return false
          console.log('⚠️ Not clearing localStorage due to API error')
          return false
        }
      } catch (verifyError) {
        console.log('❌ Error verifying profile:', verifyError)
        // Don't clear localStorage on network error - just return false
        console.log('⚠️ Not clearing localStorage due to network error')
        return false
      }
    }
    
    console.log('❌ No profile found - returning false')
    return false
  } catch (error) {
    console.error('❌ Error checking freelancer profile:', error)
    return false
  }
}

// Function to check if client profile exists in database
const checkClientProfileExists = async (userId) => {
  try {
    console.log('🔍 Checking client profile for userId:', userId)
    
    // Try to update with personId - the backend will either:
    // 1. Find the profile and update it (if it exists)
    // 2. Return an error (if it doesn't exist or can't find it)
    const response = await authenticatedFetch('http://localhost:5000/api/client/info/update', {
      method: 'POST',
      body: JSON.stringify({ personId: userId })
    })
    
    console.log('📡 Client response status:', response.status)
    console.log('📡 Client response ok:', response.ok)
    
    if (response.ok) {
      const data = await response.json()
      console.log('📊 Client update successful - profile exists:', data)
      return true
    } else {
      const errorData = await response.json()
      console.log('📊 Client error response:', errorData)
      
      // If it's a 404, profile doesn't exist
      if (response.status === 404) {
        console.log('❌ Client profile not found (404)')
        return false
      } else {
        console.log('❌ Client other error, assuming profile does not exist')
        return false
      }
    }
  } catch (error) {
    console.error('❌ Error checking client profile:', error)
    return false
  }
}

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: false })
    }
  }

  function validate() {
    const next = {}
    const fieldErrorStates = {}
    
    // Email validation
    if (!form.email) {
      next.email = 'Email is required'
      fieldErrorStates.email = true
    } else if (!form.email.includes('@') || !form.email.includes('.com')) {
      next.email = 'Email must contain @ and .com'
      fieldErrorStates.email = true
    }
    
    // Password validation
    if (!form.password) {
      next.password = 'Password is required'
      fieldErrorStates.password = true
    }
    
    setErrors(next)
    setFieldErrors(fieldErrorStates)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage(null)
    if (!validate()) return
    setLoading(true)

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      setLoading(false)

      if (data.token) {
        // ✅ Save token and user data to localStorage
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("userData", JSON.stringify(data.user))
        
        // ✅ Store authentication data for API headers
        localStorage.setItem("authHeaders", JSON.stringify({
          token: data.token,
          _id: data.user._id,
          userRole: data.user.user_type,
          userEmail: data.user.email
        }))
        
        setMessage({ type: "success", text: "Login successful 🎉" })

        // Debug localStorage directly
        console.log('=== DEBUG LOCALSTORAGE ===')
        console.log('freelancer_profile_id:', localStorage.getItem('freelancer_profile_id'))
        console.log('freelancer_personId:', localStorage.getItem('freelancer_personId'))
        console.log('freelancer_profile_completed:', localStorage.getItem('freelancer_profile_completed'))
        console.log('freelancer_profile_data:', localStorage.getItem('freelancer_profile_data'))
        console.log('userType:', data.user.user_type)
        console.log('current user _id:', data.user._id)
        console.log('========================')



        // Check if user has completed profile setup by checking database
        setTimeout(async () => {
          try {
            console.log('🚀 Login Debug: Starting profile existence check')
            console.log('👤 User data:', data.user)
            console.log('🆔 User _id:', data.user._id)
            console.log('👥 User type:', data.user.user_type)
            
            if (data.user.user_type === 'freelancer') {
              console.log('🔍 Checking freelancer profile for user:', data.user._id)
              console.log('🔍 User data:', data.user)
              
              // Check localStorage before calling the function
              console.log('📝 Pre-check localStorage:')
              console.log('  - freelancer_profile_id:', localStorage.getItem('freelancer_profile_id'))
              console.log('  - freelancer_profile_completed:', localStorage.getItem('freelancer_profile_completed'))
              console.log('  - freelancer_profile_data:', localStorage.getItem('freelancer_profile_data'))
              
              const profileExists = await checkFreelancerProfileExists(data.user._id)
              console.log('📋 Freelancer profile exists result:', profileExists)
              
              if (profileExists) {
                console.log('✅ Freelancer profile exists, redirecting to home page')
                window.location.href = "/freelancer-home"
              } else {
                console.log('❌ No freelancer profile, redirecting to dashboard')
                window.location.href = "/freelancer-dashboard"
              }
            } else if (data.user.user_type === 'client') {
              console.log('🔍 Checking client profile for user:', data.user._id)
              const profileExists = await checkClientProfileExists(data.user._id)
              console.log('📋 Client profile exists result:', profileExists)
              
              if (profileExists) {
                console.log('✅ Client profile exists in database, redirecting to home page')
                window.location.href = "/client-home"
              } else {
                console.log('❌ No client profile in database, redirecting to dashboard')
                window.location.href = "/client-dashboard"
              }
            }
          } catch (error) {
            console.error('❌ Error checking profile existence:', error)
            console.log('🔄 Using fallback logic...')
            
            // Simple fallback: check localStorage directly
            if (data.user.user_type === 'freelancer') {
              const profileCompleted = localStorage.getItem('freelancer_profile_completed')
              const profileData = localStorage.getItem('freelancer_profile_data')
              console.log('📝 Fallback check - profileCompleted:', profileCompleted, 'profileData exists:', !!profileData)
              
              if (profileCompleted === 'true' && profileData) {
                console.log('✅ Fallback: Profile exists, redirecting to home')
                window.location.href = "/freelancer-home"
              } else {
                console.log('❌ Fallback: No profile, redirecting to dashboard')
                window.location.href = "/freelancer-dashboard"
              }
            } else if (data.user.user_type === 'client') {
              const profileCompleted = localStorage.getItem('client_profile_completed')
              const profileData = localStorage.getItem('client_profile_data')
              console.log('📝 Fallback check - profileCompleted:', profileCompleted, 'profileData exists:', !!profileData)
              
              if (profileCompleted === 'true' && profileData) {
                console.log('✅ Fallback: Profile exists, redirecting to home')
                window.location.href = "/client-home"
              } else {
                console.log('❌ Fallback: No profile, redirecting to dashboard')
                window.location.href = "/client-dashboard"
              }
            }
          }
        }, 1500)
      } else {
        setMessage({ type: "error", text: data.message || "Invalid credentials" })
      }
    } catch (err) {
      setLoading(false)
      setMessage({ type: "error", text: "Something went wrong. Try again." })
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left Side - Brand Section */}
      <div className="hidden md:flex bg-brand-gradient text-white p-10 items-center justify-center">
        <div className="space-y-8 max-w-md text-center">
          <Logo theme="light" />
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Welcome back</h2>
            <p className="text-xl text-white/90">Login to continue your journey with Maayo</p>
            <p className="text-white/80">Connect with talented professionals and grow your business</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-base">
        <div className="w-full max-w-md">
          <div className="mb-8 md:hidden text-center">
            <Logo theme="dark" />
          </div>
          
          <div className="card p-8">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold text-graphite">Welcome back</h1>
              <p className="text-coolgray mt-1">Login to continue to your dashboard</p>
            </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
               <div>
                 <label className="block text-sm font-medium text-graphite mb-1">Email</label>
                 <input
                   type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
                   className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet ${
                     fieldErrors.email ? "border-red-500" : "border-gray-300"
                   }`}
                 />
                 {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
               </div>

               <div>
                 <label className="block text-sm font-medium text-graphite mb-1">Password</label>
                 <input
                   type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
                   className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet ${
                     fieldErrors.password ? "border-red-500" : "border-gray-300"
                   }`}
        />
                 {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
               </div>

        {message && (
                <div className={`p-3 rounded-lg text-sm ${
                  message.type === 'success' 
                    ? 'bg-mint/20 text-mint border border-mint/30' 
                    : 'bg-coral/20 text-coral border border-coral/30'
                }`}>
            {message.text}
                </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Link to="/signup" className="link-accent text-sm">
            Create account
          </Link>
          <Button type="submit" variant="accent" loading={loading}>
                  {loading ? 'Signing in...' : 'Login'}
          </Button>
        </div>
      </form>
          </div>
        </div>
      </div>
    </div>
  )
}
