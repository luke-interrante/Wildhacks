import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Farmer's Market</Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/marketplace" className="nav-link">Marketplace</Link>
        <Link to="/social" className="nav-link">Community</Link>
        <Link to="/profile" className="nav-link">Profile</Link>
        <Link to="/login" className="nav-link">Login</Link>
      </div>
    </nav>
  )
}

export default Navbar 