import { useState, useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import UrlShortener from './components/UrlShortener'
import UrlHistory from './components/UrlHistory'
import FileUpload from './components/FileUpload'
import TextSaver from './components/TextSaver'
import Login from './components/Login'
import Register from './components/Register'
import UserHistory from './components/UserHistory'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme === 'dark'
  })
  const [urls, setUrls] = useState([])
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showUserHistory, setShowUserHistory] = useState(false)

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const addUrl = (newUrl) => {
    setUrls([newUrl, ...urls])
  }

  const handleFileUploadSuccess = (fileData) => {
    const fileUrl = {
      long_url: fileData.original_filename,
      short_url: fileData.short_url,
      timestamp: new Date().toISOString(),
      isFile: true
    }
    setUrls([fileUrl, ...urls])
  }

  const handleNoteSaveSuccess = (noteData) => {
    const noteUrl = {
      long_url: noteData.content_preview,
      short_url: noteData.short_url,
      timestamp: new Date().toISOString(),
      isNote: true
    }
    setUrls([noteUrl, ...urls])
  }

  return (
    <AuthProvider>
      <div className={`app ${darkMode ? 'dark' : ''}`}>
        <div className="background-gradient">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        
        <Header 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode}
          onShowLogin={() => setShowLogin(true)}
          onShowRegister={() => setShowRegister(true)}
          onShowHistory={() => setShowUserHistory(true)}
        />
        
        <main className="main-content">
          <div className="hero-section">
            <h1 className="main-title">
              <span className="gradient-text">Shorten</span> Your Links
            </h1>
            <p className="subtitle">
              Transform long URLs into short, shareable links in seconds
            </p>
          </div>

          <UrlShortener darkMode={darkMode} addUrl={addUrl} />
          
          <FileUpload 
            darkMode={darkMode} 
            onUploadSuccess={handleFileUploadSuccess}
          />
          
          <TextSaver
            darkMode={darkMode}
            onSaveSuccess={handleNoteSaveSuccess}
          />
          
          {urls.length > 0 && (
            <UrlHistory darkMode={darkMode} urls={urls} />
          )}
        </main>

        <Footer />

        {showLogin && (
          <Login 
            onClose={() => setShowLogin(false)}
            onSwitchToRegister={() => {
              setShowLogin(false)
              setShowRegister(true)
            }}
          />
        )}

        {showRegister && (
          <Register 
            onClose={() => setShowRegister(false)}
            onSwitchToLogin={() => {
              setShowRegister(false)
              setShowLogin(true)
            }}
          />
        )}

        {showUserHistory && (
          <UserHistory
            darkMode={darkMode}
            onClose={() => setShowUserHistory(false)}
          />
        )}
      </div>
    </AuthProvider>
  )
}

export default App
