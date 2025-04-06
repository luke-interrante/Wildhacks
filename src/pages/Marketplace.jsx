import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import supabase from '../util/supabaseClient.js'
import ProductModal from '../components/ProductModal.jsx'
import { useCart } from '../context/CartContext.jsx'
import { UserAuth } from '../context/AuthContext.jsx'

const Marketplace = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    category: ''
  })
  const [farmers, setFarmers] = useState({})
  const [selectedItem, setSelectedItem] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [warningMessage, setWarningMessage] = useState('');
  const { addToCart } = useCart()
  const location = useLocation()

  useEffect(() => {
    // Check for success message from checkout
    if (location.state?.success) {
      setSuccessMessage(location.state.message)
      setTimeout(() => setSuccessMessage(''), 5000)
      // Clear the location state
      window.history.replaceState({}, document.title)
    }
  }, [location])

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        
        // Start building the query without awaiting yet - just fetch items
        let query = supabase.from('items').select('*')
        
        // Apply filters if set
        if (filters.search) {
          query = query.ilike('name', `%${filters.search}%`)
        }
        
        if (filters.minPrice) {
          query = query.gte('price', filters.minPrice)
        }
        
        if (filters.maxPrice) {
          query = query.lte('price', filters.maxPrice)
        }
        
        // Execute the query after all filters have been applied
        const { data, error } = await query
        
        if (error) {
          throw error
        }
        
        console.log('Items data:', data)
        setItems(data || [])

        // Get unique farmer IDs to fetch farmer info
        if (data && data.length > 0) {
          // Get unique farmer Ids
          const farmerIds = [...new Set(data.map(item => item.farmer_id))].filter(Boolean)
          
          if (farmerIds.length > 0) {
            const { data: farmersData, error: farmersError } = await supabase
              .from('users')
              .select('id, first_name, last_name')
              .in('id', farmerIds)
            
            if (!farmersError && farmersData) {
              // Create a lookup object with farmer_id as key
              const farmerLookup = {}
              farmersData.forEach(farmer => {
                farmerLookup[farmer.id] = farmer
              })
              setFarmers(farmerLookup)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching items:', error)
        setError('Failed to load marketplace items')
      } finally {
        setLoading(false)
      }
    }
    
    fetchItems()
  }, [filters])
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleAddToCart = async (item) => {
    const result = await addToCart(item, 1)
    if (result.success === false) {
      setError(result.message)
      setTimeout(() => setError(null), 3000)
    } else if (result.success === null) {
      setWarningMessage(result.message)
      setTimeout(() => setWarningMessage(''), 3000)
    } else {
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
    <div className="marketplace-container app-container">
      <h1>Farmer's Marketplace</h1>
      
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      { warningMessage && (
        <div className="warning-message">{warningMessage}</div>
      )}
      
      <div className="marketplace-filters">
        <input
          type="text"
          name="search"
          placeholder="Search products..."
          value={filters.search}
          onChange={handleFilterChange}
        />
        
        <div className="price-filters">
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="products-grid">
          {items.length === 0 ? (
            <p>No products found.</p>
          ) : (
            items.map(item => (
              <div className="product-card" key={item.id}>
                <div className="product-image">
                <img src={item.image_url} alt={item.name} />
                  <div className="image-placeholder"></div>
                </div>
                <div className="product-info">
                  <h3 className='cursor-pointer' onClick={ () => openProductModal(item) }>{item.name}</h3>
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

export default Marketplace 