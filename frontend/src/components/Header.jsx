import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Header.css'

function Header({ darkMode, toggleDarkMode, onShowLogin, onShowRegister, onShowHistory }) {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  const handleShowHistory = () => {
    setShowUserMenu(false)
    onShowHistory()
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">🔗</span>
          <span className="logo-text">URL Shortener</span>
        </div>
        
        <div className="header-actions">
          {user ? (
            <div className="user-menu">
              <button 
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="user-icon">👤</span>
                <span className="user-name">{user.username}</span>
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-email">{user.email}</div>
                  </div>
                  <button className="menu-button" onClick={handleShowHistory}>
                    <span>📋</span>
                    My History
                  </button>
                  <button className="logout-button" onClick={handleLogout}>
                    <span>🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="login-button" onClick={onShowLogin}>
                Sign In
              </button>
              <button className="register-button" onClick={onShowRegister}>
                Sign Up
              </button>
            </div>
          )}
          
          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <span className="theme-icon">☀️</span>
            ) : (
              <span className="theme-icon">🌙</span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
