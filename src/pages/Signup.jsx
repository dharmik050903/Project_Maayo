import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Input from '../components/Input'
import Button from '../components/Button'
import { countries } from '../data/countries'
import { dialCodes } from '../data/dialCodes'
import CountrySelect from '../components/CountrySelect'
import { saveAuthData, getDashboardRoute } from '../utils/auth'

export default function Signup() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    contact_number: '',
    country: '',
    user_type: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value } = e.target
    // if country changed, try to set contact_number prefix based on dial code
    if (name === 'country') {
      const selected = countries.find(c => c.name === value)
      if (selected && dialCodes[selected.code]) {
        const current = form.contact_number || ''
        const nextPrefix = dialCodes[selected.code]
        const stripped = current.replace(/^\+[^\s]*/,'').trim()
        const next = stripped ? `${nextPrefix} ${stripped}` : nextPrefix
        setForm({ ...form, country: value, contact_number: next })
        return
      }
    }
    setForm({ ...form, [name]: value })
  }

  function handleCountryChange(countryName) {
    const selected = countries.find(c => c.name === countryName)
    if (selected && dialCodes[selected.code]) {
      const current = form.contact_number || ''
      const nextPrefix = dialCodes[selected.code]
      const stripped = current.replace(/^\+[^\s]*/,'').trim()
      const next = stripped ? `${nextPrefix} ${stripped}` : nextPrefix
      setForm(prev => ({ ...prev, country: countryName, contact_number: next }))
    } else {
      setForm(prev => ({ ...prev, country: countryName }))
    }
  }

  function validate() {
    const next = {}
    if (!form.first_name) next.first_name = 'First name is required'
    if (!form.last_name) next.last_name = 'Last name is required'
    if (!form.email) next.email = 'Email is required'
    if (!form.password) next.password = 'Password is required'
    if (!form.contact_number) next.contact_number = 'Phone is required'
    if (!form.user_type) next.user_type = 'Select a user type'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage(null)
    if (!validate()) return
    setLoading(true)

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      setLoading(false)

      if (data.user) {
        setMessage({ type: 'success', text: 'Account created successfully! Please login to continue.' })
        
        // Redirect to login after successful signup
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setMessage({ type: "error", text: data.message || "Failed to create account" })
      }
    } catch (err) {
      setLoading(false)
      setMessage({ type: "error", text: "Something went wrong. Try again." })
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join Maayo and get started">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="First name"
              name="first_name"
              placeholder="John"
              value={form.first_name}
              onChange={handleChange}
            />
            {errors.first_name && <p className="text-coral text-sm">{errors.first_name}</p>}
          </div>
          <div>
            <Input
              label="Last name"
              name="last_name"
              placeholder="Doe"
              value={form.last_name}
              onChange={handleChange}
            />
            {errors.last_name && <p className="text-coral text-sm">{errors.last_name}</p>}
          </div>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Contact number"
              name="contact_number"
              placeholder="+1 555 123 4567"
              value={form.contact_number}
              onChange={handleChange}
            />
            {errors.contact_number && <p className="text-coral text-sm">{errors.contact_number}</p>}
          </div>
          <CountrySelect countries={countries} value={form.country} onChange={handleCountryChange} />
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm text-graphite">User type</span>
          <select name="user_type" value={form.user_type} onChange={handleChange} className="input">
            <option value="">Select type</option>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>
        </label>
        {errors.user_type && <p className="text-coral text-sm">{errors.user_type}</p>}

        {message && (
          <p className={`text-sm ${message.type === 'success' ? 'text-mint' : 'text-coral'}`}>
            {message.text}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <Link to="/login" className="link-accent text-sm">
            Have an account? Login
          </Link>
          <Button type="submit" loading={loading}>
            Create account
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
