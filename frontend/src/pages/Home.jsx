import React from 'react'
import { Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const navigateToMarketplace = () => { navigate('/marketplace'); };
  const navigateToSignup = () => { navigate('/signup'); }

  return (
    <div className="home-container">
      <section className="hero">
        <h1>Welcome to the Community Farmer's Market</h1>
        <p>Connect with local farmers, buy fresh produce, and join our growing community</p>
        <div className="cta-buttons">
          <Link to="/marketplace">
          <button className="primary-btn">Browse Marketplace</button>
          </Link>
          <Link to="/signup">
            <button className="secondary-btn">Join Community</button>
          </Link>
        </div>
      </section>
      
      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {/* Product cards will go here */}
        </div>
      </section>
      
      <section className="farmers-spotlight">
        <h2>Featured Farmers</h2>
        <div className="farmers-grid">
          {/* Farmer cards will go here */}
        </div>
      </section>
    </div>
  )
}

export default Home
