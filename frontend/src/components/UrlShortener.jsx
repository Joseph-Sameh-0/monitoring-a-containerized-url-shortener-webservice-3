import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { API_ENDPOINTS } from '../config/api'
import './UrlShortener.css'

function UrlShortener({ darkMode, addUrl }) {
  const [longUrl, setLongUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const { token } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!longUrl.trim()) {
      setError('Please enter a URL')
      return
    }

    // Basic URL validation
    if (!longUrl.match(/^https?:\/\/.+/)) {
      setError('Please enter a valid URL starting with http:// or https://')
      return
    }

    setLoading(true)
    setError('')
    setShortUrl('')

    try {
      const headers = {
        'Content-Type': 'application/json',
      }
      
      // Add authorization header if user is logged in
      if (token) {
        headers['Authorization'] = 'Bearer ' + token
      }

      const response = await fetch(API_ENDPOINTS.URL.SHORTEN, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ long_url: longUrl })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to shorten URL')
      }
      
      const data = await response.json()
      
      const newUrl = {
        long_url: longUrl,
        short_url: data.short_url,
        timestamp: new Date().toISOString()
      }
      
      setShortUrl(data.short_url)
      addUrl(newUrl)
      setLongUrl('')
    } catch (err) {
      setError(err.message || 'Failed to shorten URL. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="url-shortener">
      <div className={'shortener-card' + (darkMode ? ' dark' : '')}>
        <form onSubmit={handleSubmit} className="shortener-form">
          <div className="input-container">
            <span className="input-icon">🔗</span>
            <input
              type="text"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="Enter your long URL here..."
              className="url-input"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            className="shorten-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Shortening...
              </>
            ) : (
              <>
                <span>🔗</span>
                Shorten URL
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {shortUrl && (
          <div className="result-container">
            <div className="result-label">Your shortened URL:</div>
            <div className="result-url-container">
              <a 
                href={shortUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="result-url"
              >
                {shortUrl}
              </a>
              <button
                onClick={copyToClipboard}
                className="copy-button"
                aria-label="Copy to clipboard"
              >
                {copied ? '✓' : '📋'}
              </button>
            </div>
            {copied && (
              <div className="copied-message">
                Copied to clipboard!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default UrlShortener
