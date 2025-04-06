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
        
        // Fetch all farmers
        const { data: farmers } = await supabase
          .from('users')
          .select('*')
          .eq('is_farmer', true)
        
        // Fetch all posts along with user details (users table)
        const { data: postsData, error } = await supabase
          .from('posts')
          .select(`
            post_id, 
            caption, 
            image_url, 
            created_at, 
            user_id, 
            users (id, first_name, last_name, pfp)
          `)
          .order('created_at', { ascending: false })  // Sorting posts by created_at in descending order

        // Map the fetched data into the required format
        const formattedPosts = postsData.map(post => ({
          id: post.post_id,  // Post ID
          content: post.caption,  // Post content
          image_url: post.image_url,
          created_at: post.created_at,  // Post creation date
        // Fetch all posts along with user details (users table)
        const { data: postsData, error } = await supabase
          .from('posts')
          .select(`
            post_id, 
            caption, 
            image_url, 
            created_at, 
            user_id, 
            users (id, first_name, last_name, pfp)
          `)
          .order('created_at', { ascending: false })  // Sorting posts by created_at in descending order

        // Map the fetched data into the required format
        const formattedPosts = postsData.map(post => ({
          id: post.post_id,  // Post ID
          content: post.caption,  // Post content
          image_url: post.image_url,
          created_at: post.created_at,  // Post creation date
          user: {
            id: post.users.id,  // User ID
            first_name: post.users.first_name,  // User first name
            last_name: post.users.last_name,  // User last name
            profile_photo: post.users.pfp || `https://ui-avatars.com/api/?name=${post.users.first_name}+${post.users.last_name}&background=random`  // User profile photo or a random one
            id: post.users.id,  // User ID
            first_name: post.users.first_name,  // User first name
            last_name: post.users.last_name,  // User last name
            profile_photo: post.users.pfp || `https://ui-avatars.com/api/?name=${post.users.first_name}+${post.users.last_name}&background=random`  // User profile photo or a random one
          }
        }));

        // Set the formatted posts to state
        setPosts(formattedPosts);

        }));

        // Set the formatted posts to state
        setPosts(formattedPosts);

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
  
  const handleAddPost = async (e) => {
    e.preventDefault();
  
    if (!userDetails?.is_farmer) {
      alert('Only farmers can create posts');
      return;
    }
  
    try {
      // Step 1: Insert the new post into Supabase
      const { error, status } = await supabase
        .from('posts')
        .insert([
          {
            user_id: userDetails.id,
            caption: newPost.content,
            image_url: newPost.image_url || null,
            created_at: new Date(),
          }
        ]);
  
      console.log('Supabase insert status:', { error, status });
  
      if (error) {
        throw new Error(error.message); // Log detailed error message if it exists
      }
  
      // Step 2: Manually construct the new post object
      const newPostObject = {
        id: Date.now(),  // Use a temporary unique id (you can change this later)
        content: newPost.content,
        image_url: newPost.image_url || null,
        created_at: new Date().toISOString(), // Assign the created_at timestamp manually
        user: {
          id: userDetails.id,
          first_name: userDetails.first_name,
          last_name: userDetails.last_name,
          profile_photo: userDetails.profile_photo || `https://ui-avatars.com/api/?name=${userDetails.first_name}+${userDetails.last_name}&background=random`
        }
      };
  
      console.log('New post object:', newPostObject); // Log the new post object
  
      // Step 3: Update local state with the new post
      setPosts([newPostObject, ...posts]);
  
      // Step 4: Reset the new post form
      setNewPost({
        content: '',
        image_url: ''
      });
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to create post: ' + error.message);
    }
  };
  
  
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