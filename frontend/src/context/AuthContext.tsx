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
  interestedCareerPathId?: string | null
  interestedCareerPath?: { id: string; title: string; domain: string } | null
  careerFocusId?: string | null
  educationLevel?: string | null
  onboardingCompleted?: boolean
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
        // 401 is expected when user is not logged in - don't log as error
        if (err.response?.status === 401) {
          return null;
        }
        // Only log non-401 errors in development
        if (import.meta.env.DEV && err.response?.status !== 401) {
          console.error("Error fetching /auth/me:", err);
        }
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
   * Note: Tokens are stored in httpOnly cookies, so we don't need to pass them explicitly.
   * The socket connection will automatically include cookies if on the same domain.
   */
  useEffect(() => {
    if (user) {
      // Initialize Socket.io - cookies are sent automatically with the connection
      // The backend should extract the token from cookies
      // For now, we'll pass an empty string or let the backend handle it from cookies
      try {
        initializeSocket('');
        if (import.meta.env.DEV) {
          console.log('Socket.io initialized for user:', user.name);
        }
      } catch (error) {
        // Silently handle socket initialization errors
        if (import.meta.env.DEV) {
          console.debug('Socket initialization:', error);
        }
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
