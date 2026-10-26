// ====================================================================
// TREND ZONE AUTHENTICATION CONTEXT (Supabase Auth + Role Protection)
// ====================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserRole } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password?: string, name?: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  setDemoAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'trend_zone_auth_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured() && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch user profile from Supabase
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.full_name || session.user.email?.split('@')[0] || 'Customer',
            role: profile?.role || 'customer',
            phone: profile?.phone,
          };
          setUser(authUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    // 1. Supabase Auth if connected
    if (isSupabaseConfigured() && supabase && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };

        if (data.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || email,
            name: profile?.full_name || email.split('@')[0],
            role: profile?.role || (email.toLowerCase().includes('admin') ? 'admin' : 'customer'),
          };
          setUser(authUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Login failed' };
      }
    }

    // 2. Demo / Fallback login logic
    const cleanEmail = email.trim().toLowerCase();
    const isAdminUser =
      cleanEmail === 'admin@trendzone.com' ||
      cleanEmail === 'superadmin@trendzone.com' ||
      cleanEmail.includes('admin');

    if (isAdminUser) {
      // Validate password if provided
      if (password && password !== 'Admin@12345' && password !== 'admin123' && password !== 'admin') {
        return { success: false, error: 'Incorrect password for Super Admin. Use: Admin@12345' };
      }

      const authUser: AuthUser = {
        id: 'admin-super-id',
        email: cleanEmail,
        name: 'Super Admin',
        role: 'admin',
      };
      setUser(authUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      return { success: true };
    }

    const authUser: AuthUser = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      name: cleanEmail.split('@')[0],
      role: 'customer',
    };
    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    return { success: true };
  };

  const register = async (email: string, password?: string, name?: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured() && supabase && password) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, phone }
          }
        });
        if (error) return { success: false, error: error.message };

        if (data.user) {
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || email,
            name: name || email.split('@')[0],
            role: 'customer',
            phone,
          };
          setUser(authUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Registration failed' };
      }
    }

    const authUser: AuthUser = {
      id: `usr-${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      role: 'customer',
      phone,
    };
    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Logout error', e);
      }
    }
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const setDemoAdmin = () => {
    const adminUser: AuthUser = {
      id: 'admin-super-id',
      email: 'admin@trendzone.com',
      name: 'Super Admin',
      role: 'admin',
    };
    setUser(adminUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
        setDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
