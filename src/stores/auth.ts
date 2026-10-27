import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface AuthUser {
  id: string
  name: string
  email: string
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  setAuth: (payload: { token: string; user: AuthUser }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        token: null,
        user: null,
        setAuth: ({ token, user }) =>
          set({ token, user }, undefined, 'auth/setAuth'),
        logout: () =>
          set({ token: null, user: null }, undefined, 'auth/logout'),
      }),
      { name: 'auth' },
    ),
    { name: 'AuthStore', enabled: import.meta.env.DEV },
  ),
)
