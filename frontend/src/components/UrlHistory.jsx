import './UrlHistory.css'

function UrlHistory({ darkMode, urls }) {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} min ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="url-history">
      <h2 className={`history-title ${darkMode ? 'dark' : ''}`}>
        Recent Items
      </h2>
      
      <div className="history-list">
        {urls.map((url, index) => (
          <div
            key={index}
            className={`history-item ${darkMode ? 'dark' : ''}`}
          >
            <div className="history-item-content">
              <div className="url-info">
                <div className="url-short">
                  <a href={url.short_url} target="_blank" rel="noopener noreferrer">
                    {url.isFile && <span className="file-badge">📎 File</span>}
                    {url.isNote && <span className="note-badge">📝 Note</span>}
                    {url.short_url}
                    <span className="external-icon">↗</span>
                  </a>
                </div>
                <div className="url-long">
                  {url.long_url}
                </div>
              </div>
              <div className="timestamp">
                <span>🕐</span>
                {formatTimestamp(url.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UrlHistory
