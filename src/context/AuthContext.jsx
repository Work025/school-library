import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem('adminToken'),
  )

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('adminUser')

    return savedUser ? JSON.parse(savedUser) : null
  })

  const login = (newToken, newUser) => {
    localStorage.setItem('adminToken', newToken)
    localStorage.setItem('adminUser', JSON.stringify(newUser))

    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')

    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
