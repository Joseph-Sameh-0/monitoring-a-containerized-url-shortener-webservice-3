import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { API_ENDPOINTS } from '../config/api'
import './FileUpload.css'

function FileUpload({ darkMode, onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFileUrl, setUploadedFileUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const { token, isAuthenticated } = useAuth()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'application/pdf']
      if (!validTypes.includes(selectedFile.type)) {
        setError('Only images (PNG, JPEG, GIF) and PDF files are allowed')
        setFile(null)
        return
      }

      // Validate file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError('')
      setUploadedFileUrl('')
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!file) {
      setError('Please select a file')
      return
    }

    if (!isAuthenticated) {
      setError('Please login to upload files')
      return
    }

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(API_ENDPOINTS.FILE.UPLOAD, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Upload failed')
      }

      const data = await response.json()
      setUploadedFileUrl(data.short_url)
      setFile(null)
      
      // Reset file input
      const fileInput = document.getElementById('file-input')
      if (fileInput) fileInput.value = ''

      if (onUploadSuccess) {
        onUploadSuccess(data)
      }
    } catch (err) {
      setError(err.message || 'Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(uploadedFileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getFileIcon = () => {
    if (!file) return '📎'
    if (file.type.startsWith('image/')) return '🖼️'
    if (file.type === 'application/pdf') return '📄'
    return '📎'
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  if (!isAuthenticated) {
    return (
      <div className={`file-upload-card ${darkMode ? 'dark' : ''}`}>
        <div className="file-upload-login-message">
          <span className="file-icon">🔒</span>
          <p>Please login to upload files</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`file-upload-card ${darkMode ? 'dark' : ''}`}>
      <h3 className="file-upload-title">
        <span>📁</span>
        Upload File
      </h3>

      <form onSubmit={handleUpload} className="file-upload-form">
        <div className="file-input-wrapper">
          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/jpg,image/gif,application/pdf"
            disabled={uploading}
          />
          <label htmlFor="file-input" className="file-input-label">
            <span className="file-icon">{getFileIcon()}</span>
            <span className="file-input-text">
              {file ? file.name : 'Choose a file'}
            </span>
          </label>
          {file && (
            <div className="file-details">
              <span className="file-size">{formatFileSize(file.size)}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="upload-button"
          disabled={uploading || !file}
        >
          {uploading ? (
            <>
              <div className="spinner"></div>
              Uploading...
            </>
          ) : (
            <>
              <span>⬆️</span>
              Upload File
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="upload-error">
          {error}
        </div>
      )}

      {uploadedFileUrl && (
        <div className="upload-result">
          <div className="upload-result-label">File uploaded successfully!</div>
          <div className="upload-result-url-container">
            <a 
              href={uploadedFileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="upload-result-url"
            >
              {uploadedFileUrl}
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

      <div className="file-upload-hint">
        Supported formats: PNG, JPEG, GIF, PDF (max 10MB)
      </div>
    </div>
  )
}

export default FileUpload
