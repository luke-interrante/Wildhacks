import { useState, useEffect } from 'react'
import supabase from '../util/supabaseClient.js'

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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        
        // Start building the query without awaiting yet
        let query = supabase.from('items').select(`
          *,
          users:farmer_id (
            first_name,
            last_name
          )
        `)
        
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
        
        setItems(data || [])
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
  
  const handleAddToCart = (item) => {
    // To be implemented - Add to cart functionality
    console.log('Added to cart:', item)
  }
  
  return (
    <div className="marketplace-container">
      <h1>Farmer's Marketplace</h1>
      
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
                  {/* Placeholder for product image */}
                  <div className="image-placeholder"></div>
                </div>
                <div className="product-info">
                  <h3>{item.name}</h3>
                  <p className="product-price">${item.price}</p>
                  {item.users && (
                    <p className="product-farmer">
                      By: {item.users.first_name} {item.users.last_name}
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
                    <button className="view-details-btn">View Details</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Marketplace 