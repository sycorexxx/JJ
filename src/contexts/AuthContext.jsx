import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('casinoUser')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('casinoUser')
      }
    }
    setLoading(false)
  }, [])

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('casinoUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('casinoUser')
    }
  }, [user])

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        const savedUsers = JSON.parse(localStorage.getItem('casinoUsers') || '[]')
        const user = savedUsers.find(u => u.email === email && u.password === password)
        
        if (user) {
          const userData = {
            id: user.id,
            email: user.email,
            username: user.username,
            balance: user.balance,
            totalWins: user.totalWins || 0,
            totalLosses: user.totalLosses || 0,
            gamesPlayed: user.gamesPlayed || 0,
            joinDate: user.joinDate
          }
          setUser(userData)
          resolve(userData)
        } else {
          reject(new Error('Invalid email or password'))
        }
      }, 1000)
    })
  }

  const signup = (username, email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        const savedUsers = JSON.parse(localStorage.getItem('casinoUsers') || '[]')
        
        // Check if user already exists
        if (savedUsers.find(u => u.email === email)) {
          reject(new Error('User with this email already exists'))
          return
        }

        const newUser = {
          id: Date.now().toString(),
          username,
          email,
          password,
          balance: 1000, // Starting balance
          totalWins: 0,
          totalLosses: 0,
          gamesPlayed: 0,
          joinDate: new Date().toISOString()
        }

        const updatedUsers = [...savedUsers, newUser]
        localStorage.setItem('casinoUsers', JSON.stringify(updatedUsers))

        const userData = {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          balance: newUser.balance,
          totalWins: newUser.totalWins,
          totalLosses: newUser.totalLosses,
          gamesPlayed: newUser.gamesPlayed,
          joinDate: newUser.joinDate
        }

        setUser(userData)
        resolve(userData)
      }, 1000)
    })
  }

  const logout = () => {
    setUser(null)
  }

  const updateBalance = (newBalance) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance }
      setUser(updatedUser)
      
      // Update in localStorage
      const savedUsers = JSON.parse(localStorage.getItem('casinoUsers') || '[]')
      const updatedUsers = savedUsers.map(u => 
        u.id === user.id ? { ...u, balance: newBalance } : u
      )
      localStorage.setItem('casinoUsers', JSON.stringify(updatedUsers))
    }
  }

  const updateStats = (gameResult) => {
    if (user) {
      const updatedUser = {
        ...user,
        gamesPlayed: user.gamesPlayed + 1,
        totalWins: user.totalWins + (gameResult.won ? 1 : 0),
        totalLosses: user.totalLosses + (gameResult.won ? 0 : 1)
      }
      setUser(updatedUser)
      
      // Update in localStorage
      const savedUsers = JSON.parse(localStorage.getItem('casinoUsers') || '[]')
      const updatedUsers = savedUsers.map(u => 
        u.id === user.id ? updatedUser : u
      )
      localStorage.setItem('casinoUsers', JSON.stringify(updatedUsers))
    }
  }

  const value = {
    user,
    login,
    signup,
    logout,
    updateBalance,
    updateStats,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
