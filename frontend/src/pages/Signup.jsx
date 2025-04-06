import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import CustomCheckbox from '../components/Checkbox.jsx'
import { UserAuth } from '../context/AuthContext.jsx'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isFarmer, setIsFarmer] = useState(false)
  const [phone, setPhone] = useState('')
  
  const { signUpNewUser } = UserAuth()
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signUpNewUser(email, password, firstName, lastName, isFarmer, phone);

      if (result.success) {
        navigate('/home')
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError('an error occured', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1>Create Account</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              placeholder="John"
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              placeholder='Doe'
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              placeholder='777-777-7777'
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <CustomCheckbox 
              id="isFarmer"
              onChange={() => setIsFarmer(!isFarmer)}
              label="I am a farmer"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder='johndoe@gmail.com'
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder='supersecretpassword'
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Processing...' : 'Sign Up'}
          </button>
          {error && <p className="text-red-600 text-center pt-4">{error}</p>}
        </form>
        
        <div className="auth-switch">
          <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Signup 