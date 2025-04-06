import { Link, Outlet, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import CartDropdown from './CartDropdown'
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { session, signOut } = UserAuth();
  const { getCartCount, toggleCart, isOpen } = useCart();
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
          <Link to="/"><b>Farmer's Place</b></Link>
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/marketplace" className="nav-link">Marketplace</Link>
          <Link to="/social" className="nav-link">Community</Link>
          
          {session ? (
            <>
              <Link to="/profile" className="nav-link"><b>Profile</b></Link>
              <div className="nav-user">
                <div className="cart-icon" onClick={toggleCart}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                  </svg>
                  {getCartCount() > 0 && (
                    <span className="cart-count">{getCartCount()}</span>
                  )}
                </div>
                <button onClick={handleSignOut} className="nav-signout">Sign Out</button>
              </div>
              {isOpen && <CartDropdown />}
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link"><b>Sign Up</b></Link>
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