import { useLocation, useNavigate } from 'react-router-dom'
import './PDFViewer.css'

function PDFViewer() {
  const location = useLocation()
  const navigate = useNavigate()
  const book = location.state

  if (!book) {
    return (
      <main className="pdf-viewer-page">
        <div className="pdf-error">
          <h1>Book not found</h1>
          <button type="button" onClick={() => navigate('/')}>
            Back to Library
          </button>
        </div>
      </main>
    )
  }

  const pdfUrl = book.pdf ? `http://localhost:5000${book.pdf}` : ''

  return (
    <main className="pdf-viewer-page">
      <header className="pdf-viewer-header">
        <button
          type="button"
          className="pdf-back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="pdf-book-info">
          <h1>{book.title}</h1>
          <p>{book.author}</p>
        </div>
      </header>

      {pdfUrl ? (
        <section className="pdf-content">
          <div className="pdf-toolbar">
            <span>PDF Reader</span>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="pdf-open-button"
            >
              Open PDF File
            </a>
          </div>

          <iframe
            src={pdfUrl}
            title={`${book.title} PDF`}
            className="pdf-frame"
          />
        </section>
      ) : (
        <div className="pdf-error">
          <h2>PDF Not Available</h2>
          <p>This book does not have a PDF file.</p>
        </div>
      )}
    </main>
  )
}

export default PDFViewer