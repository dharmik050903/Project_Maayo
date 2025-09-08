import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import Input from '../components/Input'
import Button from '../components/Button'
import { countries } from '../data/countries'
import { dialCodes } from '../data/dialCodes'
import CountrySelect from '../components/CountrySelect'

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
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      setLoading(false)

      if (data.message === "User created successfully") {
        setMessage({ type: 'success', text: 'Account created successfully 🎉' })
        // Redirect to login after successful signup
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to create account' })
      }
    } catch (err) {
      setLoading(false)
      setMessage({ type: 'error', text: 'Something went wrong. Try again.' })
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left Side - Brand Section */}
      <div className="hidden md:flex bg-brand-gradient text-white p-10 items-center justify-center">
        <div className="space-y-8 max-w-md text-center">
          <Logo theme="light" />
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Join Maayo</h2>
            <p className="text-xl text-white/90">Start your journey with the world's leading freelance platform</p>
            <p className="text-white/80">Connect with top talent or find amazing projects to work on</p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-base">
        <div className="w-full max-w-md">
          <div className="mb-8 md:hidden text-center">
            <Logo theme="dark" />
          </div>
          
          <div className="card p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold text-graphite">Create your account</h1>
              <p className="text-coolgray mt-1">Join Maayo and get started</p>
            </div>

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
                <div className={`p-3 rounded-lg text-sm ${
                  message.type === 'success' 
                    ? 'bg-mint/20 text-mint border border-mint/30' 
                    : 'bg-coral/20 text-coral border border-coral/30'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Link to="/login" className="link-accent text-sm">
                  Have an account? Login
                </Link>
                <Button type="submit" loading={loading}>
                  {loading ? 'Creating...' : 'Create account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
