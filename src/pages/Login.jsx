import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Input from '../components/Input'
import Button from '../components/Button'
import { saveAuthData, getDashboardRoute } from '../utils/auth'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validate() {
    const next = {}
    if (!form.email) next.email = 'Email is required'
    if (!form.password) next.password = 'Password is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage(null)
    if (!validate()) return
    setLoading(true)

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      setLoading(false)

      if (data.token && data.user) {
        // ✅ Save token and user data to localStorage
        saveAuthData(data.token, data.user)
        
        setMessage({ type: "success", text: "Login successful! Redirecting..." })
        
        // Redirect based on user type
        setTimeout(() => {
          const dashboardRoute = getDashboardRoute()
          navigate(dashboardRoute)
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
    <AuthLayout title="Welcome back" subtitle="Login to continue">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-coral text-sm">{errors.email}</p>}

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <p className="text-coral text-sm">{errors.password}</p>}

        {message && (
          <p className={`text-sm ${message.type === 'success' ? 'text-mint' : 'text-coral'}`}>
            {message.text}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <Link to="/signup" className="link-accent text-sm">
            Create account
          </Link>
          <Button type="submit" variant="accent" loading={loading}>
            Login
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
