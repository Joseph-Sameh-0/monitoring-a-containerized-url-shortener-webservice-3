import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          Made with <span className="heart-icon">❤️</span> by Joseph
        </p>
        <p className="footer-copyright">
          © {currentYear} Joseph. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
