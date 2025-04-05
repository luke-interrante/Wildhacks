import { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../util/supabaseClient.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined);

  // Sign up function
  const signUpNewUser = async () => {
    const [data, error] = await supabase.auth.signUp( {
      email: email,
      password: password,
    });

    if (error) {
      console.log('error signing up', error);
      return { success: false, error };
    }
    return { success: true, data }
  };

  useEffect( () => {
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    })
  }, []);

  // Sign out
  const signOut = () => {
    const { error } = supabase.auth.signOut();
    if (error) {
      console.log("there was an error", error);
    }
  }

  return (
    <AuthContext.Provider value={{ session, signUpNewUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
} 