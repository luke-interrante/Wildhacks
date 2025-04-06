import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext.jsx'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { signInUser } = UserAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { session, error } = await signInUser(email, password);

    if (error) {
      setError(error);

      setTimeout( () => {
        setError("");
      }, 3000); // 3000 ms = 3 sec
    } else {
      navigate('/home');
    }

    if (session) {
      // closeModal();
      setError('');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1>Log in</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder='Email'
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="auth-button">
            Log in
          </button>
        </form>
        
        <div className="auth-switch">
          <p>Need an account? <Link to="/signup"><strong>Sign Up</strong></Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login
