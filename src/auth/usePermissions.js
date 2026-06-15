import { useState, useEffect } from 'react';
import { useAuth } from './useAuth.js';
import { supabase } from '../services/supabaseClient.js';

const usePermissions = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (!user?.email) { setRoles([]); return; }

    supabase
      .from('user_profiles')
      .select('role')
      .eq('email', user.email)
      .single()
      .then(({ data }) => {
        if (data?.role) {
          setRoles([data.role]);
        } else {
          // fallback: lê do JWT metadata (Supabase Dashboard ou signUp options)
          const metaRoles = user?.user_metadata?.roles;
          setRoles(Array.isArray(metaRoles) ? metaRoles : []);
        }
      });
  }, [user?.email]);

  const hasRole = (role) => roles.includes(role);
  const hasAny = (roleList = []) => roleList.some(r => roles.includes(r));

  return { roles, hasRole, hasAny };
};

export default usePermissions;
