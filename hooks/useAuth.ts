'use client';

import { useSession } from 'next-auth/react';
import { UserRole } from '@prisma/client';
import {
  hasRole,
  isAdmin,
  isManager,
  isAdminOrManager,
  isB2BCustomer,
  canAccessAdmin,
  canAccessB2B,
  getUserPermissions,
} from '@/lib/auth';

export function useAuth() {
  const { data: session, status } = useSession();

  const user = session?.user;
  const role = user?.role as UserRole | undefined;

  return {
    user,
    role,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    isAdmin: isAdmin(role),
    isManager: isManager(role),
    isAdminOrManager: isAdminOrManager(role),
    isB2BCustomer: isB2BCustomer(role),
    canAccessAdmin: canAccessAdmin(role),
    canAccessB2B: canAccessB2B(role),
    permissions: getUserPermissions(role),
    hasRole: (roles: UserRole[]) => hasRole(role, roles),
  };
}

