import { useEffect, useState } from 'react'
import Search from '../Search/Search.jsx'
import BookCard from '../BookCard/BookCard.jsx'
import API_URL from '../../config/api.js'
import './BookSection.css'

function BookSection({ id, title, category }) {
  const [books, setBooks] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/api/books`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBooks(data.books)
        }
      })
      .catch((error) => {
        console.error('Failed to load books:', error)
      })
  }, [])

  const categoryBooks = books.filter((book) => book.category === category)

  const handleSearch = (query) => {
    const normalizedQuery = query.trim().toLowerCase()
    const filteredBooks = categoryBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(normalizedQuery) ||
        book.author.toLowerCase().includes(normalizedQuery),
    )

    setSearchResults(filteredBooks)
    setSearched(true)
  }

  const displayedBooks = searched ? searchResults : categoryBooks

  return (
    <section className="book-section" id={id}>
      <div className="book-section-header">
        <div>
          <p className="section-label">MAKTAB 230 LIBRARY</p>
          <h2>{title}</h2>
        </div>

        <Search onSearch={handleSearch} />
      </div>

      <div className="book-grid">
        {displayedBooks.length > 0 ? (
          displayedBooks.map((book) => (
            <BookCard
              key={book._id}
              title={book.title}
              author={book.author}
              category={book.category}
              pdf={book.pdf}
              image={book.image}
            />
          ))
        ) : (
          <p className="no-books">No books found.</p>
        )}
      </div>
    </section>
  )
}

export default BookSection