import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './Header.css'

function Header() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  return (
    <header className="header">
      <div className="header__container">
        <a href="/" className="header__logo">
          MAKTAB 230
        </a>

        <nav className="header__nav" aria-label="Book categories">
          <a href="#library">Library</a>
          <a href="#novels">Novels</a>
          <a href="#story-books">Story Books</a>
          <a href="#ielts">IELTS</a>
          <a href="#school-books">School Books</a>
        </nav>

        {isAuthenticated && (
          <button
            className="header__admin-button"
            type="button"
            aria-label="Add a book"
            onClick={() => navigate('/admin')}
          >
            ADD +
          </button>
        )}
      </div>
    </header>
  )
}

export default Header