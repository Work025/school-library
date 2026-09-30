import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>MAKTAB 230</h2>
            <p>School Library</p>
          </div>

          <nav className="footer-links" aria-label="Footer navigation">
            <a href="#library">Library</a>
            <a href="#novels">Novels</a>
            <a href="#story-books">Story Books</a>
            <a href="#ielts">IELTS</a>
            <a href="#school-books">School Books</a>
          </nav>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MAKTAB 230 School Library</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer