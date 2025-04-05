import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import supabase from '../util/supabaseClient.js'
import CustomCheckbox from '../components/Checkbox.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isFarmer, setIsFarmer] = useState(false)
  const [phone, setPhone] = useState('')

  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Handle sign up
      const { error: authError } = await supabase.auth.signUp({
        email,
        password: pass,
      })

      if (authError) throw authError

      // Insert into users table
      const { error: userError } = await supabase
        .from('users')
        .insert([
          { 
            email: email,
            first_name: firstName,
            last_name: lastName,
            is_farmer: isFarmer,
            phone_num: phone,
            created_at: new Date(),
          }
        ])

      if (userError) throw userError
      
      alert('Sign up successful! Please check your email for verification.')
      navigate('/login')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1>Create Account</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <CustomCheckbox 
              id="isFarmer"
              checked={isFarmer}
              onChange={setIsFarmer}
              label="I am a farmer"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Processing...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-switch">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
        
        <div className="auth-options">
          <p>Or continue with</p>
          <button className="google-auth">Google</button>
        </div>
      </div>
    </div>
  )
}

export default Signup 