import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, LogOut, Trophy, Target, Calendar, Coins, Settings } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const UserProfile = ({ onClose }) => {
  const { user, logout } = useAuth()
  const [showStats, setShowStats] = useState(true)

  const handleLogout = () => {
    logout()
    onClose()
  }

  const winRate = user.gamesPlayed > 0 ? ((user.totalWins / user.gamesPlayed) * 100).toFixed(1) : 0

  return (
    <motion.div
      className="profile-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={32} />
          </div>
          <div className="profile-info">
            <h2>{user.username}</h2>
            <p>{user.email}</p>
            <span className="member-since">
              Member since {new Date(user.joinDate).toLocaleDateString()}
            </span>
          </div>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab-button ${showStats ? 'active' : ''}`}
            onClick={() => setShowStats(true)}
          >
            <Trophy size={20} />
            Statistics
          </button>
          <button
            className={`tab-button ${!showStats ? 'active' : ''}`}
            onClick={() => setShowStats(false)}
          >
            <Settings size={20} />
            Settings
          </button>
        </div>

        <div className="profile-body">
          {showStats ? (
            <div className="stats-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <Coins size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>${user.balance.toLocaleString()}</h3>
                    <p>Current Balance</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <Target size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>{user.gamesPlayed}</h3>
                    <p>Games Played</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <Trophy size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>{user.totalWins}</h3>
                    <p>Total Wins</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <Calendar size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>{winRate}%</h3>
                    <p>Win Rate</p>
                  </div>
                </div>
              </div>

              <div className="detailed-stats">
                <h3>Detailed Statistics</h3>
                <div className="stats-list">
                  <div className="stat-item">
                    <span>Total Wins:</span>
                    <span className="stat-value win">{user.totalWins}</span>
                  </div>
                  <div className="stat-item">
                    <span>Total Losses:</span>
                    <span className="stat-value loss">{user.totalLosses}</span>
                  </div>
                  <div className="stat-item">
                    <span>Games Played:</span>
                    <span className="stat-value">{user.gamesPlayed}</span>
                  </div>
                  <div className="stat-item">
                    <span>Win Rate:</span>
                    <span className="stat-value">{winRate}%</span>
                  </div>
                  <div className="stat-item">
                    <span>Current Balance:</span>
                    <span className="stat-value balance">${user.balance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="settings-section">
              <h3>Account Settings</h3>
              <div className="settings-list">
                <div className="setting-item">
                  <label>Username</label>
                  <input type="text" value={user.username} disabled />
                </div>
                <div className="setting-item">
                  <label>Email</label>
                  <input type="email" value={user.email} disabled />
                </div>
                <div className="setting-item">
                  <label>Member Since</label>
                  <input type="text" value={new Date(user.joinDate).toLocaleDateString()} disabled />
                </div>
              </div>
              
              <div className="danger-zone">
                <h4>Danger Zone</h4>
                <button className="logout-button" onClick={handleLogout}>
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default UserProfile
