import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../util/supabaseClient.js'

const Login = () => {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isFarmer, setIsFarmer] = useState(false)
  const [phone, setPhone] = useState('')

  const navigate = useNavigate()

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        // Handle sign up
        const { error: authError } = await supabase.auth.signUp({
          email,
          pass,
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
              password: pass,
            }
          ])

        if (userError) throw userError
        
        alert('Sign up successful! Please check your email for verification.')
      } else {
        // Handle sign in
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          pass
        })

        if (authError) throw authError
        
        navigate('/')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1>{isSignUp ? 'Create Account' : 'Login'}</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleAuth}>
          {isSignUp && (
            <>
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
                  required
                />
              </div>
              
              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="isFarmer"
                  checked={isFarmer}
                  onChange={(e) => setIsFarmer(e.target.checked)}
                />
                <label htmlFor="isFarmer">I am a farmer</label>
              </div>
            </>
          )}
          
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
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
          </button>
        </form>
        
        <div className="auth-switch">
          <button onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
          </button>
        </div>
        
        <div className="auth-options">
          <p>Or continue with</p>
          <button className="google-auth">Google</button>
        </div>
      </div>
    </div>
  )
}

export default Login
