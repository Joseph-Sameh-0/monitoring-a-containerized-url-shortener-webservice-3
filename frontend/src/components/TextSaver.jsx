import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { API_ENDPOINTS } from '../config/api'
import './TextSaver.css'

function TextSaver({ darkMode, onSaveSuccess }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedNoteUrl, setSavedNoteUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const { token, isAuthenticated } = useAuth()

  const handleSave = async (e) => {
    e.preventDefault()

    if (!content.trim()) {
      setError('Please enter some content')
      return
    }

    if (!isAuthenticated) {
      setError('Please login to save notes')
      return
    }

    setSaving(true)
    setError('')

    try {
      const response = await fetch(API_ENDPOINTS.NOTE.SAVE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          title: title.trim() || null,
          content: content
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save note')
      }

      const data = await response.json()
      setSavedNoteUrl(data.short_url)
      
      // Reset form
      setTitle('')
      setContent('')

      if (onSaveSuccess) {
        onSaveSuccess(data)
      }
    } catch (err) {
      setError(err.message || 'Failed to save note')
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(savedNoteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className={'text-saver-card' + (darkMode ? ' dark' : '')}>
        <div className="text-saver-login-message">
          <span className="text-icon">🔒</span>
          <p>Please login to save text notes</p>
        </div>
      </div>
    )
  }

  return (
    <div className={'text-saver-card' + (darkMode ? ' dark' : '')}>
      <h3 className="text-saver-title">
        <span>📝</span>
        Save Text/Note
      </h3>

      <form onSubmit={handleSave} className="text-saver-form">
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="title-input"
            disabled={saving}
            maxLength={255}
          />
        </div>

        <div className="form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your text or note here..."
            className="content-textarea"
            disabled={saving}
            rows={6}
            maxLength={5000}
          />
          <div className="char-count">
            {content.length} / 5000
          </div>
        </div>

        <button
          type="submit"
          className="save-button"
          disabled={saving || !content.trim()}
        >
          {saving ? (
            <>
              <div className="spinner"></div>
              Saving...
            </>
          ) : (
            <>
              <span>💾</span>
              Save Note
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="save-error">
          {error}
        </div>
      )}

      {savedNoteUrl && (
        <div className="save-result">
          <div className="save-result-label">Note saved successfully!</div>
          <div className="save-result-url-container">
            <a 
              href={savedNoteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="save-result-url"
            >
              {savedNoteUrl}
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

      <div className="text-saver-hint">
        Save text, code snippets, or notes and get a shareable link
      </div>
    </div>
  )
}

export default TextSaver
