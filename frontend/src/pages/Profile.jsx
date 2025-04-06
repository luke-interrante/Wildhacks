import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../util/supabaseClient.js'

const Profile = () => {
  const navigate = useNavigate()
  const [_user, setUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [farmerItems, setFarmerItems] = useState([])
  const [activeTab, setActiveTab] = useState('profile')
  
  // New item form state
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    quantity: ''
  })
  
  // Edit profile form state
  const [editedProfile, setEditedProfile] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    profile_photo: ''
  })
  
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true)
        
        // First check if we have an active session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) throw sessionError
        
        // If no active session, redirect to login
        if (!sessionData.session) {
          navigate('/login')
          return
        }
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) throw userError
        
        if (!user) {
          navigate('/login')
          return
        }
        
        setUser(user)
        
        // Get user details from our users table
        const { data: userData, error: detailsError } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single()
        
        if (detailsError) throw detailsError
        
        setUserDetails(userData)
        setEditedProfile({
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone_number: userData.phone_number || '',
          profile_photo: userData.profile_photo || ''
        })
        
        // If user is a farmer, fetch their items
        if (userData.is_farmer) {
          const { data: itemsData, error: itemsError } = await supabase
            .from('items')
            .select('*')
            .eq('farmer_id', userData.id)
          
          if (itemsError) throw itemsError
          
          setFarmerItems(itemsData || [])
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    
    getUser()
  }, [navigate])
  
  const handleAddItem = async (e) => {
    e.preventDefault()
    
    try {
      if (!userDetails?.is_farmer) {
        alert('Only farmers can add items')
        return
      }
      
      const newItemData = {
        ...newItem,
        farmer_id: userDetails.id,
        price: parseFloat(newItem.price),
        quantity: parseInt(newItem.quantity, 10)
      }
      
      const { data, error } = await supabase
        .from('items')
        .insert([newItemData])
        .select()
      
      if (error) throw error
      
      // Add the new item to the state
      setFarmerItems(prev => [...prev, data[0]])
      
      // Reset form
      setNewItem({
        name: '',
        description: '',
        price: '',
        quantity: ''
      })
      
      alert('Item added successfully!')
    } catch (error) {
      console.error('Error adding item:', error)
      alert(`Failed to add item: ${error.message}`)
    }
  }
  
  const handleItemChange = (e) => {
    const { name, value } = e.target
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const updateProfile = async (e) => {
    e.preventDefault()
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: editedProfile.first_name,
          last_name: editedProfile.last_name,
          phone_number: editedProfile.phone_number,
          profile_photo: editedProfile.profile_photo
        })
        .eq('id', userDetails.id)
      
      if (error) throw error
      
      // Update local state
      setUserDetails(prev => ({
        ...prev,
        ...editedProfile
      }))
      
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert(`Failed to update profile: ${error.message}`)
    }
  }
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      alert('Error signing out')
    }
  }
  
  if (loading) return <div>Loading profile...</div>
  if (error) return <div>Error: {error}</div>
  if (!userDetails) return <div>Please log in to view your profile</div>
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-photo">
          {userDetails.profile_photo ? (
            <img src={userDetails.profile_photo} alt="Profile" />
          ) : (
            <div className="profile-placeholder">
              {userDetails.first_name?.charAt(0)}{userDetails.last_name?.charAt(0)}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1>{userDetails.first_name} {userDetails.last_name}</h1>
          <p>{userDetails.is_farmer ? 'Farmer' : 'Customer'}</p>
          <button className="sign-out-btn" onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>
      
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        {userDetails.is_farmer && (
          <button 
            className={`tab-btn ${activeTab === 'items' ? 'active' : ''}`}
            onClick={() => setActiveTab('items')}
          >
            My Products
          </button>
        )}
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>
      
      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-edit">
            <h2>Edit Profile</h2>
            <form onSubmit={updateProfile}>
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={editedProfile.first_name}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={editedProfile.last_name}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone_number">Phone</label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={editedProfile.phone_number}
                  onChange={handleProfileChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="profile_photo">Profile Photo URL</label>
                <input
                  type="text"
                  id="profile_photo"
                  name="profile_photo"
                  value={editedProfile.profile_photo}
                  onChange={handleProfileChange}
                />
              </div>
              
              <button type="submit" className="update-profile-btn">Update Profile</button>
            </form>
          </div>
        )}
        
        {activeTab === 'items' && userDetails.is_farmer && (
          <div className="farmer-items">
            <h2>My Products</h2>
            
            <div className="add-item-form">
              <h3>Add New Product</h3>
              <form onSubmit={handleAddItem}>
                <div className="form-group">
                  <label htmlFor="name">Product Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newItem.name}
                    onChange={handleItemChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newItem.description}
                    onChange={handleItemChange}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Price ($)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      value={newItem.price}
                      onChange={handleItemChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      value={newItem.quantity}
                      onChange={handleItemChange}
                      required
                    />
                  </div>
                </div>
                
                <button type="submit" className="add-item-btn">Add Product</button>
              </form>
            </div>
            
            <div className="items-list">
              <h3>Current Products</h3>
              {farmerItems.length === 0 ? (
                <p>You don't have any products yet.</p>
              ) : (
                <div className="farmer-products-grid">
                  {farmerItems.map(item => (
                    <div className="farmer-product-card" key={item.id}>
                      <h4>{item.name}</h4>
                      <p className="item-price">${item.price}</p>
                      <p className="item-quantity">In stock: {item.quantity}</p>
                      <div className="item-actions">
                        <button className="edit-item-btn">Edit</button>
                        <button className="delete-item-btn">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="orders">
            <h2>My Orders</h2>
            <p>Order history will be shown here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile 