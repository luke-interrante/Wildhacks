import { useState, useEffect } from 'react'
import supabase from '../util/supabaseClient.js'

const Social = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [_user, setUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [newPost, setNewPost] = useState({
    content: '',
    image_url: ''
  })

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        setUser(currentUser)
        
        if (currentUser) {
          // Get user details
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('email', currentUser.email)
            .single()
            
          setUserDetails(userData)
        }
        
        // In a real app, we would have a posts table
        // This is just a placeholder
        // We'll simulate some posts for now
        
        // Fetch all farmers
        const { data: farmers } = await supabase
          .from('users')
          .select('*')
          .eq('is_farmer', true)
        
        // Create simulated posts for demonstration
        const simulatedPosts = farmers.map((farmer, index) => ({
          id: index + 1,
          content: `Check out our latest harvest! #FarmFresh #LocalProduce`,
          image_url: `https://source.unsplash.com/random/800x600?farm&sig=${index}`,
          created_at: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
          user: {
            id: farmer.id,
            first_name: farmer.first_name,
            last_name: farmer.last_name,
            profile_photo: farmer.profile_photo || `https://ui-avatars.com/api/?name=${farmer.first_name}+${farmer.last_name}&background=random`
          }
        }))
        
        setPosts(simulatedPosts)
      } catch (error) {
        console.error('Error fetching social posts:', error)
        setError('Failed to load community posts')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts()
  }, [])
  
  const handlePostChange = (e) => {
    const { name, value } = e.target
    setNewPost(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleAddPost = (e) => {
    e.preventDefault()
    
    if (!userDetails?.is_farmer) {
      alert('Only farmers can create posts')
      return
    }
    
    // In a real app, we would insert into a posts table
    // For now, we'll just add to the local state
    
    const newPostObject = {
      id: posts.length + 1,
      content: newPost.content,
      image_url: newPost.image_url || `https://source.unsplash.com/random/800x600?farm&sig=${posts.length}`,
      created_at: new Date().toISOString(),
      user: {
        id: userDetails.id,
        first_name: userDetails.first_name,
        last_name: userDetails.last_name,
        profile_photo: userDetails.profile_photo || `https://ui-avatars.com/api/?name=${userDetails.first_name}+${userDetails.last_name}&background=random`
      }
    }
    
    setPosts([newPostObject, ...posts])
    
    // Reset form
    setNewPost({
      content: '',
      image_url: ''
    })
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  return (
    <div className="social-container">
      <h1>Farmer Community</h1>
      
      {userDetails?.is_farmer && (
        <div className="new-post-form">
          <h2>Create a New Post</h2>
          <form onSubmit={handleAddPost}>
            <div className="form-group">
              <label htmlFor="content">Post Content</label>
              <textarea
                id="content"
                name="content"
                placeholder="Share updates about your farm..."
                value={newPost.content}
                onChange={handlePostChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="image_url">Image URL (optional)</label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                placeholder="https://example.com/your-image.jpg"
                value={newPost.image_url}
                onChange={handlePostChange}
              />
            </div>
            
            <button type="submit" className="post-btn">Share Post</button>
          </form>
        </div>
      )}
      
      {loading ? (
        <div className="loading">Loading community posts...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="posts-feed">
          {posts.length === 0 ? (
            <p>No posts to display.</p>
          ) : (
            posts.map(post => (
              <div className="post-card" key={post.id}>
                <div className="post-header">
                  <div className="post-user">
                    <div className="user-avatar">
                      <img src={post.user.profile_photo} alt={`${post.user.first_name}'s profile`} />
                    </div>
                    <div className="user-info">
                      <h3>{post.user.first_name} {post.user.last_name}</h3>
                      <p className="post-date">{formatDate(post.created_at)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="post-content">
                  <p>{post.content}</p>
                </div>
                
                {post.image_url && (
                  <div className="post-image">
                    <img src={post.image_url} alt="Post" />
                  </div>
                )}
                
                <div className="post-actions">
                  <button className="like-btn">❤️ Like</button>
                  <button className="comment-btn">💬 Comment</button>
                  <button className="share-btn">↗️ Share</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Social 