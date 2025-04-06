import { Link, Outlet, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();

  const handleSignOut = async (e) => {
    e.preventDefault();

    try {
      await signOut();
      navigate('/signup')
    } catch (err) {
      console.log("an error occured", err);
    }
  }

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <Link to="/">Farmer's Market</Link>
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/marketplace" className="nav-link">Marketplace</Link>
          <Link to="/social" className="nav-link">Community</Link>
          
          {session ? (
            <>
              <Link to="/profile" className="nav-link">Profile</Link>
              <div className="nav-user">
                <button onClick={handleSignOut} className="nav-signout">Sign Out</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Log in</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
            </>
          )}
          <div className="nav-theme-toggle">
            <ThemeToggle /> {/* Add the ThemeToggle button here */}
          </div>
        </div>
      </nav>
      <div className="content-container">
        <Outlet />
      </div>
    </>
  )
}

export default Navbar 