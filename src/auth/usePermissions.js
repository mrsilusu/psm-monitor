import { useMemo } from 'react';
import { useAuth } from './useAuth.js';

const usePermissions = () => {
  const { user } = useAuth();

  const roles = useMemo(() => {
    if (!user) return [];
    // Supabase stores custom metadata in user.user_metadata
    const metaRoles = user?.user_metadata?.roles;
    if (Array.isArray(metaRoles)) return metaRoles;
    if (typeof user?.role === 'string') return [user.role];
    return [];
  }, [user]);

  const hasRole = (role) => roles.includes(role);
  const hasAny = (roleList = []) => roleList.some(r => roles.includes(r));

  return { roles, hasRole, hasAny };
};

export default usePermissions;
