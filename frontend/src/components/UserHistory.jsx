import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { API_ENDPOINTS } from '../config/api'
import './UserHistory.css'

function UserHistory({ darkMode, onClose }) {
  const [urls, setUrls] = useState([])
  const [files, setFiles] = useState([])
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('urls')
  const { token } = useAuth()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setLoading(true)
    setError('')

    try {
      // Fetch URLs
      const urlsResponse = await fetch(API_ENDPOINTS.URL.MY_URLS, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })

      if (urlsResponse.ok) {
        const urlsData = await urlsResponse.json()
        console.log('URLs data:', urlsData) // Debug log
        setUrls(Array.isArray(urlsData) ? urlsData : [])
      } else {
        console.error('Failed to fetch URLs:', urlsResponse.status)
      }

      // Fetch Files
      const filesResponse = await fetch(API_ENDPOINTS.FILE.MY_FILES, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })

      if (filesResponse.ok) {
        const filesData = await filesResponse.json()
        console.log('Files data:', filesData) // Debug log
        setFiles(Array.isArray(filesData) ? filesData : [])
      } else {
        console.error('Failed to fetch files:', filesResponse.status)
      }

      // Fetch Notes
      const notesResponse = await fetch(API_ENDPOINTS.NOTE.MY_NOTES, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })

      if (notesResponse.ok) {
        const notesData = await notesResponse.json()
        console.log('Notes data:', notesData) // Debug log
        setNotes(Array.isArray(notesData) ? notesData : [])
      } else {
        console.error('Failed to fetch notes:', notesResponse.status)
      }
    } catch (err) {
      console.error('Error fetching history:', err)
      setError('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="user-history-modal-overlay" onClick={onClose}>
      <div className={`user-history-modal ${darkMode ? 'dark' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="user-history-header">
          <h2>My History</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="history-tabs">
          <button
            className={`history-tab ${activeTab === 'urls' ? 'active' : ''}`}
            onClick={() => setActiveTab('urls')}
          >
            🔗 URLs ({urls.length})
          </button>
          <button
            className={`history-tab ${activeTab === 'files' ? 'active' : ''}`}
            onClick={() => setActiveTab('files')}
          >
            📁 Files ({files.length})
          </button>
          <button
            className={`history-tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            📝 Notes ({notes.length})
          </button>
        </div>

        <div className="history-content">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <>
              {activeTab === 'urls' && (
                <div className="history-list">
                  {urls.length === 0 ? (
                    <div className="empty-state">
                      <span className="empty-icon">🔗</span>
                      <p>No URLs yet</p>
                      <small>Start by creating a short URL!</small>
                    </div>
                  ) : (
                    urls.map((url) => (
                      <div key={url.id} className="history-item">
                        <div className="item-main">
                          <div className="item-info">
                            <div className="item-title">
                              <a
                                href={`http://localhost:9002/${url.short_code}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                localhost:9002/{url.short_code}
                              </a>
                              <button
                                className="copy-btn"
                                onClick={() => copyToClipboard(`http://localhost:9002/${url.short_code}`)}
                                title="Copy to clipboard"
                              >
                                📋
                              </button>
                            </div>
                            <div className="item-subtitle">{url.long_url}</div>
                          </div>
                          <div className="item-stats">
                            <span className="stat">👆 {url.clicks} clicks</span>
                            <span className="stat-date">🕐 {formatDate(url.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'files' && (
                <div className="history-list">
                  {files.length === 0 ? (
                    <div className="empty-state">
                      <span className="empty-icon">📁</span>
                      <p>No files yet</p>
                      <small>Upload an image or PDF to get started!</small>
                    </div>
                  ) : (
                    files.map((file) => (
                      <div key={file.id} className="history-item">
                        <div className="item-main">
                          <div className="item-info">
                            <div className="item-title">
                              <span className="file-icon">
                                {file.content_type.startsWith('image/') ? '🖼️' : '📄'}
                              </span>
                              <a
                                href={file.short_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {file.original_filename}
                              </a>
                              <button
                                className="copy-btn"
                                onClick={() => copyToClipboard(file.short_url)}
                                title="Copy link"
                              >
                                📋
                              </button>
                            </div>
                            <div className="item-subtitle">
                              {formatFileSize(file.file_size)} • {file.content_type}
                            </div>
                          </div>
                          <div className="item-stats">
                            <span className="stat">⬇️ {file.downloads} downloads</span>
                            <span className="stat-date">🕐 {formatDate(file.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="history-list">
                  {notes.length === 0 ? (
                    <div className="empty-state">
                      <span className="empty-icon">📝</span>
                      <p>No notes yet</p>
                      <small>Save a text note to get started!</small>
                    </div>
                  ) : (
                    notes.map((note) => (
                      <div key={note.id} className="history-item">
                        <div className="item-main">
                          <div className="item-info">
                            <div className="item-title">
                              <span className="file-icon">📝</span>
                              <a
                                href={note.short_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {note.title || 'Untitled Note'}
                              </a>
                              <button
                                className="copy-btn"
                                onClick={() => copyToClipboard(note.short_url)}
                                title="Copy link"
                              >
                                📋
                              </button>
                            </div>
                            <div className="item-subtitle">
                              {truncateText(note.content, 100)}
                            </div>
                          </div>
                          <div className="item-stats">
                            <span className="stat">👁️ {note.views} views</span>
                            <span className="stat-date">🕐 {formatDate(note.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserHistory
