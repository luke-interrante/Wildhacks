import { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../util/supabaseClient.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined);

  // Create or update user in custom users table
  const updateUserTable = async (userData) => {
    try {
      console.log('Updating user table for:', userData.email);

      // First check if the user exists by email
      const { data: existingUsers, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', userData.email);
      
      if (fetchError) {
        console.error('Error fetching user:', fetchError);
        return { success: false, error: fetchError };
      }
      
      // Check if we found a user
      const existingUser = existingUsers && existingUsers.length > 0 ? existingUsers[0] : null;
      
      if (existingUser) {
        console.log('Found existing user in custom table');
        return { success: true, data: existingUser };
      }
      
      console.log('Creating new user in custom table');
      
      // If user doesn't exist, create a new one
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{ 
          email: userData.email,
          auth_id: userData.id,
          first_name: '',
          last_name: '',
          is_farmer: false
        }])
        .select();
      
      if (insertError) {
        console.error('Error creating user in custom table:', insertError);
        return { success: false, error: insertError };
      }
      
      return { success: true, data: newUser[0] };
    } catch (error) {
      console.error('Unexpected error in updateUserTable:', error);
      return { success: false, error };
    }
  };

  // Sign up function
  const signUpNewUser = async ( email, password ) => {
    const { data, error } = await supabase.auth.signUp( {
      email: email.toLowerCase(),
      password: password,
    });

    if (error) {
      console.log('error signing up', error);
      return { success: false, error };
    }
    
    // Add user to custom users table
    console.log('data.user info:', data.user);
    if (data.user) {
      const userTableResult = await updateUserTable(data.user);
      if (!userTableResult.success) {
        console.log('Error updating user table:', userTableResult.error);
        // Note: We don't return here as the auth signup was successful
      }
    }
    
    return { success: true, data }
  };

  // sign in function
  const signInUser = async ( email, password ) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      // handle supabase error explicitly
      if (error) {
        console.log("sign in error occured", error.message);
        return { success: false, error: error.message }
      }

      // if no error, return success
      console.log('sign in success!', data);
      
      // Ensure user exists in custom users table
      if (data.user) {
        const userTableResult = await updateUserTable(data.user);
        if (!userTableResult.success) {
          console.log('Error ensuring user in custom table:', userTableResult.error);
          // We continue as the sign in was successful
        }
      }
      
      return { success: true, data };
    } catch(error) {
      console.log('an error occured', error.message);
      return {
        success: false,
        error: "unexpected error occured. please tryin again",
      }
    }
  };

  // Sign out
  async function signOut() {
    const { error } = supabase.auth.signOut();
    if (error) {
      console.log("there was an error", error);
    }
  }

  useEffect( () => {
    supabase.auth.getSession().then(({data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ session, signUpNewUser, signInUser, signOut, updateUserTable }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const UserAuth = () => {
  return useContext(AuthContext);
} 