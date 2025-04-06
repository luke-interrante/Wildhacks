import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import supabase from '../util/supabaseClient.js'
import ProductModal from '../components/ProductModal.jsx'
import { useCart } from '../context/CartContext.jsx'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [featuredFarmers, setFeaturedFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [farmers, setFarmers] = useState({})
  const [selectedItem, setSelectedItem] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch 4 most recent items
        const { data: itemsData, error: itemsError } = await supabase
          .from('items')
          .select('*')
          .order('id', { ascending: false }) // Assuming newer items have higher IDs
          .limit(4)

          if (itemsError) throw itemsError
          console.log('4 items', itemsData);
          setFeaturedProducts(itemsData || [])
        
        // Get unique farmer IDs to fetch farmer info
        if (itemsData && itemsData.length > 0) {
          // Get unique farmer IDs
          const farmerIds = [...new Set(itemsData.map(item => item.farmer_id))].filter(Boolean)
          console.log('all farmer ids', farmerIds);
          if (farmerIds.length > 0) {
            const { data: farmersData, error: farmersError } = await supabase
              .from('users')
              .select('id, first_name, last_name')
              .in('id', farmerIds)
            console.log('farmer data', farmersData);
            if (farmersError) throw farmersError
            
            if (farmersData) {
              // Create a lookup object with farmer_id as key
              const farmerLookup = {}
              farmersData.forEach(farmer => {
                farmerLookup[farmer.id] = farmer
              })
              setFarmers(farmerLookup)
            }
          }
        }
        
        // Fetch 4 users for featured farmers
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, first_name, last_name, pfp, is_farmer')
          .limit(4)
        
        if (usersError) throw usersError
        
        setFeaturedFarmers(usersData || [])
        
      } catch (error) {
        console.error('Error fetching home data:', error)
        setError('Failed to load home page data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  const handleAddToCart = async (item) => {
    const result = await addToCart(item, 1)
    if (result.success === true) {
      setSuccessMessage('Added to cart!')
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }

  const openProductModal = (item) => {
    setSelectedItem(item)
  }
  
  const closeProductModal = () => {
    setSelectedItem(null)
  }

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
      
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      
      <section className="featured-products">
        <h2>Featured Products</h2>
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="product-grid">
            {featuredProducts.length === 0 ? (
              <p>No products found.</p>
            ) : (
              featuredProducts.map(item => (
                <div className="product-card" key={item.id}>
                  <div className="product-image">
                    <div className="image-placeholder"></div>
                  </div>
                  <div className="product-info">
                    <h3 className='cursor-pointer' onClick={() => openProductModal(item)}>{item.name}</h3>
                    <p className="product-price">${(item.price).toFixed(2)}</p>
                    {item.farmer_id && farmers[item.farmer_id] && (
                      <p className="product-farmer">
                        By: {farmers[item.farmer_id].first_name} {farmers[item.farmer_id].last_name}
                      </p>
                    )}
                    <p className="product-description">{item.description}</p>
                    <div className="product-actions">
                      <button 
                        className="add-to-cart-btn" 
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className="view-details-btn"
                        onClick={() => openProductModal(item)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
      
      <section className="farmers-spotlight">
        <h2>Featured Farmers</h2>
        {loading ? (
          <div className="loading">Loading farmers...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="farmers-grid">
            {featuredFarmers.length === 0 ? (
              <p>No farmers found.</p>
            ) : (
              featuredFarmers.map(farmer => (
                <Link to={`/profile/${farmer.id}`} key={farmer.id} className="farmer-card">
                  <div className="farmer-avatar">
                    {farmer.profile_photo ? (
                      <img src={farmer.profile_photo} alt={`${farmer.first_name} ${farmer.last_name}`} />
                    ) : (
                      <div className="farmer-initials">
                        {farmer.first_name?.charAt(0)}{farmer.last_name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="farmer-info">
                    <h3>{farmer.first_name} {farmer.last_name}</h3>
                    <p>{farmer.is_farmer ? 'Farmer' : 'Community Member'}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </section>
      
      {selectedItem && (
        <ProductModal 
          item={selectedItem} 
          farmer={selectedItem.farmer_id ? farmers[selectedItem.farmer_id] : null} 
          onClose={closeProductModal} 
        />
      )}
    </div>
  )
}

export default Home
