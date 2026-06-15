import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient.js';
import { AuthContext } from './AuthContext.jsx';

const fetchProfile = async (email) => {
  if (!email) return null;
  const { data } = await supabase
    .from('user_profiles')
    .select('full_name, role, psm_access, is_active')
    .eq('email', email)
    .single();
  return data ?? null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        const authUser = session?.user ?? null;
        setUser(authUser);
        setProfile(await fetchProfile(authUser?.email));
      } catch (e) {
        if (!mounted) return;
        setError(e.message);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      setProfile(await fetchProfile(authUser?.email));
      setLoading(false);
    });

    return () => {
      mounted = false;
      try { subscription.unsubscribe(); } catch (e) { /* ignore */ }
    };
  }, []);

  const signIn = async (email, password) => {
    setLoading(true); setError(null);
    const result = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (result.error) setError(result.error.message);
    return result;
  };

  const signUp = async (email, password, options = {}) => {
    setLoading(true); setError(null);
    const result = await supabase.auth.signUp({ email, password }, { data: options });
    setLoading(false);
    if (result.error) setError(result.error.message);
    return result;
  };

  const signOut = async () => {
    setLoading(true); setError(null);
    const result = await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setLoading(false);
    if (result.error) setError(result.error.message);
    return result;
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, signIn, signUp, signOut, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
