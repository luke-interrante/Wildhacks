import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { isAuthenticated, userDetails, signOut } = useAuth();

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Farmer's Market</Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/marketplace" className="nav-link">Marketplace</Link>
        <Link to="/social" className="nav-link">Community</Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="nav-link">Profile</Link>
            <div className="nav-user">
              {userDetails?.profile_photo ? (
                <Link to="/profile">
                  <img 
                    src={userDetails.profile_photo} 
                    alt={`${userDetails.first_name} ${userDetails.last_name}`} 
                    className="nav-user-photo"
                  />
                </Link>
              ) : (
                <Link to="/profile" className="nav-user-initials">
                  {userDetails?.first_name?.charAt(0)}{userDetails?.last_name?.charAt(0)}
                </Link>
              )}
              <button onClick={signOut} className="nav-signout">Sign Out</button>
            </div>
          </>
        ) : (
          <Link to="/login" className="nav-link">Login</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar 