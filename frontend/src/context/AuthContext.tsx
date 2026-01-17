import React, { createContext, useContext, useEffect } from "react"
import api from "@/services/api"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { initializeSocket, disconnectSocket } from "@/services/socket"

interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (credentials: any) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient()

  /**
   * ✅ Fetch current user (auth/me)
   * This runs ONCE on app start. React Query handles caching.
   */
  const {
    data: user,
    isLoading,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data?.success && res.data?.data) return res.data.data;
        return null;
      } catch (err: any) {
        if (err.response?.status === 401) return null;
        console.error("Error fetching /auth/me:", err);
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  /**
   * ✅ Login function
   */
  const login = async (credentials: any) => {
    try {
      const res = await api.post("/auth/login", credentials, {
        withCredentials: true,
      })

      if (res.data.success) {
        await queryClient.invalidateQueries({ queryKey: ["auth-user"] })
      }
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Login failed")
    }
  }

  /**
   * ✅ Register function
   */
  const register = async (data: any) => {
    try {
      const res = await api.post("/auth/register", data, {
        withCredentials: true,
      })

      if (res.data.success) {
        await queryClient.invalidateQueries({ queryKey: ["auth-user"] })
      }
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Register failed")
    }
  }

  /**
   * ✅ Logout function
   */
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true })
    } catch (err) {
      console.error("Logout error:", err)
    }

    // Disconnect Socket.io
    disconnectSocket()

    // Clear only auth-related data, not everything
    queryClient.removeQueries({ queryKey: ["auth-user"] })

    // Redirect immediately
    window.location.href = "/login"
  }

  /**
   * ✅ Initialize Socket.io when user is authenticated
   */
  useEffect(() => {
    if (user) {
      // Initialize Socket.io with actual JWT token
      const token = localStorage.getItem('accessToken');
      if (token) {
        initializeSocket(token);
        console.log('Socket.io initialized for user:', user.name);
      } else {
        console.warn('No access token found for socket authentication');
      }
    } else {
      disconnectSocket();
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}
