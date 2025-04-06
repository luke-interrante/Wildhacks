import { useState, useEffect } from 'react'
import supabase, { supabaseUrl } from '../util/supabaseClient.js'
// import FileUploader from '../components/FileUploader.jsx'
import { v4 as uuidv4 } from 'uuid'

// Upload file to Supabase Storage using standard upload
async function uploadFile(file) {
  const { data, error } = await supabase.storage.from('bucket_name').upload('file_path', file)
  if (error) {
    // Handle error
  } else {
    // Handle success
  }
}

const Social = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [_user, setUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [newPost, setNewPost] = useState({
    content: '',
    image_url: '',
    image_file: ''
  })
  const [selectedFile, setSelectedFile] = useState(null)

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
          user: {
            id: post.users.id,  // User ID
            first_name: post.users.first_name,  // User first name
            last_name: post.users.last_name,  // User last name
            profile_photo: post.users.pfp || `https://ui-avatars.com/api/?name=${post.users.first_name}+${post.users.last_name}&background=random`  // User profile photo or a random one
          }
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

  const handleFileChange = (e) => {
    const { name, files } = e.target

    // TODO: delete console.logs
    console.log('** Just added file!')
    console.log('** file:', files[0])
    console.log('** file name:', files[0].name)

    const file = files[0]
    setNewPost(prev => ({
      ...prev,
      [name]: file
    }))
  }
  
  const handleAddPost = async (e) => {
    e.preventDefault();
  
    if (!userDetails?.is_farmer) {
      alert('Only farmers can create posts');
      return;
    }
  
    try {
      // TODO: delete console.logs
      console.log('here1')

      // Step 0: If an image file is selected, upload it to Supabase Storage
      if (newPost.image_file) {
        console.log('here2')

        // TODO: generate a unique file name (uuid) for the image
        const file_name = `${uuidv4()}.${newPost.image_file.name.split('.').pop()}`
        console.log('file_name:', file_name)

        const { data, error: uploadError } = await supabase
          .storage
          .from('farmers-place')  // bucket name
          .upload(`post-images/${file_name}`, newPost.image_file)  // file path, file
  
        console.log('here3')

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        console.log('here4')
  
        // Get the public URL of the uploaded image
        // const { publicURL, error: urlError } = supabase
        //   .storage
        //   .from('farmers-place')  // bucket name
        //   .getPublicUrl(data.path)

        const publicURL = `${supabaseUrl}/storage/v1/object/public/farmers-place/post-images/${file_name}`

        console.log('here5')
        console.log('publicURL:', publicURL)
  
        // if (urlError) {
        //   throw new Error(urlError.message);
        // }

        console.log('here6')
  
        // Update the newPost with the public URL
        newPost.image_url = publicURL;

        console.log('here7')
      }

      console.log('here8')
      console.log('newPost:', newPost)

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

      console.log('here9')
  
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
        image_url: '',
        image_file: ''
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
    <div className='flex justify-center'>
      <div className="social-container">
        <h1>Farmer Community</h1>
      
        {userDetails?.is_farmer && (
          <div className="new-post-form">
            <p className='text-xl'> <strong>My Profile</strong> </p>
              <form onSubmit={handleAddPost}>
              <div className="form-group">
                <label htmlFor="content">Post Content</label>
                <textarea
                  className='min-h-20'
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

              <div className="form-group">
                <label htmlFor="image_file">Upload image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  id="image_file"
                  name="image_file"
                  // value={newPost.image_file}
                  onChange={handleFileChange}
                />
                {/* <FileUploader
                  onFileSelectSuccess={(file) => setSelectedFile(file)}
                  onFileSelectError={({ error }) => alert(error)}
                /> */}
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
                    <button className="like-btn"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.89346 2.35248C3.49195 2.35248 2.35248 3.49359 2.35248 4.90532C2.35248 6.38164 3.20954 7.9168 4.37255 9.33522C5.39396 10.581 6.59464 11.6702 7.50002 12.4778C8.4054 11.6702 9.60608 10.581 10.6275 9.33522C11.7905 7.9168 12.6476 6.38164 12.6476 4.90532C12.6476 3.49359 11.5081 2.35248 10.1066 2.35248C9.27059 2.35248 8.81894 2.64323 8.5397 2.95843C8.27877 3.25295 8.14623 3.58566 8.02501 3.88993C8.00391 3.9429 7.98315 3.99501 7.96211 4.04591C7.88482 4.23294 7.7024 4.35494 7.50002 4.35494C7.29765 4.35494 7.11523 4.23295 7.03793 4.04592C7.01689 3.99501 6.99612 3.94289 6.97502 3.8899C6.8538 3.58564 6.72126 3.25294 6.46034 2.95843C6.18109 2.64323 5.72945 2.35248 4.89346 2.35248ZM1.35248 4.90532C1.35248 2.94498 2.936 1.35248 4.89346 1.35248C6.0084 1.35248 6.73504 1.76049 7.20884 2.2953C7.32062 2.42147 7.41686 2.55382 7.50002 2.68545C7.58318 2.55382 7.67941 2.42147 7.79119 2.2953C8.265 1.76049 8.99164 1.35248 10.1066 1.35248C12.064 1.35248 13.6476 2.94498 13.6476 4.90532C13.6476 6.74041 12.6013 8.50508 11.4008 9.96927C10.2636 11.3562 8.92194 12.5508 8.00601 13.3664C7.94645 13.4194 7.88869 13.4709 7.83291 13.5206C7.64324 13.6899 7.3568 13.6899 7.16713 13.5206C7.11135 13.4709 7.05359 13.4194 6.99403 13.3664C6.0781 12.5508 4.73641 11.3562 3.59926 9.96927C2.39872 8.50508 1.35248 6.74041 1.35248 4.90532Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>Like</button>
                    <button className="comment-btn"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 3L2.5 3.00002C1.67157 3.00002 1 3.6716 1 4.50002V9.50003C1 10.3285 1.67157 11 2.5 11H7.50003C7.63264 11 7.75982 11.0527 7.85358 11.1465L10 13.2929V11.5C10 11.2239 10.2239 11 10.5 11H12.5C13.3284 11 14 10.3285 14 9.50003V4.5C14 3.67157 13.3284 3 12.5 3ZM2.49999 2.00002L12.5 2C13.8807 2 15 3.11929 15 4.5V9.50003C15 10.8807 13.8807 12 12.5 12H11V14.5C11 14.7022 10.8782 14.8845 10.6913 14.9619C10.5045 15.0393 10.2894 14.9965 10.1464 14.8536L7.29292 12H2.5C1.11929 12 0 10.8807 0 9.50003V4.50002C0 3.11931 1.11928 2.00003 2.49999 2.00002Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>Comment</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Social 