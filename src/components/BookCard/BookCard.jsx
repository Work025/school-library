import { useNavigate } from 'react-router-dom'
import API_URL from '../../config/api.js'
import './BookCard.css'

function BookCard({ title, author, image, pdf }) {
  const navigate = useNavigate()

  const handleOpenPDF = () => {
    navigate('/pdf', {
      state: {
        title,
        author,
        pdf,
      },
    })
  }

  return (
    <article className="book-card">
      <div className="book-card-image">
        {image ? (
          <img src={`${API_URL}${image}`} alt={title} />
        ) : (
          <div className="book-card-placeholder">No Cover</div>
        )}
      </div>

      <div className="book-card-content">
        <h3>{title}</h3>

        <p>{author}</p>

        <button
          type="button"
          className="book-card-button"
          onClick={handleOpenPDF}
          disabled={!pdf}
        >
          {pdf ? 'Open PDF' : 'PDF Not Available'}
        </button>
      </div>
    </article>
  )
}

export default BookCard