import { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../util/supabaseClient.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session when the app loads
    const checkSession = async () => {
      try {
        setLoading(true);
        
        // Check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          return;
        }
        
        if (session) {
          // Set the user from the session
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error('User error:', userError);
            return;
          }
          
          setUser(user);
          
          // Get user details from our users table
          if (user) {
            const { data: userData, error: detailsError } = await supabase
              .from('users')
              .select('*')
              .eq('email', user.email)
              .single();
              
            if (detailsError) {
              console.error('User details error:', detailsError);
              return;
            }
            
            setUserDetails(userData);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Execute check
    checkSession();
    
    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single();
          
        setUserDetails(userData);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserDetails(null);
      }
    });
    
    // Cleanup the listener
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);
  
  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const value = {
    user,
    userDetails,
    loading,
    signOut,
    isAuthenticated: !!user,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 