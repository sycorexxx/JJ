import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, Coins, Settings, Home, User, LogOut } from 'lucide-react'
import './App.css'
import './games/games.css'
import './components/auth.css'

// Import authentication
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import Signup from './components/Signup'
import UserProfile from './components/UserProfile'

// Import game components
import Blackjack from './games/Blackjack'
import Poker from './games/Poker'
import Roulette from './games/Roulette'
import SlotMachine from './games/SlotMachine'
import Baccarat from './games/Baccarat'
import Craps from './games/Craps'

const GAMES = [
  { id: 'blackjack', name: 'Blackjack', icon: '🃏', component: Blackjack },
  { id: 'poker', name: 'Poker', icon: '🂡', component: Poker },
  { id: 'roulette', name: 'Roulette', icon: '🎰', component: Roulette },
  { id: 'slots', name: 'Slot Machine', icon: '🎰', component: SlotMachine },
  { id: 'baccarat', name: 'Baccarat', icon: '🃏', component: Baccarat },
  { id: 'craps', name: 'Craps', icon: '🎲', component: Craps },
]

function AppContent() {
  const { user, loading, updateBalance } = useAuth()
  const [currentGame, setCurrentGame] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'

  const handleGameSelect = (game) => {
    setCurrentGame(game)
  }

  const handleBackToLobby = () => {
    setCurrentGame(null)
  }

  const handleBalanceUpdate = (newBalance) => {
    updateBalance(newBalance)
  }

  const handleLogout = () => {
    setShowProfile(false)
  }

  // Show loading screen
  if (loading) {
    return (
      <div className="casino-app">
        <div className="loading-screen">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Gamepad2 size={48} />
          </motion.div>
          <h2>Loading Lucky Casino...</h2>
        </div>
      </div>
    )
  }

  // Show authentication if not logged in
  if (!user) {
    return (
      <div className="casino-app">
        {authMode === 'login' ? (
          <Login onSwitchToSignup={() => setAuthMode('signup')} />
        ) : (
          <Signup onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </div>
    )
  }

  const CurrentGameComponent = currentGame?.component

  if (currentGame) {
    return (
      <div className="casino-app">
        <header className="game-header">
          <button onClick={handleBackToLobby} className="back-button">
            <Home size={20} />
            Back to Lobby
          </button>
          <div className="balance-display">
            <Coins size={20} />
            <span>${user.balance.toLocaleString()}</span>
          </div>
        </header>
        <main className="game-container">
          <CurrentGameComponent 
            balance={user.balance} 
            setBalance={handleBalanceUpdate} 
          />
        </main>
      </div>
    )
  }

  return (
    <div className="casino-app">
      <header className="casino-header">
        <div className="header-content">
          <div className="logo">
            <Gamepad2 size={32} />
            <h1>Lucky Casino</h1>
          </div>
          <div className="header-actions">
            <div className="balance-display">
              <Coins size={20} />
              <span>${user.balance.toLocaleString()}</span>
            </div>
            <button 
              className="profile-button"
              onClick={() => setShowProfile(true)}
            >
              <User size={20} />
              {user.username}
            </button>
            <button 
              className="settings-button"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="casino-lobby">
        <div className="welcome-section">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Welcome back, {user.username}!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Choose your game and test your luck! You have ${user.balance.toLocaleString()} to play with.
          </motion.p>
        </div>

        <div className="games-grid">
          {GAMES.map((game, index) => (
            <motion.div
              key={game.id}
              className="game-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGameSelect(game)}
            >
              <div className="game-icon">{game.icon}</div>
              <h3>{game.name}</h3>
              <p>Click to play</p>
            </motion.div>
          ))}
        </div>
      </main>

      {showSettings && (
        <motion.div
          className="settings-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="settings-content">
            <h3>Settings</h3>
            <div className="setting-item">
              <label>Current Balance:</label>
              <input
                type="number"
                value={user.balance}
                onChange={(e) => updateBalance(Number(e.target.value))}
                min="0"
                max="100000"
              />
            </div>
            <div className="setting-item">
              <label>Username:</label>
              <input
                type="text"
                value={user.username}
                disabled
              />
            </div>
            <div className="setting-item">
              <label>Email:</label>
              <input
                type="email"
                value={user.email}
                disabled
              />
            </div>
            <button onClick={() => setShowSettings(false)}>Close</button>
          </div>
        </motion.div>
      )}

      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App